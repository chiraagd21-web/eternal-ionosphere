import { NextRequest, NextResponse } from 'next/server'

const AG_BASE = process.env.ANTIGRAVITY_API_URL || 'http://localhost:8000'

export async function POST(req: NextRequest) {
  const body = await req.json()

  try {
    const res = await fetch(`${AG_BASE}/ag/calc-landed-cost`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    })
    if (res.ok) return NextResponse.json(await res.json())
  } catch { /* fallback */ }

  // Simple US import estimate fallback
  const { unit_price = 10, quantity = 100, weight_kg = 1 } = body
  const subtotal   = unit_price * quantity
  const freight    = Math.max(50, weight_kg * quantity * 0.8)
  const duties     = subtotal * 0.05
  const insurance  = subtotal * 0.005
  const total      = subtotal + freight + duties + insurance
  const landed_unit_cost = total / quantity

  return NextResponse.json({
    unit_price, subtotal, freight: Math.round(freight * 100) / 100,
    duties: Math.round(duties * 100) / 100,
    insurance: Math.round(insurance * 100) / 100,
    total: Math.round(total * 100) / 100,
    landed_unit_cost: Math.round(landed_unit_cost * 100) / 100,
    note: 'Estimate only — connect AG backend for live tariff data',
  })
}
