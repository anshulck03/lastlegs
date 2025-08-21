export interface OnboardingBasics {
  firstName: string;
  lastName: string;
  email: string;
  experience: "beginner" | "intermediate" | "advanced" | "";
  targetRace: string;
}