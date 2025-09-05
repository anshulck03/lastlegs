import { PrismaClient } from '@prisma/client'
import { fetchIronmanRaces } from './sources/ironman'

const prisma = new PrismaClient()

export async function syncIronmanRaces(opts?: { months?: number }) {
  const months = opts?.months ?? Number(process.env.RACE_SYNC_WINDOW_MONTHS || '12')
  const races = await fetchIronmanRaces(months)

  let upserted = 0
  for (const r of races) {
    // Only HALF/FULL
    if (!['HALF', 'FULL'].includes(r.distance)) continue

    await prisma.race.upsert({
      where: {
        race_name_date_unique: {
          name: r.name,
          date: new Date(r.dateISO),
        },
      },
      create: {
        name: r.name,
        city: r.city,
        country: r.country,
        date: new Date(r.dateISO),
        distance: r.distance,
        status: r.status,
        url: r.url,
      },
      update: {
        city: r.city,
        country: r.country,
        distance: r.distance,
        status: r.status,
        url: r.url,
      },
    })
    upserted++
  }

  return { count: upserted }
}

