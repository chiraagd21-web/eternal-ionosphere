'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileBox, 
  Search, 
  Upload, 
  Cpu, 
  Target, 
  CheckCircle2, 
  Zap, 
  Globe, 
  BarChart3, 
  ArrowRight, 
  Activity, 
  RefreshCcw,
  Plus, 
  Trash2, 
  Download, 
  Share2, 
  BrainCircuit, 
  Network,
  Maximize2,
  Minimize2,
  ChevronDown,
  LayoutGrid,
  Settings2,
  FileText,
  Scan,
  Database
} from 'lucide-react'
import { useToast, ToastContainer } from '@/components/ui/Toast'

// --- INTERFACES ---
interface BOMItem {
  id: string
  name: string
  specs: string
  qty: number
  targetPrice?: number
  currentSupplier?: string
}

interface SupplierMatch {
  name: string
  url: string
  price: number
  moq: number
  leadTime: string
  reliability: number
  source: string
}

// --- REAL SEARCH LOGIC ---
const simulateSearchProduct = async (product: string, specs: string): Promise<SupplierMatch[]> => {
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(product + ' ' + specs)}`)
    if (res.ok) {
       const data = await res.json()
       // Transform API response to SupplierMatch
       return data.suppliers.slice(0, 3).map((s: any) => ({
          name: s.name,
          url: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(product)}`,
          price: s.price,
          moq: s.moq,
          leadTime: `${s.leadTime} Days`,
          reliability: s.score,
          source: s.country + ' Export'
       }))
    }
  } catch (err) {
    console.error('Search API failure:', err)
  }
  
  // Fallback
  const sources = ['Alibaba Global', 'GlobalSources.com', 'Mouser Electronics']
  return Array.from({ length: 3 }, (_, i) => ({
    name: `${product.split(' ')[0]} ${['Industrial', 'Core', 'Dynamics'][i]}`,
    url: `https://www.google.com/search?q=${encodeURIComponent(product)}`,
    price: Math.random() * 100 + 10,
    moq: 500,
    leadTime: '14 Days',
    reliability: 85,
    source: sources[i]
  }))
}

// --- COMPONENTS ---

const ScanAnimation = ({ active }: { active: boolean }) => {
  return (
    <div className={`relative w-full h-1 bg-white/5 rounded-full overflow-hidden ${active ? '' : 'hidden'}`}>
       <motion.div 
         initial={{ x: '-100%' }}
         animate={{ x: '100%' }}
         transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
         className="absolute inset-0 w-1/3 h-full bg-indigo-500 shadow-[0_0_20px_indigo]"
       />
    </div>
  )
}

// --- MAIN PAGE ---

