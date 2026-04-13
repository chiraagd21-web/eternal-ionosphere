'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Cpu, 
  Globe, 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  MessageSquare, 
  Compass, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
  BarChart3,
  Bot
} from 'lucide-react'

interface Source {
  title: string
  url: string
  snippet: string
}

interface IntelligenceResponse {
  answer: string
  sources: Source[]
  vitals: {
    latency: string
    confidence: string
    nodes: number
  }
}

export default function IntelligenceHub() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [response, setResponse] = useState<IntelligenceResponse | null>(null)
  const [history, setHistory] = useState<string[]>([
    "Current sea freight rates Shanghai to Long Beach?",
    "Impact of Red Sea crisis on Europe shipping times?",
    "UPS vs FedEx rates for 50lb international express",
    "Average tariff for HTS 8517.12.00 in USA"
  ])

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    setResponse(null)

    // Simulate Agentic Crawling & Processing (Perplexity Style)
    // In a real prod env, this would call /api/intelligence
    try {
        await new Promise(r => setTimeout(r, 2500)) // Neural processing simulation
        
        const mockResponse: IntelligenceResponse = {
            answer: `Based on current market intelligence from Drewry WCI and Freightos FBX (updated today), sea freight rates from Shanghai to Los Angeles are holding steady at approximately $5,200 per 40ft container. \n\nDirect carrier data shows Maersk and MSC have adjusted their surcharges due to increased port congestion in the San Pedro Bay. For urgent shipments, air freight volume is rising with rates averaging $4.85/kg. Global transit times for this route currently average 14-16 days.`,
            sources: [
                { title: "Drewry World Container Index - Weekly Update", url: "https://www.drewry.co.uk", snippet: "WCI increased by 2% this week to $3,964 per 40ft container..." },
                { title: "Freightos Baltic Index (FBX): Global Container Freight Index", url: "https://fbx.freightos.com", snippet: "Asia-US West Coast rates remain elevated following Lunar New Year..." },
                { title: "Port of Los Angeles Operational Bulletin", url: "https://www.portoflosangeles.org", snippet: "Terminal fluidness improving but vessel wait times remain 3-5 days." }
            ],
            vitals: {
                latency: "2.4s",
                confidence: "98.2%",
                nodes: 124
            }
        }
        setResponse(mockResponse)
        if (!history.includes(query)) setHistory([query, ...history].slice(0, 5))
    } catch (e) {}
    setIsSearching(false)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] p-6 lg:p-10 font-sans custom-scrollbar overflow-y-auto pb-32">
      
      {/* Header Neural Core */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
         <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/20 group"
         >
            <Zap className="text-white group-hover:scale-110 transition-transform" size={40} fill="currentColor" />
         </motion.div>
         <h1 className="text-6xl font-black text-[var(--text-primary)] tracking-tight uppercase italic flex items-center justify-center gap-4">
            Intelligence <span className="text-indigo-500">Core</span>
         </h1>
         <p className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 mt-4 uppercase tracking-[0.5em]">Global Supply Chain Search Engine (v1.0)</p>
      </div>

      {/* Perplexity Search Bar */}
      <div className="max-w-4xl mx-auto mb-12">
         <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500/5 blur-[50px] -z-10 group-focus-within:bg-indigo-500/10 transition-all" />
            <form onSubmit={handleSearch} className="relative bg-[var(--bg-1)] border border-[var(--border)] rounded-[3rem] p-2 shadow-2xl flex items-center">
               <div className="w-14 h-14 rounded-full flex items-center justify-center text-[var(--text-secondary)] opacity-30">
                  <Bot size={28} />
               </div>
               <input 
                  type="text" 
                  autoFocus
                  placeholder="Ask anything about global trade, carrier rates, or market trends..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-[var(--text-primary)] placeholder:opacity-20 py-6 px-4"
               />
               <div className="flex items-center gap-2 pr-2">
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--bg-2)] rounded-full border border-[var(--border)] text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">
                     <Globe size={12} /> Search Web
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSearching}
                    className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-xl shadow-indigo-600/20"
                  >
                     {isSearching ? <RefreshCw className="animate-spin" size={20} /> : <ArrowRight size={24} />}
                  </button>
               </div>
            </form>
         </div>

         {/* Quick Commands */}
         <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {history.map((h, i) => (
               <button 
                key={i} 
                onClick={() => { setQuery(h); handleSearch() }}
                className="px-5 py-2.5 rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] text-[11px] font-bold text-[var(--text-secondary)] opacity-40 hover:opacity-100 hover:text-indigo-400 hover:border-indigo-500/30 transition-all flex items-center gap-2"
               >
                  <Sparkles size={12} /> {h}
               </button>
            ))}
         </div>
      </div>

      {/* Search Results Display */}
      <AnimatePresence mode="wait">
         {isSearching && !response && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0 }}
               className="max-w-4xl mx-auto space-y-8"
            >
               <div className="space-y-4">
                  <div className="h-4 bg-[var(--bg-1)] rounded-full w-3/4 animate-pulse" />
                  <div className="h-4 bg-[var(--bg-1)] rounded-full w-full animate-pulse" />
                  <div className="h-4 bg-[var(--bg-1)] rounded-full w-5/6 animate-pulse" />
               </div>
               <div className="grid grid-cols-3 gap-6">
                  <div className="h-32 bg-[var(--bg-1)] rounded-[2rem] animate-pulse" />
                  <div className="h-32 bg-[var(--bg-1)] rounded-[2rem] animate-pulse" />
                  <div className="h-32 bg-[var(--bg-1)] rounded-[2rem] animate-pulse" />
               </div>
            </motion.div>
         )}

         {response && (
            <motion.div 
               initial={{ opacity: 0, y: 40 }} 
               animate={{ opacity: 1, y: 0 }}
               className="max-w-4xl mx-auto space-y-12"
            >
               {/* Answer Section */}
               <div className="relative group">
                  <div className="absolute -left-12 top-0 text-indigo-500 opacity-20 hidden lg:block">
                     <MessageSquare size={32} />
                  </div>
                  <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[3rem] p-10 shadow-soft leading-relaxed">
                     <div className="flex items-center gap-3 mb-8">
                        <Bot size={24} className="text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] opacity-40 italic">Synthesized Response</span>
                     </div>
                     <div className="text-xl font-bold text-[var(--text-primary)] whitespace-pre-line leading-relaxed pb-8 border-b border-[var(--border)] mb-8">
                        {response.answer}
                     </div>
                     
                     <div className="flex flex-wrap items-center gap-8">
                        <div>
                           <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-1">Confidence Score</div>
                           <div className="text-lg font-black text-emerald-500">{response.vitals.confidence}</div>
                        </div>
                        <div>
                           <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-1">Response Time</div>
                           <div className="text-lg font-black text-indigo-400">{response.vitals.latency}</div>
                        </div>
                        <div>
                           <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-1">Index Nodes</div>
                           <div className="text-lg font-black text-[var(--text-primary)]">{response.vitals.nodes}k</div>
                        </div>
                        <button className="ml-auto px-6 py-3 bg-[var(--bg-2)] border border-[var(--border)] rounded-2xl text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest hover:border-indigo-400 transition-all flex items-center gap-2">
                           <ShieldCheck size={14} className="text-emerald-500" /> Verify Factual Core
                        </button>
                     </div>
                  </div>
               </div>

               {/* Sources Grid */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 px-4">
                     <Compass size={18} className="text-[var(--text-secondary)] opacity-30" />
                     <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] opacity-40">Primary Intelligence Sources</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {response.sources.map((source, i) => (
                        <a 
                           key={i} 
                           href={source.url} 
                           target="_blank" 
                           className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[2rem] p-6 hover:border-indigo-500/30 hover:shadow-xl transition-all group"
                        >
                           <h4 className="text-sm font-black text-[var(--text-primary)] mb-4 line-clamp-1 group-hover:text-indigo-400">{source.title}</h4>
                           <p className="text-[10px] font-medium text-[var(--text-secondary)] opacity-40 line-clamp-3 leading-relaxed mb-6">{source.snippet}</p>
                           <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border)]">
                              <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter">{new URL(source.url).hostname}</span>
                              <ExternalLink size={12} className="text-[var(--text-secondary)] opacity-30" />
                           </div>
                        </a>
                     ))}
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  )
}
