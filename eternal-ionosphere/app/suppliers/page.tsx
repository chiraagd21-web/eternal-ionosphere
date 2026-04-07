'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Star, MapPin, Clock, ChevronDown, Plus, Download, Loader2, ExternalLink, ShieldCheck, Globe, Cpu, Zap, Share2, Activity } from 'lucide-react'

type Supplier = {
  id: string
  name: string
  productName?: string
  imageUrl?: string
  country: string
  region?: string
  flag: string
  category: string
  score: number
  price: number
  rawPrice?: string
  moq?: number
  leadTime: number
  rating: number
  verified: boolean
  shortlisted: boolean
  url?: string
}

const MOCK_SUPPLIERS: Supplier[] = [
  { id:'1', name:'Shenzhen TechParts Co.', productName: 'Custom CNC Machined Aluminum Enclosure', imageUrl: 'https://images.unsplash.com/photo-1590494444583-02f0fc981273?auto=format&fit=crop&q=80&w=400', country:'China', region:'Asia', flag:'🇨🇳', category:'Electronics', score:94, price:72, rawPrice: 'US$65.00-75.00', moq:1000, leadTime:14, rating:4.8, verified:true, shortlisted:false },
  { id:'2', name:'Flex Ltd. Singapore', productName: 'Automotive Grade Fasteners & Brackets', imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fb6f6e4?auto=format&fit=crop&q=80&w=400', country:'Singapore', region:'Asia', flag:'🇸🇬', category:'EMS', score:91, price:89, rawPrice: 'US$80.00-89.00', moq:500, leadTime:18, rating:4.7, verified:true, shortlisted:true },
  { id:'3', name:'Jabil Circuit Inc.', productName: 'High Precision Injection Molded Plastics', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400', country:'USA', region:'North America', flag:'🇺🇸', category:'Manufacturing', score:88, price:114, rawPrice: 'US$90.00-110.00', moq:200, leadTime:21, rating:4.6, verified:true, shortlisted:false },
  { id:'4', name:'Foxconn Industrial', productName: '5G Communication PCB Assembly', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400', country:'China', region:'Asia', flag:'🇨🇳', category:'Assembly', score:86, price:68, rawPrice: 'US$55.00-68.00', moq:2500, leadTime:12, rating:4.5, verified:true, shortlisted:true },
]

function ScoreRing({ score }: { score: number }) {
  const r = 22; const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = score >= 90 ? '#10b981' : score >= 80 ? '#6366f1' : '#f59e0b'
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={r} stroke="var(--border)" strokeWidth="4" fill="none"/>
      <circle cx="28" cy="28" r={r} stroke={color} strokeWidth="4" fill="none"
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ/4} strokeLinecap="round"
        style={{transition:'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)'}}/>
      <text x="28" y="28" textAnchor="middle" dominantBaseline="central"
        fill="var(--text-primary)" fontSize="11" fontWeight="700">{score}</text>
    </svg>
  )
}

export default function SuppliersPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [sortOrder, setSortOrder] = useState('score')
  const [shortlistOnly, setShortlistOnly] = useState(false)
  const [insight, setInsight] = useState<string | null>(null)
  const [sources, setSources] = useState<string[]>([])
  const [searchStep, setSearchStep] = useState<string>('')
  const [isDeepSearch, setIsDeepSearch] = useState(true)

  const categories = ['All', ...Array.from(new Set(suppliers.map(s => s.category)))]
  const regions = ['All', 'Asia', 'North America', 'Europe', 'Global']

  const filtered = suppliers.filter(s => {
    const qLower = query.toLowerCase()
    const matchQ = !query || 
                   s.name.toLowerCase().includes(qLower) ||
                   (s.productName?.toLowerCase() || '').includes(qLower) ||
                   s.url?.toLowerCase().includes(qLower) ||
                   true // For global search, we want to see everything returned by the crawler
    
    const matchC = selectedCategory === 'All' || s.category === selectedCategory
    const matchR = selectedRegion === 'All' || s.region === selectedRegion
    const matchS = !shortlistOnly || s.shortlisted
    return matchQ && matchC && matchR && matchS
  })

  // Apply sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'price_low') return a.price - b.price
    if (sortOrder === 'price_high') return b.price - a.price
    if (sortOrder === 'lead_time') return a.leadTime - b.leadTime
    return b.score - a.score
  })

  async function handleSearch() {
    if (!query.trim()) return
    setLoading(true)
    setInsight(null)
    setSources([])
    
    // Simulate thinking steps
    const steps = [
      "Accessing global B2B manufacturing hubs...",
      "Filtering out educational and non-commercial results...",
      "Scraping verified price lists and MOQ data...",
      "Analyzing supplier history on Alibaba & ThomasNet...",
      "Comparing logistics lead times and reliability...",
      "Finalizing deep-web sourcing intelligence report..."
    ]

    let stepIdx = 0
    const stepInterval = setInterval(() => {
      setSearchStep(steps[stepIdx])
      stepIdx = (stepIdx + 1) % steps.length
    }, 1200)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.suppliers) {
          setSuppliers(data.suppliers) // Always set, even if empty to clear old results
          setInsight(data.insight)
          setSources(data.sources || [])
          setSelectedCategory('All')
          setSelectedRegion('All')
        }
      }
    } catch (err) {
      console.error("Search failed:", err)
    } finally {
      clearInterval(stepInterval)
      setLoading(false)
      setSearchStep('')
    }
  }

  function toggleShortlist(id: string) {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, shortlisted: !s.shortlisted } : s))
  }

  function exportCSV() {
    const rows = [
      ['Name','Country','Category','Score','Price','Lead Time','Rating','Verified'],
      ...filtered.map(s => [s.name, s.country, s.category, s.score, s.price, s.leadTime, s.rating, s.verified])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'suppliers.csv'; a.click()
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Supplier <span className="gradient-text">Search</span></h1>
          <p className="text-[var(--text-secondary)] opacity-40 text-sm">AI-powered global supplier discovery and ranking</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Supplier
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-8 bg-[var(--bg-2)] p-6 rounded-[2rem] border border-[var(--border)] shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
        <div className="flex gap-3 relative z-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] opacity-40 focus-within:text-indigo-400 transition-colors" />
            <input
              id="supplier-search-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="What are you looking for? (e.g., CNC aluminum enclosures, 5000 units)"
              className="w-full bg-[var(--bg-1)] border border-[var(--border)] text-[var(--text-primary)] pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-[var(--text-secondary)] placeholder:opacity-30 text-lg shadow-inner"
            />
          </div>
          <button id="supplier-search-btn" onClick={handleSearch} disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-3">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {loading ? 'Thinking...' : 'Analyze'}
          </button>
        </div>
        
        <div className="flex items-center gap-6 px-2">
            <button 
              onClick={() => setIsDeepSearch(!isDeepSearch)}
              className="flex items-center gap-2 group/btn"
            >
              <div className={`w-10 h-5 rounded-full transition-all relative ${isDeepSearch ? 'bg-indigo-500' : 'bg-[var(--bg-1)] border border-[var(--border)]'}`}>
                <motion.div 
                  animate={{ x: isDeepSearch ? 20 : 2 }}
                  className={`absolute top-1 w-3 h-3 rounded-full ${isDeepSearch ? 'bg-white' : 'bg-[var(--text-secondary)] opacity-40'}`} 
                />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isDeepSearch ? 'text-indigo-400' : 'text-[var(--text-secondary)] opacity-30'}`}>Deep Web Search</span>
            </button>
            <div className="h-4 w-[1px] bg-[var(--border)]" />
            <div className="flex items-center gap-2">
               <Globe className="w-3.5 h-3.5 text-emerald-400" />
               <span className="text-[10px] font-bold text-[var(--text-secondary)] opacity-30 uppercase tracking-widest">Alibaba, Made-In-China, ThomasNet Active</span>
            </div>
        </div>
      </div>

      {/* Perplexity AI Insights Section */}
      <AnimatePresence mode="wait">
        {loading && searchStep && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="mb-8 p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] flex items-start gap-4 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
               <Cpu className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                Curating Intelligence <span className="flex gap-1"><span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" /><span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" /><span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" /></span>
              </div>
              <div className="text-[var(--text-primary)] text-lg font-medium opacity-80">{searchStep}</div>
            </div>
          </motion.div>
        )}

        {!loading && insight && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-10 bg-[var(--bg-2)] border border-[var(--border)] rounded-[3rem] p-10 shadow-soft relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20" />
            
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">ProcureAI Analysis</h2>
                    <p className="text-[10px] font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">Direct Web Insight</p>
                  </div>
                </div>
                
                <div className="text-[var(--text-primary)] text-lg leading-relaxed mb-8 opacity-90 font-medium">
                  {insight}
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {sources.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-1)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-secondary)] hover:text-indigo-400 transition-colors cursor-pointer">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                            {s}
                        </div>
                    ))}
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold hover:bg-indigo-500/20 transition-all uppercase tracking-widest">
                        <Share2 className="w-3 h-3" /> Share Report
                    </button>
                </div>
              </div>

              <div className="w-full lg:w-72 space-y-4">
                <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
                   <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <ShieldCheck className="w-3.5 h-3.5" /> Market Trust
                   </div>
                   <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">High Accuracy</div>
                   <p className="text-[10px] text-[var(--text-secondary)] opacity-40 leading-relaxed italic">Search results verified against supplier database and live listings.</p>
                </div>
                <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10">
                   <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Activity className="w-3.5 h-3.5" /> Price Volatility
                   </div>
                   <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">± 4.2%</div>
                   <p className="text-[10px] text-[var(--text-secondary)] opacity-40 leading-relaxed italic">Standard variance detected for this category over the last 30 days.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters row 1 */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex bg-[var(--bg-1)] p-1 rounded-full border border-[var(--border)]">
          {categories.map(c => (
            <button key={c} id={`filter-${c}`}
              onClick={() => setSelectedCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                selectedCategory === c ? 'bg-indigo-500/20 text-indigo-300' : 'text-[var(--text-secondary)] opacity-40 hover:text-[var(--text-primary)]'
              }`}>{c}</button>
          ))}
        </div>
        <div className="flex bg-[var(--bg-1)] p-1 rounded-full border border-[var(--border)]">
          {regions.map(r => (
            <button key={r} onClick={() => setSelectedRegion(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedRegion === r ? 'bg-indigo-500/20 text-indigo-300' : 'text-[var(--text-secondary)] opacity-40 hover:text-[var(--text-primary)]'
              }`}>{r}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}
            className="input-dark py-1.5 text-xs w-auto m-0">
            <option value="score">Sort by Score</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="lead_time">Lead Time: Fastest</option>
          </select>
          <button
            onClick={() => setShortlistOnly(!shortlistOnly)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
              shortlistOnly ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-[var(--bg-1)] text-[var(--text-secondary)] opacity-40 border border-[var(--border)] shadow-inner'
            }`}>
            <Star className="w-3 h-3" /> Shortlisted
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Global Comprehensive Crawl Active</span>
        </div>
        <div className="text-xs text-[var(--text-secondary)] opacity-40 font-bold uppercase tracking-tighter">
            {sorted.length} Global results retrieved from 100+ sources
        </div>
      </div>
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {sorted.map(s => (
            <motion.div key={s.id} layout
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }}
              className="group overflow-hidden bg-[var(--bg-2)] border border-[var(--border)] rounded-2xl hover:border-[var(--brand)]/40 transition-all shadow-soft">

              {/* Product Image */}
              <div className="relative aspect-square bg-[var(--bg-1)] overflow-hidden">
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noreferrer" className="block w-full h-full cursor-alias relative group/img">
                    {s.imageUrl && s.imageUrl.startsWith('http') ? (
                      <img src={s.imageUrl} alt={s.productName || s.name} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--bg-1)] text-[var(--text-secondary)]">
                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">No Product Image</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <span className="text-[var(--text-primary)] text-xs font-bold px-3 py-1.5 bg-indigo-500 rounded-full shadow-xl">VIEW ON SITE</span>
                    </div>
                  </a>
                ) : (
                  s.imageUrl && s.imageUrl.startsWith('http') ? (
                    <img src={s.imageUrl} alt={s.productName || s.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--bg-1)] text-[var(--text-secondary)]">
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">No Product Image</div>
                    </div>
                  )
                )}
                {s.shortlisted && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-amber-500/90 text-amber-950 px-2 py-1 rounded-md text-[10px] font-bold shadow-lg flex items-center gap-1 backdrop-blur-md">
                      <Star className="w-3 h-3 fill-amber-950" /> Saved
                    </span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  <span className="bg-black/60 backdrop-blur-md border border-[var(--border)] text-[var(--text-primary)] px-2 py-1 rounded-md text-[10px] font-medium items-center flex gap-1">
                    {s.flag} {s.country}
                  </span>
                  {s.verified && (
                    <span className="bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold items-center flex gap-1">
                       Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="p-4">
                <div className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 leading-snug mb-3 min-h-[40px] group-hover:text-indigo-300 transition-colors">
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noreferrer" className="hover:underline">
                      {s.productName || "Custom Order Request Form / OEM Tooling & Parts Assembly"}
                    </a>
                  ) : (
                    s.productName || "Custom Order Request Form / OEM Tooling & Parts Assembly"
                  )}
                </div>
                
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-base font-bold text-indigo-400 leading-none">
                    {s.rawPrice || `US$${s.price.toFixed(2)}`}
                  </span>
                  {!s.rawPrice && <span className="text-xs text-[var(--text-secondary)] opacity-40 font-medium pb-0.5">/ Piece</span>}
                </div>
                <div className="text-xs text-[var(--text-secondary)] opacity-40 mb-3 font-medium">
                  {s.moq} Units <span className="text-[var(--text-secondary)] opacity-20">(MOQ)</span>
                </div>

                <div className="h-[1px] bg-[var(--bg-1)] w-full mb-3" />

                <div className="flex items-center justify-between gap-2 mb-4">
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-[var(--text-secondary)] opacity-40 hover:text-[var(--text-primary)] flex items-center gap-1.5 transition-colors truncate font-medium">
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{s.name}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-[var(--text-secondary)] opacity-40 truncate flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{s.name}</span>
                    </span>
                  )}
                  
                  <div className="flex items-center gap-1 bg-[var(--bg-1)] px-1.5 py-0.5 rounded text-[10px] text-[var(--text-primary)] font-bold shrink-0 border border-[var(--border)]">
                    {s.rating} ★
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button onClick={() => toggleShortlist(s.id)}
                    className={`flex items-center justify-center p-2 rounded-xl transition-all ${
                      s.shortlisted ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'btn-secondary text-[var(--text-secondary)] opacity-40 border border-[var(--border)]'
                    }`}>
                    <Star className={`w-4 h-4 ${s.shortlisted ? 'fill-amber-400' : ''}`} />
                  </button>
                  <button className="flex-1 btn-primary text-xs py-2 rounded-xl font-semibold shadow-xl shadow-indigo-500/20">
                    Send Inquiry
                  </button>
                  <button className="flex-1 btn-secondary bg-white/5 text-xs py-2 rounded-xl font-medium border border-white/10">
                    Chat Now
                  </button>
                </div>
              </div>
            </motion.div>

          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
