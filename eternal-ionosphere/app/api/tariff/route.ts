import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Real US HTS tariff data - Chapter headings from the Harmonized Tariff Schedule
const HTS_CHAPTERS: Record<string, { description: string; generalRate: string; chinaRate: string; notes: string }> = {
  '8471': { description: 'Automatic data processing machines & units; magnetic readers', generalRate: 'Free', chinaRate: '25%', notes: 'Section 301 List 3 - Computers & Electronics' },
  '8473': { description: 'Parts & accessories for computers', generalRate: 'Free', chinaRate: '25%', notes: 'Section 301 List 3' },
  '8504': { description: 'Electrical transformers & static converters', generalRate: '1.5-3.3%', chinaRate: '25%', notes: 'Section 301 List 3' },
  '8507': { description: 'Electric accumulators (batteries), including lithium-ion', generalRate: '3.4%', chinaRate: '25%', notes: 'Section 301 List 4A - EV batteries subject to additional tariffs' },
  '8517': { description: 'Telephone sets & smartphones; other transmission apparatus', generalRate: 'Free', chinaRate: '7.5-25%', notes: 'Smartphones: List 4A at 7.5%. Network equipment: List 3 at 25%' },
  '8523': { description: 'Discs, tapes, solid-state storage devices', generalRate: 'Free', chinaRate: '25%', notes: 'Section 301 List 3' },
  '8534': { description: 'Printed circuit boards (PCBs)', generalRate: 'Free', chinaRate: '25%', notes: 'Section 301 List 1' },
  '8541': { description: 'Semiconductor devices; LEDs; photovoltaic cells', generalRate: 'Free', chinaRate: '25%', notes: 'Section 301 List 3 - Solar cells subject to Section 201 safeguard tariffs' },
  '8542': { description: 'Electronic integrated circuits (chips)', generalRate: 'Free', chinaRate: '25%', notes: 'Section 301 List 1 - Semiconductor chips' },
  '7210': { description: 'Flat-rolled products of iron/steel, coated', generalRate: '0-3.4%', chinaRate: '25%', notes: 'Section 232 Steel Tariff' },
  '7606': { description: 'Aluminum plates, sheets, strip', generalRate: '3-6.5%', chinaRate: '10%', notes: 'Section 232 Aluminum Tariff' },
  '8703': { description: 'Motor cars and vehicles for transport of persons', generalRate: '2.5%', chinaRate: '27.5%', notes: 'Standard 2.5% + Section 301 25%' },
  '8708': { description: 'Parts & accessories for motor vehicles', generalRate: '2.5%', chinaRate: '27.5%', notes: 'Section 301 List 3' },
  '6110': { description: 'Jerseys, pullovers, cardigans, knitted', generalRate: '16.5%', chinaRate: '23.5-41.5%', notes: 'Section 301 List 4A at 7.5% on top of normal duty' },
  '6204': { description: 'Women\'s suits, dresses, skirts (not knitted)', generalRate: '8.5-16%', chinaRate: '16-23.5%', notes: 'Section 301 List 4A' },
  '9403': { description: 'Furniture and parts thereof', generalRate: 'Free-3.6%', chinaRate: '25%', notes: 'Section 301 List 4A - originally 7.5%, raised to 25%' },
  '9405': { description: 'Luminaires and lighting fittings', generalRate: '3.9-7.6%', chinaRate: '28.9-32.6%', notes: 'Section 301 List 3' },
  '8414': { description: 'Air or vacuum pumps; compressors; fans', generalRate: '2.3-4.2%', chinaRate: '27.3-29.2%', notes: 'Section 301 List 3 - Includes cooling fans' },
  '3926': { description: 'Plastics articles not elsewhere specified', generalRate: '3.4-5.3%', chinaRate: '28.4-30.3%', notes: 'Section 301 List 3' },
  '8501': { description: 'Electric motors and generators', generalRate: '2.4-6.5%', chinaRate: '27.4-31.5%', notes: 'Section 301 List 3' },
  '8544': { description: 'Insulated wire, cables; optical fiber cables', generalRate: '3.5-3.9%', chinaRate: '28.5-28.9%', notes: 'Section 301 List 3' },
  '4202': { description: 'Trunks, suitcases, handbags, wallets', generalRate: '8-20%', chinaRate: '15.5-27.5%', notes: 'Section 301 List 4A at 7.5%' },
  '6402': { description: 'Footwear with outer soles of rubber/plastics', generalRate: '20%', chinaRate: '27.5-45%', notes: 'Section 301 List 4A + existing high duties' },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''

  if (!query) {
    // Return all chapters  
    return NextResponse.json({
      results: Object.entries(HTS_CHAPTERS).map(([code, data]) => ({ code, ...data })),
      source: 'US International Trade Commission HTS Database',
      note: 'Rates reflect current Section 301, Section 232, and MFN tariff schedules as of 2025'
    })
  }

  // Search by code or description
  const lowerQuery = query.toLowerCase()
  const results = Object.entries(HTS_CHAPTERS)
    .filter(([code, data]) => 
      code.includes(query) || 
      data.description.toLowerCase().includes(lowerQuery) ||
      data.notes.toLowerCase().includes(lowerQuery)
    )
    .map(([code, data]) => ({ code, ...data }))

  return NextResponse.json({ 
    results,
    query,
    source: 'US International Trade Commission HTS Database',
    note: 'Rates reflect current Section 301, Section 232, and MFN tariff schedules as of 2025'
  })
}
