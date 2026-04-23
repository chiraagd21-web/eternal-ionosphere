'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, Activity, Zap, Cpu,
  Package, Boxes, ArrowUpRight, 
  Bell, ShieldCheck, DollarSign,
  Briefcase, BarChart3, Globe,
  Search, Filter, ChevronRight, Mic, MapPin, Clock
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { JarvisOrb } from '@/components/JarvisOrb'

export default function DashboardPage() {
  const { 
    inventory, recommendations, executeRecommendation, 
    aiStatus, lastVoiceCommand, sales 
  } = useAppStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const inventoryValue = useMemo(() => 
    inventory.reduce((a, s) => a + (s.qtyOnHand * (s.price || 0)), 0), 
  [inventory])

  const pendingRecs = useMemo(() => 
    recommendations.filter(r => r.status === 'pending'), 
  [recommendations])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#FCFAF6] p-8 lg:p-16 font-sans">
      
      {/* NYC HUB HEADER */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-20">
        <div>
           <div className="flex items-center gap-4 mb-6">
              <div className={`w-3 h-3 rounded-full ${aiStatus === 'idle' ? 'bg-[#20808D]' : 'bg-rose-500 animate-pulse'} `} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                {aiStatus === 'idle' ? 'NYC Hub Synchronized' : 'Neural Processing...'}
              </span>
           </div>
           <h1 className="text-5xl md:text-8xl font-black text-[#091717] tracking-tighter uppercase italic leading-none">LES Control</h1>
           <div className="flex items-center gap-3 mt-6 text-slate-400">
              <MapPin size={14} className="text-[#20808D]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Lower East Side, Manhattan</span>
              <div className="w-1 h-1 rounded-full bg-slate-200 mx-2" />
              <Clock size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Live Operations</span>
           </div>
        </div>
        
        <AnimatePresence>
           {lastVoiceCommand && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-2xl flex items-center gap-6 max-w-md"
             >
                <div className="w-12 h-12 bg-slate-950 text-white rounded-full flex items-center justify-center shrink-0">
                   <Mic size={20} />
                </div>
                <div>
                   <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Neural Command Received</div>
                   <div className="text-sm font-bold text-slate-950 italic">"{lastVoiceCommand}"</div>
                </div>
             </motion.div>
           )}
        </AnimatePresence>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
         {[
           { label: 'Shop Valuation', value: `$${((inventoryValue || 0)/1000).toFixed(1)}k`, icon: DollarSign, color: 'text-emerald-600', trend: 'Healthy' },
           { label: 'Active Protocols', value: pendingRecs.length, icon: Zap, color: 'text-amber-500', trend: 'Priority' },
           { label: 'NYC Sales', value: sales.length, icon: TrendingUp, color: 'text-blue-500', trend: 'Live' },
           { label: 'Carrier Status', value: '4 Active', icon: Globe, color: 'text-[#20808D]', trend: 'In-Transit' },
         ].map((stat, i) => (
           <motion.div 
             key={stat.label}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative"
           >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                   <div className={`w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform shadow-sm`}>
                      <stat.icon size={24} />
                   </div>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{stat.trend}</span>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</div>
                <div className="text-4xl font-black text-[#091717] tracking-tight">{stat.value}</div>
              </div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
         <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black text-[#091717] tracking-tight uppercase italic">Intelligence Protocols</h2>
               <div className="h-px flex-1 mx-10 bg-slate-100" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <AnimatePresence mode="popLayout">
                  {pendingRecs.length === 0 ? (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full py-20 text-center opacity-20 border-2 border-dashed border-slate-100 rounded-[3rem]"
                    >
                       <ShieldCheck size={48} className="mx-auto mb-6" />
                       <p className="text-xs font-black uppercase tracking-widest">All NYC Nodes Balanced</p>
                    </motion.div>
                  ) : (
                    pendingRecs.map((rec) => (
                      <motion.div 
                        key={rec.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, x: -20 }}
                        className="bg-white border border-slate-100 rounded-[3rem] p-10 flex flex-col justify-between hover:shadow-2xl transition-all border-l-4 border-l-[#20808D]"
                      >
                         <div>
                            <div className="flex justify-between items-start mb-8">
                               <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${
                                 rec.type === 'reorder' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                               }`}>
                                 {rec.type} Alert
                               </span>
                               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">ID_{rec.id}</span>
                            </div>
                            <h4 className="text-xl font-black text-[#091717] tracking-tight mb-4 leading-none">{rec.title}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed mb-10">{rec.description}</p>
                         </div>
                         <button 
                           onClick={() => executeRecommendation(rec.id)}
                           className="w-full h-16 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#20808D] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                         >
                           Resolve Action <ChevronRight size={14} />
                         </button>
                      </motion.div>
                    ))
                  )}
               </AnimatePresence>
            </div>
         </div>

         {/* NYC OPERATIONAL LOG */}
         <div className="space-y-10">
            <h2 className="text-2xl font-black text-[#091717] tracking-tight uppercase italic">Operational Pulse</h2>
            <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm min-h-[500px]">
               <div className="space-y-10">
                  <AnimatePresence mode="popLayout">
                    {sales.slice(0, 4).map((sale, i) => (
                      <motion.div 
                        key={sale.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-6 items-start"
                      >
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 animate-pulse" />
                         <div>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            <div className="text-sm font-black text-slate-950">NYC Transaction Logged</div>
                            <div className="text-xs text-slate-400 mt-1">Processed {sale.items.length} NYC Assets. Total: ${(sale.total || 0).toFixed(2)}</div>
                         </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {recommendations.slice(0, 2).map((rec, i) => (
                    <div key={rec.id} className="flex gap-6 items-start opacity-60">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#20808D] mt-2 shrink-0" />
                       <div>
                          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Intelligence Protocol</div>
                          <div className="text-sm font-bold text-slate-950">{rec.title}</div>
                          <div className="text-xs text-slate-400 mt-1">Status: {rec.status}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <JarvisOrb />
    </div>
  )
}
