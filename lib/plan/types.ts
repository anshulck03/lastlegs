export type Distance = 'HALF' | 'FULL';

export type FitnessLevel =
  | 'NEW_TO_ENDURANCE'
  | 'ACTIVE_NON_ENDURANCE'
  | 'SOME_ENDURANCE'
  | 'EXPERIENCED'
  | 'COMPETITIVE';

export type StrengthPriority =
  | 'ENDURANCE_PRIORITY'
  | 'BALANCED'
  | 'STRENGTH_PRIORITY';

export interface Facilities {
  pool?: boolean;
  gym?: boolean;
  treadmill?: boolean;
  trainer?: boolean;
}

export interface PlanInput {
  distance: Distance;
  raceDate: string; // ISO
  today: string;    // ISO
  age: number;
  fitnessLevel: FitnessLevel;
  weeklyHours?: number;
  facilities?: Facilities;
  constraints?: string;
  strengthPriority: StrengthPriority;
  availability?: any; // JSON from profile; optional, not enforced
}

export type Phase = 'BASE' | 'BUILD' | 'PEAK' | 'TAPER';

export interface Session {
  sport: 'SWIM' | 'BIKE' | 'RUN' | 'STRENGTH';
  label: string;
  durationMin?: number;
  distanceKm?: number;
  notes?: string;
  isBrick?: boolean;
}

export interface DayPlan {
  dateISO: string;
  sessions: Session[];
}

export interface WeekPlan {
  weekIndex: number;
  phase: Phase;
  targetHours: number;
  days: DayPlan[]; // length 7
}

export interface Plan {
  startDate: string;
  raceDate: string;
  distance: Distance;
  fitnessLevel: FitnessLevel;
  weeklyHoursTarget: number;
  strengthPriority: StrengthPriority;
  weeks: WeekPlan[];
  meta: {
    weeksToRace: number;
    runwayBucket: '12-15' | '8-11' | '6-7' | '<=5' | '>=16';
    shortRunway: boolean;
    ageBand: '18-34' | '35-44' | '45+';
    notes: string[];
  };
}

// Helper types for AI coaching
export interface ProfileSafe {
  distance: Distance;
  fitnessLevel: FitnessLevel;
  ageBand: '18-34' | '35-44' | '45+';
  facilities?: Facilities;
  constraintsSummary?: string; // trimmed to 300 chars
  strengthPriority: StrengthPriority;
  weeksToRace: number;
}

export type CoachType = 'PLAN_OVERVIEW' | 'WEEKLY_EXPLANATION' | 'CONSTRAINT_TRANSLATION' | 'STRENGTH_RATIONALE';