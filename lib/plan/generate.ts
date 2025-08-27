import { addDays, addWeeks, differenceInWeeks, format, parseISO } from 'date-fns';
import {
  PlanInput,
  Plan,
  WeekPlan,
  DayPlan,
  Session,
  Phase,
  Distance,
  FitnessLevel,
  StrengthPriority,
  Facilities,
} from './types';

// Helper function to calculate age band
function getAgeBand(age: number): '18-34' | '35-44' | '45+' {
  if (age < 35) return '18-34';
  if (age < 45) return '35-44';
  return '45+';
}

// Helper function to calculate runway bucket
function getRunwayBucket(weeksToRace: number): '12-15' | '8-11' | '6-7' | '<=5' | '>=16' {
  if (weeksToRace <= 5) return '<=5';
  if (weeksToRace <= 7) return '6-7';
  if (weeksToRace <= 11) return '8-11';
  if (weeksToRace <= 15) return '12-15';
  return '>=16';
}

// Helper function to get default weekly hours based on distance and fitness level
function getDefaultWeeklyHours(distance: Distance, fitnessLevel: FitnessLevel): number {
  const bands = {
    HALF: {
      NEW_TO_ENDURANCE: 6,
      ACTIVE_NON_ENDURANCE: 8,
      SOME_ENDURANCE: 10,
      EXPERIENCED: 12,
      COMPETITIVE: 14,
    },
    FULL: {
      NEW_TO_ENDURANCE: 8,
      ACTIVE_NON_ENDURANCE: 10,
      SOME_ENDURANCE: 12,
      EXPERIENCED: 15,
      COMPETITIVE: 18,
    },
  };
  
  return bands[distance][fitnessLevel];
}

// Helper function to apply age-based adjustments
function applyAgeAdjustments(hours: number, ageBand: '18-34' | '35-44' | '45+'): number {
  switch (ageBand) {
    case '35-44':
      return Math.round(hours * 0.95);
    case '45+':
      return Math.round(hours * 0.90);
    default:
      return hours;
  }
}

// Helper function to determine phase distribution based on runway
function getPhaseDistribution(weeksToRace: number): { base: number; build: number; peak: number; taper: number } {
  // Always reserve 2 weeks for taper
  const availableWeeks = weeksToRace - 2;
  
  if (availableWeeks <= 3) { // <=5 total weeks
    return { base: 1, build: 1, peak: 1, taper: 2 };
  } else if (availableWeeks <= 5) { // 6-7 total weeks
    return { base: 2, build: 2, peak: 1, taper: 2 };
  } else if (availableWeeks <= 9) { // 8-11 total weeks
    return { base: 3, build: 3, peak: 3, taper: 2 };
  } else if (availableWeeks <= 13) { // 12-15 total weeks
    return { base: 5, build: 4, peak: 4, taper: 2 };
  } else { // >=16 total weeks
    return { base: 6, build: 5, peak: 3, taper: 2 };
  }
}

