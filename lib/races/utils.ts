export function computeShortRunway(dateISO: string, thresholdWeeks = 16): boolean {
  const raceDate = new Date(dateISO + 'T00:00:00Z')
  const now = new Date()
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const diffWeeks = (raceDate.getTime() - now.getTime()) / msPerWeek
  return diffWeeks < thresholdWeeks
}

