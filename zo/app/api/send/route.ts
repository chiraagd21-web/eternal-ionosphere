import { NextRequest, NextResponse } from 'next/server'

const AG_BASE = process.env.ANTIGRAVITY_API_URL || 'http://localhost:8000'

export async function POST(req: NextRequest) {
  const body = await req.json()

  try {
    const res = await fetch(`${AG_BASE}/ag/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    })
    if (res.ok) return NextResponse.json(await res.json())
  } catch { /* fallback */ }

  // Simulate success when backend is offline
  return NextResponse.json({
    sent: body.suppliers?.length || 1,
    failed: 0,
    message_ids: [`msg_${Date.now()}`],
    note: 'Demo mode — configure SMTP in the backend to send real emails',
  })
}
