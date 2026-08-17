import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { EmailService } from '@/lib/email';
import { formatDate, formatTime, formatCurrency } from '@/lib/formatters';

export async function POST(req: NextRequest) {
  try {
    const { bookingRef } = await req.json();
    if (!bookingRef) {
      return NextResponse.json({ success: false, error: 'Booking reference is required' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { bookingRef: bookingRef.trim().toUpperCase() },
      include: {
        trip: {
          include: {
            route: {
              include: { origin: true, destination: true },
            },
          },
        },
        passengers: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    const ticketUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/my-booking?ref=${booking.bookingRef}`;
    const emailHtml = EmailService.generateBookingConfirmationHtml({
      bookingRef: booking.bookingRef,
      passengerName: booking.contactName,
      origin: booking.trip.route.origin.name,
      destination: booking.trip.route.destination.name,
      departureDate: formatDate(booking.trip.departureDate),
      departureTime: formatTime(booking.trip.departureTime),
      seatNumbers: booking.passengers.map((p) => p.seatNumber).join(', '),
      totalAmount: formatCurrency(booking.totalAmount, booking.currency),
      ticketUrl,
    });

    await EmailService.sendEmail({
      to: booking.contactEmail,
      subject: `[Copy] Your Trinity Express Digital Bus Ticket: ${booking.bookingRef}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, message: `Ticket resent to ${booking.contactEmail}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
