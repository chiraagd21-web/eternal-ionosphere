'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  Users,
  BarChart3,
  FileSearch,
  Zap,
  ShieldCheck,
  FileText,
  FileDown
} from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

type RFxStatus = 'Drafting' | 'Published' | 'Bid Evaluation' | 'Negotiating' | 'Awarded' | 'Closed'
type RFxType = 'RFI' | 'RFP' | 'RFQ'

interface RFxEvent {
  id: string
  title: string
  type: RFxType
  status: RFxStatus
  suppliers: number
  responses: number
  deadline: string
  value?: string
  priority: 'High' | 'Medium' | 'Low'
}

const MOCK_EVENTS: RFxEvent[] = [
  { id: 'RFX-001', title: 'Q3 Semiconductor Supply', type: 'RFQ', status: 'Bid Evaluation', suppliers: 5, responses: 3, deadline: '2026-04-15', value: '$1.2M', priority: 'High' },
  { id: 'RFX-002', title: 'Sustainable Packaging Options', type: 'RFI', status: 'Published', suppliers: 12, responses: 8, deadline: '2026-03-30', priority: 'Medium' },
  { id: 'RFX-003', title: 'Cloud Infrastructure Migration', type: 'RFP', status: 'Negotiating', suppliers: 3, responses: 3, deadline: '2026-03-22', value: '$450K', priority: 'High' },
  { id: 'RFX-004', title: 'Office Furniture Refurbishment', type: 'RFQ', status: 'Drafting', suppliers: 0, responses: 0, deadline: '2026-05-10', value: '$85K', priority: 'Low' },
  { id: 'RFX-005', title: 'Logistics Partner - EU Region', type: 'RFP', status: 'Awarded', suppliers: 4, responses: 4, deadline: '2026-03-10', value: '$2.1M', priority: 'High' },
]

const STATUS_COLORS: Record<RFxStatus, string> = {
  'Drafting': 'text-gray-500 bg-gray-50 border-gray-100',
  'Published': 'text-blue-500 bg-blue-50 border-blue-100',
  'Bid Evaluation': 'text-amber-500 bg-amber-50 border-amber-100',
  'Negotiating': 'text-indigo-500 bg-indigo-50 border-indigo-100',
  'Awarded': 'text-emerald-500 bg-emerald-50 border-emerald-100',
  'Closed': 'text-gray-400 bg-gray-50 border-gray-100',
}

