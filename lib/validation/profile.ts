import { z } from 'zod'

// Optional numeric with empty-string-to-undefined semantics
const optNum = (min: number, max: number) =>
  z
    .preprocess((v) => (v === '' || v === null || v === undefined ? undefined : v), z.coerce.number().min(min).max(max))
    .optional()

export const ProfileSchema = z.object({
  age: z.coerce.number().int().min(18, 'Must be at least 18'),

  distancePreference: z.enum(['HALF', 'FULL']),
  fitnessLevel: z.string().min(1, 'Select fitness level'),
  strengthPriority: z.string().min(1, 'Select strength priority'),

  // Optional numerics
  weeklyHours: optNum(0, 40),
  weightKg: optNum(30, 200),
  bodyFatPct: optNum(1, 60),

  // Optional strings/arrays
  gender: z.string().optional(),
  sportsBackground: z.array(z.string()).optional(),
  constraints: z.string().max(1000).optional(),

  // Optional JSON
  availability: z.unknown().optional(),
  facilities: z.unknown().optional(),

  // Pace calibration (optional)
  runPaceMinPerMi: optNum(4, 20),
  bikeMph: optNum(8, 35),
  swimSecPer100m: optNum(50, 300),

  // Coach tone
  coachTone: z.string().optional(),
})

export type ProfileInput = z.infer<typeof ProfileSchema>

