import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'
import { ProfileSchema } from '@/lib/validation/profile'

export async function GET() {
  const user = await requireUser()
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
  return NextResponse.json(profile || {})
}

export async function POST(request: Request) {
  return handleUpsert(request)
}

export async function PUT(request: Request) {
  return handleUpsert(request)
}

async function handleUpsert(request: Request) {
  const user = await requireUser()
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = ProfileSchema.safeParse(body)
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return NextResponse.json({ message: 'Validation failed', errors }, { status: 400 })
  }

  const data = parsed.data

  const saved = await prisma.profile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      age: data.age,
      distancePreference: data.distancePreference,
      fitnessLevel: data.fitnessLevel,
      strengthPriority: data.strengthPriority,
      gender: data.gender,
      sportsBackground: data.sportsBackground as any,
      constraints: data.constraints,
      availability: data.availability as any,
      facilities: data.facilities as any,
      coachTone: data.coachTone,
      runPaceMinPerMi: data.runPaceMinPerMi,
      bikeMph: data.bikeMph,
      swimSecPer100m: data.swimSecPer100m,
    },
    update: {
      age: data.age,
      distancePreference: data.distancePreference,
      fitnessLevel: data.fitnessLevel,
      strengthPriority: data.strengthPriority,
      gender: data.gender,
      sportsBackground: data.sportsBackground as any,
      constraints: data.constraints,
      availability: data.availability as any,
      facilities: data.facilities as any,
      coachTone: data.coachTone,
      runPaceMinPerMi: data.runPaceMinPerMi,
      bikeMph: data.bikeMph,
      swimSecPer100m: data.swimSecPer100m,
    },
  })

  return NextResponse.json(saved)
}

