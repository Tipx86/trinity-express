import { NextRequest, NextResponse } from 'next/server';
import { lockSeats, releaseSeatLocks } from '@/lib/seat-lock';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tripId, seatNumbers, sessionId, durationMinutes } = body;

    if (!tripId || !seatNumbers || !sessionId) {
      return NextResponse.json({ success: false, error: 'tripId, seatNumbers, and sessionId are required' }, { status: 400 });
    }

    const result = await lockSeats(tripId, seatNumbers, sessionId, durationMinutes || 10);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 409 });
    }

    return NextResponse.json({ success: true, lockedUntil: result.lockedUntil });
  } catch (error: any) {
    console.error('Error locking seats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get('tripId');
    const sessionId = searchParams.get('sessionId');

    if (tripId && sessionId) {
      await releaseSeatLocks(tripId, sessionId);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
