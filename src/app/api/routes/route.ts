import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const FALLBACK_ROUTES = [
  { id: 'route_Kigali_Kampala', origin: { name: 'Kigali', terminalName: 'Nyabugogo Bus Park Terminal 1' }, destination: { name: 'Kampala', terminalName: 'Namayiba Bus Terminal (Kisenyi)' }, priceRwf: 38000, priceUgx: 100000, priceKes: 4000, durationMinutes: 570 },
  { id: 'route_Kigali_Mbarara', origin: { name: 'Kigali', terminalName: 'Nyabugogo Bus Park Terminal 1' }, destination: { name: 'Mbarara', terminalName: 'Mbarara Central Bus Park' }, priceRwf: 25000, priceUgx: 70000, priceKes: 2800, durationMinutes: 330 },
  { id: 'route_Kigali_Nairobi', origin: { name: 'Kigali', terminalName: 'Nyabugogo Bus Park Terminal 1' }, destination: { name: 'Nairobi', terminalName: 'River Road / Accra Rd Terminal' }, priceRwf: 75000, priceUgx: 220000, priceKes: 7500, durationMinutes: 960 },
  { id: 'route_Kigali_Busia', origin: { name: 'Kigali', terminalName: 'Nyabugogo Bus Park Terminal 1' }, destination: { name: 'Busia', terminalName: 'Busia Border Terminal' }, priceRwf: 55000, priceUgx: 160000, priceKes: 5500, durationMinutes: 720 },
  { id: 'route_Kampala_Kigali', origin: { name: 'Kampala', terminalName: 'Namayiba Bus Terminal (Kisenyi)' }, destination: { name: 'Kigali', terminalName: 'Nyabugogo Bus Park Terminal 1' }, priceRwf: 38000, priceUgx: 100000, priceKes: 4000, durationMinutes: 570 },
  { id: 'route_Kampala_Goma', origin: { name: 'Kampala', terminalName: 'Namayiba Bus Terminal (Kisenyi)' }, destination: { name: 'Goma', terminalName: 'La Corniche Border Station' }, priceRwf: 38000, priceUgx: 100000, priceKes: 4000, durationMinutes: 600 },
  { id: 'route_Kampala_Nairobi', origin: { name: 'Kampala', terminalName: 'Namayiba Bus Terminal (Kisenyi)' }, destination: { name: 'Nairobi', terminalName: 'River Road / Accra Rd Terminal' }, priceRwf: 40000, priceUgx: 120000, priceKes: 4000, durationMinutes: 840 },
  { id: 'route_Kampala_Juba', origin: { name: 'Kampala', terminalName: 'Namayiba Bus Terminal (Kisenyi)' }, destination: { name: 'Juba', terminalName: 'Customs Bus Terminal' }, priceRwf: 50000, priceUgx: 150000, priceKes: 5000, priceSsp: 600000, durationMinutes: 600 },
  { id: 'route_Nairobi_Kigali', origin: { name: 'Nairobi', terminalName: 'River Road / Accra Rd Terminal' }, destination: { name: 'Kigali', terminalName: 'Nyabugogo Bus Park Terminal 1' }, priceRwf: 75000, priceUgx: 220000, priceKes: 7500, durationMinutes: 960 },
  { id: 'route_Nairobi_Kampala', origin: { name: 'Nairobi', terminalName: 'River Road / Accra Rd Terminal' }, destination: { name: 'Kampala', terminalName: 'Namayiba Bus Terminal (Kisenyi)' }, priceRwf: 40000, priceUgx: 120000, priceKes: 4000, durationMinutes: 840 },
  { id: 'route_Nairobi_Mombasa', origin: { name: 'Nairobi', terminalName: 'River Road / Accra Rd Terminal' }, destination: { name: 'Mombasa', terminalName: 'Mbaraki Bus Terminal' }, priceRwf: 21000, priceUgx: 65000, priceKes: 2100, durationMinutes: 480 },
  { id: 'route_Nairobi_Kisumu', origin: { name: 'Nairobi', terminalName: 'River Road / Accra Rd Terminal' }, destination: { name: 'Kisumu', terminalName: 'Kisumu Main Bus Park' }, priceRwf: 16000, priceUgx: 50000, priceKes: 1600, durationMinutes: 360 },
  { id: 'route_Mombasa_Kisumu', origin: { name: 'Mombasa', terminalName: 'Mbaraki Bus Terminal' }, destination: { name: 'Kisumu', terminalName: 'Kisumu Main Bus Park' }, priceRwf: 26000, priceUgx: 80000, priceKes: 2600, durationMinutes: 720 },
  { id: 'route_Mombasa_Nairobi', origin: { name: 'Mombasa', terminalName: 'Mbaraki Bus Terminal' }, destination: { name: 'Nairobi', terminalName: 'River Road / Accra Rd Terminal' }, priceRwf: 21000, priceUgx: 65000, priceKes: 2100, durationMinutes: 480 },
  { id: 'route_Kisumu_Nairobi', origin: { name: 'Kisumu', terminalName: 'Kisumu Main Bus Park' }, destination: { name: 'Nairobi', terminalName: 'River Road / Accra Rd Terminal' }, priceRwf: 16000, priceUgx: 50000, priceKes: 1600, durationMinutes: 360 },
  { id: 'route_Busia_Kampala', origin: { name: 'Busia', terminalName: 'Busia Border Terminal' }, destination: { name: 'Kampala', terminalName: 'Namayiba Bus Terminal (Kisenyi)' }, priceRwf: 20000, priceUgx: 60000, priceKes: 2000, durationMinutes: 240 },
  { id: 'route_Kampala_Busia', origin: { name: 'Kampala', terminalName: 'Namayiba Bus Terminal (Kisenyi)' }, destination: { name: 'Busia', terminalName: 'Busia Border Terminal' }, priceRwf: 20000, priceUgx: 60000, priceKes: 2000, durationMinutes: 240 },
  { id: 'route_Busia_Kigali', origin: { name: 'Busia', terminalName: 'Busia Border Terminal' }, destination: { name: 'Kigali', terminalName: 'Nyabugogo Bus Park Terminal 1' }, priceRwf: 55000, priceUgx: 160000, priceKes: 5500, durationMinutes: 720 },
  { id: 'route_Juba_Kampala', origin: { name: 'Juba', terminalName: 'Customs Bus Terminal' }, destination: { name: 'Kampala', terminalName: 'Namayiba Bus Terminal (Kisenyi)' }, priceRwf: 50000, priceUgx: 150000, priceKes: 5000, priceSsp: 600000, durationMinutes: 600 },
  { id: 'route_Juba_Bor', origin: { name: 'Juba', terminalName: 'Customs Bus Terminal' }, destination: { name: 'Bor', terminalName: 'Bor Central Station' }, priceRwf: 5000, priceUgx: 15000, priceKes: 500, priceSsp: 50000, durationMinutes: 240 },
  { id: 'route_Bor_Juba', origin: { name: 'Bor', terminalName: 'Bor Central Station' }, destination: { name: 'Juba', terminalName: 'Customs Bus Terminal' }, priceRwf: 5000, priceUgx: 15000, priceKes: 500, priceSsp: 50000, durationMinutes: 240 },
];

export async function GET() {
  try {
    let routes = await prisma.route.findMany({
      where: { isActive: true },
      include: {
        origin: true,
        destination: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    if (routes.length === 0) {
      routes = FALLBACK_ROUTES as any;
    }

    return NextResponse.json({ success: true, routes });
  } catch {
    return NextResponse.json({ success: true, routes: FALLBACK_ROUTES });
  }
}