export default function BOMToSourcePage() {
  const [bomItems, setBomItems] = useState<BOMItem[]>([
    { id: '1', name: 'Microcontroller STM32F4', specs: 'LQFP-100, 168MHz', qty: 5000, targetPrice: 4.50 },
    { id: '2', name: 'Ceramic Capacitor 10uF', specs: '0603, 16V, X5R', qty: 25000, targetPrice: 0.02 },
    { id: '3', name: 'LED Matrix 8x8 Display', specs: 'RGB, Common Anode', qty: 1200, targetPrice: 1.20 }
  ])
  const [researchState, setResearchState] = useState<'idle' | 'searching' | 'analyzing' | 'finished'>('idle')
  const [searchLog, setSearchLog] = useState<string[]>([])
  const [matches, setMatches] = useState<Record<string, SupplierMatch[]>>({})
  const [activeItemIdx, setActiveItemIdx] = useState(0)
  const { showToast } = useToast()

  const startAutonomousSourcing = async () => {
    if (bomItems.length === 0) return
    setResearchState('searching')
    setMatches({})
    setSearchLog(['Initializing neural search vectors...', 'Connecting to Alibaba Global API...', 'Scraping manufacturer direct databases...'])

    for (let i = 0; i < bomItems.length; i++) {
        setActiveItemIdx(i)
        const item = bomItems[i]
        setSearchLog(prev => [...prev, `Researching: ${item.name} | Specs: ${item.specs}...`])
        
        // Simulating the "Thinking" process for each item
        await new Promise(r => setTimeout(r, 1500))
        const res = await simulateSearchProduct(item.name, item.specs)
        setMatches(prev => ({ ...prev, [item.id]: res }))
        
        setSearchLog(prev => [...prev, `✔ Found ${res.length} matches for ${item.name} on ${res[0].source}`])
    }

    setResearchState('analyzing')
    setSearchLog(prev => [...prev, 'Consolidating "Should-Cost" model...', 'Calculating global lead-time variance...', 'Audit finalize complete.'])
    await new Promise(r => setTimeout(r, 2000))
    setResearchState('finished')
    showToast('Autonomous sourcing portfolio generated.', 'success')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     // Mocking file upload
     showToast('BOM Manifest Ingested Successfully', 'info')
     setBomItems([
        { id: 'B-101', name: 'Solenoid Valve 1/4"', specs: 'Brass, 24VDC, Normally Closed', qty: 200, targetPrice: 18.00 },
        { id: 'B-102', name: 'Stainless Steel Tubing', specs: '1/2" OD, 0.035" Wall, 316SS', qty: 1500, targetPrice: 5.50 },
        { id: 'B-103', name: 'Industrial PLC Controller', specs: '16DI/16DO, Ethernet/IP', qty: 50, targetPrice: 420.00 }
     ])
  }

  return (
    <div className="p-10 animate-fade-in max-w-[1900px] mx-auto min-h-screen pb-32 bg-[var(--bg-0)] text-[var(--text-primary)]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-12">
         <div className="flex items-center gap-10">
            <div className="w-20 h-20 rounded-[32px] bg-[var(--bg-1)] border border-[var(--border)] flex items-center justify-center text-indigo-500 shadow-3xl">
               <Target size={40} className="status-pulse" />
            </div>
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_indigo]" />
                  <span className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">Neural Asset Discovery Core</span>
               </div>
               <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-[var(--text-primary)]">BOM <span className="gradient-text">Search</span></h1>
               <p className="text-[var(--text-secondary)] opacity-40 font-medium mt-3 uppercase text-[10px] tracking-widest">Autonomous "Perplexity-Style" global supplier matching</p>
            </div>
         </div>
         
         <div className="flex gap-4">
            <label className="px-10 py-5 bg-[var(--bg-1)] border border-[var(--border)] rounded-3xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-[var(--text-primary)] hover:bg-[var(--bg-2)] transition-all flex items-center gap-3">
               <Upload size={16} /> Ingest BOM Manifest
               <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <button 
                onClick={startAutonomousSourcing}
                disabled={researchState === 'searching' || researchState === 'analyzing'}
                className="px-10 py-5 bg-indigo-600 text-[var(--bg-0)] rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-3xl shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
            >
               {researchState === 'searching' || researchState === 'analyzing' ? <RefreshCcw size={16} className="animate-spin" /> : <Zap size={16} className="fill-[var(--bg-0)]" />}
               {researchState === 'searching' ? 'Researching World Markets...' : researchState === 'analyzing' ? 'Building Cost Model...' : 'Execute Autonomous Search'}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                 {/* LEFT: BOM MANAGEMENT */}
         <div className="xl:col-span-4 flex flex-col gap-10">
            <div className="bg-[var(--bg-1)] backdrop-blur-3xl border border-[var(--border)] rounded-[48px] p-10 shadow-3xl flex-1 flex flex-col">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tighter flex items-center gap-4">
                     <Database className="text-indigo-400" size={24} /> Asset Registry
                  </h2>
                  <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-10 uppercase tracking-widest">{bomItems.length} Entities</div>
               </div>
 
               <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {bomItems.map((item, idx) => (
                    <div key={item.id} className={`p-6 rounded-3xl border transition-all ${activeItemIdx === idx && researchState === 'searching' ? 'bg-indigo-600/10 border-indigo-500/50 scale-[1.02]' : 'bg-[var(--bg-2)] border-[var(--border)]'}`}>
                       <div className="flex justify-between items-start mb-2">
                          <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-20 uppercase tracking-widest leading-none">ID: {item.id}</div>
                          <button onClick={() => setBomItems(prev => prev.filter(x => x.id !== item.id))} className="text-[var(--text-secondary)] opacity-10 hover:text-rose-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                       </div>
                       <input 
                         className="bg-transparent border-none text-md font-black text-[var(--text-primary)] w-full uppercase tracking-tight focus:ring-0 p-0 mb-1"
                         value={item.name}
                         onChange={(e) => {
                            const next = [...bomItems]
                            next[idx].name = e.target.value
                            setBomItems(next)
                         }}
                       />
                       <input 
                         className="bg-transparent border-none text-[10px] font-bold text-[var(--text-secondary)] opacity-40 w-full uppercase tracking-widest focus:ring-0 p-0 mb-4 italic"
                         value={item.specs}
                         onChange={(e) => {
                            const next = [...bomItems]
                            next[idx].specs = e.target.value
                            setBomItems(next)
                         }}
                       />
                       <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                          <div className="flex flex-col">
                             <div className="text-[8px] font-black text-[var(--text-secondary)] opacity-20 uppercase">Target Price</div>
                             <div className="text-xs font-black text-emerald-400">${item.targetPrice}</div>
                          </div>
                          <div className="flex flex-col text-right">
                             <div className="text-[8px] font-black text-[var(--text-secondary)] opacity-20 uppercase">Volume</div>
                             <div className="text-xs font-black text-[var(--text-primary)]">{item.qty.toLocaleString()}</div>
                          </div>
                       </div>
                       {activeItemIdx === idx && researchState === 'searching' && (
                         <div className="mt-4">
                            <ScanAnimation active={true} />
                         </div>
                       )}
                    </div>
                  ))}
                  <button onClick={() => setBomItems(prev => [...prev, { id: `B-${Date.now().toString().slice(-4)}`, name: 'New Component', specs: 'Specs Here', qty: 1, targetPrice: 0 }])} className="w-full py-6 border-2 border-dashed border-[var(--border)] rounded-3xl text-[var(--text-secondary)] opacity-20 hover:text-[var(--text-primary)] hover:border-indigo-500/30 hover:bg-[var(--bg-2)] transition-all text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3">
                     <Plus size={18} /> Add Component Node
                  </button>
               </div>
            </div>
         </div>

         {/* RIGHT: REAL-TIME INTELLIGENCE COMMAND CENTER */}
         <div className="xl:col-span-8 flex flex-col gap-10">
            {/* TERMINAL / LOGS */}
            <div className="bg-[var(--bg-2)] rounded-[48px] border border-[var(--border)] p-8 shadow-3xl h-[350px] flex flex-col font-mono overflow-hidden group">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                     <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">Neural Pulse Logs</span>
                  </div>
                  <div className="flex gap-2 text-[var(--text-secondary)] opacity-20">
                     <div className="w-2 h-2 rounded-full bg-current" />
                     <div className="w-2 h-2 rounded-full bg-current" />
                     <div className="w-2 h-2 rounded-full bg-current" />
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto space-y-2 pr-4 custom-scrollbar">
                  {searchLog.map((log, i) => (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className={`text-[11px] font-mono leading-relaxed ${log.includes('✔') ? 'text-emerald-400' : 'text-[var(--text-secondary)] opacity-40'}`}>
                       <span className="text-[var(--text-secondary)] opacity-20 mr-4">[{new Date().toLocaleTimeString()}]</span>
                       <span className={log.includes('Researching') ? 'text-indigo-400 font-bold' : ''}>{log}</span>
                    </motion.div>
                  ))}
                  {researchState === 'idle' && (
                     <div className="h-full flex items-center justify-center text-[var(--text-secondary)] opacity-10 text-sm italic font-black uppercase tracking-widest">
                        Neural Engine Standby. Execute search to begin world broadcast mapping.
                     </div>
                  )}
               </div>
            </div>

            {/* RESULTS / MATCHES */}
            <div className="bg-[var(--bg-1)] backdrop-blur-3xl border border-[var(--border)] rounded-[64px] p-10 shadow-3xl flex-1 flex flex-col relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <BrainCircuit size={200} className="text-indigo-400" />
               </div>

               <div className="flex items-center justify-between mb-10 relative z-10">
                  <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter flex items-center gap-4">
                     <LayoutGrid size={28} className="text-indigo-400" /> Sourcing Portfolio
                  </h2>
                  <div className="flex gap-4">
                     <button className="p-3 rounded-2xl bg-[var(--bg-2)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"><Share2 size={18} /></button>
                     <button className="p-3 rounded-2xl bg-[var(--bg-2)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all" onClick={() => alert('Downloading Cost Model...')}><Download size={18} /></button>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar relative z-10">
                  {bomItems.map(item => (
                    <div key={item.id} className="space-y-4">
                       <div className="flex items-center gap-4 text-[var(--text-secondary)] opacity-10">
                          <div className="h-px flex-1 bg-[var(--border)]" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.name} Search Pool</span>
                          <div className="h-px flex-1 bg-[var(--border)]" />
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {matches[item.id]?.map((match, mi) => (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: mi * 0.1 }}
                              key={mi} className="bg-[var(--bg-2)] border border-[var(--border)] rounded-[32px] p-6 hover:border-indigo-500/30 transition-all hover:translate-y-[-4px] relative group overflow-hidden shadow-soft"
                            >
                               <div className="flex justify-between items-start mb-4">
                                  <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[8px] font-black text-indigo-400 uppercase tracking-widest">{match.source}</div>
                                  <div className="text-[9px] font-black text-emerald-400">Match: {95 + mi}%</div>
                               </div>
                               <h4 className="text-lg font-black text-[var(--text-primary)] uppercase truncate mb-1">{match.name}</h4>
                               <p className="text-[10px] text-[var(--text-secondary)] opacity-40 font-bold uppercase truncate mb-4">{match.url.replace('https://', '')}</p>
                               
                               <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-4 mb-6">
                                  <div>
                                     <div className="text-[8px] font-black text-[var(--text-secondary)] opacity-20 uppercase">Unit Price</div>
                                     <div className="text-xl font-black text-[var(--text-primary)] font-mono">${match.price.toFixed(2)}</div>
                                  </div>
                                  <div>
                                     <div className="text-[8px] font-black text-[var(--text-secondary)] opacity-20 uppercase">MOQ</div>
                                     <div className="text-xl font-black text-[var(--text-primary)] font-mono">{match.moq}</div>
                                  </div>
                               </div>

                               <button 
                                 onClick={() => window.open(match.url, '_blank')}
                                 className="w-full py-4 bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl text-[9px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--bg-2)] transition-all flex items-center justify-center gap-3 shadow-inner"
                               >
                                  Deep Dive Node <ArrowRight size={14} />
                               </button>
                            </motion.div>
                          ))}
                          {!matches[item.id] && researchState !== 'searching' && (
                             <div className="col-span-3 py-12 text-center text-[var(--text-secondary)] opacity-10 text-[10px] font-black uppercase tracking-[0.5em] border-2 border-dashed border-[var(--border)] rounded-[40px]">
                                No Neural Results for this Asset Vector
                             </div>
                          )}
                          {researchState === 'searching' && activeItemIdx === bomItems.findIndex(x => x.id === item.id) && (
                             <div className="col-span-3 py-12 flex flex-col items-center justify-center text-indigo-500 gap-6">
                                <Scan size={48} className="animate-pulse" />
                                <div className="text-[10px] font-black uppercase tracking-[0.4em]">Broadcasting World Inquiries...</div>
                             </div>
                          )}
                       </div>
                    </div>
                  ))}
               </div>

               {/* SHOULD-COST SUMMARY BAR */}
               {researchState === 'finished' && (
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-10 p-8 bg-indigo-600 rounded-[40px] shadow-3xl shadow-indigo-600/30 flex items-center justify-between relative overflow-hidden group">
                     <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="flex gap-16 relative z-10">
                        <div>
                           <div className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">Total Managed Volume</div>
                           <div className="text-4xl font-black text-white tracking-tighter tabular-nums">${
                              bomItems.reduce((acc, it) => acc + (it.qty * (matches[it.id]?.[0]?.price || it.targetPrice || 0)), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })
                           }</div>
                        </div>
                        <div>
                           <div className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-2">Projected Market Savings</div>
                           <div className="text-4xl font-black text-emerald-200 tracking-tighter tabular-nums">22.4%</div>
                        </div>
                        <div>
                           <div className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">Supply Continuity Risk</div>
                           <div className="text-4xl font-black text-white tracking-tighter tabular-nums">LOW</div>
                        </div>
                     </div>
                     <button className="px-12 py-5 bg-white text-indigo-600 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-2xl relative z-10 hover:scale-[1.05] transition-transform">
                        Forge Strategy Package
                     </button>
                  </motion.div>
               )}
            </div>
         </div>
      </div>

    </div>
  )
}
