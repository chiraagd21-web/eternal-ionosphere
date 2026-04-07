'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, 
  Search, 
  MapPin, 
  Package, 
  Activity, 
  Download, 
  CheckCircle2, 
  Truck, 
  Box, 
  Clock, 
  BarChart3, 
  ArrowUpRight, 
  ArrowRight,
  Maximize2,
  Filter,
  RefreshCcw,
  Zap,
  Ship,
  Plane,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import dynamic from 'next/dynamic'

// --- DYNAMIC LEAFLET MAP ---
const LeafletMap = dynamic(() => import('@/app/shipments/LeafletMap'), { ssr: false, loading: () => (
  <div className="w-full h-full flex items-center justify-center bg-[var(--bg-0)]">
    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
) })

// --- MOCK DATA GENERATOR FOR 200 ORDERS ---
const STATUSES = ['Out for Delivery', 'In Transit', 'Pending', 'Delivered', 'Held at Customs']
const TYPES = ['sea', 'air', 'land']
const LOCATIONS = [
  { name: 'Los Angeles, CA', lat: 34.0522, lon: -118.2437 },
  { name: 'New York, NY', lat: 40.7128, lon: -74.0060 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo, JP', lat: 35.6762, lon: 139.6503 },
  { name: 'Berlin, DE', lat: 52.5200, lon: 13.4050 },
  { name: 'Toronto, CA', lat: 43.6532, lon: -79.3832 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Sydney, AU', lat: -33.8688, lon: 151.2093 }
]

const MOCK_OUTBOUND_ORDERS = Array.from({ length: 200 }, (_, i) => {
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)]
  const type = TYPES[Math.floor(Math.random() * TYPES.length)]
  const locIdx = Math.floor(Math.random() * LOCATIONS.length)
  const loc = LOCATIONS[locIdx]
  const destIdx = (locIdx + Math.floor(Math.random() * (LOCATIONS.length - 1)) + 1) % LOCATIONS.length
  const dest = LOCATIONS[destIdx]
  
  // Generating realistic dates
  const now = new Date()
  const shipDate = new Date(now.getTime() - (Math.random() * 5 + 1) * 86400000).toISOString().split('T')[0]
  const eta = new Date(now.getTime() + (Math.random() * 5 + 1) * 86400000).toISOString().split('T')[0]
  
  return {
    id: `OUT-${2000 + i}`,
    tracking: `${i % 2 === 0 ? 'FEDEX' : 'UPS'}${123456789 + i}`,
    customer: `Global Partner ${i + 1}`,
    status,
    type,
    origin: loc.name,
    originLat: loc.lat,
    originLon: loc.lon,
    destination: dest.name,
    destLat: dest.lat,
    destLon: dest.lon,
    shipDate,
    eta,
    lastUpdate: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    items: [`Component X-142`, `Unit P-09`],
    hasPOD: status === 'Delivered',
    supplier: 'Forge Logistics Core', // Needed for map tooltip
    product: 'Industrial Assembly Unit'   // Needed for map tooltip
  }
})

// --- COMPONENTS ---

