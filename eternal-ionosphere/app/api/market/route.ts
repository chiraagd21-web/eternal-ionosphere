import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // 1. Fetch Real Forex Data
    const forexRes = await fetch('https://api.frankfurter.app/latest?from=USD&to=JPY,CNY', { next: { revalidate: 60 } })
    const forexData = await forexRes.json()

    // 2. Fetch Real Crypto Data (Supply Chain Blockchain proxy metric)
    const cryptoRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', { next: { revalidate: 10 } })
    const cryptoData = await cryptoRes.json()

    return NextResponse.json({
       forex: forexData.rates,
       crypto: Number(cryptoData.price),
       timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch live market aggregates' }, { status: 500 })
  }
}
