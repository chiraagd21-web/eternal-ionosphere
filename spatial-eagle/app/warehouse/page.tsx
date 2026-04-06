'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Settings2, 
  Clock, 
  Activity, 
  Zap, 
  Package, 
  X, 
  ShieldCheck,
  Play,
  Pause,
  RefreshCcw,
  Maximize2,
  LayoutGrid,
  Smartphone,
  Cpu,
  Layers,
  Terminal,
  Database,
  BarChart4
} from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import Enhanced Three.js engine
const Warehouse3D = dynamic(() => import('@/components/Warehouse3D').then(mod => mod.Warehouse3D), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#020617] rounded-[40px] flex flex-col items-center justify-center p-20 border border-white/5 relative overflow-hidden">
       {/* Futuristic Loading Animation */}
       <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent animate-pulse" />
       <Cpu className="w-16 h-16 text-indigo-500 mb-8 animate-spin transition-transform duration-[3s]" />
       <div className="flex flex-col items-center gap-2 relative z-10">
          <span className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Initializing Quantum 3D Core</span>
          <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
             <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)]" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4">Calibrating Spatial Coordinates...</span>
       </div>
    </div>
  )
})

// --- Mock Data ---

const ZONES = [
  { id: 'A', label: 'NEURAL CORE ALPHA', racks: 12, utilization: 84, color: 'indigo' },
  { id: 'B', label: 'OPTIMIZED LOGISTIX', racks: 8, utilization: 62, color: 'emerald' },
  { id: 'C', label: 'RAW DATA STORAGE', racks: 15, utilization: 91, color: 'amber' },
  { id: 'D', label: 'EXPERIMENTAL TECH', racks: 6, utilization: 45, color: 'purple' },
]

// --- Components ---