const OutboundCard = ({ order, isExpanded, onToggle }: { order: any, isExpanded: boolean, onToggle: () => void }) => {
  return (
    <div key={order.id} className={`group bg-[var(--bg-1)] border border-[var(--border)] rounded-[32px] overflow-hidden transition-all hover:border-indigo-500/30 shadow-soft ${isExpanded ? 'ring-2 ring-indigo-500' : ''}`}>
       <div className="p-8 flex items-center gap-6 cursor-pointer" onClick={onToggle}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110 ${
            order.status === 'Delivered' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
            order.status === 'Out for Delivery' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' :
            'bg-[var(--bg-2)] border border-[var(--border)] text-[var(--text-secondary)] opacity-40'
          }`}>
             {order.type === 'air' ? <Plane size={24} /> : order.type === 'sea' ? <Ship size={24} /> : <Truck size={24} />}
          </div>
          <div className="flex-1 min-w-0">
             <div className="flex items-center gap-3 mb-1.5">
                <span className="text-[10px] font-black text-[var(--text-secondary)] opacity-20 uppercase tracking-widest">{order.id}</span>
                <span className="text-sm font-black text-[var(--text-primary)] uppercase truncate">{order.customer}</span>
             </div>
             <div className="flex items-center gap-6">
                <div className="text-[10px] font-mono text-indigo-400 font-bold tracking-widest uppercase">{order.tracking}</div>
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`} />
                   <span className="text-[9px] font-black uppercase text-[var(--text-secondary)] opacity-40 tracking-widest">{order.status}</span>
                </div>
             </div>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
             <div className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">{order.destination.split(',')[0]}</div>
             <div className="text-[8px] font-black text-[var(--text-secondary)] opacity-20 uppercase tracking-widest">Target ETA: 12H</div>
          </div>
          <button className="p-3 rounded-xl bg-[var(--bg-1)] border border-[var(--border)] text-[var(--text-secondary)] opacity-40 group-hover:text-white group-hover:bg-indigo-600 transition-all opacity-0 group-hover:opacity-100">
             <ArrowUpRight size={18} />
          </button>
       </div>
       
       <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-black/5 backdrop-blur-xl border-t border-[var(--border)] p-8 space-y-6 overflow-hidden">
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                     <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-2">Transit Protocol</div>
                     <div className="text-[11px] font-black text-[var(--text-primary)] uppercase">{order.type.toUpperCase()} FREIGHT</div>
                  </div>
                  <div>
                     <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-2">Last Checkpoint</div>
                     <div className="text-[11px] font-black text-[var(--text-primary)] uppercase">{order.origin}</div>
                  </div>
                  <div>
                     <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-2">Target Neural Node</div>
                     <div className="text-[11px] font-black text-[var(--text-primary)] uppercase">{order.destination}</div>
                  </div>
                  <div>
                     <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-2">Proof of Execution</div>
                     {order.hasPOD ? (
                        <button className="flex items-center gap-2 text-emerald-400 hover:text-white transition-colors" onClick={(e) => { 
                           e.stopPropagation(); 
                           const blob = new Blob([`PROOF OF DELIVERY\nID: ${order.id}\nTRACKING: ${order.tracking}\nSTATUS: DELIVERED\nTIMESTAMP: ${new Date().toISOString()}`], { type: 'text/plain' });
                           const url = URL.createObjectURL(blob);
                           const a = document.createElement('a');
                           a.href = url;
                           a.download = `POD_${order.id}.txt`;
                           a.click();
                        }}>
                           <Download size={14} className="status-pulse" />
                           <span className="text-[10px] font-black uppercase underline decoration-emerald-500/20 underline-offset-4">Download POD.pdf</span>
                        </button>
                     ) : (
                        <span className="text-[10px] font-black text-[var(--text-secondary)] opacity-20 uppercase">Pending Delivery</span>
                     )}
                  </div>
               </div>
               
               <div className="flex gap-4 items-center p-4 bg-[var(--bg-1)] rounded-2xl border border-[var(--border)] shadow-inner">
                  <Activity size={16} className="text-indigo-500" />
                  <div className="flex-1 h-1 bg-black/5 rounded-full relative overflow-hidden">
                     <div className={`h-full bg-indigo-500 transition-all duration-1000 ${order.status === 'Delivered' ? 'w-full' : 'w-[72%]'}`} />
                  </div>
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{order.status === 'Delivered' ? '100%' : '72%'} Complete</span>
               </div>
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  )
}

// --- MAIN PAGE ---

