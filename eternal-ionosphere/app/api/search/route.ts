import { NextRequest, NextResponse } from 'next/server'

const AG_BASE = process.env.ANTIGRAVITY_API_URL || 'http://127.0.0.1:8001'

console.log('API Route Init: AG_BASE is', AG_BASE)

// Mock data for when backend is offline
const MOCK_SUPPLIERS = [
  { id:'1', name:'Shenzhen TechParts Co.', country:'China', flag:'🇨🇳', category:'Electronics', score:94, price:72,  leadTime:14, rating:4.8, verified:true, shortlisted:false },
  { id:'2', name:'Flex Ltd. Singapore',   country:'Singapore', flag:'🇸🇬', category:'EMS', score:91, price:89,  leadTime:18, rating:4.7, verified:true, shortlisted:false },
  { id:'3', name:'Jabil Circuit Inc.',    country:'USA', flag:'🇺🇸', category:'Manufacturing', score:88, price:114, leadTime:21, rating:4.6, verified:true, shortlisted:false },
  { id:'4', name:'Foxconn Industrial',    country:'China', flag:'🇨🇳', category:'Assembly', score:86, price:68,  leadTime:12, rating:4.5, verified:true, shortlisted:false },
  { id:'5', name:'Celestica Toronto',     country:'Canada', flag:'🇨🇦', category:'Electronics', score:85, price:97,  leadTime:19, rating:4.4, verified:true, shortlisted:false },
]

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') || ''
  const targetUrl = `${AG_BASE}/ag/supplier-search`

  console.log('GET /api/search -> Hitting Backend:', targetUrl, 'with query:', query)

  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit: 500 }),
      signal: AbortSignal.timeout(60000), // 60s for deep web search
    })
    
    if (res.ok) {
      const data = await res.json()
      console.log('Search API Success:', data.suppliers?.length, 'results from', data.source)
      return NextResponse.json(data)
    } else {
      console.error('Search API Failed with status:', res.status, res.statusText)
    }
  } catch (error: any) {
    console.error('Search API Critical Error:', error.message || error)
  }

  const filtered = query
    ? MOCK_SUPPLIERS.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.country.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase()))
    : MOCK_SUPPLIERS

  return NextResponse.json({ suppliers: filtered, total: filtered.length, source: 'mock' })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  try {
    const res = await fetch(`${AG_BASE}/ag/supplier-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    })
    if (res.ok) return NextResponse.json(await res.json())
  } catch { /* fallback */ }

  return NextResponse.json({ suppliers: MOCK_SUPPLIERS, total: MOCK_SUPPLIERS.length, source: 'mock' })
}
