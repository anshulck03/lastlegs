import { describe, it, expect } from 'vitest'

describe('races API filters', () => {
  it('excludes championships/finals by regex', () => {
    const finalsRegex = /championship|world|final|finale|pro\s*series/i
    expect(finalsRegex.test('World Championship')).toBe(true)
    expect(finalsRegex.test('Ironman Pro Series Finale')).toBe(true)
    expect(finalsRegex.test('Ironman Texas')).toBe(false)
  })
})

