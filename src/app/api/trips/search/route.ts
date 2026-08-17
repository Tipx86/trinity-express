import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cleanupExpiredLocks } from '@/lib/seat-lock';

export async function GET(req: NextRequest) {
  try {
    await cleanupExpiredLocks();

    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date');
    const sessionId = searchParams.get('sessionId');

    if (!from || !to) {
      return NextResponse.json({ success: false, error: 'Origin and destination are required' }, { status: 400 });
    }

    // Find routes connecting these two cities
    const routes = await prisma.route.findMany({
      where: {
        isActive: true,
        origin: { name: { equals: from } },
        destination: { name: { equals: to } },
      },
      select: { id: true },
    });

    const routeIds = routes.map((r) => r.id);

    if (routeIds.length === 0) {
      return NextResponse.json({ success: true, trips: [] });
    }

    // Query trips
    const whereClause: any = {
      routeId: { in: routeIds },
      status: { in: ['SCHEDULED', 'BOARDING'] },
    };

    if (date) {
      whereClause.departureDate = date;
    }

    let trips = await prisma.trip.findMany({
      where: whereClause,
      include: {
        route: {
          include: {
            origin: true,
            destination: true,
          },
        },
        bus: true,
        seatLocks: {
          where: {
            lockedUntil: { gt: new Date() },
          },
        },
        bookings: {
          where: {
            status: { in: ['CONFIRMED', 'PENDING'] },
            paymentStatus: { in: ['PAID', 'PENDING'] },
          },
          include: {
            passengers: true,
          },
        },
      },
      orderBy: { departureTime: 'asc' },
    });

    // If no trips on exact date, fetch trips for nearest future dates
    if (trips.length === 0 && date) {
      trips = await prisma.trip.findMany({
        where: {
          routeId: { in: routeIds },
          departureDate: { gte: date },
          status: { in: ['SCHEDULED', 'BOARDING'] },
        },
        include: {
          route: {
            include: {
              origin: true,
              destination: true,
            },
          },
          bus: true,
          seatLocks: {
            where: {
              lockedUntil: { gt: new Date() },
            },
          },
          bookings: {
            where: {
              status: { in: ['CONFIRMED', 'PENDING'] },
              paymentStatus: { in: ['PAID', 'PENDING'] },
            },
            include: {
              passengers: true,
            },
          },
        },
        orderBy: [{ departureDate: 'asc' }, { departureTime: 'asc' }],
        take: 6,
      });
    }

    // Format trip seat availability
    const formattedTrips = trips.map((trip) => {
      const occupiedSeats: number[] = [];
      trip.bookings.forEach((b) => {
        b.passengers.forEach((p) => occupiedSeats.push(p.seatNumber));
      });

      const lockedSeats = trip.seatLocks
        .filter((l) => !sessionId || l.sessionId !== sessionId)
        .map((l) => l.seatNumber);

      const totalBookedOrLocked = new Set([...occupiedSeats, ...lockedSeats]).size;
      const availableSeats = Math.max(0, trip.bus.seatCount - totalBookedOrLocked);

      return {
        id: trip.id,
        routeId: trip.routeId,
        busId: trip.busId,
        departureDate: trip.departureDate,
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        priceRwf: trip.priceRwf,
        priceUgx: trip.priceUgx,
        priceKes: trip.priceKes,
        priceUsd: trip.priceUsd,
        priceSsp: (trip as any).priceSsp || 0,
        status: trip.status,
        route: trip.route,
        bus: trip.bus,
        availableSeats,
        occupiedSeats,
        lockedSeats,
      };
    });

    return NextResponse.json({ success: true, trips: formattedTrips });
  } catch (error: any) {
    console.error('Error searching trips:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
