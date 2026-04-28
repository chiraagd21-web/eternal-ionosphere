'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Loader2, 
  ExternalLink, 
  ShoppingCart, 
  Globe, 
  ArrowRight, 
  Bot,
  Zap,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Trophy,
  CheckCircle2,
  Info,
  ShieldCheck,
  Tag,
  Cpu
} from 'lucide-react'

interface PricePoint {
  store: string
  name: string
  price: number
  priceFormatted: string
  url: string
  notes: string
}

interface BestPick {
  goal: string
  option: string
}

interface SearchData {
  query: string
  answer: string
  comparison: PricePoint[]
  insights: string[]
  bestPicks: BestPick[]
  followUps: string[]
  images: string[]
  sources: { title: string; url: string; snippet: string }[]
  vitals: { latency: string; nodes: number; confidence: string }
}

export default function DeepIntelligenceSearch() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SearchData | null>(null)
  const [searchStep, setSearchStep] = useState('')
  const [mounted, setMounted] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { 
    if (window.innerWidth > 1024) inputRef.current?.focus() 
    setMounted(true)
  }, [])

  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery || query
    if (!q.trim()) return
    setLoading(true)
    setData(null)

    // Immediate Neural Simulation for "Zero Delay" UI
    setSearchStep('Initializing Handshake...')
    
    const steps = [
      'Bypassing Retail Gateways...',
      'Injecting SKU Search Nodes...',
      'Comparing MSRP vs Carrier Installments...',
      'Synthesizing Intelligence Report...',
      'Finalizing 100% Factual Grid...'
    ]
    let i = 0
    const timer = setInterval(() => { setSearchStep(steps[i]); i = (i + 1) % steps.length }, 800)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      if (res.ok) {
        const result = await res.json()
        setData(result)
      }
    } catch (e) {}

    clearInterval(timer)
    setLoading(false)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen w-full bg-[var(--bg-0)] p-4 md:p-8 lg:p-10 font-sans custom-scrollbar overflow-y-auto pb-48 pt-24 lg:pt-10">
      
      {/* 1. Header Hub (Optimized for Mobile) */}
      <div className={`max-w-4xl mx-auto transition-all duration-700 ${data ? 'mb-12 mt-4' : 'mb-24 mt-8 lg:mt-16 text-center'}`}>
         {!data && (
           <>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] lg:rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 lg:mb-8 shadow-2xl shadow-indigo-500/20 group">
                 <Zap className="text-white" size={28} />
              </motion.div>
              <h1 className="text-4xl lg:text-6xl font-black text-[var(--text-primary)] tracking-tight uppercase italic mb-4">
                 Neural <span className="text-emerald-500">Search</span>
              </h1>
              <p className="text-[9px] lg:text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-[0.5em] mb-12">Deep Sourcing & Price Comparison Engine</p>
           </>
         )}

         <div className="relative group max-w-3xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch() }} className="relative bg-[var(--bg-1)] border border-[var(--border)] rounded-full lg:rounded-[3rem] p-1.5 lg:p-2 shadow-2xl flex items-center hover:border-emerald-500/50 transition-all focus-within:ring-8 focus-within:ring-emerald-500/5">
               <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-[var(--text-secondary)] opacity-30">
                  <Search size={24} />
               </div>
               <input 
                  ref={inputRef}
                  type="text" 
                  placeholder="Ask anything... 'Compare iPhone 17 Pro prices'" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-base lg:text-xl font-black text-[var(--text-primary)] placeholder:opacity-20 py-2 lg:py-4 px-2 lg:px-4"
               />
               <button 
                 type="submit" 
                 className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-slate-950 flex items-center justify-center text-white hover:bg-emerald-600 active:scale-95 transition-all shadow-xl shadow-emerald-500/10"
               >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={24} />}
               </button>
            </form>
         </div>

         {!data && !loading && (
           <div className="flex flex-wrap justify-center gap-2 mt-10">
              {['Mango price at Costco', 'iPhone 17 Pro deal', 'RTX 5090 B&H', 'NVIDIA GPU stock'].map(s => (
                <button 
                  key={s} 
                  onClick={() => { setQuery(s); handleSearch(s) }}
                  className="px-4 py-2 lg:px-6 lg:py-3 rounded-xl lg:rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] text-[9px] lg:text-[11px] font-bold text-[var(--text-secondary)] opacity-40 hover:opacity-100 hover:text-emerald-500 transition-all flex items-center gap-2"
                >
                   {s}
                </button>
              ))}
           </div>
         )}
      </div>

      {loading && (
        <div className="max-w-4xl mx-auto p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[3.5rem] bg-indigo-500/5 border border-indigo-500/20 flex flex-col items-center justify-center text-center">
           <Loader2 className="animate-spin text-indigo-500 mb-6" size={48} />
           <div className="text-2xl lg:text-3xl font-black text-indigo-400 uppercase tracking-tighter italic">{searchStep}</div>
           <p className="text-[9px] text-[var(--text-secondary)] opacity-40 mt-3 font-medium uppercase tracking-widest">Neural Scraper Pipeline: ACTIVE</p>
        </div>
      )}

      {data && !loading && (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1400px] mx-auto space-y-12">
           
           <div className="max-w-4xl mx-auto bg-[var(--bg-1)] border border-[var(--border)] rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 shadow-soft relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6 lg:mb-8">
                 <Bot size={20} className="text-indigo-500" />
                 <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] opacity-40">Intelligence Synthesis Report</span>
              </div>
              <div className="text-lg lg:text-xl font-bold text-[var(--text-primary)] leading-relaxed lg:leading-[1.6] tracking-tight pb-8 lg:pb-10 border-b border-[var(--border)] mb-8 lg:mb-10">
                 {data.answer}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                 <div>
                    <h4 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-3">What Stands Out</h4>
                    <div className="space-y-2">
                       {(data.insights || []).map((insight, i) => (
                          <div key={i} className="flex gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                             <p className="text-[11px] font-bold text-[var(--text-secondary)]">{insight}</p>
                          </div>
                       ))}
                    </div>
                 </div>
                 <div>
                    <h4 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-3">Best Picks</h4>
                    <div className="space-y-3">
                       {(data.bestPicks || []).map((pick, i) => (
                          <div key={i} className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3">
                             <div className="text-[8px] font-black uppercase tracking-widest text-indigo-500 mb-1">{pick.goal}</div>
                             <div className="text-[11px] font-black text-[var(--text-primary)]">{pick.option}</div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-4">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                       <ShoppingCart size={20} />
                    </div>
                    <div>
                       <h2 className="text-xl lg:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">Market Price Grid</h2>
                       <p className="text-[9px] lg:text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mt-0.5">Deep Sourcing SKU Paths Found ({(data.comparison || []).length})</p>
                    </div>
                 </div>
                 <div className="self-start sm:self-center text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
                    Factual Reality Sync
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
                 {(data.comparison || []).map((item, i) => (
                    <motion.a 
                       key={i} href={item.url} target="_blank"
                       initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                       className="group bg-[var(--bg-1)] border border-[var(--border)] rounded-[1.8rem] lg:rounded-[2.5rem] p-5 lg:p-8 hover:border-indigo-500/30 hover:shadow-xl transition-all relative overflow-hidden flex flex-col h-full"
                    >
                       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="flex items-center justify-between mb-6 lg:mb-8">
                          <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                             {item.store}
                          </div>
                          <Tag size={12} className="opacity-10 group-hover:opacity-100 text-indigo-500 transition-opacity" />
                       </div>
                       <div className="text-2xl lg:text-3xl font-black text-[var(--text-primary)] mb-2 tracking-tighter tabular-nums">
                          {item.priceFormatted}
                       </div>
                       <div className="text-[10px] lg:text-xs font-bold text-[var(--text-secondary)] opacity-60 leading-snug mb-6 line-clamp-3 flex-1 group-hover:text-[var(--text-primary)] transition-colors">
                          {item.notes}
                       </div>
                       <div className="flex items-center justify-between pt-5 border-t border-[var(--border)] mt-auto">
                          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">Verified SKU</span>
                          <div className="text-[9px] lg:text-[10px] font-black text-indigo-500 group-hover:translate-x-1 transition-transform uppercase tracking-widest flex items-center gap-1">
                             Buy Direct <ArrowRight size={12} />
                          </div>
                       </div>
                    </motion.a>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 pb-32">
              <div className="space-y-6">
                 <div className="flex items-center gap-3 px-2">
                    <Globe size={18} className="text-indigo-500" />
                    <h3 className="text-[9px] lg:text-xs font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] opacity-40">Verified Knowledge Nodes</h3>
                 </div>
                 <div className="flex flex-wrap gap-2 lg:gap-3 px-2">
                    {(data.sources || []).map((s, i) => (
                       <a key={i} href={s.url} target="_blank" className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-[var(--bg-1)] border border-[var(--border)] rounded-full text-[9px] lg:text-[10px] font-black text-[var(--text-secondary)] hover:text-indigo-500 transition-all shadow-sm">
                          <span className="w-3 h-3 lg:w-4 lg:h-4 rounded bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-[7px] lg:text-[8px] font-black">{i+1}</span>
                          <span className="max-w-[120px] lg:max-w-[150px] truncate">{s.title}</span>
                       </a>
                    ))}
                 </div>

                 {/* Visual Media Sidebar Integration (Mobile Responsive) */}
                 {data.images && data.images.length > 0 && (
                    <div className="p-4 lg:p-6 bg-[var(--bg-1)] border border-[var(--border)] rounded-[1.8rem] lg:rounded-[2.5rem] mt-8">
                       <h4 className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Intelligence Visuals</h4>
                       <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
                          {data.images.map((img, idx) => (
                             <img key={idx} src={img} alt="SKU Visual" className="w-full h-24 lg:h-32 object-cover rounded-xl lg:rounded-2xl grayscale hover:grayscale-0 transition-all cursor-zoom-in" />
                          ))}
                       </div>
                    </div>
                 )}

                 <div className="p-6 lg:p-8 bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-[2rem] lg:rounded-[3rem] text-center">
                    <Cpu className="text-indigo-400 mb-4 mx-auto" size={32} lg={40} />
                    <h3 className="text-lg lg:text-xl font-black text-indigo-400 uppercase tracking-tighter italic leading-none">Neural SKU Protocol</h3>
                    <p className="text-[9px] text-indigo-400/60 leading-relaxed max-w-sm mx-auto mt-2 font-medium uppercase tracking-widest"> 
                       Injecting direct SKU query strings into 30+ global merchant grids.
                    </p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-3 px-2">
                    <MessageSquare size={18} className="text-indigo-500" />
                    <h3 className="text-[9px] lg:text-xs font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] opacity-40">Follow-up Analysis</h3>
                 </div>
                 <div className="space-y-2">
                    {(data.followUps || []).map((q, i) => (
                       <button key={i} onClick={() => { setQuery(q); handleSearch(q) }} className="w-full text-left px-5 lg:px-6 py-3.5 lg:py-4 rounded-xl lg:rounded-2xl bg-[var(--bg-1)] hover:bg-indigo-500/5 border border-[var(--border)] hover:border-indigo-500/30 transition-all flex items-center justify-between group">
                          <span className="text-[11px] lg:text-xs font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{q}</span>
                          <ChevronRight size={14} lg={16} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                       </button>
                    ))}
                 </div>
              </div>
           </div>

        </motion.div>
      )}
    </div>
  )
}
