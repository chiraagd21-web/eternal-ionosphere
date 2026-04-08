'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, Activity, Clock, CheckCircle2,
  Package, LayoutGrid, MoreHorizontal, List, CheckSquare, Users,
  BarChart3, LineChart as LineIcon, PieChart as PieIcon,
  Search, ShieldCheck, Box, Zap, Globe, FileText, 
  Cpu, CreditCard, Share2, Terminal, Briefcase
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { useAppStore } from '@/lib/store'
import { JarvisOrb } from '@/components/JarvisOrb'

// --- High-Density Hub Data ---
const DEMAND_DATA = [
  { name: 'W1', actual: 400, pred: 440 },
  { name: 'W2', actual: 300, pred: 320 },
  { name: 'W3', actual: 500, pred: 480 },
  { name: 'W4', actual: 280, pred: 310 },
  { name: 'W5', actual: 590, pred: 610 },
]

const FINANCIAL_DATA = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 210 },
  { name: 'Wed', value: 180 },
  { name: 'Thu', value: 340 },
  { name: 'Fri', value: 290 },
]

const RFX_STATS = [
  { label: 'Active Bids', value: 14, trend: '+2' },
  { label: 'Shortlisted', value: 38, trend: '+5' },
  { label: 'Savings', value: '$242k', trend: '8.2%' },
]

