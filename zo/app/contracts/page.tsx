'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, 
  Clock, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Calendar,
  FileText,
  BadgeCheck,
  CreditCard,
  Download,
  Eye,
  MoreHorizontal,
  Loader2,
  Lock,
  Zap,
  CheckCircle2,
  Trash2,
  ArrowRight
} from 'lucide-react'
import { useToast, ToastContainer } from '@/components/ui/Toast'

type ContractStatus = 'Active' | 'Pending Review' | 'Expiring Soon' | 'Expired' | 'Terminated' | 'Drafting'

interface Contract {
  id: string
  supplier: string
  title: string
  status: ContractStatus
  value: string
  renewalDate: string
  compliance: number // 0-100
  type: 'MSA' | 'SOW' | 'NDA' | 'PO'
}

const MOCK_CONTRACTS: Contract[] = [
  { id: 'CON-092-23', supplier: 'Shenzhen Microchips Ltd.', title: 'Master Supply Agreement - Q3 Components', status: 'Active', value: '$2.4M', renewalDate: '2027-04-15', compliance: 98, type: 'MSA' },
  { id: 'CON-112-24', supplier: 'Flex Logix Singapore', title: 'SOW: Logistics Integration Ph 2', status: 'Expiring Soon', value: '$850K', renewalDate: '2026-05-30', compliance: 100, type: 'SOW' },
  { id: 'CON-005-24', supplier: 'Astra Global Sourcing', title: 'Standard Mutual Non-Disclosure', status: 'Active', value: '-', renewalDate: '2029-01-01', compliance: 100, type: 'NDA' },
  { id: 'CON-245-25', supplier: 'Valiant Steel Works', title: 'Purchase Order #8844 - Raw Materials', status: 'Pending Review', value: '$112K', renewalDate: '2026-12-15', compliance: 85, type: 'PO' },
  { id: 'CON-012-22', supplier: 'TechScribe Outsourcing', title: 'Master Service Agreement - R&D Support', status: 'Expired', value: '$45K/mo', renewalDate: '2026-02-10', compliance: 92, type: 'MSA' },
]