// Helper function to create base sessions for a day
function createBaseSessions(
  day: number, // 0 = Monday, 6 = Sunday
  phase: Phase,
  weekIndex: number,
  targetHours: number,
  distance: Distance,
  strengthPriority: StrengthPriority,
  facilities: Facilities,
  weeksToRace: number,
): Session[] {
  const sessions: Session[] = [];
  
  // Rest day (typically Sunday = 6)
  if (day === 6) {
    return sessions; // Rest day
  }
  
  // Strength training placement (avoiding interference)
  const shouldIncludeStrength = strengthPriority !== 'ENDURANCE_PRIORITY' && 
                               weeksToRace > 2 && // No strength in final 2 weeks
                               (phase !== 'TAPER' || weeksToRace > 4); // Reduce strength in taper
  
  const isLongRunDay = day === 0; // Monday long run
  const isLongBikeDay = day === 1; // Tuesday long bike
  const isBrickDay = (phase === 'BUILD' || phase === 'PEAK') && day === 5; // Saturday brick
  
  // Strength interference rules: no heavy lower <48h before long run
  const canDoStrength = shouldIncludeStrength && 
                       !isLongRunDay && 
                       !isBrickDay && 
                       day !== 0 && // No strength on day before long run
                       (strengthPriority === 'STRENGTH_PRIORITY' || (day !== 4 && day !== 5));
  
  // Swimming (2x per week)
  if (day === 2 || day === 4) { // Wednesday and Friday
    if (facilities.pool === false) {
      // No pool - replace with bike endurance or run technique alternating
      if (day === 2) {
        sessions.push({
          sport: 'BIKE',
          label: 'Endurance Ride (Pool Alternative)',
          durationMin: 60,
          notes: 'Steady aerobic effort to replace swim session',
        });
      } else {
        sessions.push({
          sport: 'RUN',
          label: 'Technique Run (Pool Alternative)',
          durationMin: 45,
          notes: 'Focus on form and cadence',
        });
      }
    } else {
      const swimDuration = distance === 'FULL' ? 60 : 45;
      sessions.push({
        sport: 'SWIM',
        label: day === 2 ? 'Technique Swim' : 'Endurance Swim',
        durationMin: swimDuration,
        distanceKm: distance === 'FULL' ? 2.5 : 1.8,
        notes: day === 2 ? 'Drill work and technique focus' : 'Steady aerobic swimming',
      });
    }
  }
  
  // Long run (Monday)
  if (isLongRunDay) {
    const longRunDuration = Math.min(
      distance === 'FULL' ? 150 : 120, // Cap at 2.5h for FULL, 2h for HALF
      targetHours * 60 * 0.35 // Max 35% of weekly volume
    );
    sessions.push({
      sport: 'RUN',
      label: 'Long Run',
      durationMin: longRunDuration,
      distanceKm: longRunDuration / 6, // ~6 min/km average
      notes: phase === 'BASE' ? 'Easy aerobic pace' : 'Build to race pace in final third',
    });
  }
  
  // Long bike (Tuesday)
  if (isLongBikeDay) {
    const longBikeDuration = Math.min(
      distance === 'FULL' ? 240 : 180, // Cap at 4h for FULL, 3h for HALF
      targetHours * 60 * 0.4 // Max 40% of weekly volume
    );
    
    if (facilities.trainer === false && phase === 'PEAK') {
      // No trainer - shift some intensity to run aerobic
      sessions.push({
        sport: 'BIKE',
        label: 'Long Outdoor Ride',
        durationMin: longBikeDuration,
        notes: 'Steady effort, outdoor ride without trainer',
      });
    } else {
      sessions.push({
        sport: 'BIKE',
        label: 'Long Bike',
        durationMin: longBikeDuration,
        distanceKm: longBikeDuration / 2.5, // ~2.5 min/km average
        notes: phase === 'BASE' ? 'Steady aerobic effort' : 'Include race pace intervals',
      });
    }
  }
  
  // Brick session (Saturday in BUILD and PEAK)
  if (isBrickDay) {
    sessions.push({
      sport: 'BIKE',
      label: 'Brick Bike',
      durationMin: 90,
      isBrick: true,
      notes: 'Moderate effort leading into run',
    });
    sessions.push({
      sport: 'RUN',
      label: 'Brick Run',
      durationMin: 30,
      isBrick: true,
      notes: 'Quick transition, find race pace',
    });
  }
  
  // Regular training sessions
  if (!isLongRunDay && !isLongBikeDay && !isBrickDay) {
    // Run sessions (3x per week total including long run)
    if (day === 3) { // Thursday
      sessions.push({
        sport: 'RUN',
        label: 'Tempo Run',
        durationMin: 45,
        notes: phase === 'BASE' ? 'Steady effort' : 'Threshold intervals',
      });
    }
    
    // Bike sessions (3x per week total including long bike)
    if (day === 4 && !isBrickDay) { // Friday (if not brick day)
      sessions.push({
        sport: 'BIKE',
        label: 'Recovery Ride',
        durationMin: 60,
        notes: 'Easy spinning, active recovery',
      });
    }
  }
  
  // Strength training (0-2x per week based on priority)
  if (canDoStrength) {
    const strengthFreq = strengthPriority === 'STRENGTH_PRIORITY' ? 2 : 1;
    
    if ((strengthFreq === 2 && (day === 2 || day === 4)) || 
        (strengthFreq === 1 && day === 3)) {
      
      let strengthType = 'Functional Strength';
      let duration = 45;
      
      if (facilities.gym === false) {
        strengthType = 'Bodyweight Strength';
        duration = 30;
      }
      
      if (phase === 'TAPER') {
        strengthType = 'Maintenance Strength';
        duration = 30;
      }
      
      sessions.push({
        sport: 'STRENGTH',
        label: strengthType,
        durationMin: duration,
        notes: phase === 'TAPER' ? 'Light weights, maintain strength' : 'Functional movements for triathlon',
      });
    }
  }
  
  return sessions;
}

