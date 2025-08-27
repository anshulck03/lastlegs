import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { raceId } = await request.json();

    if (!raceId) {
      return NextResponse.json(
        { error: 'Race ID is required' },
        { status: 400 }
      );
    }

    const user = await requireUser();

    // Verify race exists
    const race = await prisma.race.findUnique({
      where: { id: raceId },
    });

    if (!race) {
      return NextResponse.json(
        { error: 'Race not found' },
        { status: 404 }
      );
    }

    // Create or update race selection
    const raceSelection = await prisma.raceSelection.upsert({
      where: { userId: user.id },
      update: { raceId },
      create: {
        userId: user.id,
        raceId,
      },
      include: {
        race: true,
      },
    });

    return NextResponse.json(raceSelection);
  } catch (error) {
    console.error('Race selection error:', error);
    return NextResponse.json(
      { error: 'Failed to select race' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await requireUser();

    const raceSelection = await prisma.raceSelection.findUnique({
      where: { userId: user.id },
      include: {
        race: true,
      },
    });

    return NextResponse.json(raceSelection);
  } catch (error) {
    console.error('Get race selection error:', error);
    return NextResponse.json(
      { error: 'Failed to get race selection' },
      { status: 500 }
    );
  }
}