const STATUS_MAP: Record<ContractStatus, { color: string, bg: string, border: string }> = {
  'Active': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  'Pending Review': { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  'Expiring Soon': { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  'Expired': { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  'Terminated': { color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
  'Drafting': { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
}

export default function ContractsDashboard() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'All' | Contract['type']>('All')
  const [exporting, setExporting] = useState(false)
  const { toasts, showToast, removeToast } = useToast()

  const handleApplyFilter = (t: any) => {
    setFilter(t)
  }

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => {
        setExporting(false)
    }, 2000)
  }

  const filteredContracts = MOCK_CONTRACTS.filter(c => {
    const matchesSearch = c.supplier.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || c.type === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-10 animate-fade-in min-h-screen">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-5xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-2 leading-none">
            Contract <span className="text-indigo-400">Vault</span>
          </h1>
          <p className="text-[var(--text-secondary)] opacity-40 max-w-xl text-sm font-medium">
            Immutable AI-monitored repository for global supplier agreements. 
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-4 bg-[var(--bg-1)] hover:bg-[var(--bg-2)] text-[var(--text-primary)] px-8 py-4 rounded-2xl border border-[var(--border)] font-black uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-50 shadow-inner"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {exporting ? 'Syncing...' : 'Export Audit'}
          </button>
          <button 
            onClick={() => {}}
            className="flex items-center gap-4 bg-indigo-600 hover:bg-indigo-500 text-[var(--bg-0)] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Plus size={18} /> New Agreement
          </button>
        </div>
      </div>

      {/* Grid Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="p-8 rounded-[40px] bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 relative overflow-hidden group hover:border-indigo-500/40 transition-all cursor-pointer" onClick={() => {}}>
          <ShieldCheck className="absolute -right-4 -bottom-4 w-40 h-40 text-indigo-500/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          <div className="relative z-10">
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Compliance Rate</div>
            <div className="flex items-end gap-4 mb-6">
              <div className="text-5xl font-black text-[var(--text-primary)] tracking-tighter tabular-nums leading-none">96.8%</div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black border border-emerald-500/20 mb-1">+1.2%</div>
            </div>
            <div className="h-1.5 w-full bg-[var(--bg-1)] rounded-full overflow-hidden shadow-inner">
              <motion.div initial={{ width: 0 }} animate={{ width: '96.8%' }} transition={{ duration: 1 }} className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[40px] bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 relative overflow-hidden group hover:border-orange-500/40 transition-all cursor-pointer" onClick={() => {}}>
          <Clock className="absolute -right-4 -bottom-4 w-40 h-40 text-orange-500/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          <div className="relative z-10">
            <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-6">Expiring Soon</div>
            <div className="text-5xl font-black text-[var(--text-primary)] tracking-tighter mb-4 leading-none tabular-nums">04</div>
            <div className="text-[10px] text-[var(--text-secondary)] opacity-40 font-black uppercase tracking-widest bg-[var(--bg-1)] border border-[var(--border)] rounded px-2 py-0.5 inline-block mb-6">Expiring T-60 Days</div>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-2xl border-2 border-[var(--bg-card)] bg-[var(--bg-1)] flex items-center justify-center text-[10px] font-black text-[var(--text-primary)] shadow-lg overflow-hidden grayscale hover:grayscale-0 transition-all">
                  S{i}
                </div>
              ))}
              <div className="w-10 h-10 rounded-2xl border-2 border-[var(--bg-card)] bg-indigo-600 flex items-center justify-center text-[10px] font-black text-[var(--bg-0)] shadow-lg">
                +2
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[40px] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-all cursor-pointer" onClick={() => {}}>
          <CreditCard className="absolute -right-4 -bottom-4 w-40 h-40 text-emerald-500/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          <div className="relative z-10">
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Total Value</div>
            <div className="text-5xl font-black text-[var(--text-primary)] tracking-tighter mb-4 leading-none tabular-nums">$14.2M</div>
            <div className="text-[10px] text-[var(--text-secondary)] opacity-40 font-black uppercase tracking-widest mb-8">24 Active Agreements</div>
            <div className="flex items-center gap-3 text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 shadow-inner">
              <BadgeCheck className="w-4 h-4" /> Fully Consensus Audited
            </div>
          </div>
        </div>
      </div>

      {/* Main List Table */}
      <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[40px] p-8 shadow-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-10">
          <div className="flex bg-[var(--bg-0)] p-1.5 rounded-2xl border border-[var(--border)]">
            {['All', 'MSA', 'SOW', 'NDA', 'PO'].map(t => (
              <button 
                key={t}
                onClick={() => handleApplyFilter(t)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === t ? 'bg-indigo-600 text-[var(--bg-0)] shadow-lg shadow-indigo-500/20' : 'text-[var(--text-secondary)] opacity-40 hover:text-[var(--text-primary)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-sm">
             <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-[var(--text-secondary)] opacity-40" />
             </div>
             <input 
               type="text" 
               placeholder="Omni-search vault logs..." 
               className="w-full bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider focus:border-indigo-500/50 outline-none transition-colors shadow-inner"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[var(--border)]">
                <th className="pb-6 px-4 text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.2em]">Contract ID</th>
                <th className="pb-6 px-4 text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.2em]">Supplier</th>
                <th className="pb-6 px-4 text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.2em]">Type</th>
                <th className="pb-6 px-4 text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.2em]">Value</th>
                <th className="pb-6 px-4 text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.2em]">Renewal Date</th>
                <th className="pb-6 px-4 text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.2em]">Status</th>
                <th className="pb-6 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredContracts.map((c, idx) => (
                <motion.tr 
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-[var(--bg-2)] transition-colors cursor-pointer"
                  onClick={() => {}}
                >
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--bg-0)] border border-[var(--border)] flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-[var(--bg-0)] transition-all shadow-inner">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight group-hover:text-indigo-400 transition-colors leading-none mb-1.5">{c.title}</div>
                        <div className="text-[10px] font-mono text-[var(--text-secondary)] opacity-40 uppercase tracking-tighter">{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-tight">{c.supplier}</div>
                    <div className="text-[9px] text-[var(--text-secondary)] opacity-40 uppercase font-black tracking-widest mt-1">Verified</div>
                  </td>
                  <td className="py-6 px-4">
                    <span className="px-3 py-1 rounded-lg bg-[var(--bg-1)] text-[9px] font-black text-[var(--text-secondary)] border border-[var(--border)] uppercase tracking-widest">{c.type}</span>
                  </td>
                  <td className="py-6 px-4">
                    <div className="text-sm font-black text-[var(--text-primary)] tabular-nums tracking-tighter">{c.value}</div>
                    <div className="text-[9px] text-[var(--text-secondary)] opacity-40 uppercase font-black tracking-widest mt-1">USD BASE</div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-secondary)] opacity-40 uppercase">
                      <Calendar size={12} className="text-[var(--text-secondary)] opacity-40" />
                      {new Date(c.renewalDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-inner ${STATUS_MAP[c.status].color} ${STATUS_MAP[c.status].bg} ${STATUS_MAP[c.status].border}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                      {c.status}
                    </div>
                  </td>
                   <td className="py-6 px-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-3 bg-[var(--bg-2)] rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-indigo-400 hover:bg-indigo-600/10 transition-all"
                      >
                        <Lock size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-3 bg-[var(--bg-2)] rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-indigo-400 transition-all shadow-lg"
                      >
                         <Eye size={16} />
                      </button>
                      <button className="p-3 bg-[var(--bg-2)] rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-indigo-400 transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
