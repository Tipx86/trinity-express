import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingRef, emailOrPhone, action, reason } = body;

    if (!bookingRef) {
      return NextResponse.json({ success: false, error: 'Booking reference is required' }, { status: 400 });
    }

    const cleanRef = bookingRef.trim().toUpperCase();

    // Find booking
    const booking = await prisma.booking.findFirst({
      where: {
        bookingRef: cleanRef,
        ...(emailOrPhone
          ? {
              OR: [
                { contactEmail: { equals: emailOrPhone.trim() } },
                { contactPhone: { contains: emailOrPhone.trim() } },
              ],
            }
          : {}),
      },
      include: {
        trip: {
          include: {
            route: {
              include: {
                origin: true,
                destination: true,
              },
            },
            bus: true,
          },
        },
        passengers: {
          include: {
            ticket: true,
          },
        },
        payments: true,
      },
    });

    if (!booking) {
      return NextResponse.json({
        success: false,
        error: 'No reservation found matching this reference. Please verify your reference number and contact info.',
      }, { status: 404 });
    }

    // Handle cancellation request
    if (action === 'CANCEL') {
      if (booking.status === 'CANCELLED') {
        return NextResponse.json({ success: false, error: 'This booking has already been cancelled.' }, { status: 400 });
      }

      // Check departure time: Can only cancel if departure is more than 6 hours away
      const depDateTime = new Date(`${booking.trip.departureDate}T${booking.trip.departureTime}:00`);
      const now = new Date();
      const diffHours = (depDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (diffHours < 6) {
        return NextResponse.json({
          success: false,
          error: 'Cancellations are only permitted at least 6 hours before scheduled departure.',
        }, { status: 400 });
      }

      const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: 'CANCELLED',
          notes: `Cancelled by customer. Reason: ${reason || 'Customer request'}`,
        },
        include: {
          trip: {
            include: {
              route: {
                include: {
                  origin: true,
                  destination: true,
                },
              },
              bus: true,
            },
          },
          passengers: {
            include: {
              ticket: true,
            },
          },
          payments: true,
        },
      });

      return NextResponse.json({
        success: true,
        booking: updated,
        message: 'Your booking has been cancelled. Refund processing initiated.',
      });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
