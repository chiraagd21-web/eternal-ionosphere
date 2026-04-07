'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Truck, 
  Package, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Zap,
  Boxes
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'

export default function LogisticsPage() {
  const { shipments, receiveShipment } = useAppStore()
  const { showToast } = useToast()

  const inTransit = shipments.filter(s => s.status === 'In Transit')
  const completed = shipments.filter(s => s.status === 'Delivered')

  const handleReceive = (id: string) => {
    receiveShipment(id)
    showToast(`Shipment ${id} received into inventory`, 'success')
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] p-12 font-sans selection:bg-indigo-100">
      
      {/* Header */}
      <header className="mb-16">
        <div className="flex items-center gap-4 mb-4">
           <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">Global Ops</span>
           <span className="text-[10px] font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">Control Center</span>
        </div>
        <h1 className="text-6xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-2">Logistics Hub</h1>
        <p className="text-sm font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">Real-time supply chain synchronization</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
        
        {/* SHIPMENT LIST */}
        <section className="space-y-8">
           <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border)]">
              <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-3">
                 <Truck className="text-indigo-600" /> Incoming Shipments
              </h2>
              <span className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.2em]">{inTransit.length} Active Flow Nodes</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                 {inTransit.map(shipment => (
                    <motion.div 
                      key={shipment.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-[var(--bg-1)] rounded-[2.5rem] border border-[var(--border)] p-8 shadow-soft relative overflow-hidden group hover:shadow-2xl transition-all"
                    >
                       <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                          <Truck size={120} />
                       </div>

                       <div className="flex items-center justify-between mb-8">
                          <div className="bg-indigo-50/10 text-indigo-400 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 flex items-center gap-2">
                             <Clock size={14} /> ETA: {new Date(shipment.eta).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                          <span className="text-[10px] font-bold text-[var(--text-secondary)] opacity-10 uppercase tracking-widest">ID: {shipment.id}</span>
                       </div>

                       <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter mb-4 capitalize">{shipment.supplier}</h3>
                       
                       <div className="space-y-4 mb-10">
                          {shipment.items.map((item, i) => (
                             <div key={i} className="flex items-center justify-between p-4 bg-[var(--bg-2)] rounded-2xl border border-[var(--border)]">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-xl bg-[var(--bg-1)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] opacity-40 shadow-inner">
                                      <Package size={14} />
                                   </div>
                                   <span className="text-xs font-black text-[var(--text-secondary)] uppercase">{item.name}</span>
                                </div>
                                <span className="text-sm font-black text-indigo-400">+{item.qty} UNITS</span>
                             </div>
                          ))}
                       </div>

                       <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--text-secondary)] opacity-40 mb-8 px-2 uppercase tracking-widest">
                          <div className="flex items-center gap-2"><MapPin size={12} /> {shipment.origin}</div>
                          <ArrowRight size={12} className="text-[var(--text-secondary)] opacity-20" />
                          <div className="flex items-center gap-2">{shipment.destination}</div>
                       </div>

                       <button 
                         onClick={() => handleReceive(shipment.id)}
                         className="w-full bg-slate-900 border border-slate-800 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-600 transition-all active:scale-[0.98]"
                       >
                          <CheckCircle2 size={18} /> Receive into Inventory
                       </button>
                    </motion.div>
                 ))}
              </AnimatePresence>

              {inTransit.length === 0 && (
                 <div className="col-span-full py-20 border-2 border-dashed border-[var(--border)] rounded-[3rem] flex flex-col items-center justify-center gap-6">
                    <Zap size={48} className="text-[var(--text-secondary)] opacity-20" />
                    <span className="text-sm font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.3em]">No Active Replenishment Nodes</span>
                 </div>
              )}
           </div>
        </section>

        {/* SIDEBAR: METRICS & HISTORY */}
        <aside className="space-y-8">
           <section className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[2.5rem] p-8 shadow-soft">
              <h3 className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.2em] mb-8">Supply Chain Health</h3>
              <div className="space-y-6">
                 <HealthCard label="Neural Predictability" value="98.2%" icon={ShieldCheck} color="text-indigo-600" />
                 <HealthCard label="On-Time Delivery" value="94.5%" icon={Clock} color="text-emerald-600" />
                 <HealthCard label="Global In-Transit" value={`${inTransit.length}`} icon={Truck} color="text-blue-600" />
              </div>
           </section>

           <section className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[2.5rem] p-8 shadow-soft">
              <h3 className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.2em] mb-8">Recently Synchronized</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                 {completed.map(s => (
                    <div key={s.id} className="flex flex-col gap-2 p-4 bg-[var(--bg-2)] rounded-2xl border border-[var(--border)]">
                       <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Completed</span>
                          <span className="text-[9px] font-bold text-[var(--text-secondary)] opacity-20">{s.id}</span>
                       </div>
                       <div className="text-xs font-black text-[var(--text-primary)] uppercase">{s.supplier}</div>
                       <div className="text-[9px] text-[var(--text-secondary)] opacity-40 font-bold uppercase tracking-widest">ETA Met Index: 99.1%</div>
                    </div>
                 ))}
                 {completed.length === 0 && <span className="text-[9px] text-[var(--text-secondary)] opacity-40 uppercase font-bold text-center block">No Synchronization Records</span>}
              </div>
           </section>
        </aside>

      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
      `}</style>
    </div>
  )
}

function HealthCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer p-2 hover:bg-[var(--bg-2)] rounded-2xl transition-all shadow-soft">
       <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] shadow-inner flex items-center justify-center ${color}`}>
             <Icon size={20} />
          </div>
          <div className="flex flex-col">
             <span className="text-[9px] font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">{label}</span>
             <span className="text-lg font-black text-[var(--text-primary)] tracking-tighter">{value}</span>
          </div>
       </div>
       <ArrowRight size={16} className="text-gray-200 group-hover:translate-x-1 group-hover:text-gray-400 transition-all" />
    </div>
  )
}
