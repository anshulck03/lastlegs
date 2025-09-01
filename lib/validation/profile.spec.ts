import { describe, it, expect } from 'vitest'
import { ProfileSchema } from './profile'

describe('ProfileSchema', () => {
  it('accepts only required fields', () => {
    const input = {
      age: 25,
      distancePreference: 'HALF',
      fitnessLevel: 'intermediate',
      strengthPriority: 'medium',
    }
    const parsed = ProfileSchema.parse(input)
    expect(parsed.age).toBe(25)
  })

  it('transforms empty strings to undefined for optional numerics', () => {
    const input = {
      age: 30,
      distancePreference: 'FULL',
      fitnessLevel: 'advanced',
      strengthPriority: 'high',
      weeklyHours: '',
      weightKg: '',
      bodyFatPct: '',
      runPaceMinPerMi: '',
      bikeMph: '',
      swimSecPer100m: '',
    }
    const parsed = ProfileSchema.parse(input)
    expect(parsed.weeklyHours).toBeUndefined()
    expect(parsed.weightKg).toBeUndefined()
    expect(parsed.bodyFatPct).toBeUndefined()
    expect(parsed.runPaceMinPerMi).toBeUndefined()
    expect(parsed.bikeMph).toBeUndefined()
    expect(parsed.swimSecPer100m).toBeUndefined()
  })
})

