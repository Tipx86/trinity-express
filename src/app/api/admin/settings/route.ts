import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: { category: 'asc' },
    });
    const partners = await prisma.partner.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, settings, partners });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { settings, newPartner } = body;

    if (settings && Array.isArray(settings)) {
      for (const s of settings) {
        await prisma.siteSetting.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: { key: s.key, value: s.value, category: s.category || 'GENERAL' },
        });
      }
    }

    if (newPartner) {
      await prisma.partner.create({
        data: {
          name: newPartner.name,
          category: newPartner.category || 'CORPORATE',
          description: newPartner.description,
          websiteUrl: newPartner.websiteUrl,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
