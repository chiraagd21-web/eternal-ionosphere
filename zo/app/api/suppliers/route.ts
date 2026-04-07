import { NextRequest, NextResponse } from 'next/server'

const AG_BASE = process.env.ANTIGRAVITY_API_URL || 'http://localhost:8000'

export async function GET() {
  try {
    const res = await fetch(`${AG_BASE}/health`, {
      signal: AbortSignal.timeout(3000),
    })
    if (res.ok) return NextResponse.json(await res.json())
  } catch { /* offline */ }
  return NextResponse.json({ status: 'offline', version: 'n/a' }, { status: 503 })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  try {
    const res = await fetch(`${AG_BASE}/ag/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    })
    if (res.ok) return NextResponse.json(await res.json())
  } catch { /* fallback */ }

  // Client-side scoring fallback
  return NextResponse.json({ error: 'Backend offline, use client-side scoring' }, { status: 503 })
}
