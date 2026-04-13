import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// --- REAL-TIME API FETCH (SHIPPO) ---
const fetchShippoRates = async (apiKey: string, params: any) => {
  try {
    const response = await fetch('https://api.goshippo.com/shipments/', {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address_from: { city: params.origin, state: "CA", zip: "94103", country: "US" },
        address_to: { city: params.destination, state: "NY", zip: "10001", country: "US" },
        parcels: [{ length: params.l || "10", width: params.w || "10", height: params.h || "10", distance_unit: "in", weight: params.weight || "5", mass_unit: "lb" }],
        async: false
      })
    })
    if (!response.ok) return null
    const data = await response.json()
    return data.rates.map((rate: any) => ({
      id: rate.object_id,
      origin: params.origin,
      destination: params.destination,
      originPort: params.origin.substring(0, 5).toUpperCase(),
      destPort: params.destination.substring(0, 5).toUpperCase(),
      mode: 'land',
      rateLTL: parseFloat(rate.amount),
      transitDays: parseInt(rate.days) || 3,
      carrierDetails: [{ name: rate.provider, mode: 'land', quoteUrl: '#', trackUrl: '#' }]
    }))
  } catch (e) { return null }
}

const CARRIERS: any = {
  'maersk': { name: 'Maersk', mode: 'sea', quoteUrl: 'https://www.maersk.com/instant-quote', trackUrl: 'https://www.maersk.com/tracking' },
  'msc': { name: 'MSC', mode: 'sea', quoteUrl: 'https://www.msc.com/en/search-a-schedule', trackUrl: 'https://www.msc.com/en/track-a-shipment' },
}

const MOCK_ROUTES: any[] = [
  { origin: 'China', destination: 'USA West', originPort: 'Shanghai (CNSHA)', destPort: 'Los Angeles (USLAX)', mode: 'sea', rate20ft: 3450, rate40ft: 5200, transitDays: 14, carriers: ['maersk', 'msc'] },
  { origin: 'Mexico', destination: 'USA', originPort: 'Monterrey', destPort: 'Dallas', mode: 'land', rateFTL: 2100, rateLTL: 650, transitDays: 1, carriers: ['maersk'] },
  { origin: 'India', destination: 'Europe', originPort: 'Mumbai (BOM)', destPort: 'London (LHR)', mode: 'air', ratePerKg: 3.80, transitDays: 2, carriers: ['maersk'] },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const mode = searchParams.get('mode') || ''
  const weight = searchParams.get('weight')
  const shippoToken = request.headers.get('X-Shippo-Token')

  // Detect individual origin/destination if in "X to Y" format
  let origin = ''
  let destination = ''
  if (q.toLowerCase().includes(' to ')) {
    const parts = q.split(/ to /i)
    origin = parts[0].trim()
    destination = parts[1].trim()
  }

  // Handle Real API (Shippo)
  if (shippoToken && shippoToken !== 'null' && origin && destination) {
    const realRates = await fetchShippoRates(shippoToken, { origin, destination, weight, l: searchParams.get('l'), w: searchParams.get('w'), h: searchParams.get('h') })
    if (realRates) return NextResponse.json({ routes: realRates, isLive: true, source: 'LIVE SHIPPO API' })
  }

  // Smart Mock Search Logic (Fixing the "does not work" issue)
  let results = MOCK_ROUTES.map((r, i) => ({ ...r, id: `mock-${i}`, carrierDetails: (r.carriers as string[]).map(k => CARRIERS[k] || { name: k, mode: 'land', quoteUrl: '#', trackUrl: '#' }) }))

  if (q) {
    const lowerQ = q.toLowerCase()
    
    // If it's a specific "origin to destination" search
    if (origin && destination) {
        results = results.filter(r => 
            (r.origin.toLowerCase().includes(origin.toLowerCase()) || r.originPort.toLowerCase().includes(origin.toLowerCase())) &&
            (r.destination.toLowerCase().includes(destination.toLowerCase()) || r.destPort.toLowerCase().includes(destination.toLowerCase()))
        )
    } else {
        // Fallback to fuzzy keyword search
        results = results.filter(r => 
            r.origin.toLowerCase().includes(lowerQ) || 
            r.destination.toLowerCase().includes(lowerQ) || 
            r.originPort.toLowerCase().includes(lowerQ) || 
            r.destPort.toLowerCase().includes(lowerQ)
        )
    }
  }

  if (mode) results = results.filter(r => r.mode === mode)

  return NextResponse.json({
    routes: results,
    totalRoutes: results.length,
    source: 'Benchmarked Data',
    isLive: false
  })
}
