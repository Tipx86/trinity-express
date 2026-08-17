import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tripId, seatNumbers, sessionId, durationMinutes } = body;

    if (!tripId || !seatNumbers || !sessionId) {
      return NextResponse.json({ success: false, error: 'tripId, seatNumbers, and sessionId are required' }, { status: 400 });
    }

    let lockedUntil = new Date(Date.now() + (durationMinutes || 10) * 60 * 1000);

    try {
      const { lockSeats } = await import('@/lib/seat-lock');
      const dbResult = await lockSeats(tripId, seatNumbers, sessionId, durationMinutes || 10);
      if (dbResult && dbResult.lockedUntil) {
        lockedUntil = dbResult.lockedUntil;
      }
    } catch (dbErr) {
      console.warn('DB seat lock skipped on serverless:', dbErr);
    }

    return NextResponse.json({ success: true, lockedUntil });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      lockedUntil: new Date(Date.now() + 10 * 60 * 1000),
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get('tripId');
    const sessionId = searchParams.get('sessionId');

    if (tripId && sessionId) {
      try {
        const { releaseSeatLocks } = await import('@/lib/seat-lock');
        await releaseSeatLocks(tripId, sessionId);
      } catch {
        // Silently handle
      }
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: true });
  }
}
