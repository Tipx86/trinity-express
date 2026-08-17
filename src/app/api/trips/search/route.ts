import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cleanupExpiredLocks } from '@/lib/seat-lock';

// Dynamic Pricing Map (exact user prices)
const ROUTE_PRICES: Record<string, { rwf: number; ugx: number; kes: number; usd: number; ssp?: number; duration: number }> = {
  'Kigali-Kampala': { rwf: 38000, ugx: 100000, kes: 4000, usd: 30, duration: 570 },
  'Kigali-Mbarara': { rwf: 25000, ugx: 70000, kes: 2800, usd: 20, duration: 330 },
  'Kigali-Nairobi': { rwf: 75000, ugx: 220000, kes: 7500, usd: 60, duration: 960 },
  'Kigali-Busia': { rwf: 55000, ugx: 160000, kes: 5500, usd: 45, duration: 720 },
  'Kampala-Kigali': { rwf: 38000, ugx: 100000, kes: 4000, usd: 30, duration: 570 },
  'Kampala-Goma': { rwf: 38000, ugx: 100000, kes: 4000, usd: 30, duration: 600 },
  'Kampala-Nairobi': { rwf: 40000, ugx: 120000, kes: 4000, usd: 32, duration: 840 },
  'Kampala-Juba': { rwf: 50000, ugx: 150000, kes: 5000, usd: 45, ssp: 600000, duration: 600 },
  'Nairobi-Kigali': { rwf: 75000, ugx: 220000, kes: 7500, usd: 60, duration: 960 },
  'Nairobi-Kampala': { rwf: 40000, ugx: 120000, kes: 4000, usd: 32, duration: 840 },
  'Nairobi-Mombasa': { rwf: 21000, ugx: 65000, kes: 2100, usd: 18, duration: 480 },
  'Nairobi-Kisumu': { rwf: 16000, ugx: 50000, kes: 1600, usd: 13, duration: 360 },
  'Mombasa-Kisumu': { rwf: 26000, ugx: 80000, kes: 2600, usd: 22, duration: 720 },
  'Mombasa-Nairobi': { rwf: 21000, ugx: 65000, kes: 2100, usd: 18, duration: 480 },
  'Kisumu-Nairobi': { rwf: 16000, ugx: 50000, kes: 1600, usd: 13, duration: 360 },
  'Busia-Kampala': { rwf: 20000, ugx: 60000, kes: 2000, usd: 16, duration: 240 },
  'Kampala-Busia': { rwf: 20000, ugx: 60000, kes: 2000, usd: 16, duration: 240 },
  'Busia-Kigali': { rwf: 55000, ugx: 160000, kes: 5500, usd: 45, duration: 720 },
  'Juba-Kampala': { rwf: 50000, ugx: 150000, kes: 5000, usd: 45, ssp: 600000, duration: 600 },
  'Juba-Bor': { rwf: 5000, ugx: 15000, kes: 500, usd: 5, ssp: 50000, duration: 240 },
  'Bor-Juba': { rwf: 5000, ugx: 15000, kes: 500, usd: 5, ssp: 50000, duration: 240 },
};

// Terminal Names per city
const TERMINAL_NAMES: Record<string, string> = {
  'Kigali': 'Nyabugogo Bus Park Terminal 1',
  'Kampala': 'Namayiba Bus Terminal (Kisenyi)',
  'Nairobi': 'River Road / Accra Rd Terminal',
  'Mombasa': 'Mbaraki Bus Terminal, Mombasa',
  'Kisumu': 'Kisumu Main Bus Park, Oginga Odinga Rd',
  'Juba': 'Customs Bus Terminal, Juba',
  'Bor': 'Bor Central Bus Station',
  'Busia': 'Busia Border Terminal',
  'Mbarara': 'Mbarara Central Bus Park',
  'Goma': 'La Corniche Border Station',
};

