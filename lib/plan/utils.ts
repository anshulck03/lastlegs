import { createHash } from 'crypto';
import { Plan, PlanInput } from './types';

/**
 * Generate a deterministic hash for a plan based on its key inputs
 * This is used for caching AI responses
 */
export function generatePlanHash(input: PlanInput): string {
  // Create a stable string representation of the plan inputs
  const hashInput = {
    distance: input.distance,
    raceDate: input.raceDate,
    today: input.today,
    age: input.age,
    fitnessLevel: input.fitnessLevel,
    weeklyHours: input.weeklyHours,
    facilities: input.facilities,
    constraints: input.constraints,
    strengthPriority: input.strengthPriority,
    // Don't include availability as it doesn't affect plan generation
  };

  const hashString = JSON.stringify(hashInput, Object.keys(hashInput).sort());
  return createHash('md5').update(hashString).digest('hex').substring(0, 12);
}

/**
 * Get the current week index based on today's date and plan start date
 */
export function getCurrentWeekIndex(plan: Plan): number {
  const today = new Date();
  const startDate = new Date(plan.startDate);
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weekIndex = Math.floor(diffDays / 7);
  
  // Ensure we don't go beyond the plan length
  return Math.max(0, Math.min(weekIndex, plan.weeks.length - 1));
}

/**
 * Get a safe profile summary for AI prompts (no PII)
 */
export function createProfileSafe(
  profile: any,
  race: any,
  weeksToRace: number
): any {
  // Determine age band
  let ageBand: '18-34' | '35-44' | '45+' = '18-34';
  if (profile.age >= 45) ageBand = '45+';
  else if (profile.age >= 35) ageBand = '35-44';

  return {
    distance: profile.distancePreference || race?.distance || 'HALF',
    fitnessLevel: profile.fitnessLevel || 'SOME_ENDURANCE',
    ageBand,
    facilities: profile.facilities || {},
    constraintsSummary: profile.constraints?.substring(0, 300) || undefined,
    strengthPriority: profile.strengthPriority || 'BALANCED',
    weeksToRace,
  };
}