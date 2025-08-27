import { Distance, FitnessLevel, StrengthPriority, Facilities } from '@/lib/plan/types';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
}

export interface OnboardingData {
  // Step A: Basic Profile
  age?: number;
  distancePreference?: Distance;
  fitnessLevel?: FitnessLevel;
  strengthPriority?: StrengthPriority;

  // Step B: Training Preferences
  weeklyHours?: number;
  facilities?: Facilities;
  constraints?: string;

  // Step C: Race Selection
  selectedRaceId?: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'Tell us about yourself and your goals',
  },
  {
    id: 'preferences',
    title: 'Training Preferences',
    description: 'Help us customize your training plan',
  },
  {
    id: 'race-selection',
    title: 'Choose Your Race',
    description: 'Select your target race',
  },
  {
    id: 'complete',
    title: 'Ready to Train',
    description: 'Your personalized plan is ready',
  },
];

export const FITNESS_LEVELS = [
  {
    value: 'NEW_TO_ENDURANCE' as const,
    label: 'New to Endurance',
    description: 'Little to no endurance training experience',
  },
  {
    value: 'ACTIVE_NON_ENDURANCE' as const,
    label: 'Active (Non-Endurance)',
    description: 'Regular exercise but not endurance focused',
  },
  {
    value: 'SOME_ENDURANCE' as const,
    label: 'Some Endurance',
    description: 'Some running, cycling, or swimming experience',
  },
  {
    value: 'EXPERIENCED' as const,
    label: 'Experienced',
    description: 'Completed endurance events before',
  },
  {
    value: 'COMPETITIVE' as const,
    label: 'Competitive',
    description: 'High-level training and racing experience',
  },
];

export const STRENGTH_PRIORITIES = [
  {
    value: 'ENDURANCE_PRIORITY' as const,
    label: 'Endurance Priority',
    description: 'Maximize endurance training, minimal strength work',
  },
  {
    value: 'BALANCED' as const,
    label: 'Balanced Approach',
    description: 'Equal focus on endurance and strength development',
  },
  {
    value: 'STRENGTH_PRIORITY' as const,
    label: 'Strength Priority',
    description: 'Maintain/build strength while developing endurance',
  },
];

export const DISTANCE_OPTIONS = [
  {
    value: 'HALF' as const,
    label: 'Half Distance (70.3)',
    description: '1.2mi swim, 56mi bike, 13.1mi run',
  },
  {
    value: 'FULL' as const,
    label: 'Full Distance (140.6)',
    description: '2.4mi swim, 112mi bike, 26.2mi run',
  },
];