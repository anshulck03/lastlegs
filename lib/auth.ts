import { prisma } from './prisma';
import { User, Profile, Race, RaceSelection } from '@prisma/client';

// Development mode user ID - stable for testing
const DEV_USER_ID = 'dev_user_1';
const DEV_USER_EMAIL = 'dev@lastlegs.app';

export interface UserWithProfile extends User {
  profile: Profile | null;
  raceSelection: (RaceSelection & { race: Race }) | null;
}

/**
 * Get the current user for development mode
 * This creates a stable dev user if it doesn't exist
 */
export async function requireUser(): Promise<UserWithProfile> {
  const isDevMode = process.env.NO_AUTH_DEV_MODE === 'true';
  
  if (!isDevMode) {
    throw new Error('Authentication not configured - set NO_AUTH_DEV_MODE=true for development');
  }

  // Check if dev user exists
  let user = await prisma.user.findUnique({
    where: { id: DEV_USER_ID },
    include: {
      profile: true,
      raceSelection: {
        include: {
          race: true,
        },
      },
    },
  });

  // Create dev user if it doesn't exist
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: DEV_USER_ID,
        email: DEV_USER_EMAIL,
      },
      include: {
        profile: true,
        raceSelection: {
          include: {
            race: true,
          },
        },
      },
    });
  }

  return user;
}

/**
 * Get current user's profile, creating one if it doesn't exist
 */
export async function requireProfile(): Promise<Profile> {
  const user = await requireUser();
  
  if (user.profile) {
    return user.profile;
  }

  // Create empty profile for dev user
  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
      // All fields are optional, will be filled during onboarding
    },
  });

  return profile;
}

/**
 * Check if user has completed onboarding (required fields filled)
 */
export function isOnboardingComplete(profile: Profile): boolean {
  return !!(
    profile.age &&
    profile.distancePreference &&
    profile.fitnessLevel &&
    profile.strengthPriority &&
    profile.completedAt
  );
}

/**
 * Check if user has selected a race
 */
export function hasRaceSelection(user: UserWithProfile): boolean {
  return !!(user.raceSelection && user.raceSelection.race);
}