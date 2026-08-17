import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const routes = await prisma.route.findMany({
      include: { origin: true, destination: true },
      orderBy: { createdAt: 'desc' },
    });
    const destinations = await prisma.destination.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ success: true, routes, destinations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      originId,
      destinationId,
      distanceKm,
      durationMinutes,
      basePriceRwf,
      basePriceUgx,
      basePriceKes,
      basePriceUsd,
      stops,
      isActive = true,
    } = body;

    const newRoute = await prisma.route.create({
      data: {
        originId,
        destinationId,
        distanceKm: parseInt(distanceKm, 10),
        durationMinutes: parseInt(durationMinutes, 10),
        basePriceRwf: parseInt(basePriceRwf, 10),
        basePriceUgx: parseInt(basePriceUgx, 10),
        basePriceKes: parseInt(basePriceKes, 10),
        basePriceUsd: parseInt(basePriceUsd, 10),
        stops,
        isActive,
      },
      include: { origin: true, destination: true },
    });

    return NextResponse.json({ success: true, route: newRoute });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isActive, basePriceRwf, basePriceUgx, basePriceKes, basePriceUsd, durationMinutes, stops } = body;

    const updated = await prisma.route.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(basePriceRwf !== undefined && { basePriceRwf: parseInt(basePriceRwf, 10) }),
        ...(basePriceUgx !== undefined && { basePriceUgx: parseInt(basePriceUgx, 10) }),
        ...(basePriceKes !== undefined && { basePriceKes: parseInt(basePriceKes, 10) }),
        ...(basePriceUsd !== undefined && { basePriceUsd: parseInt(basePriceUsd, 10) }),
        ...(durationMinutes !== undefined && { durationMinutes: parseInt(durationMinutes, 10) }),
        ...(stops !== undefined && { stops }),
      },
      include: { origin: true, destination: true },
    });

    return NextResponse.json({ success: true, route: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
