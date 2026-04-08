import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Comprehensive US HTS tariff database — Section 301, Section 232, and MFN rates
const HTS_DATA: { code: string; description: string; generalRate: string; chinaRate: string; notes: string; chapter: string }[] = [
  // Chapter 28-29: Chemicals
  { code: '2804', description: 'Hydrogen, rare gases and other non-metals', generalRate: 'Free-3.7%', chinaRate: '25%', notes: 'Section 301 List 3', chapter: 'Chemicals' },
  { code: '2933', description: 'Heterocyclic compounds with nitrogen', generalRate: '3.5-6.5%', chinaRate: '28.5-31.5%', notes: 'Section 301 List 3 — Pharmaceutical intermediates', chapter: 'Chemicals' },
  // Chapter 39: Plastics
  { code: '3901', description: 'Polymers of ethylene, in primary forms', generalRate: '6.5%', chinaRate: '31.5%', notes: 'Section 301 List 3', chapter: 'Plastics' },
  { code: '3920', description: 'Plates, sheets, film of plastics (non-cellular)', generalRate: '4.2%', chinaRate: '29.2%', notes: 'Section 301 List 3', chapter: 'Plastics' },
  { code: '3926', description: 'Other articles of plastics (misc)', generalRate: '3.4-5.3%', chinaRate: '28.4-30.3%', notes: 'Section 301 List 3', chapter: 'Plastics' },
  // Chapter 42: Leather goods
  { code: '4202', description: 'Trunks, suitcases, handbags, wallets', generalRate: '8-20%', chinaRate: '15.5-27.5%', notes: 'Section 301 List 4A at 7.5%', chapter: 'Leather & Bags' },
  // Chapter 44: Wood
  { code: '4407', description: 'Wood sawn or chipped lengthwise', generalRate: 'Free-4.9%', chinaRate: '25%', notes: 'Section 301 List 3', chapter: 'Wood Products' },
  { code: '4418', description: 'Builders joinery and carpentry of wood', generalRate: '3.2%', chinaRate: '28.2%', notes: 'Section 301 List 3', chapter: 'Wood Products' },
  // Chapter 61-62: Apparel
  { code: '6109', description: 'T-shirts, singlets, tank tops (knitted)', generalRate: '16.5-32%', chinaRate: '24-39.5%', notes: 'Section 301 List 4A at 7.5%', chapter: 'Apparel' },
  { code: '6110', description: 'Jerseys, pullovers, cardigans (knitted)', generalRate: '16.5%', chinaRate: '23.5-41.5%', notes: 'Section 301 List 4A at 7.5%', chapter: 'Apparel' },
  { code: '6203', description: "Men's suits, jackets, trousers (not knitted)", generalRate: '7.1-27.3%', chinaRate: '14.6-34.8%', notes: 'Section 301 List 4A', chapter: 'Apparel' },
  { code: '6204', description: "Women's suits, dresses, skirts (not knitted)", generalRate: '8.5-16%', chinaRate: '16-23.5%', notes: 'Section 301 List 4A', chapter: 'Apparel' },
  // Chapter 64: Footwear
  { code: '6402', description: 'Footwear with outer soles of rubber/plastics', generalRate: '20%', chinaRate: '27.5-45%', notes: 'Section 301 List 4A + existing high duties', chapter: 'Footwear' },
  { code: '6403', description: 'Footwear with outer soles of rubber and upper of leather', generalRate: '8.5-20%', chinaRate: '16-27.5%', notes: 'Section 301 List 4A', chapter: 'Footwear' },
  // Chapter 72-73: Steel
  { code: '7207', description: 'Semi-finished products of iron or non-alloy steel', generalRate: 'Free', chinaRate: '25%', notes: 'Section 232 Steel Tariff', chapter: 'Steel' },
  { code: '7208', description: 'Flat-rolled products of iron, hot-rolled', generalRate: 'Free', chinaRate: '25%', notes: 'Section 232 Steel Tariff', chapter: 'Steel' },
  { code: '7210', description: 'Flat-rolled products of iron/steel, coated', generalRate: '0-3.4%', chinaRate: '25%', notes: 'Section 232 Steel Tariff', chapter: 'Steel' },
  { code: '7306', description: 'Tubes, pipes and hollow profiles of iron/steel', generalRate: 'Free-3.4%', chinaRate: '25%', notes: 'Section 232 Steel Tariff', chapter: 'Steel' },
  { code: '7318', description: 'Screws, bolts, nuts, washers of iron/steel', generalRate: 'Free-8.6%', chinaRate: '25%', notes: 'Section 301 List 3 + AD/CVD on Chinese fasteners', chapter: 'Steel' },
  // Chapter 76: Aluminum
  { code: '7601', description: 'Unwrought aluminum (ingots, billets)', generalRate: 'Free-5%', chinaRate: '10%', notes: 'Section 232 Aluminum Tariff', chapter: 'Aluminum' },
  { code: '7604', description: 'Aluminum bars, rods and profiles', generalRate: '5%', chinaRate: '10%', notes: 'Section 232 Aluminum Tariff', chapter: 'Aluminum' },
  { code: '7606', description: 'Aluminum plates, sheets, strip', generalRate: '3-6.5%', chinaRate: '10%', notes: 'Section 232 Aluminum Tariff', chapter: 'Aluminum' },
  { code: '7610', description: 'Aluminum structures (bridges, towers, etc.)', generalRate: '5.7%', chinaRate: '10%', notes: 'Section 232 Aluminum Tariff', chapter: 'Aluminum' },
  // Chapter 84: Machinery
  { code: '8414', description: 'Air/vacuum pumps; compressors; fans', generalRate: '2.3-4.2%', chinaRate: '27.3-29.2%', notes: 'Section 301 List 3 — Includes cooling fans', chapter: 'Machinery' },
  { code: '8415', description: 'Air conditioning machines', generalRate: '1-2.2%', chinaRate: '26-27.2%', notes: 'Section 301 List 3', chapter: 'Machinery' },
  { code: '8421', description: 'Centrifuges; filtering or purifying machinery', generalRate: 'Free-2%', chinaRate: '25-27%', notes: 'Section 301 List 3', chapter: 'Machinery' },
  { code: '8428', description: 'Lifting, handling, loading machinery (conveyors)', generalRate: 'Free-2.4%', chinaRate: '25-27.4%', notes: 'Section 301 List 3', chapter: 'Machinery' },
  { code: '8443', description: 'Printing machinery; printers, copiers', generalRate: 'Free-2.4%', chinaRate: '25-27.4%', notes: 'Section 301 List 1', chapter: 'Machinery' },
  { code: '8471', description: 'Automatic data processing machines (computers)', generalRate: 'Free', chinaRate: '25%', notes: 'Section 301 List 3 — Laptops/desktops', chapter: 'Electronics' },
  { code: '8473', description: 'Parts & accessories for computers', generalRate: 'Free', chinaRate: '25%', notes: 'Section 301 List 3', chapter: 'Electronics' },
  // Chapter 85: Electrical
  { code: '8501', description: 'Electric motors and generators', generalRate: '2.4-6.5%', chinaRate: '27.4-31.5%', notes: 'Section 301 List 3', chapter: 'Electrical' },
  { code: '8504', description: 'Electrical transformers & static converters', generalRate: '1.5-3.3%', chinaRate: '25%', notes: 'Section 301 List 3', chapter: 'Electrical' },
  { code: '8507', description: 'Electric accumulators (batteries, lithium-ion)', generalRate: '3.4%', chinaRate: '25%', notes: 'Section 301 List 4A — EV batteries 100% tariff starting 2025', chapter: 'Electrical' },
  { code: '8517', description: 'Telephone sets, smartphones, network equipment', generalRate: 'Free', chinaRate: '7.5-25%', notes: 'Smartphones: List 4A at 7.5%. Routers/switches: List 3 at 25%', chapter: 'Electronics' },
  { code: '8523', description: 'Discs, tapes, solid-state storage devices', generalRate: 'Free', chinaRate: '25%', notes: 'Section 301 List 3', chapter: 'Electronics' },
  { code: '8525', description: 'Cameras, camcorders, webcams', generalRate: 'Free-2.1%', chinaRate: '25-27.1%', notes: 'Section 301 List 3', chapter: 'Electronics' },
  { code: '8528', description: 'Monitors and projectors; TV receivers', generalRate: '3.9-5%', chinaRate: '28.9-30%', notes: 'Section 301 List 3', chapter: 'Electronics' },
  { code: '8534', description: 'Printed circuit boards (PCBs)', generalRate: 'Free', chinaRate: '25%', notes: 'Section 301 List 1', chapter: 'Electronics' },
  { code: '8541', description: 'Semiconductor devices; LEDs; photovoltaic cells', generalRate: 'Free', chinaRate: '25-50%', notes: 'Section 301 + Section 201 safeguard. Solar cells 50% from 2025', chapter: 'Semiconductors' },
  { code: '8542', description: 'Electronic integrated circuits (chips)', generalRate: 'Free', chinaRate: '25%', notes: 'Section 301 List 1 — Semiconductor chips', chapter: 'Semiconductors' },
  { code: '8544', description: 'Insulated wire, cables; fiber optic cables', generalRate: '3.5-3.9%', chinaRate: '28.5-28.9%', notes: 'Section 301 List 3', chapter: 'Electrical' },
  // Chapter 87: Vehicles
  { code: '8703', description: 'Motor cars and vehicles for transport of persons', generalRate: '2.5%', chinaRate: '27.5-100%', notes: 'Standard 2.5% + Section 301 25% + EV 100% tariff from 2025', chapter: 'Automotive' },
  { code: '8704', description: 'Motor vehicles for transport of goods (trucks)', generalRate: '25%', chinaRate: '50%', notes: 'Chicken Tax 25% + Section 301 25%', chapter: 'Automotive' },
  { code: '8708', description: 'Parts & accessories for motor vehicles', generalRate: '2.5%', chinaRate: '27.5%', notes: 'Section 301 List 3', chapter: 'Automotive' },
  { code: '8711', description: 'Motorcycles and cycles with auxiliary motor', generalRate: 'Free-2.4%', chinaRate: '25-27.4%', notes: 'Section 301 List 3', chapter: 'Automotive' },
  // Chapter 90: Instruments
  { code: '9018', description: 'Medical/surgical instruments and apparatus', generalRate: 'Free-4%', chinaRate: '25-29%', notes: 'Section 301 List 3', chapter: 'Medical' },
  { code: '9027', description: 'Instruments for physical/chemical analysis', generalRate: 'Free-3.5%', chinaRate: '25-28.5%', notes: 'Section 301 List 3', chapter: 'Instruments' },
  { code: '9031', description: 'Measuring or checking instruments (3D scanners)', generalRate: 'Free-3.2%', chinaRate: '25-28.2%', notes: 'Section 301 List 3', chapter: 'Instruments' },
  // Chapter 94: Furniture
  { code: '9401', description: 'Seats (excluding those of heading 9402)', generalRate: 'Free-3.6%', chinaRate: '25-28.6%', notes: 'Section 301 List 4A — Originally 7.5%, raised to 25%', chapter: 'Furniture' },
  { code: '9403', description: 'Other furniture and parts thereof', generalRate: 'Free-3.6%', chinaRate: '25%', notes: 'Section 301 List 4A — Originally 7.5%, raised to 25%', chapter: 'Furniture' },
  { code: '9404', description: 'Mattress supports; mattresses; sleeping bags', generalRate: '3-6%', chinaRate: '28-31%', notes: 'Section 301 List 3', chapter: 'Furniture' },
  { code: '9405', description: 'Luminaires and lighting fittings', generalRate: '3.9-7.6%', chinaRate: '28.9-32.6%', notes: 'Section 301 List 3', chapter: 'Lighting' },
  // Chapter 95: Toys/Games
  { code: '9503', description: 'Tricycles, scooters, pedal cars and similar toys', generalRate: 'Free', chinaRate: '25%', notes: 'Section 301 List 3', chapter: 'Toys & Games' },
  { code: '9504', description: 'Video game consoles and machines', generalRate: 'Free', chinaRate: '7.5%', notes: 'Section 301 List 4A at 7.5%', chapter: 'Toys & Games' },
  // Chapter 96: Misc manufactured
  { code: '9608', description: 'Ball point pens; felt-tipped pens and markers', generalRate: '0.8 cents each', chinaRate: '25% + 0.8 cents', notes: 'Section 301 List 3', chapter: 'Stationery' },
  // Critical materials
  { code: '2602', description: 'Manganese ores and concentrates', generalRate: 'Free', chinaRate: 'Free', notes: 'Critical mineral — No Section 301 applied', chapter: 'Critical Minerals' },
  { code: '2611', description: 'Tungsten ores and concentrates', generalRate: 'Free', chinaRate: 'Free', notes: 'Critical mineral — supply chain dependency on China', chapter: 'Critical Minerals' },
  { code: '2846', description: 'Rare earth compounds', generalRate: 'Free-3.7%', chinaRate: 'Free-3.7%', notes: 'NO Section 301 tariff — 70% Chinese supply creates strategic dependency', chapter: 'Critical Minerals' },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''

  let results = HTS_DATA

  if (query) {
    const lowerQuery = query.toLowerCase()
    results = results.filter(item =>
      item.code.includes(query) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.notes.toLowerCase().includes(lowerQuery) ||
      item.chapter.toLowerCase().includes(lowerQuery)
    )
  }

  // Get unique chapters for faceted search
  const chapters = [...new Set(HTS_DATA.map(h => h.chapter))].sort()

  return NextResponse.json({
    results,
    chapters,
    totalCodes: HTS_DATA.length,
    query,
    source: 'US International Trade Commission Harmonized Tariff Schedule',
    note: 'Rates reflect Section 301 (China), Section 232 (Steel/Aluminum), Section 201 (Solar), and MFN tariff schedules as of 2025. EV/battery tariffs updated per August 2024 final rule.'
  })
}
