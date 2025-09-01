import { z } from 'zod'

// Helpers for optional numeric inputs that may arrive as "" from forms
const emptyToUndefinedNumber = (schema: z.ZodNumber) =>
  z.preprocess((v) => (v === '' || v === null || v === undefined ? undefined : v), schema.optional())

export const ProfileSchema = z.object({
  age: z.coerce.number().int().min(18, 'Must be at least 18'),

  distancePreference: z.enum(['HALF', 'FULL']),
  fitnessLevel: z.string().min(1, 'Select fitness level'),
  strengthPriority: z.string().min(1, 'Select strength priority'),

  // Optional numerics
  weeklyHours: emptyToUndefinedNumber(z.coerce.number().min(0).max(40)),
  weightKg: emptyToUndefinedNumber(z.coerce.number().min(30).max(200)),
  bodyFatPct: emptyToUndefinedNumber(z.coerce.number().min(1).max(60)),

  // Optional strings/arrays
  gender: z.string().optional(),
  sportsBackground: z.array(z.string()).optional(),
  constraints: z.string().max(1000).optional(),

  // Optional JSON
  availability: z.unknown().optional(),
  facilities: z.unknown().optional(),

  // Pace calibration (optional)
  runPaceMinPerMi: emptyToUndefinedNumber(z.coerce.number().min(4).max(20)),
  bikeMph: emptyToUndefinedNumber(z.coerce.number().min(8).max(35)),
  swimSecPer100m: emptyToUndefinedNumber(z.coerce.number().min(50).max(300)),

  // Coach tone
  coachTone: z.string().optional(),
})

export type ProfileInput = z.infer<typeof ProfileSchema>

