import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const forexRes = await fetch('https://api.frankfurter.app/latest?from=USD&to=JPY,CNY,EUR,GBP,KRW,TWD,INR,MXN,VND,THB,CAD,AUD', { next: { revalidate: 60 } })
    const forexData = await forexRes.json()

    const cryptoRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', { next: { revalidate: 10 } })
    const cryptoData = await cryptoRes.json()

    // Fetch historical data for chart (last 30 days)
    const histRes = await fetch('https://api.frankfurter.app/2025-03-08..?from=USD&to=JPY,CNY,EUR', { next: { revalidate: 3600 } })
    const histData = await histRes.json()

    return NextResponse.json({
       forex: forexData.rates,
       base: forexData.base,
       date: forexData.date,
       crypto: Number(cryptoData.price),
       history: histData.rates,
       timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch live market data' }, { status: 500 })
  }
}
