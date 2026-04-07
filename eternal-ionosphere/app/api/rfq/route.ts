import { NextRequest, NextResponse } from 'next/server'

const AG_BASE = process.env.ANTIGRAVITY_API_URL || 'http://localhost:8000'

function generateFallbackRFQ(body: Record<string, unknown>): string {
  const product = (body.product as string) || 'Product'
  const category = (body.category as string) || 'General'
  const quantity = (body.quantity as number) || 0
  const targetPrice = (body.targetPrice as string) || ''
  const deadline = (body.deadline as string) || 'ASAP'
  const requirements = (body.requirements as string) || ''
  const lineItems = (body.lineItems as Array<{description:string;qty:number;unit:string;notes:string}>) || []
  const ref = `RFQ-${Date.now().toString(36).toUpperCase()}`
  const date = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })

  return `REQUEST FOR QUOTATION
══════════════════════════════════════
Reference No: ${ref}
Issued: ${date}

TO: [Supplier Name]
FROM: Procurement Team — ProcureAI Platform

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Product:       ${product}
Category:      ${category}
Quantity:      ${quantity.toLocaleString()} units
Target Price:  ${targetPrice ? `USD $${targetPrice} per unit` : 'To be quoted'}
Quote By:      ${deadline}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECHNICAL REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${requirements || 'Please provide product specifications in your response.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LINE ITEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${lineItems.length
    ? lineItems.map((li, i) => `  ${i+1}. ${li.description || 'Item'} — Qty: ${li.qty} ${li.unit}${li.notes ? ` | Note: ${li.notes}` : ''}`).join('\n')
    : `  1. ${product} — Qty: ${quantity} pcs`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUIRED IN YOUR QUOTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Unit price at stated quantity (and price breaks if available)
□ Minimum Order Quantity (MOQ)
□ Lead time from order confirmation
□ Payment terms
□ Validity period of quote
□ ISO / quality certifications
□ Sample availability and cost
□ Country of origin

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please reply to this email with your quotation by ${deadline}.
Questions? Contact procurement@company.com

Thank you for your prompt response.
ProcureAI — AI Procurement Intelligence Platform`
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  try {
    const res = await fetch(`${AG_BASE}/ag/generate-rfq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    })
    if (res.ok) return NextResponse.json(await res.json())
  } catch { /* fallback */ }

  const rfq_text = generateFallbackRFQ(body)
  const reference = `RFQ-${Date.now().toString(36).toUpperCase()}`
  return NextResponse.json({ rfq_text, reference })
}
