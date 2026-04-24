import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual, createHash } from 'crypto'

// In-memory rate limiter — resets on server restart, fine for a low-traffic site
const attempts = new Map<string, { count: number; resetAt: number }>()

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = attempts.get(ip)

  if (!entry || now > entry.resetAt) {
    return false
  }
  return entry.count >= MAX_ATTEMPTS
}

function recordFailure(ip: string) {
  const now = Date.now()
  const entry = attempts.get(ip)

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
  } else {
    entry.count++
  }
}

function clearFailures(ip: string) {
  attempts.delete(ip)
}

// Use a fixed-length hash so timingSafeEqual buffers are always the same size
function hash(value: string): Buffer {
  return createHash('sha256').update(value).digest()
}

export async function POST(request: NextRequest) {
  const ip = getIp(request)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait 15 minutes.' },
      { status: 429 }
    )
  }

  const { password } = await request.json()
  const expected = process.env.ADMIN_PASSWORD
  const secret = process.env.ADMIN_SECRET

  if (!expected || !secret) {
    return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 })
  }

  const match = timingSafeEqual(
    hash(password ?? ''),
    hash(expected)
  )

  if (!match) {
    recordFailure(ip)
    const entry = attempts.get(ip)
    const remaining = MAX_ATTEMPTS - (entry?.count ?? 0)
    return NextResponse.json(
      { error: `Incorrect password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.` },
      { status: 401 }
    )
  }

  clearFailures(ip)

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  return response
}
