import prisma from './prisma';

export const SEAT_HOLD_DURATION_MINUTES = parseInt(
  process.env.SEAT_HOLD_DURATION_MINUTES || '10',
  10
);

export async function cleanupExpiredLocks() {
  const now = new Date();
  try {
    await prisma.seatLock.deleteMany({
      where: {
        lockedUntil: {
          lt: now,
        },
      },
    });
  } catch (err) {
    console.error('Error cleaning up expired seat locks:', err);
  }
}

export async function getTripSeatAvailability(tripId: string, currentSessionId?: string) {
  await cleanupExpiredLocks();

  // 1. Get confirmed passenger seats for this trip
  const confirmedPassengers = await prisma.passenger.findMany({
    where: {
      booking: {
        tripId,
        status: {
          in: ['CONFIRMED', 'PENDING'],
        },
        paymentStatus: {
          in: ['PAID', 'PENDING'],
        },
      },
    },
    select: {
      seatNumber: true,
      booking: {
        select: {
          id: true,
          status: true,
          paymentStatus: true,
        },
      },
    },
  });

  const occupiedSeats = new Set<number>();
  for (const p of confirmedPassengers) {
    occupiedSeats.add(p.seatNumber);
  }

  // 2. Get active seat locks
  const activeLocks = await prisma.seatLock.findMany({
    where: {
      tripId,
      lockedUntil: {
        gt: new Date(),
      },
    },
    select: {
      seatNumber: true,
      sessionId: true,
      lockedUntil: true,
    },
  });

  const lockedByOthers = new Set<number>();
  const lockedByCurrent = new Set<number>();

  for (const lock of activeLocks) {
    if (occupiedSeats.has(lock.seatNumber)) continue;
    if (currentSessionId && lock.sessionId === currentSessionId) {
      lockedByCurrent.add(lock.seatNumber);
    } else {
      lockedByOthers.add(lock.seatNumber);
    }
  }

  return {
    occupiedSeats: Array.from(occupiedSeats),
    lockedByOthers: Array.from(lockedByOthers),
    lockedByCurrent: Array.from(lockedByCurrent),
  };
}

export async function lockSeats(
  tripId: string,
  seatNumbers: number[],
  sessionId: string,
  durationMinutes = SEAT_HOLD_DURATION_MINUTES
): Promise<{ success: boolean; error?: string; lockedUntil?: Date }> {
  if (!seatNumbers || seatNumbers.length === 0) {
    return { success: false, error: 'No seats selected.' };
  }

  await cleanupExpiredLocks();
  const now = new Date();
  const lockedUntil = new Date(now.getTime() + durationMinutes * 60 * 1000);

  // Run in a transaction
  return await prisma.$transaction(async (tx) => {
    // 1. Check if any seat is already booked
    const existingBooked = await tx.passenger.findFirst({
      where: {
        seatNumber: { in: seatNumbers },
        booking: {
          tripId,
          status: { in: ['CONFIRMED'] },
        },
      },
      select: { seatNumber: true },
    });

    if (existingBooked) {
      return {
        success: false,
        error: `Seat ${existingBooked.seatNumber} has already been booked by another passenger.`,
      };
    }

    // 2. Check if any seat is locked by someone else
    const conflictLock = await tx.seatLock.findFirst({
      where: {
        tripId,
        seatNumber: { in: seatNumbers },
        sessionId: { not: sessionId },
        lockedUntil: { gt: now },
      },
      select: { seatNumber: true },
    });

    if (conflictLock) {
      return {
        success: false,
        error: `Seat ${conflictLock.seatNumber} is currently reserved by another customer. Please select a different seat.`,
      };
    }

    // 3. Clear existing locks for this session on this trip
    await tx.seatLock.deleteMany({
      where: {
        tripId,
        sessionId,
      },
    });

    // 4. Create new locks
    for (const seatNumber of seatNumbers) {
      await tx.seatLock.upsert({
        where: {
          tripId_seatNumber: {
            tripId,
            seatNumber,
          },
        },
        create: {
          tripId,
          seatNumber,
          sessionId,
          lockedUntil,
        },
        update: {
          sessionId,
          lockedUntil,
        },
      });
    }

    return {
      success: true,
      lockedUntil,
    };
  });
}

export async function releaseSeatLocks(tripId: string, sessionId: string) {
  try {
    await prisma.seatLock.deleteMany({
      where: {
        tripId,
        sessionId,
      },
    });
  } catch (err) {
    console.error('Error releasing seat locks:', err);
  }
}
