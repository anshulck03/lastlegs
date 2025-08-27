import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const user = await requireUser();

    // Validate required fields
    const requiredFields = ['age', 'distancePreference', 'fitnessLevel', 'strengthPriority'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Update profile with completion timestamp
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        ...data,
        completedAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        ...data,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true, 
      profile,
      message: 'Onboarding completed successfully'
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}