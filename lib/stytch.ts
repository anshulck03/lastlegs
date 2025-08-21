import { env } from "./env";

// Basic Stytch configuration using validated environment variables
export const stytchConfig = {
  projectId: env.STYTCH_PROJECT_ID,
  secret: env.STYTCH_SECRET,
  publicToken: env.STYTCH_PUBLIC_TOKEN,
};

// Placeholder for requireUser function - this will be implemented when auth is ready
export function requireUser(req: Request): Promise<{ userId: string } | null> {
  // TODO: Implement actual Stytch session validation when auth is ready
  // For now, return null to indicate no authenticated user
  return Promise.resolve(null);
}