import { NextRequest, NextResponse } from 'next/server';
import { differenceInWeeks, parseISO } from 'date-fns';
import { requireUser, hasRaceSelection } from '@/lib/auth';
import { generatePlan } from '@/lib/plan/generate';
import { getCurrentWeekIndex } from '@/lib/plan/utils';
import { logPlanGenerated, logApiCall } from '@/lib/telemetry';
import { PlanInput, Distance, FitnessLevel, StrengthPriority } from '@/lib/plan/types';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get current user and validate they have a race selected
    const user = await requireUser();
    
    if (!hasRaceSelection(user) || !user.raceSelection?.race) {
      logApiCall('/api/plan', 'GET', Date.now() - startTime, 400);
      return NextResponse.json(
        { error: 'No race selected. Please select a race first.' },
        { status: 400 }
      );
    }

    const profile = user.profile;
    const race = user.raceSelection.race;

    if (!profile) {
      logApiCall('/api/plan', 'GET', Date.now() - startTime, 400);
      return NextResponse.json(
        { error: 'Profile not found. Please complete onboarding first.' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!profile.age || !profile.fitnessLevel || !profile.distancePreference) {
      logApiCall('/api/plan', 'GET', Date.now() - startTime, 400);
      return NextResponse.json(
        { error: 'Incomplete profile. Please complete onboarding first.' },
        { status: 400 }
      );
    }

    // Build plan input
    const today = new Date().toISOString().split('T')[0];
    const raceDate = race.date.toISOString().split('T')[0];
    const weeksToRace = differenceInWeeks(parseISO(raceDate), parseISO(today));

    const planInput: PlanInput = {
      distance: profile.distancePreference as Distance,
      raceDate,
      today,
      age: profile.age,
      fitnessLevel: profile.fitnessLevel as FitnessLevel,
      weeklyHours: profile.weeklyHours || undefined,
      facilities: profile.facilities as any || {},
      constraints: profile.constraints || undefined,
      strengthPriority: (profile.strengthPriority as StrengthPriority) || 'BALANCED',
      availability: profile.availability as any || undefined,
    };

    // Generate the plan
    const plan = generatePlan(planInput);

    // Log telemetry
    logPlanGenerated({
      distance: plan.distance,
      weeksToRace: plan.meta.weeksToRace,
      fitnessLevel: plan.fitnessLevel,
    });

    // Check if specific week is requested
    const { searchParams } = new URL(request.url);
    const weekParam = searchParams.get('week');
    
    if (weekParam) {
      let weekIndex: number;
      
      if (weekParam === 'current') {
        weekIndex = getCurrentWeekIndex(plan);
      } else {
        weekIndex = parseInt(weekParam, 10) - 1; // Convert to 0-based index
        if (isNaN(weekIndex) || weekIndex < 0 || weekIndex >= plan.weeks.length) {
          logApiCall('/api/plan', 'GET', Date.now() - startTime, 400);
          return NextResponse.json(
            { error: 'Invalid week parameter' },
            { status: 400 }
          );
        }
      }

      const week = plan.weeks[weekIndex];
      if (!week) {
        logApiCall('/api/plan', 'GET', Date.now() - startTime, 404);
        return NextResponse.json(
          { error: 'Week not found' },
          { status: 404 }
        );
      }

      logApiCall('/api/plan', 'GET', Date.now() - startTime, 200);
      return NextResponse.json(week);
    }

    // Return full plan
    logApiCall('/api/plan', 'GET', Date.now() - startTime, 200);
    return NextResponse.json(plan);

  } catch (error) {
    console.error('Plan generation error:', error);
    logApiCall('/api/plan', 'GET', Date.now() - startTime, 500);
    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    );
  }
}