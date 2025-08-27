import { NextRequest, NextResponse } from 'next/server';
import { requireUser, requireProfile } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const profile = await requireProfile();
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireUser();
    const data = await request.json();

    // Validate required fields if completing onboarding
    if (data.completedAt) {
      const requiredFields = ['age', 'distancePreference', 'fitnessLevel', 'strengthPriority'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        return NextResponse.json(
          { error: `Missing required fields: ${missingFields.join(', ')}` },
          { status: 400 }
        );
      }
    }

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        ...data,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}