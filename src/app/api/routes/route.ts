import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const routes = await prisma.route.findMany({
      where: { isActive: true },
      include: {
        origin: true,
        destination: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ success: true, routes });
  } catch (error: any) {
    console.error('Error fetching routes:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
