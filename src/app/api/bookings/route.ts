import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateBookingRef, generateTicketNumber, generateSecurityToken, formatCurrency, formatDate, formatTime } from '@/lib/formatters';
import { PaymentService } from '@/lib/payments';
import { EmailService } from '@/lib/email';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tripId,
      contactName,
      contactEmail,
      contactPhone,
      currency = 'RWF',
      selectedSeats,
      passengers,
      paymentMethod,
      paymentDetails,
      sessionId,
    } = body;

    if (!tripId || !selectedSeats || selectedSeats.length === 0 || !passengers || passengers.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing required booking parameters' }, { status: 400 });
    }

    // Check if user is logged in
    const sessionUser = getSessionUser(req);

    // Fetch trip details
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        route: {
          include: {
            origin: true,
            destination: true,
          },
        },
        bus: true,
      },
    });

    if (!trip) {
      return NextResponse.json({ success: false, error: 'Trip not found or no longer active' }, { status: 404 });
    }

    // Calculate total price based on currency
    let unitPrice = trip.priceRwf;
    if (currency === 'UGX') unitPrice = trip.priceUgx;
    else if (currency === 'KES') unitPrice = trip.priceKes;
    else if (currency === 'USD') unitPrice = trip.priceUsd;

    const totalAmount = unitPrice * passengers.length;
    const bookingRef = generateBookingRef();

    // 1. Process payment with provider adapter
    const paymentResult = await PaymentService.process({
      bookingRef,
      amount: totalAmount,
      currency,
      provider: paymentMethod,
      phoneNumber: paymentDetails?.phoneNumber || contactPhone,
      cardDetails: paymentDetails?.cardNumber ? {
        cardNumber: paymentDetails.cardNumber,
        expiry: paymentDetails.cardExpiry || '',
        cvc: paymentDetails.cardCvc || '',
        holder: paymentDetails.cardHolder || contactName,
      } : undefined,
    });

    if (!paymentResult.success) {
      return NextResponse.json({
        success: false,
        error: paymentResult.message || 'Payment authorization failed. Please check your details and try again.',
      }, { status: 400 });
    }

    // 2. Perform database transaction to guarantee zero double-booking
    const booking = await prisma.$transaction(async (tx) => {
      // Check again if any seat was taken during payment
      const existingPassenger = await tx.passenger.findFirst({
        where: {
          seatNumber: { in: selectedSeats },
          booking: {
            tripId,
            status: 'CONFIRMED',
          },
        },
      });

      if (existingPassenger) {
        throw new Error(`Seat ${existingPassenger.seatNumber} was booked just now. Please select an alternative seat.`);
      }

      // Create Booking record
      const newBooking = await tx.booking.create({
        data: {
          bookingRef,
          userId: sessionUser ? sessionUser.id : null,
          tripId,
          contactName,
          contactEmail,
          contactPhone,
          totalAmount,
          currency,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          notes: `Cross-border passenger booking via ${paymentMethod}`,
        },
      });

      // Create Passengers & Tickets
      const createdPassengers = [];
      for (const p of passengers) {
        const ticketNumber = generateTicketNumber(bookingRef, p.seatNumber);
        const securityToken = generateSecurityToken();

        const createdPass = await tx.passenger.create({
          data: {
            bookingId: newBooking.id,
            seatNumber: p.seatNumber,
            fullName: p.fullName,
            nationality: p.nationality || 'Rwanda',
            idPassportNumber: p.idPassportNumber,
            phone: p.phone || contactPhone,
            email: p.email || contactEmail,
            emergencyContact: p.emergencyContact,
            ticketNumber,
          },
        });

        const qrData = JSON.stringify({
          ticket: ticketNumber,
          ref: bookingRef,
          passenger: p.fullName,
          seat: p.seatNumber,
          origin: trip.route.origin.name,
          destination: trip.route.destination.name,
          date: trip.departureDate,
          time: trip.departureTime,
          securityToken,
        });

        const createdTicket = await tx.ticket.create({
          data: {
            ticketNumber,
            bookingId: newBooking.id,
            passengerId: createdPass.id,
            qrData,
            securityToken,
            status: 'VALID',
          },
        });

        createdPassengers.push({
          ...createdPass,
          ticket: createdTicket,
        });
      }

      // Record Payment
      const newPayment = await tx.payment.create({
        data: {
          bookingId: newBooking.id,
          transactionRef: paymentResult.transactionRef,
          amount: totalAmount,
          currency,
          provider: paymentMethod,
          status: 'COMPLETED',
          phoneNumber: paymentDetails?.phoneNumber || contactPhone,
          cardLast4: paymentDetails?.cardNumber ? paymentDetails.cardNumber.slice(-4) : null,
          rawResponse: JSON.stringify(paymentResult.rawDetails || {}),
        },
      });

      // Release seat locks
      if (sessionId) {
        await tx.seatLock.deleteMany({
          where: {
            tripId,
            sessionId,
          },
        });
      }

      return {
        ...newBooking,
        trip,
        passengers: createdPassengers,
        payment: newPayment,
      };
    });

    // 3. Send Transactional Email asynchronously
    const ticketUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/my-booking?ref=${bookingRef}`;
    const emailHtml = EmailService.generateBookingConfirmationHtml({
      bookingRef,
      passengerName: contactName,
      origin: trip.route.origin.name,
      destination: trip.route.destination.name,
      departureDate: formatDate(trip.departureDate),
      departureTime: formatTime(trip.departureTime),
      seatNumbers: selectedSeats.sort((a: number, b: number) => a - b).join(', '),
      totalAmount: formatCurrency(totalAmount, currency),
      ticketUrl,
    });

    EmailService.sendEmail({
      to: contactEmail,
      subject: `Your Trinity Express Bus Ticket (${bookingRef}): ${trip.route.origin.name} ➔ ${trip.route.destination.name}`,
      html: emailHtml,
    }).catch((err) => console.error('Failed to send confirmation email:', err));

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking confirmed successfully',
    });
  } catch (error: any) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error processing booking' }, { status: 500 });
  }
}
