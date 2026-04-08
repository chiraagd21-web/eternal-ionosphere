import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') || ''
  if (!query) return NextResponse.json({ error: 'No query provided' }, { status: 400 })

  try {
    // 1. DuckDuckGo Instant Answers API (free, no key)
    const ddgRes = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`, { next: { revalidate: 0 } })
    const ddgData = await ddgRes.json()

    // 2. DuckDuckGo HTML search for web results
    const ddgHtmlRes = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    })
    const ddgHtml = await ddgHtmlRes.text()

    // Parse web results from HTML
    const webResults = parseWebResults(ddgHtml)

    // 3. Wikipedia API for detailed info
    let wikiSummary = ''
    let wikiImage = ''
    if (ddgData.AbstractURL || ddgData.Abstract) {
      wikiSummary = ddgData.Abstract || ''
      wikiImage = ddgData.Image ? `https://duckduckgo.com${ddgData.Image}` : ''
    }
    // If no DDG abstract, try Wikipedia directly
    if (!wikiSummary) {
      try {
        const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`)
        if (wikiRes.ok) {
          const wikiData = await wikiRes.json()
          wikiSummary = wikiData.extract || ''
          wikiImage = wikiData.thumbnail?.source || ''
        }
      } catch(e) {}
    }

    // 4. Shopping comparison links — real retailer search URLs
    const shoppingLinks = [
      { name: 'Amazon', url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`, icon: '🛒', color: '#FF9900' },
      { name: 'Walmart', url: `https://www.walmart.com/search?q=${encodeURIComponent(query)}`, icon: '🏪', color: '#0071CE' },
      { name: 'eBay', url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`, icon: '🏷️', color: '#E53238' },
      { name: 'Best Buy', url: `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(query)}`, icon: '🖥️', color: '#0046BE' },
      { name: 'Target', url: `https://www.target.com/s?searchTerm=${encodeURIComponent(query)}`, icon: '🎯', color: '#CC0000' },
      { name: 'Alibaba', url: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query)}`, icon: '🌐', color: '#FF6A00' },
      { name: 'AliExpress', url: `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(query)}`, icon: '📦', color: '#E43225' },
      { name: 'Google Shopping', url: `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`, icon: '🔍', color: '#4285F4' },
    ]

    // 5. Related topics from DDG
    const relatedTopics = (ddgData.RelatedTopics || [])
      .filter((t: any) => t.Text && t.FirstURL)
      .slice(0, 8)
      .map((t: any) => ({
        text: t.Text,
        url: t.FirstURL,
      }))

    // 6. Infobox data
    const infobox = ddgData.Infobox?.content || []

    return NextResponse.json({
      query,
      abstract: wikiSummary,
      abstractSource: ddgData.AbstractSource || 'Wikipedia',
      abstractUrl: ddgData.AbstractURL || '',
      image: wikiImage,
      heading: ddgData.Heading || query,
      type: ddgData.Type || '',
      webResults,
      shoppingLinks,
      relatedTopics,
      infobox: infobox.slice(0, 10),
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Search API error:', error.message)
    return NextResponse.json({ error: 'Search failed', message: error.message }, { status: 500 })
  }
}

function parseWebResults(html: string): { title: string; url: string; snippet: string }[] {
  const results: { title: string; url: string; snippet: string }[] = []
  
  // Parse result snippets from DDG HTML response
  const resultRegex = /class="result__a"[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>.*?class="result__snippet"[^>]*>(.*?)<\/span>/gs
  let match
  let count = 0
  
  while ((match = resultRegex.exec(html)) !== null && count < 15) {
    let url = match[1]
    // DDG wraps URLs in redirect — extract the actual URL
    const uddgMatch = url.match(/uddg=([^&]+)/)
    if (uddgMatch) {
      url = decodeURIComponent(uddgMatch[1])
    }
    
    const title = match[2].replace(/<[^>]*>/g, '').trim()
    const snippet = match[3].replace(/<[^>]*>/g, '').trim()
    
    if (title && url && !url.includes('duckduckgo.com')) {
      results.push({ title, url, snippet })
      count++
    }
  }

  return results
}
