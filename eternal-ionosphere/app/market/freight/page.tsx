'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Search, Activity, Ship, Clock, MapPin, RefreshCw, 
  ArrowRight, Plane, Truck, TrainFront, ExternalLink, Filter, 
  ChevronDown, Package, Box, Weight, Ruler, ChevronRight, 
  AlertCircle, ShieldCheck, Zap, Globe, Gauge, Cable, Lock
} from 'lucide-react'

interface FreightRoute {
  id: string
  origin: string
  destination: string
  originPort: string
  destPort: string
  mode: 'sea' | 'air' | 'land' | 'rail'
  rate20ft?: number
  rate40ft?: number
  ratePerKg?: number
  rateFTL?: number
  rateLTL?: number
  transitDays: number
  carrierDetails: any[]
}

const MODE_CONFIG = {
  sea:  { icon: Ship, label: 'Ocean', color: 'indigo', bg: 'bg-indigo-500' },
  air:  { icon: Plane, label: 'Air', color: 'amber', bg: 'bg-amber-500' },
  land: { icon: Truck, label: 'Truck', color: 'emerald', bg: 'bg-emerald-500' },
  rail: { icon: TrainFront, label: 'Rail', color: 'rose', bg: 'bg-rose-500' },
}

export default function TMSPage() {
  const [routes, setRoutes] = useState<FreightRoute[]>([])
  const [loading, setLoading] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [modeFilter, setModeFilter] = useState<string>('land')
  
  // TMS Inputs
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [weight, setWeight] = useState('10')
  const [dims, setDims] = useState({ l: '10', w: '10', h: '10' })
  const [shippoToken, setShippoToken] = useState<string | null>(null)

  const [liveLog, setLiveLog] = useState<string[]>([
    'System Ready. Connect API for real-time rates.'
  ])

  useEffect(() => {
    const token = localStorage.getItem('api_key_shippo')
    setShippoToken(token)
    if (token) {
      appendLog('✓ REAL-TIME LINK ACTIVE: Shippo API Node Connected.')
    }
  }, [])

  const appendLog = (msg: string) => {
    setLiveLog(prev => [msg, ...prev].slice(0, 10))
  }

  const fetchRates = async () => {
    setLoading(true)
    appendLog(`Querying Carrier Network for ${origin} → ${destination}...`)
    
    try {
      const q = `${origin} to ${destination}`
      const headers: any = {}
      if (shippoToken) headers['X-Shippo-Token'] = shippoToken

      const url = `/api/freight?q=${encodeURIComponent(q)}&weight=${weight}&l=${dims.l}&w=${dims.w}&h=${dims.h}&mode=${modeFilter}`
      const res = await fetch(url, { headers })
      const data = await res.json()
      
      setRoutes(data.routes)
      setIsLive(data.isLive)
      appendLog(data.isLive ? '✓ LIVE SUCCESS: Fetched real-time carrier quotes.' : 'NOTICE: Using Benchmark Data (Connect API for real rates).')
    } catch(e) {
      appendLog('Error: Failed to connect to Carrier Registry.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full bg-[var(--bg-0)] p-6 lg:p-10 font-sans custom-scrollbar overflow-y-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
           <Link href="/market" className="group w-14 h-14 rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] flex items-center justify-center hover:border-indigo-500/50 transition-all shadow-xl">
             <ArrowLeft size={24} className="text-[var(--text-secondary)] group-hover:text-indigo-400" />
           </Link>
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className={`px-3 py-1 ${isLive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'} rounded-full flex items-center gap-2`}>
                    <Activity size={12} className={isLive ? 'animate-pulse' : ''} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{isLive ? 'Full API Control' : 'Benchmark Mode'}</span>
                 </div>
                 {shippoToken && (
                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-2">
                       <Cable size={10} className="text-blue-400" />
                       <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Shippo Connected</span>
                    </div>
                 )}
              </div>
              <h1 className="text-5xl font-black text-[var(--text-primary)] tracking-tighter uppercase italic">
                Freight <span className="text-indigo-600">Command</span>
              </h1>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* TMS FORM */}
        <div className="xl:col-span-4 space-y-6">
           {!shippoToken && (
              <Link href="/integrations" className="block p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 group hover:border-amber-500/50 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                       <ShieldCheck size={24} />
                    </div>
                    <div>
                       <div className="text-sm font-black text-amber-500 uppercase tracking-tight">API Key Required</div>
                       <p className="text-[10px] text-amber-500/60 font-medium">Connect Shippo or UPS in Integrations to unlock real carrier rates and labels.</p>
                    </div>
                 </div>
              </Link>
           )}

           <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[2.5rem] p-8 shadow-2xl relative">
              <form onSubmit={(e) => { e.preventDefault(); fetchRates() }} className="space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest pl-2">Origin</label>
                       <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                          <input type="text" placeholder="City, State, Zip..." value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full bg-[var(--bg-0)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-indigo-500" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest pl-2">Destination</label>
                       <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={18} />
                          <input type="text" placeholder="City, State, Zip..." value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-[var(--bg-0)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-rose-500" />
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest pl-2">Weight (LB)</label>
                       <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-[var(--bg-0)] border border-[var(--border)] rounded-2xl py-4 px-6 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-indigo-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest pl-2">Package Type</label>
                       <select className="w-full bg-[var(--bg-0)] border border-[var(--border)] rounded-2xl py-4 px-6 text-sm font-bold text-[var(--text-primary)] outline-none">
                          <option>Small Box</option>
                          <option>Large Box</option>
                          <option>Pallet</option>
                       </select>
                    </div>
                 </div>

                 <button type="submit" className={`w-full py-6 rounded-2xl ${isLive ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-indigo-600 shadow-indigo-500/20'} text-white font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3`}>
                    {loading ? <RefreshCw className="animate-spin" /> : <Zap size={18} />}
                    {loading ? 'Polling API Handshake...' : 'Fetch Live Rates'}
                 </button>
              </form>
           </div>

           <div className="bg-[#0a0f1e] border border-white/5 rounded-[2rem] p-6 font-mono text-[10px] text-white/40 space-y-2">
              {liveLog.map((log, i) => <div key={i} className={i === 0 ? 'text-indigo-400' : ''}> {'>'} {log}</div>)}
           </div>
        </div>

        {/* RESULTS */}
        <div className="xl:col-span-8 space-y-6">
           {loading && (
              <div className="h-[400px] bg-[var(--bg-1)] border border-[var(--border)] rounded-[3rem] flex items-center justify-center">
                 <RefreshCw size={48} className="animate-spin text-indigo-500 mb-6" />
              </div>
           )}

           {!loading && routes.length > 0 && (
              <div className="space-y-4">
                 <div className="flex items-center justify-between px-6">
                    <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-[0.3em]">
                       {isLive ? 'Verified Live Carrier Node Results' : 'Simulated Logistics benchmarks'}
                    </div>
                    {isLive && (
                       <div className="flex items-center gap-2 text-emerald-500 animate-pulse">
                          <Lock size={12} />
                          <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
                       </div>
                    )}
                 </div>

                 {routes.map((route, i) => (
                    <motion.div key={route.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[2.5rem] p-6 group hover:border-indigo-500/30 shadow-soft">
                       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-2xl bg-[var(--bg-0)] border border-[var(--border)] flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                <Ship size={32} />
                             </div>
                             <div>
                                <div className="text-2xl font-black text-[var(--text-primary)] tracking-tight mb-1 flex items-center gap-3">
                                   {route.carrierDetails[0].name}
                                   {isLive && <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[8px] uppercase tracking-tighter">Real-Time</div>}
                                </div>
                                <div className="flex items-center gap-3">
                                   <div className="text-[10px] font-bold text-[var(--text-secondary)] opacity-50 uppercase tracking-widest">{route.origin} → {route.destination}</div>
                                   <div className="w-1 h-1 rounded-full bg-[var(--border)]" />
                                   <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{route.transitDays} Days Transit</div>
                                </div>
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-8">
                             <div className="text-right">
                                <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase mb-1">Total Rate</div>
                                <div className="text-3xl font-black text-indigo-400 tabular-nums tracking-tighter">${route.rateLTL?.toLocaleString()}</div>
                             </div>
                             <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
                                Generate Label
                             </button>
                          </div>
                       </div>
                    </motion.div>
                 ))}
              </div>
           )}

           {!loading && routes.length === 0 && (
              <div className="h-[400px] bg-[var(--bg-1)] border border-[var(--border)] rounded-[3rem] flex flex-col items-center justify-center text-center p-12">
                 <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6">
                    <Search size={40} />
                 </div>
                 <h3 className="text-xl font-black text-[var(--text-primary)] italic uppercase tracking-tight">System Awaiting Parameters</h3>
                 <p className="text-sm text-[var(--text-secondary)] opacity-40 max-w-sm mt-2 font-medium">Input your shipment details in the terminal to fetch live carrier quotes from the global neural registry.</p>
              </div>
           )}
        </div>
      </div>
    </div>
  )
}