// Main function to generate plan
export function generatePlan(input: PlanInput): Plan {
  const startDate = parseISO(input.today);
  const raceDate = parseISO(input.raceDate);
  const weeksToRace = differenceInWeeks(raceDate, startDate);
  
  const ageBand = getAgeBand(input.age);
  const runwayBucket = getRunwayBucket(weeksToRace);
  const shortRunway = weeksToRace < 16;
  
  // Calculate target weekly hours
  let baseWeeklyHours = input.weeklyHours || getDefaultWeeklyHours(input.distance, input.fitnessLevel);
  baseWeeklyHours = applyAgeAdjustments(baseWeeklyHours, ageBand);
  
  // Get phase distribution
  const phaseDistribution = getPhaseDistribution(weeksToRace);
  
  // Build weeks
  const weeks: WeekPlan[] = [];
  let currentPhase: Phase = 'BASE';
  let phaseWeekCount = 0;
  let totalVolume = baseWeeklyHours;
  
  for (let weekIndex = 0; weekIndex < weeksToRace; weekIndex++) {
    const weekStartDate = addWeeks(startDate, weekIndex);
    
    // Determine current phase
    if (weekIndex < phaseDistribution.base) {
      currentPhase = 'BASE';
    } else if (weekIndex < phaseDistribution.base + phaseDistribution.build) {
      currentPhase = 'BUILD';
    } else if (weekIndex < phaseDistribution.base + phaseDistribution.build + phaseDistribution.peak) {
      currentPhase = 'PEAK';
    } else {
      currentPhase = 'TAPER';
    }
    
    // Calculate target hours for this week
    let targetHours = baseWeeklyHours;
    
    // Apply recovery weeks (every 3-4 weeks, reduce by 20-30%)
    const isRecoveryWeek = (weekIndex + 1) % 4 === 0 && currentPhase !== 'TAPER';
    if (isRecoveryWeek) {
      targetHours = Math.round(targetHours * 0.75);
    }
    
    // Apply progressive volume increase (~5-8% per week)
    if (currentPhase === 'BASE' || currentPhase === 'BUILD') {
      const progressionMultiplier = 1 + (weekIndex * 0.06);
      targetHours = Math.round(targetHours * progressionMultiplier);
    }
    
    // Apply taper reduction
    if (currentPhase === 'TAPER') {
      const weeksFromRace = weeksToRace - weekIndex;
      if (weeksFromRace === 2) {
        targetHours = Math.round(baseWeeklyHours * 0.6); // -40%
      } else if (weeksFromRace === 1) {
        targetHours = Math.round(baseWeeklyHours * 0.4); // -60%
      }
    }
    
    // Build daily plans
    const days: DayPlan[] = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const dayDate = addDays(weekStartDate, dayIndex);
      const sessions = createBaseSessions(
        dayIndex,
        currentPhase,
        weekIndex,
        targetHours,
        input.distance,
        input.strengthPriority,
        input.facilities || {},
        weeksToRace - weekIndex
      );
      
      days.push({
        dateISO: format(dayDate, 'yyyy-MM-dd'),
        sessions,
      });
    }
    
    weeks.push({
      weekIndex: weekIndex + 1,
      phase: currentPhase,
      targetHours,
      days,
    });
  }
  
  // Generate plan metadata notes
  const notes: string[] = [];
  if (shortRunway) {
    notes.push(`Short runway (${weeksToRace} weeks) - compressed training phases`);
  }
  if (input.facilities?.pool === false) {
    notes.push('Swimming replaced with alternative endurance training');
  }
  if (input.facilities?.gym === false) {
    notes.push('Gym-based strength replaced with bodyweight exercises');
  }
  if (ageBand !== '18-34') {
    notes.push(`Age-adjusted training volume (${ageBand})`);
  }
  
  return {
    startDate: format(startDate, 'yyyy-MM-dd'),
    raceDate: format(raceDate, 'yyyy-MM-dd'),
    distance: input.distance,
    fitnessLevel: input.fitnessLevel,
    weeklyHoursTarget: baseWeeklyHours,
    strengthPriority: input.strengthPriority,
    weeks,
    meta: {
      weeksToRace,
      runwayBucket,
      shortRunway,
      ageBand,
      notes,
    },
  };
}