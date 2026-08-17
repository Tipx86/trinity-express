import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const FALLBACK_DESTINATIONS = [
  { id: 'dest_kigali', name: 'Kigali', code: 'KGL', country: 'Rwanda', terminalName: 'Nyabugogo Bus Park Terminal 1', isPopular: true, sortOrder: 1 },
  { id: 'dest_kampala', name: 'Kampala', code: 'KLA', country: 'Uganda', terminalName: 'Namayiba Bus Terminal (Kisenyi)', isPopular: true, sortOrder: 2 },
  { id: 'dest_nairobi', name: 'Nairobi', code: 'NBO', country: 'Kenya', terminalName: 'River Road / Accra Rd Terminal', isPopular: true, sortOrder: 3 },
  { id: 'dest_mombasa', name: 'Mombasa', code: 'MBA', country: 'Kenya', terminalName: 'Mbaraki Bus Terminal', isPopular: true, sortOrder: 4 },
  { id: 'dest_kisumu', name: 'Kisumu', code: 'KIS', country: 'Kenya', terminalName: 'Kisumu Main Bus Park', isPopular: true, sortOrder: 5 },
  { id: 'dest_busia', name: 'Busia', code: 'BSA', country: 'Uganda', terminalName: 'Busia Border Terminal', isPopular: true, sortOrder: 6 },
  { id: 'dest_mbarara', name: 'Mbarara', code: 'MBR', country: 'Uganda', terminalName: 'Mbarara Central Bus Park', isPopular: false, sortOrder: 7 },
  { id: 'dest_juba', name: 'Juba', code: 'JUB', country: 'South Sudan', terminalName: 'Customs Bus Terminal', isPopular: true, sortOrder: 8 },
  { id: 'dest_bor', name: 'Bor', code: 'BOR', country: 'South Sudan', terminalName: 'Bor Central Station', isPopular: false, sortOrder: 9 },
  { id: 'dest_goma', name: 'Goma', code: 'GOM', country: 'DR Congo', terminalName: 'La Corniche Border Station', isPopular: false, sortOrder: 10 },
];

export async function GET() {
  try {
    let destinations = await prisma.destination.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    if (destinations.length === 0) {
      destinations = FALLBACK_DESTINATIONS as any;
    }

    return NextResponse.json({ success: true, destinations });
  } catch {
    return NextResponse.json({ success: true, destinations: FALLBACK_DESTINATIONS });
  }
}
