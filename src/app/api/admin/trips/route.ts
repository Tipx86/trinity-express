import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    const trips = await prisma.trip.findMany({
      where: date ? { departureDate: date } : {},
      include: {
        route: {
          include: { origin: true, destination: true },
        },
        bus: true,
        bookings: {
          include: { passengers: true },
        },
      },
      orderBy: [{ departureDate: 'desc' }, { departureTime: 'asc' }],
      take: 50,
    });

    const buses = await prisma.bus.findMany({ where: { isActive: true } });
    const routes = await prisma.route.findMany({
      where: { isActive: true },
      include: { origin: true, destination: true },
    });

    return NextResponse.json({ success: true, trips, buses, routes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { routeId, busId, departureDate, departureTime, arrivalTime, priceRwf, priceUgx, priceKes, priceUsd } = body;

    const newTrip = await prisma.trip.create({
      data: {
        routeId,
        busId,
        departureDate,
        departureTime,
        arrivalTime,
        priceRwf: parseInt(priceRwf, 10),
        priceUgx: parseInt(priceUgx, 10),
        priceKes: parseInt(priceKes, 10),
        priceUsd: parseInt(priceUsd, 10),
        status: 'SCHEDULED',
      },
      include: {
        route: { include: { origin: true, destination: true } },
        bus: true,
      },
    });

    return NextResponse.json({ success: true, trip: newTrip });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, busId, departureTime, arrivalTime } = body;

    const updated = await prisma.trip.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(busId && { busId }),
        ...(departureTime && { departureTime }),
        ...(arrivalTime && { arrivalTime }),
      },
      include: {
        route: { include: { origin: true, destination: true } },
        bus: true,
      },
    });

    return NextResponse.json({ success: true, trip: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
