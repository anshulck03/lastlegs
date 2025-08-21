import { z } from "zod";

const serverSchema = z.object({
  STYTCH_PROJECT_ID: z.string().min(1),
  STYTCH_SECRET: z.string().min(1),
  STYTCH_PUBLIC_TOKEN: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  FORMSPREE_ENDPOINT: z.string().url().optional(),
});

// Parse and validate environment variables at module load time
let env: z.infer<typeof serverSchema>;

try {
  env = serverSchema.parse({
    STYTCH_PROJECT_ID: process.env.STYTCH_PROJECT_ID,
    STYTCH_SECRET: process.env.STYTCH_SECRET,
    STYTCH_PUBLIC_TOKEN: process.env.STYTCH_PUBLIC_TOKEN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    FORMSPREE_ENDPOINT: process.env.FORMSPREE_ENDPOINT,
  });
} catch (error) {
  console.error("ENV_MISCONFIGURED: Environment validation failed", error);
  throw new Error("ENV_MISCONFIGURED");
}

export { env };

export const publicEnv = {
  NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
} as const;