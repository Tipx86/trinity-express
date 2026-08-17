import { NextRequest, NextResponse } from 'next/server';
import { getTripSeatAvailability } from '@/lib/seat-lock';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId') || undefined;

    const availability = await getTripSeatAvailability(id, sessionId);
    return NextResponse.json({ success: true, ...availability });
  } catch (error: any) {
    console.error('Error fetching seat availability:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