export default function RFxDashboard() {
  const [activeTab, setActiveTab] = useState<'All' | RFxType>('All')
  const [search, setSearch] = useState('')
  const [invited, setInvited] = useState(false)
  const { showToast } = useToast()

  const filteredEvents = MOCK_EVENTS.filter(e => {
    const matchesTab = activeTab === 'All' || e.type === activeTab
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="p-8 lg:p-12 animate-fade-in min-h-screen bg-bg-0 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary">RFx Manager</h1>
          <p className="text-text-muted mt-2 text-sm max-w-xl">
            Strategic control center for unified Information, Proposals, and Quotations. 
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/rfx/new" 
            className="btn-primary flex items-center gap-2 px-8 py-4"
          >
            <Plus size={18} /> New Event
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Events', value: '12', icon: Zap, color: 'blue', trend: '+2 this week' },
          { label: 'Pending Bids', value: '48', icon: Clock, color: 'amber', trend: '14 required' },
          { label: 'Total Value', value: '$8.4M', icon: BarChart3, color: 'emerald', trend: '+12% MoM' },
          { label: 'Avg. Savings', value: '18.4%', icon: ShieldCheck, color: 'indigo', trend: 'AI Optimized' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-500 shadow-sm border border-${stat.color}-100`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest bg-bg-2 px-2 py-1 rounded-lg">{stat.trend}</span>
            </div>
            <div className="text-3xl font-bold tracking-tight text-text-primary mb-1">{stat.value}</div>
            <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Sidebar Controls */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 px-2">Templates</h3>
            {[
              { label: 'Discovery RFI', icon: FileSearch, desc: 'Information gathering' },
              { label: 'Technical RFP', icon: FileText, desc: 'Complex proposals' },
              { label: 'Quick RFQ', icon: Zap, desc: 'Pricing quotes' },
            ].map((t) => (
              <button 
                key={t.label} 
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-bg-2 border border-transparent hover:border-border transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-bg-3 border border-border flex items-center justify-center group-hover:bg-brand/10 transition-all">
                  <t.icon className="w-5 h-5 text-text-muted group-hover:text-brand" />
                </div>
                <div>
                   <div className="text-xs font-bold text-text-primary uppercase tracking-tight group-hover:text-brand transition-colors">{t.label}</div>
                   <div className="text-[9px] text-text-muted font-medium uppercase tracking-widest mt-0.5">{t.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-8 rounded-[2.5rem] bg-[var(--brand)] text-white shadow-2xl shadow-brand/20 relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/10 blur-3xl rounded-full" />
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
              <Zap className="w-4 h-4 text-emerald-300 fill-emerald-300" /> AI Insights
            </h3>
            <p className="text-xs font-medium leading-relaxed mb-8 opacity-90 text-white">
              Low engagement on "Q3 Semiconductor". Invite 3 tier-1 suppliers now.
            </p>
            <button 
              onClick={() => setInvited(true)}
              className={`w-full py-4 text-[10px] font-bold uppercase tracking-widest rounded-2xl transition-all ${invited ? 'bg-emerald-500/20 text-emerald-100 flex items-center justify-center gap-2' : 'bg-[var(--bg-0)] text-[var(--text-primary)] hover:bg-[var(--bg-1)] active:scale-95 shadow-lg'}`}
            >
              {invited ? <><CheckCircle2 size={16} /> Syncing Shortlist...</> : 'Sync Invitations'}
            </button>
          </div>
        </aside>

        {/* Main Feed */}
        <div className="lg:col-span-9 space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex bg-bg-2 p-1.5 rounded-2xl border border-border">
              {['All', 'RFI', 'RFP', 'RFQ'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab 
                      ? 'bg-[var(--bg-0)] text-[var(--brand)] border border-[var(--border)] shadow-sm' 
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="relative flex-1 max-w-sm group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-brand transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search events..." 
                 className="w-full bg-bg-2 border border-border rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/30 transition-all"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
            
            <button className="p-3 bg-[var(--bg-2)] border border-[var(--border)] rounded-xl text-[var(--text-muted)] hover:text-[var(--brand)] transition-all shadow-sm">
               <FileDown size={20} />
            </button>
          </div>

          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-panel group relative hover:border-brand/40 overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-8 py-2">
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-xs shadow-sm border ${
                        event.type === 'RFQ' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        event.type === 'RFP' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                      }`}>
                         <span className="text-[8px] opacity-40 uppercase tracking-tighter">#{event.id.split('-')[1]}</span>
                         <span className="mt-1">{event.type}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{event.id}</span>
                          {event.priority === 'High' && (
                            <span className="px-2 py-0.5 rounded-lg bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest ring-1 ring-inset ring-red-600/10">Urgent</span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-text-primary uppercase tracking-tight truncate group-hover:text-brand transition-colors">{event.title}</h3>
                        
                        <div className="flex flex-wrap items-center gap-6 mt-4">
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${STATUS_COLORS[event.status]}`}>
                            {event.status}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-widest">
                            <Users size={14} className="opacity-40" />
                            {event.responses} / {event.suppliers} Responses
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-widest">
                            <Clock size={14} className="opacity-40" />
                            {new Date(event.deadline).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      {event.value && (
                        <div className="text-right hidden sm:block">
                           <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Value</div>
                           <div className="text-xl font-bold tracking-tight text-text-primary">{event.value}</div>
                        </div>
                      )}
                      <button className="w-12 h-12 rounded-2xl bg-[var(--bg-2)] border border-[var(--border)] text-[var(--text-secondary)] opacity-40 hover:bg-[var(--brand)] hover:text-white transition-all group-hover:border-[var(--brand)]/20 active:scale-95 shadow-sm">
                        <ArrowUpRight size={20} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-bg-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(event.responses / (event.suppliers || 1)) * 100}%` }}
                      className={`h-full ${event.status === 'Awarded' ? 'bg-emerald-400' : 'bg-brand'}`}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
