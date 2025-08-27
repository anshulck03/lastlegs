import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distance = searchParams.get('distance');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status');

    const where: any = {};
    
    if (distance && ['HALF', 'FULL'].includes(distance)) {
      where.distance = distance;
    }
    
    if (status && ['OPEN', 'CLOSED', 'WAITLIST'].includes(status)) {
      where.status = status;
    }

    const races = await prisma.race.findMany({
      where,
      orderBy: [
        { date: 'asc' },
        { name: 'asc' },
      ],
      take: Math.min(limit, 100), // Cap at 100 for safety
    });

    return NextResponse.json(races);
  } catch (error) {
    console.error('Get races error:', error);
    return NextResponse.json(
      { error: 'Failed to get races' },
      { status: 500 }
    );
  }
}