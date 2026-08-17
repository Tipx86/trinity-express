import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    const ticket = await prisma.ticket.findFirst({
      where: {
        OR: [
          { securityToken: token },
          { ticketNumber: token },
        ],
      },
      include: {
        booking: {
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
          },
        },
        passenger: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Invalid or fraudulent ticket token. Not found in Trinity Express manifest.',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      valid: ticket.status === 'VALID' || ticket.status === 'CHECKED_IN',
      ticket,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const body = await req.json().catch(() => ({}));
    const conductorName = body.conductorName || 'Terminal Conductor';

    const ticket = await prisma.ticket.findFirst({
      where: {
        OR: [
          { securityToken: token },
          { ticketNumber: token },
        ],
      },
    });

    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
    }

    if (ticket.status === 'CHECKED_IN') {
      return NextResponse.json({
        success: true,
        alreadyCheckedIn: true,
        message: `This ticket was already checked in at ${ticket.checkedInAt?.toLocaleTimeString()}`,
        ticket,
      });
    }

    const updated = await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: 'CHECKED_IN',
        checkedInAt: new Date(),
        checkedInBy: conductorName,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Passenger checked in successfully. Boarding authorized.',
      ticket: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
