import { NextRequest, NextResponse } from 'next/server';
import { differenceInWeeks, parseISO } from 'date-fns';
import { requireUser, hasRaceSelection } from '@/lib/auth';
import { generatePlan } from '@/lib/plan/generate';
import { generatePlanHash, createProfileSafe } from '@/lib/plan/utils';
import { getCoachText, CoachPromptInput } from '@/lib/ai/openrouter';
import { getCached, setCached, makeKey } from '@/lib/ai/cache';
import { logAiOverviewSuccess, logAiOverviewError, logAiWeekSuccess, logAiWeekError, logApiCall } from '@/lib/telemetry';
import { PlanInput, Distance, FitnessLevel, StrengthPriority, CoachType } from '@/lib/plan/types';

interface CoachRequest {
  type: CoachType;
  weekIndex?: number;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Parse request body
    const body: CoachRequest = await request.json();
    const { type, weekIndex } = body;

    if (!type || !['PLAN_OVERVIEW', 'WEEKLY_EXPLANATION', 'CONSTRAINT_TRANSLATION', 'STRENGTH_RATIONALE'].includes(type)) {
      logApiCall('/api/coach', 'POST', Date.now() - startTime, 400);
      return NextResponse.json(
        { error: 'Invalid or missing type parameter' },
        { status: 400 }
      );
    }

    // Get current user and validate
    const user = await requireUser();
    
    if (!hasRaceSelection(user) || !user.raceSelection?.race) {
      logApiCall('/api/coach', 'POST', Date.now() - startTime, 400);
      return NextResponse.json(
        { error: 'No race selected. Please select a race first.' },
        { status: 400 }
      );
    }

    const profile = user.profile;
    const race = user.raceSelection.race;

    if (!profile || !profile.age || !profile.fitnessLevel || !profile.distancePreference) {
      logApiCall('/api/coach', 'POST', Date.now() - startTime, 400);
      return NextResponse.json(
        { error: 'Incomplete profile. Please complete onboarding first.' },
        { status: 400 }
      );
    }

    // Build plan input and generate plan
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

    const plan = generatePlan(planInput);
    const planHash = generatePlanHash(planInput);
    const profileSafe = createProfileSafe(profile, race, weeksToRace);

    // Determine token budget based on type
    const tokenBudgets = {
      PLAN_OVERVIEW: 400,
      WEEKLY_EXPLANATION: 250,
      CONSTRAINT_TRANSLATION: 200,
      STRENGTH_RATIONALE: 150,
    };
    const tokenBudget = tokenBudgets[type];

    // Prepare plan slice based on type
    let planSlice: any;
    let cacheWeekIndex = 0;

    if (type === 'PLAN_OVERVIEW') {
      planSlice = {
        distance: plan.distance,
        weeksToRace: plan.meta.weeksToRace,
        phases: plan.weeks.reduce((acc, week) => {
          acc[week.phase] = (acc[week.phase] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        weeklyHoursTarget: plan.weeklyHoursTarget,
        strengthPriority: plan.strengthPriority,
        shortRunway: plan.meta.shortRunway,
        notes: plan.meta.notes,
      };
    } else if (type === 'WEEKLY_EXPLANATION') {
      if (typeof weekIndex !== 'number' || weekIndex < 1 || weekIndex > plan.weeks.length) {
        logApiCall('/api/coach', 'POST', Date.now() - startTime, 400);
        return NextResponse.json(
          { error: 'Invalid weekIndex for WEEKLY_EXPLANATION' },
          { status: 400 }
        );
      }
      planSlice = plan.weeks[weekIndex - 1]; // Convert to 0-based index
      cacheWeekIndex = weekIndex;
    } else if (type === 'CONSTRAINT_TRANSLATION') {
      if (!profile.constraints) {
        logApiCall('/api/coach', 'POST', Date.now() - startTime, 400);
        return NextResponse.json(
          { error: 'No constraints to translate' },
          { status: 400 }
        );
      }
      planSlice = { constraints: profile.constraints };
    } else if (type === 'STRENGTH_RATIONALE') {
      // Find current or next strength session
      const currentWeek = plan.weeks[Math.min(plan.weeks.length - 1, Math.floor(plan.weeks.length / 2))];
      planSlice = {
        phase: currentWeek.phase,
        strengthPriority: plan.strengthPriority,
        hasStrengthSessions: currentWeek.days.some(day => 
          day.sessions.some(session => session.sport === 'STRENGTH')
        ),
      };
    }

    // Check cache
    const cacheKey = makeKey({
      userId: user.id,
      planHash,
      weekIndex: cacheWeekIndex,
      type,
    });

    const cachedText = getCached(cacheKey);
    if (cachedText) {
      logApiCall('/api/coach', 'POST', Date.now() - startTime, 200);
      return NextResponse.json({ text: cachedText });
    }

    // Call AI if not cached
    const coachInput: CoachPromptInput = {
      profileSafe,
      planSlice,
      tone: 'analytical',
      type,
      tokenBudget,
    };

    const aiStartTime = Date.now();
    const text = await getCoachText(coachInput);
    const aiDuration = Date.now() - aiStartTime;

    if (!text) {
      // AI call failed, log error and return empty response
      if (type === 'PLAN_OVERVIEW') {
        logAiOverviewError({ error: 'Empty response', duration: aiDuration });
      } else if (type === 'WEEKLY_EXPLANATION') {
        logAiWeekError({ weekIndex: weekIndex || 0, error: 'Empty response', duration: aiDuration });
      }
      
      logApiCall('/api/coach', 'POST', Date.now() - startTime, 503);
      return NextResponse.json(
        { text: '' },
        { status: 503 }
      );
    }

    // Cache the result
    setCached(cacheKey, text);

    // Log success
    if (type === 'PLAN_OVERVIEW') {
      logAiOverviewSuccess({ tokenCount: text.length, duration: aiDuration });
    } else if (type === 'WEEKLY_EXPLANATION') {
      logAiWeekSuccess({ weekIndex: weekIndex || 0, tokenCount: text.length, duration: aiDuration });
    }

    logApiCall('/api/coach', 'POST', Date.now() - startTime, 200);
    return NextResponse.json({ text });

  } catch (error) {
    console.error('Coach API error:', error);
    logApiCall('/api/coach', 'POST', Date.now() - startTime, 500);
    return NextResponse.json(
      { text: '' },
      { status: 500 }
    );
  }
}