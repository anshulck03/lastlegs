export type WeekSession = {
  title: string
  startISO: string // YYYY-MM-DD
  durationMin: number
  details?: string
}

function formatDate(dt: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`
}

export function buildWeekIcs(sessions: WeekSession[]) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Last Legs//EN',
  ]
  for (const s of sessions) {
    const start = new Date(`${s.startISO}T07:00:00Z`)
    const end = new Date(start.getTime() + s.durationMin * 60000)
    lines.push('BEGIN:VEVENT')
    lines.push(`SUMMARY:${s.title}`)
    if (s.details) lines.push(`DESCRIPTION:${s.details.replace(/\n/g, '\\n')}`)
    lines.push(`DTSTART:${formatDate(start)}`)
    lines.push(`DTEND:${formatDate(end)}`)
    lines.push('END:VEVENT')
  }
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

