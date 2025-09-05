import { NextResponse } from 'next/server'
import { syncIronmanRaces } from '@/lib/races/sync'

export async function POST(request: Request) {
  const isProd = process.env.NODE_ENV === 'production'
  const secret = request.headers.get('x-admin-secret')
  if (isProd && secret !== process.env.ADMIN_SYNC_SECRET) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const { count } = await syncIronmanRaces({ months: Number(process.env.RACE_SYNC_WINDOW_MONTHS || '12') })
    return NextResponse.json({ ok: true, count })
  } catch (e) {
    console.error(e)
    return new NextResponse('Sync failed', { status: 500 })
  }
}

