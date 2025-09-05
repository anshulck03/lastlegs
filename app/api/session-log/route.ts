import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()

  const { planHash, weekIndex, sessionKey, dateISO, sport, plannedMin, actualMin, status } = body || {}

  if (!planHash || weekIndex === undefined || !sessionKey || !dateISO || !sport || plannedMin === undefined || !status) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  const saved = await prisma.sessionLog.upsert({
    where: { userId_planHash_sessionKey: { userId: user.id, planHash, sessionKey } },
    create: {
      userId: user.id,
      planHash,
      weekIndex: Number(weekIndex),
      sessionKey,
      date: new Date(dateISO),
      sport,
      plannedMin: Number(plannedMin),
      actualMin: actualMin != null ? Number(actualMin) : null,
      status,
    },
    update: {
      weekIndex: Number(weekIndex),
      date: new Date(dateISO),
      sport,
      plannedMin: Number(plannedMin),
      actualMin: actualMin != null ? Number(actualMin) : null,
      status,
    },
  })

  return NextResponse.json(saved)
}

export async function GET(request: Request) {
  const user = await requireUser()
  const { searchParams } = new URL(request.url)
  const planHash = searchParams.get('planHash') || ''
  const weekIndex = Number(searchParams.get('weekIndex') || '0')
  if (!planHash) return NextResponse.json({ message: 'planHash required' }, { status: 400 })

  const logs = await prisma.sessionLog.findMany({ where: { userId: user.id, planHash, weekIndex } })
  const counts = { DONE: 0, SKIPPED: 0, PARTIAL: 0, TOTAL: 0 }
  let planned = 0
  let actual = 0
  for (const l of logs) {
    counts.TOTAL += 1
    if (l.status === 'DONE') counts.DONE += 1
    if (l.status === 'SKIPPED') counts.SKIPPED += 1
    if (l.status === 'PARTIAL') counts.PARTIAL += 1
    planned += l.plannedMin
    if (l.actualMin) actual += l.actualMin
  }
  const compliancePct = counts.TOTAL === 0 ? 0 : Math.round(((counts.DONE + 0.5 * counts.PARTIAL) / counts.TOTAL) * 100)

  return NextResponse.json({ counts, minutes: { planned, actual }, compliancePct })
}

