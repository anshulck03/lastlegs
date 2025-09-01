import { NextResponse } from 'next/server'

export async function POST() {
  const res = new NextResponse(null, { status: 200 })
  // Clear dev user cookie if present
  res.cookies.set('dev_user_id', '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}