const DetailModal = ({ item, onClose }: { item: any, onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 30 }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-[95vw] bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-[48px] shadow-[0_80px_160px_rgba(0,0,0,1)] overflow-hidden flex flex-col z-[1000]"
    >
      <div className="relative p-12 border-b border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent">
        <div className="absolute top-12 right-12 z-10">
           <button onClick={onClose} className="p-5 bg-white/5 rounded-3xl hover:bg-white/10 transition-all active:scale-90 border border-white/10 group">
             <X className="w-6 h-6 text-slate-400 group-hover:text-white" />
           </button>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="px-5 py-1.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-indigo-500/30">Asset Telemetry</span>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{item.id} #4492-V6</span>
          </div>
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">{item.name}</span>
          </h2>
        </div>
      </div>

      <div className="p-12 grid grid-cols-2 gap-10">
         <div className="space-y-8">
            <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6">
                  <BarChart4 size={24} className="text-indigo-400" />
               </div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Live Availability</p>
               <p className="text-5xl font-black text-white">{item.qty?.toLocaleString()}</p>
               <div className="mt-6 flex items-center gap-2">
                  <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} className="h-full bg-indigo-500" />
                  </div>
                  <span className="text-[10px] font-black text-indigo-400">82%</span>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Status</p>
                  <p className={`text-sm font-black uppercase tracking-widest ${item.status === 'Optimal' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {item.status}
                  </p>
               </div>
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Location</p>
                  <p className="text-sm font-black text-white uppercase tracking-widest">{item.location}</p>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Optimization Intelligence</h4>
            <div className="space-y-4">
               {[
                 { label: 'Thermal Load', val: '18.2°C', icon: Database },
                 { label: 'Robotic Access', val: 'Low Latency', icon: Activity },
                 { label: 'Picking Priority', val: 'P-0 High', icon: Zap },
               ].map((stat, i) => (
                 <div key={i} className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <stat.icon size={16} className="text-indigo-400" />
                       <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">{stat.label}</span>
                    </div>
                    <span className="text-[11px] font-black text-white">{stat.val}</span>
                 </div>
               ))}
            </div>
            
            <div className="mt-4 p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl">
               <p className="text-[10px] font-bold text-indigo-300 italic">"AI recommends restocking this cluster within 48 hours to maintain 99% throughput efficiency."</p>
            </div>
         </div>
      </div>

      <div className="p-12 border-t border-white/5 flex gap-6 mt-auto">
         <button className="flex-1 bg-white hover:bg-slate-200 text-black font-black uppercase tracking-[0.2em] text-xs py-7 rounded-[28px] shadow-2xl transition-all active:scale-95">
           Dispatch Resource
         </button>
         <button className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-xs py-7 rounded-[28px] transition-all active:scale-95">
           Run Analysis
         </button>
      </div>
    </motion.div>
  )
}

// --- Main Application Interface ---

export default function WarehousePage() {
  const [selectedZone, setSelectedZone] = useState('A')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isSimActive, setIsSimActive] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-full min-h-screen bg-[#020617] text-slate-100 flex font-sans overflow-hidden">
      {/* Background Chromatic Aberration & Volumetric Fog */}
      <div className="absolute inset-0 pointer-events-none decoration-clone">
        <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[200px] animate-pulse" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[200px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150" />
      </div>

      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Superior Data Header */}
        <header className="p-10 flex items-center justify-between border-b border-white/5 bg-slate-950/40 backdrop-blur-2xl">
          <div className="flex items-center gap-8">
             <div className="p-5 bg-indigo-600 rounded-3xl shadow-[0_0_40px_rgba(79,70,229,0.3)]">
                <Layers className="w-8 h-8 text-white" />
             </div>
             <div>
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                  Spatial <span className="text-indigo-400">Eagle</span>
                </h1>
                <div className="flex items-center gap-3 mt-2">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Integrated Digital Warehouse v3.04.22</p>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
                <div className="relative p-5 bg-slate-900 border border-white/10 rounded-2xl flex items-center gap-4 transition-all w-80">
                   <Search size={22} className="text-indigo-400" />
                   <input 
                     type="text" 
                     placeholder="QUERY ASSET SYSTEM..." 
                     className="bg-transparent border-none outline-none text-[12px] text-white w-full uppercase tracking-[0.2em] font-black placeholder:text-slate-700" 
                   />
                </div>
             </div>
             
             <div className="flex gap-3">
                <button 
                  onClick={() => setIsSimActive(!isSimActive)}
                  className={`p-5 rounded-2xl border transition-all duration-500 ${isSimActive ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-500'}`}
                >
                   {isSimActive ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/20 transition-all text-white group">
                   <Settings2 size={24} className="group-hover:rotate-90 transition-transform duration-700" />
                </button>
             </div>
          </div>
        </header>

        {/* Global Cluster Navigation */}
        <div className="px-10 py-8 flex gap-5 overflow-x-auto no-scrollbar border-b border-white/5 bg-slate-950/20 backdrop-blur-md">
          {ZONES.map(z => (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              className={`px-10 py-6 rounded-[32px] border transition-all duration-700 flex items-center gap-6 min-w-[320px] ${
                selectedZone === z.id 
                  ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-[0_20px_50px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500' 
                  : 'bg-white/[0.03] border-white/5 text-slate-500 hover:bg-white/[0.05]'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl italic ${
                selectedZone === z.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-600'
              }`}>
                {z.id}
              </div>
              <div className="text-left flex-1">
                 <p className={`text-[12px] font-black uppercase tracking-[0.2em] mb-1 ${selectedZone === z.id ? 'text-white' : 'text-slate-500'}`}>{z.label}</p>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600 uppercase italic">{z.racks} Modules</span>
                    <span className={`text-[10px] font-black ${z.utilization > 80 ? 'text-amber-500' : 'text-emerald-500'}`}>{z.utilization}% CAPACITY</span>
                 </div>
              </div>
            </button>
          ))}
        </div>

        {/* The 3D Singularity Area */}
        <div className="flex-1 relative p-12 bg-black/[0.15]">
           <div className="w-full h-full">
              <Warehouse3D onSelectItem={(item) => setSelectedItem(item)} />
           </div>

           {/* Precision Overlays */}
           <div className="absolute top-20 left-20 z-20 flex flex-col gap-4">
              <div className="bg-slate-950/80 backdrop-blur-3xl border border-white/10 px-6 py-4 rounded-3xl flex items-center gap-4">
                 <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                 <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Cluster</h4>
                    <p className="text-sm font-black text-white italic">ZONE_{selectedZone}_PRIMARY</p>
                 </div>
              </div>
           </div>
           
           <div className="absolute bottom-24 right-24 z-20 flex flex-col gap-4">
              {[
                { icon: Smartphone, label: 'FPV_VIEW', action: () => {} },
                { icon: Terminal, label: 'CMD_STREAM', action: () => {} },
                { icon: Maximize2, label: 'EXPAND_SRV', action: () => {} },
              ].map((btn, i) => (
                <button key={i} className="p-5 bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-[28px] text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 transition-all active:scale-90 group relative overflow-hidden">
                   <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors" />
                   <btn.icon size={22} className="relative z-10" />
                   <span className="absolute left-[-150px] top-1/2 -translate-y-1/2 opacity-0 group-hover:left-[100%] group-hover:opacity-100 transition-all bg-indigo-600 text-[10px] font-black py-2 px-4 rounded-xl text-white whitespace-nowrap ml-6 shadow-xl">{btn.label}</span>
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Intelligence Dashboard Panel */}
      <aside className="w-[480px] bg-slate-950/40 backdrop-blur-3xl border-l border-white/5 flex flex-col z-10 px-12 py-12">
        <section className="mb-14">
          <div className="flex justify-between items-end mb-8">
            <div>
               <h3 className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">Throughput Matrix</h3>
               <p className="text-[10px] font-bold text-slate-500 uppercase italic">Real-time Efficiency Metrics</p>
            </div>
            <span className="text-3xl font-black text-white italic">92<span className="text-indigo-500 text-sm">%</span></span>
          </div>
          <div className="h-44 bg-slate-900/40 rounded-[40px] border border-white/5 p-10 flex items-end gap-2 overflow-hidden shadow-inner group relative">
             <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />
             {[40, 60, 45, 90, 65, 80, 50, 70, 85, 45, 75, 95, 60, 40, 50, 80, 70, 90, 40, 60, 30, 80].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.03, duration: 0.8 }}
                  className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 opacity-40 rounded-full group-hover:opacity-100 transition-opacity" 
                />
             ))}
          </div>
        </section>

        <section className="mb-14">
           <div className="flex items-center gap-3 mb-8">
              <Activity className="text-indigo-400" size={20} />
              <h3 className="text-[12px] font-black text-slate-300 uppercase tracking-widest leading-none">System Diagnostics</h3>
           </div>
           <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Thermal Core', value: '18.4°C', color: 'indigo', icon: RefreshCcw },
                { label: 'Network Sync', value: '142 GB/S', color: 'emerald', icon: Zap },
                { label: 'Uptime', value: '100%', color: 'blue', icon: Clock },
                { label: 'Security', value: 'Tier 5', color: 'purple', icon: ShieldCheck },
              ].map((s, i) => (
                <div 
                  key={i} 
                  className="p-8 bg-white/[0.03] border border-white/5 rounded-[40px] hover:border-indigo-500/30 transition-all cursor-pointer group"
                >
                   <s.icon size={20} className="text-slate-600 group-hover:text-white transition-colors mb-6" />
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 leading-none">{s.label}</p>
                   <p className="text-2xl font-black text-white italic">{s.value}</p>
                </div>
              ))}
           </div>
        </section>

        <section className="flex-1 flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <Terminal size={18} className="text-indigo-400" />
                 <h3 className="text-[12px] font-black text-slate-300 uppercase tracking-widest">Neural Logistics Log</h3>
              </div>
              <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Clear</button>
           </div>
           <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-2">
              {[
                { event: 'DEPLOY_BOT_42', time: '14:22', icon: Zap },
                { event: 'RESTOCK_CLUSTER_C', time: '14:15', icon: Package },
                { event: 'AUTH_SUCCESS_ROOT', time: '14:02', icon: ShieldCheck },
                { event: 'SHUTDOWN_AISLE_D', time: '13:58', icon: X },
                { event: 'SCAN_COMPLETE_B', time: '13:45', icon: Activity },
              ].map((ev, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] transition-all group">
                   <div className="flex items-center gap-5">
                      <div className="p-3 bg-white/5 rounded-xl group-hover:bg-indigo-600/50 group-hover:text-white transition-all text-slate-500">
                         <ev.icon size={16} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-black text-white uppercase tracking-tight">{ev.event}</span>
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Timestamp • {ev.time}</span>
                      </div>
                   </div>
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/30 group-hover:bg-indigo-500" />
                </div>
              ))}
           </div>
        </section>
      </aside>

      {/* Futuristic Detail Overlays */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[900]" 
            />
            <DetailModal 
              item={selectedItem} 
              onClose={() => setSelectedItem(null)} 
            />
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }
      `}</style>
    </div>
  )
}
