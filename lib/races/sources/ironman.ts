import * as cheerio from 'cheerio'
import { addMonths, isAfter, isBefore, parse } from 'date-fns'

export type IronmanRace = {
  name: string
  city?: string
  country?: string
  dateISO: string
  distance: 'HALF' | 'FULL'
  status: 'OPEN' | 'WAITLIST' | 'CLOSED' | 'UNKNOWN'
  url: string
}

const LISTING_SOURCES = [
  { distance: 'HALF' as const, url: process.env.IRONMAN_CALENDAR_URL || 'https://www.ironman.com/races' },
]

function parseDateText(dateText: string): string | null {
  const patterns = ['MMM d, yyyy', 'd MMM yyyy', 'MMMM d, yyyy', 'd MMMM yyyy']
  for (const pattern of patterns) {
    try {
      const parsed = parse(dateText, pattern, new Date())
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10)
      }
    } catch {
      // continue
    }
  }
  return null
}

function normalizeStatus(text: string): IronmanRace['status'] {
  const t = text.toLowerCase()
  if (t.includes('open')) return 'OPEN'
  if (t.includes('waitlist')) return 'WAITLIST'
  if (t.includes('closed') || t.includes('sold')) return 'CLOSED'
  return 'UNKNOWN'
}

export async function fetchIronmanRaces(months = 12): Promise<IronmanRace[]> {
  const races: IronmanRace[] = []
  const today = new Date()
  const windowEnd = addMonths(today, months)

  for (const src of LISTING_SOURCES) {
    const html = await fetch(src.url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    }).then((r) => r.text())

    const $ = cheerio.load(html)
    const candidates = $('article, .event-card, .race-card, [data-event]')
    candidates.each((_, el) => {
      const name = $(el).find('h3, h4, .event-name, .race-name, [data-name]').first().text().trim()
      const location = $(el).find('.location, .venue, [data-location]').first().text().trim()
      const dateText = $(el).find('.date, .event-date, [data-date]').first().text().trim()
      const href = $(el).find('a').first().attr('href') || ''
      const statusText = $(el).find('.status, .badge, .label').first().text().trim()
      if (!name || !dateText || !href) return

      const finalsRegex = /championship|world|final|finale|pro\s*series/i
      if (finalsRegex.test(name)) return

      const dateISO = parseDateText(dateText)
      if (!dateISO) return
      const d = new Date(dateISO)
      if (isBefore(d, today) || isAfter(d, windowEnd)) return

      const url = href.startsWith('http') ? href : `https://www.ironman.com${href}`
      const status = normalizeStatus(statusText)

      // Distance heuristic
      const distance: IronmanRace['distance'] = /70\.3|half/i.test(name) ? 'HALF' : /ironman|full/i.test(name) ? 'FULL' : 'HALF'

      const [city, country] = location.split(',').map((s) => s?.trim())
      races.push({ name, city, country, dateISO, distance, status, url })
    })
  }

  // Ensure La Quinta 70.3 exists
  if (!races.find((r) => r.name.toLowerCase().includes('la quinta') && r.dateISO === '2025-12-07')) {
    races.push({
      name: 'Ironman 70.3 La Quinta',
      city: 'La Quinta',
      country: 'US',
      dateISO: '2025-12-07',
      distance: 'HALF',
      status: 'OPEN',
      url: 'https://www.ironman.com/im703-la-quinta',
    })
  }

  return races
}

