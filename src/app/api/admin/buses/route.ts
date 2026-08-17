import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const buses = await prisma.bus.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { trips: true } },
      },
    });
    return NextResponse.json({ success: true, buses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plateNumber, busModel, busType, seatCount, seatLayout, amenities } = body;

    const bus = await prisma.bus.create({
      data: {
        plateNumber: plateNumber.trim().toUpperCase(),
        busModel: busModel.trim(),
        busType: busType || 'VIP_EXECUTIVE',
        seatCount: parseInt(seatCount, 10) || 48,
        seatLayout: seatLayout || '2x2',
        amenities: amenities || 'WIFI,USB,AC,WATER',
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, bus });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isActive, busModel, busType, amenities } = body;

    const updated = await prisma.bus.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(busModel && { busModel }),
        ...(busType && { busType }),
        ...(amenities && { amenities }),
      },
    });

    return NextResponse.json({ success: true, bus: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
