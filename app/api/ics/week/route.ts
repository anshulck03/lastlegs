import { NextResponse } from 'next/server'
import { buildWeekIcs } from '@/lib/calendar/ics'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const weekStart = searchParams.get('weekStart')
  const today = new Date()
  const monday = new Date(today)
  const day = monday.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  monday.setDate(today.getDate() + diff)
  const startISO = weekStart || monday.toISOString().slice(0, 10)

  // Placeholder: no plan available here; return empty week
  const ics = buildWeekIcs([])
  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="lastlegs-week.ics"',
    },
  })
}