export default function OutboundLogisticsPage() {
  const [orders, setOrders] = useState<any[]>(MOCK_OUTBOUND_ORDERS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const q = search.toLowerCase()
      const mSearch = o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.tracking.toLowerCase().includes(q)
      const mStatus = filter === 'all' || o.status === filter || (filter === 'Delivered' && o.status === 'Delivered') || (filter === 'Active' && o.status !== 'Delivered')
      return mSearch && mStatus
    })
  }, [orders, search, filter])

  const stats = useMemo(() => ({
    total: orders.length,
    active: orders.filter(o => o.status !== 'Delivered').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    delayed: orders.filter(o => o.status === 'Held at Customs').length
  }), [orders])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      // Simulating a real-time shift in status for a random order
      const newOrders = [...orders]
      const idx = Math.floor(Math.random() * newOrders.length)
      if (newOrders[idx].status !== 'Delivered') {
          newOrders[idx].status = 'Out for Delivery'
      }
      setOrders(newOrders)
    }, 1200)
  }

  return (
    <div className="p-10 animate-fade-in max-w-[1900px] mx-auto min-h-screen pb-32 bg-[var(--bg-0)] text-[var(--text-primary)] space-y-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
         <div className="flex items-center gap-10">
            <div className="w-20 h-20 rounded-[32px] bg-[var(--bg-1)] border border-[var(--border)] flex items-center justify-center text-indigo-500 shadow-soft">
               <Globe size={40} className="animate-spin-slow" />
            </div>
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 status-pulse shadow-[0_0_10px_indigo]" />
                  <span className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">Outbound Control Center • LIVE</span>
               </div>
               <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-[var(--text-primary)]">Digital <span className="gradient-text">Twin</span></h1>
               <p className="text-[var(--text-secondary)] opacity-40 font-medium mt-3 uppercase text-[10px] tracking-widest">Real-time outbound logistics & proof-of-delivery console</p>
            </div>
         </div>
         
         <div className="flex gap-4">
            <button 
                onClick={handleRefresh}
                className="px-10 py-5 bg-[var(--bg-1)] border border-[var(--border)] rounded-3xl text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest hover:text-[var(--text-primary)] hover:bg-[var(--bg-2)] transition-all flex items-center gap-3 shadow-soft"
            >
               <RefreshCcw size={16} className={refreshing ? 'animate-spin' : ''} /> Synchronize Global Feeds
            </button>
            <button className="px-10 py-5 bg-indigo-600 text-[var(--text-primary)] rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-3xl shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
               <Maximize2 size={16} /> Maximize Immersive Model
            </button>
         </div>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { label: 'Total Shipments', val: stats.total, icon: Box, color: 'text-indigo-400' },
           { label: 'Active Transit', val: stats.active, icon: Truck, color: 'text-blue-400' },
           { label: 'Verified Delivery', val: stats.delivered, icon: CheckCircle2, color: 'text-emerald-400' },
           { label: 'Customs Issues', val: stats.delayed, icon: Activity, color: 'text-rose-400' },
         ].map((s, i) => (
           <div key={i} className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[40px] p-8 flex items-center justify-between group shadow-soft overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <s.icon size={50} />
              </div>
              <div className="relative z-10">
                 <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-20 mb-2">{s.label}</div>
                 <div className={`text-5xl font-black font-mono tracking-tighter ${s.color}`}>{s.val}</div>
              </div>
              <div className={`p-4 rounded-2xl bg-[var(--bg-2)] border border-[var(--border)] ${s.color} relative z-10 shadow-inner`}>
                 <s.icon size={24} />
              </div>
           </div>
         ))}
      </div>

      {/* MAP & SEARCH LAYER */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         <div className="xl:col-span-8 flex flex-col gap-10">
            {/* SEARCH */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-[var(--bg-1)] border border-[var(--border)] rounded-3xl p-2 flex items-center group focus-within:border-indigo-500/50 transition-all shadow-soft">
                   <Search size={22} className="ml-6 text-[var(--text-secondary)] opacity-10 group-focus-within:text-indigo-400" />
                   <input 
                      className="w-full bg-transparent border-none py-5 px-6 text-xl font-black uppercase tracking-tighter text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] opacity-20 focus:ring-0"
                      placeholder="Search Client, Protocol ID, or Hub..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                   />
                </div>
                <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-3xl p-2 flex items-center gap-2 pr-6 shadow-soft">
                   <div className="p-4 bg-[var(--bg-2)] rounded-2xl text-[var(--text-secondary)] opacity-40"><Filter size={18} /></div>
                   <select 
                      className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] focus:ring-0 cursor-pointer"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                   >
                       <option value="all" className="bg-[var(--bg-0)]">All Streams</option>
                       <option value="Active" className="bg-[var(--bg-0)]">In Transit</option>
                       <option value="Delivered" className="bg-[var(--bg-0)]">Delivered</option>
                       <option value="Held at Customs" className="bg-[var(--bg-0)]">Customs Clear</option>
                   </select>
                </div>
            </div>

            {/* REAL-TIME IMMERSIVE MAP */}
            <div className="h-[650px] bg-[var(--bg-1)] border border-[var(--border)] rounded-[64px] overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.2)] group">
                <div className="absolute top-10 left-10 z-20 flex flex-col gap-4">
                    <div className="bg-[var(--bg-0)]/60 backdrop-blur-3xl px-8 py-4 rounded-[28px] border border-[var(--border)] flex items-center gap-4 shadow-3xl scale-125 origin-top-left ml-6 mt-6">
                       <div className="w-3 h-3 rounded-full bg-indigo-500 status-pulse shadow-[0_0_12px_indigo]" />
                       <div>
                          <div className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest leading-none">Global Telemetry Hub</div>
                          <div className="text-[8px] font-black text-[var(--text-secondary)] opacity-40 tracking-[0.3em] uppercase mt-2">200 High-Volume Nodes Connected</div>
                       </div>
                    </div>
                </div>
                <LeafletMap shipments={filtered} />
            </div>
         </div>

         {/* TERMINAL LISTING */}
         <div className="xl:col-span-4 flex flex-col gap-8">
            <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[64px] p-8 flex-1 flex flex-col h-[850px] shadow-soft relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <Activity size={200} className="text-indigo-400" />
               </div>
               
               <div className="flex items-center justify-between mb-8 relative z-10">
                  <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tighter flex items-center gap-4">
                     Command Stream
                  </h2>
                  <BarChart3 className="text-[var(--text-secondary)] opacity-10" size={20} />
               </div>

               <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar relative z-10">
                  {filtered.slice(0, 50).map(o => (
                    <OutboundCard 
                      key={o.id} 
                      order={o} 
                      isExpanded={expandedId === o.id} 
                      onToggle={() => setExpandedId(expandedId === o.id ? null : o.id)} 
                    />
                  ))}
                  {filtered.length === 0 && (
                     <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                        <Box size={64} className="mb-6" />
                        <div className="text-[10px] font-black uppercase tracking-[0.5em]">No Protocol Matches</div>
                     </div>
                  )}
               </div>
               
               <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-black text-[var(--text-secondary)] opacity-10 uppercase tracking-widest relative z-10">
                  <span>Stream Buffer: 100%</span>
                  <span>Neural Latency: 24ms</span>
               </div>
            </div>
         </div>
      </div>

    </div>
  )
}
