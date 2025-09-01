import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { addMonths } from 'date-fns'
import { computeShortRunway } from '@/lib/races/utils'

const prisma = new PrismaClient()

// Types
type ApiRace = {
  name: string
  dateISO: string
  dateText: string
  location: string
  distance: 'Full' | '70.3'
  url: string
  status: 'Open' | 'Closed' | 'Waitlist' | 'Sold Out' | 'Registration Soon' | 'Unknown'
}

type CacheEntry = {
  data: Race[];
  fetchedAt: number;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const includeClosed = searchParams.get('includeClosed') === 'true'
  const limitParam = Number(searchParams.get('limit') || '50')
  const limit = Math.min(Math.max(1, limitParam), 200)

  const today = new Date()
  const windowMonths = Number(process.env.RACE_SYNC_WINDOW_MONTHS || '12')
  const windowEnd = addMonths(today, windowMonths)

  const finalsRegex = /championship|world|final|finale|pro\s*series/i

  const races = await prisma.race.findMany({
    where: {
      date: { gte: today, lte: windowEnd },
      distance: { in: ['HALF', 'FULL'] },
      AND: [
        includeClosed
          ? {}
          : {
              OR: [
                { status: null },
                { status: 'OPEN' },
                { status: 'WAITLIST' },
              ],
            },
      ],
    },
    orderBy: { date: 'asc' },
    take: limit,
  })

  const items: (ApiRace & { shortRunway: boolean })[] = races
    .filter((r) => !finalsRegex.test(r.name))
    .map((r) => ({
      name: r.name,
      dateISO: r.date.toISOString().slice(0, 10),
      dateText: r.date.toISOString().slice(0, 10),
      location: [r.city, r.country].filter(Boolean).join(', '),
      distance: r.distance === 'FULL' ? 'Full' : '70.3',
      url: r.url || '#',
      status:
        r.status === 'OPEN'
          ? 'Open'
          : r.status === 'WAITLIST'
          ? 'Waitlist'
          : r.status === 'CLOSED'
          ? 'Closed'
          : 'Unknown',
      shortRunway: computeShortRunway(r.date.toISOString().slice(0, 10)),
    }))

  // Compute shortRunway flag compatibility: add derived only in frontend if needed

  return NextResponse.json({
    fallback: false,
    count: items.length,
    items,
  })
}
