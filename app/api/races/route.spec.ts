import { describe, it, expect } from 'vitest'
import { computeShortRunway } from '../../../lib/races/utils'

describe('races API filters', () => {
  it('excludes championships/finals by regex', () => {
    const finalsRegex = /championship|world|final|finale|pro\s*series/i
    expect(finalsRegex.test('World Championship')).toBe(true)
    expect(finalsRegex.test('Ironman Pro Series Finale')).toBe(true)
    expect(finalsRegex.test('Ironman Texas')).toBe(false)
  })

  it('computes shortRunway for <16 weeks', () => {
    const soon = new Date()
    soon.setDate(soon.getDate() + 7 * 8)
    const far = new Date()
    far.setDate(far.getDate() + 7 * 20)
    expect(computeShortRunway(soon.toISOString().slice(0, 10))).toBe(true)
    expect(computeShortRunway(far.toISOString().slice(0, 10))).toBe(false)
  })
})