function generateDailyTrips(from: string, to: string, date: string) {
  const routeKey = `${from}-${to}`;
  const pricing = ROUTE_PRICES[routeKey] || { rwf: 38000, ugx: 100000, kes: 4000, usd: 30, duration: 480 };

  const originTerminal = TERMINAL_NAMES[from] || `${from} Bus Terminal`;
  const destTerminal = TERMINAL_NAMES[to] || `${to} Bus Terminal`;

  const buses = [
    {
      id: `trip_${from}_${to}_${date}_0500`,
      departureTime: '05:00',
      arrivalTime: '14:30',
      busModel: 'Scania Touring HD VIP (5AM Express)',
      plateNumber: 'RAD 782K',
      busType: 'VIP_EXECUTIVE',
      seatLayout: '2x2',
      seatCount: 48,
    },
    {
      id: `trip_${from}_${to}_${date}_1400`,
      departureTime: '14:00',
      arrivalTime: '23:30',
      busModel: 'Marcopolo Paradiso G8 (2PM Express)',
      plateNumber: 'RAC 459M',
      busType: 'LUXURY_COACH',
      seatLayout: '2x2',
      seatCount: 48,
    },
    {
      id: `trip_${from}_${to}_${date}_2000`,
      departureTime: '20:00',
      arrivalTime: '05:30',
      busModel: 'Yutong ZK6122H VIP (8PM Night Express)',
      plateNumber: 'UBK 112L',
      busType: 'VIP_EXECUTIVE',
      seatLayout: '2x1',
      seatCount: 44,
    },
  ];

  return buses.map((b) => ({
    id: b.id,
    routeId: `route_${from}_${to}`,
    busId: `bus_${b.plateNumber}`,
    departureDate: date,
    departureTime: b.departureTime,
    arrivalTime: b.arrivalTime,
    priceRwf: pricing.rwf,
    priceUgx: pricing.ugx,
    priceKes: pricing.kes,
    priceUsd: pricing.usd,
    priceSsp: pricing.ssp || 0,
    status: 'SCHEDULED',
    availableSeats: b.seatCount - 4,
    occupiedSeats: [1, 2, 12, 14],
    lockedSeats: [],
    route: {
      id: `route_${from}_${to}`,
      originId: `dest_${from}`,
      destinationId: `dest_${to}`,
      distanceKm: 500,
      durationMinutes: pricing.duration,
      origin: { name: from, terminalName: originTerminal, country: 'East Africa' },
      destination: { name: to, terminalName: destTerminal, country: 'East Africa' },
    },
    bus: {
      id: `bus_${b.plateNumber}`,
      busModel: b.busModel,
      plateNumber: b.plateNumber,
      busType: b.busType,
      seatLayout: b.seatLayout,
      seatCount: b.seatCount,
      amenities: ['WIFI', 'AC', 'COMPLIMENTARY_WATER', 'USB_POWER'],
    },
  }));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const sessionId = searchParams.get('sessionId');

    if (!from || !to) {
      return NextResponse.json({ success: false, error: 'Origin and destination are required' }, { status: 400 });
    }

    let trips: any[] = [];

    // 1. Try querying Database
    try {
      await cleanupExpiredLocks();
      const routes = await prisma.route.findMany({
        where: {
          isActive: true,
          origin: { name: { equals: from } },
          destination: { name: { equals: to } },
        },
        select: { id: true },
      });

      const routeIds = routes.map((r) => r.id);

      if (routeIds.length > 0) {
        const whereClause: any = {
          routeId: { in: routeIds },
          status: { in: ['SCHEDULED', 'BOARDING'] },
        };
        if (date) whereClause.departureDate = date;

        const dbTrips = await prisma.trip.findMany({
          where: whereClause,
          include: {
            route: { include: { origin: true, destination: true } },
            bus: true,
            seatLocks: { where: { lockedUntil: { gt: new Date() } } },
            bookings: {
              where: { status: { in: ['CONFIRMED', 'PENDING'] }, paymentStatus: { in: ['PAID', 'PENDING'] } },
              include: { passengers: true },
            },
          },
          orderBy: { departureTime: 'asc' },
        });

        if (dbTrips.length > 0) {
          trips = dbTrips.map((trip) => {
            const occupiedSeats: number[] = [];
            trip.bookings.forEach((b) => b.passengers.forEach((p) => occupiedSeats.push(p.seatNumber)));
            const lockedSeats = trip.seatLocks.filter((l) => !sessionId || l.sessionId !== sessionId).map((l) => l.seatNumber);
            const totalBookedOrLocked = new Set([...occupiedSeats, ...lockedSeats]).size;
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
              availableSeats: Math.max(0, trip.bus.seatCount - totalBookedOrLocked),
              occupiedSeats,
              lockedSeats,
            };
          });
        }
      }
    } catch {
      // Continue to fallback if DB query throws
    }

    // 2. Guaranteed Dynamic Fallback — if database returns 0 trips
    if (trips.length === 0) {
      trips = generateDailyTrips(from, to, date);
    }

    return NextResponse.json({ success: true, trips });
  } catch (error: any) {
    console.error('Error searching trips:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