export default function DashboardPage() {
  const { inventory, shipments, zones } = useAppStore()

  // Cross-App Derived KPIs
  const inventoryValue = useMemo(() => inventory.reduce((a, s) => a + (s.qtyOnHand * s.price), 0), [inventory])
  const transitCount = useMemo(() => shipments.filter(s => s.status !== 'Delivered').length, [shipments])

  return (
    <div className="min-h-screen w-full bg-[var(--bg-0)] p-6 lg:p-10 font-sans overflow-y-auto custom-scrollbar">
      
      {/* PERSISTENT HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
           <div className="text-[10px] font-black text-[var(--brand)] uppercase tracking-[0.2em] mb-2 px-1">Global Intelligence</div>
           <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter">Executive Hub</h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex bg-[var(--bg-2)] shadow-soft-sm rounded-2xl p-1.5 border border-[var(--border)]">
              <div className="px-4 py-2 bg-[var(--brand)]/10 text-[var(--brand)] rounded-xl text-xs font-bold">Standard</div>
              <div className="px-4 py-2 text-[var(--text-secondary)] opacity-40 text-xs font-bold cursor-pointer hover:text-[var(--text-primary)] transition-colors">Advanced AI</div>
           </div>
           <button className="relative w-12 h-12 bg-[var(--bg-2)] rounded-2xl shadow-soft-sm border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] opacity-40 hover:text-[var(--brand)] transition-all group">
              <Zap size={20} className="group-hover:fill-[var(--brand)] transition-all" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[var(--bg-2)]" />
           </button>
        </div>
      </header>
      
      {/* THE SUPER-BENTO GRID (Everything in the Menu) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* ROW 1: CORE SOURCE METRICS (Global Search & RFx) */}
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-2 bg-[var(--bg-2)] rounded-[2.5rem] p-8 border border-[var(--border)] shadow-soft flex flex-col justify-between">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500 text-[var(--bg-0)] rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20"><Search size={18} /></div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">RFX & Sourcing Intelligence</h3>
               </div>
               <MoreHorizontal size={18} className="text-[var(--text-secondary)] opacity-30" />
            </div>
           <div className="grid grid-cols-3 gap-6">
              {RFX_STATS.map((stat, i) => (
                <div key={i} className="space-y-1">
                   <div className="text-[10px] font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">{stat.label}</div>
                   <div className="text-2xl font-black text-[var(--text-primary)] tracking-tight">{stat.value}</div>
                   <div className="text-[10px] font-bold text-emerald-500">{stat.trend} week</div>
                </div>
              ))}
           </div>
        </motion.div>

         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-[var(--bg-2)] rounded-[2.5rem] p-8 border border-[var(--border)] shadow-soft">
            <div className="w-10 h-10 bg-emerald-500 text-[var(--bg-0)] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6"><Globe size={18} /></div>
            <div className="text-3xl font-black text-[var(--text-primary)] tracking-tighter mb-1">{transitCount}</div>
            <div className="text-[10px] font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-6">Logistics Activity</div>
            <div className="flex gap-1 h-8 items-end">
               {[40,70,30,90,50,80,60].map((h, i) => (
                 <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="flex-1 bg-emerald-500/20 rounded-sm" />
               ))}
            </div>
         </motion.div>

        {/* ROW 2: PREDICTIVE OPS (Forecasting) */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-[var(--bg-2)] rounded-[3rem] p-10 border border-[var(--border)] shadow-soft">
            <div className="flex justify-between items-center mb-10">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 text-[var(--bg-0)] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20"><LineIcon size={18} /></div>
                  <div>
                     <h3 className="text-sm font-bold text-[var(--text-primary)]">Predictive Operations</h3>
                     <p className="text-[10px] font-medium text-[var(--text-secondary)] opacity-40">Demand vs. Inventory Forecast</p>
                  </div>
               </div>
            </div>
            <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={DEMAND_DATA}>
                     <defs>
                       <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.1}/>
                         <stop offset="95%" stopColor="var(--brand)" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <Area type="monotone" dataKey="pred" stroke="var(--brand)" strokeWidth={3} fill="url(#colorPred)" />
                     <Line type="step" dataKey="actual" stroke="var(--text-secondary)" strokeDasharray="5 5" strokeWidth={2} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </motion.div>

        {/* ROW 2: FINANCE HUB */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[var(--bg-2)] rounded-[3rem] p-10 border border-[var(--border)] shadow-soft">
            <div className="w-10 h-10 bg-amber-500 text-[var(--bg-0)] rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-8"><CreditCard size={18} /></div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">Finance Hub</h3>
            <div className="text-3xl font-black text-[var(--text-primary)] tracking-tighter mb-6">${(inventoryValue / 1000).toFixed(1)}k</div>
           <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-40">
                 <span>Savings Velocity</span>
                 <span className="text-emerald-500">+14%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--bg-0)] rounded-full overflow-hidden">
                 <div className="h-full w-[65%] bg-amber-500 rounded-full" />
              </div>
           </div>
        </motion.div>

        {/* ROW 2: OUTBOUND FLOW */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[var(--bg-card)] rounded-[3rem] p-10 shadow-xl flex flex-col justify-between">
           <div>
              <Box size={24} className="text-indigo-400 mb-6" />
              <div className="text-2xl font-black tracking-tight mb-1 text-[var(--text-primary)]">Outbound</div>
              <p className="text-xs text-[var(--text-secondary)] opacity-40">Deployment workflow active</p>
           </div>
           <div className="flex items-center justify-between mt-8">
              <div className="flex -space-x-2">
                 {[1,2].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--bg-card)] bg-[var(--bg-0)]" />)}
              </div>
              <button className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center hover:bg-indigo-400 transition-colors text-[var(--bg-0)]">
                 <Zap size={16} />
              </button>
           </div>
        </motion.div>

        {/* ROW 3: CONTRACT VAULT & SYSTEM KERNEL */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] p-10 text-[var(--bg-0)] flex flex-col md:flex-row gap-10">
           <div className="flex-1">
              <FileText className="mb-6 opacity-40 text-[var(--bg-0)]" />
              <h3 className="text-xl font-bold mb-4 text-[var(--bg-0)]">Contract Vault</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs border-b border-[var(--bg-0)]/10 pb-4 text-[var(--bg-0)]">
                    <span className="opacity-60">Expiring in 30d</span>
                    <span className="font-bold">12 Active</span>
                 </div>
                 <div className="flex justify-between items-center text-xs text-[var(--bg-0)]">
                    <span className="opacity-60">Pending Signature</span>
                    <span className="font-bold">4 Requests</span>
                 </div>
              </div>
           </div>
           <div className="flex-1 bg-[var(--bg-0)]/10 backdrop-blur-xl rounded-[2rem] p-8 border border-[var(--bg-0)]/10 text-[var(--bg-0)]">
              <Terminal size={18} className="mb-4 opacity-60 text-[var(--bg-0)]" />
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[var(--bg-0)]">Integrations Hub</h4>
              <div className="space-y-3">
                 {['API Sync', 'Cloud DB', 'Edge Nodes'].map(s => (
                   <div key={s} className="flex items-center justify-between px-4 py-2 bg-[var(--bg-0)]/5 rounded-xl border border-[var(--bg-0)]/5 text-[10px] font-bold text-[var(--bg-0)]">
                      <span>{s}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                   </div>
                 ))}
              </div>
           </div>
        </motion.div>

        {/* ROW 3: SYSTEM KERNEL STATUS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-[var(--bg-2)] rounded-[3rem] p-10 border border-[var(--border)] shadow-soft">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[var(--bg-1)] border border-[var(--border)] text-[var(--text-secondary)] opacity-40 rounded-2xl flex items-center justify-center shadow-inner"><Briefcase size={18} /></div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">System Kernel</h3>
           </div>
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="text-4xl font-black text-[var(--text-primary)]">100%</div>
                 <div className="text-[10px] font-bold text-emerald-500 uppercase">Uptime</div>
              </div>
              <div className="p-4 bg-[var(--bg-0)] rounded-2xl border border-[var(--border)] italic text-[10px] text-[var(--text-secondary)] opacity-40 shadow-inner">
                 &quot;All systems operational. No active critical kernel exceptions.&quot;
              </div>
           </div>
        </motion.div>

        {/* ROW 3: TEAM ACTIVITY */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-[var(--bg-2)] rounded-[3rem] p-10 border border-[var(--border)] shadow-soft">
           <h3 className="text-xs font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-6">Active Operators</h3>
           <div className="flex flex-col gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[var(--bg-1)] border border-[var(--border)]" />
                   <div>
                      <div className="text-[10px] font-bold text-[var(--text-primary)]">Operator #{100+i}</div>
                      <div className="text-[9px] text-[var(--text-secondary)] opacity-40">Modifying Pricing Logic</div>
                   </div>
                </div>
              ))}
           </div>
        </motion.div>

      </div>
      
      <JarvisOrb />
    </div>
  )
}
