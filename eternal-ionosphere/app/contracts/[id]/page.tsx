'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Download, 
  History, 
  Lock,
  ChevronRight,
  AlertTriangle,
  CreditCard,
  Target
} from 'lucide-react'
import Link from 'next/link'

export default function ContractDetailPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState<'Overview' | 'Timeline' | 'Clauses'>('Overview')

  return (
    <div className="p-8 animate-fade-in max-w-7xl mx-auto">
      {/* Top Nav */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/contracts" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 group transition-all">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{id}</span>
            <span className="badge badge-success">ACTIVE AGREEMENT</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Master Supply Agreement - Q3 Components</h1>
        </div>
        <div className="ml-auto flex gap-3">
          <button className="btn-secondary h-11 flex items-center gap-2">
            <History className="w-4 h-4" /> Version History
          </button>
          <button className="btn-primary h-11 flex items-center gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            {['Overview', 'Timeline', 'Clauses'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="contract-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_8px_indigo]" />
                )}
              </button>
            ))}
          </div>

          <div className="card space-y-8 border-white/5 bg-white/[0.01]">
            <div className="grid grid-cols-2 gap-8 pb-8 border-b border-white/5">
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Contracting Parties</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">P</div>
                    <div>
                      <div className="text-sm font-bold text-white">ProcureAI Corp.</div>
                      <div className="text-[10px] text-slate-500">Legal Entity • Buyer</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">S</div>
                    <div>
                      <div className="text-sm font-bold text-white">Shenzhen Microchips Ltd.</div>
                      <div className="text-[10px] text-slate-500">Legal Entity • Supplier</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Financial Terms</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[9px] text-slate-500 uppercase font-black">Estimated Value</div>
                    <div className="text-sm font-bold text-white">$2.4M</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[9px] text-slate-500 uppercase font-black">Payment Term</div>
                    <div className="text-sm font-bold text-white">Net-60</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Compliance Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Quality Audit', status: 'Passed', icon: ShieldCheck, color: 'text-emerald-400' },
                  { label: 'Insurance Cert', status: 'Valid', icon: FileText, color: 'text-emerald-400' },
                  { label: 'Security Review', status: 'In Review', icon: Lock, color: 'text-amber-400' },
                ].map(c => (
                  <div key={c.label} className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center gap-3">
                    <c.icon className={`w-5 h-5 ${c.color}`} />
                    <div>
                      <div className="text-xs font-bold text-white">{c.label}</div>
                      <div className={`text-[10px] font-bold uppercase ${c.color}`}>{c.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card border-orange-500/20 bg-orange-500/5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-400" /> Lifecycle Info
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Effective Date</span>
                <span className="text-white font-bold">Jan 12, 2024</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Renew By</span>
                <span className="text-orange-400 font-bold">Mar 15, 2027</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-4 border-t border-white/5">
                <span className="text-slate-400">Days to Renewal</span>
                <span className="text-2xl font-bold text-white">422</span>
              </div>
              <button className="w-full btn-secondary text-xs uppercase tracking-widest font-black py-3 border-orange-500/20 hover:bg-orange-500/10">
                Initiate Renewal
              </button>
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="text-sm font-bold text-white">Smart Summary</h3>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              AI analysis suggests this agreement's price adjustment clause is tied to the PPI (Producer Price Index). Current trends indicate a possible 3.2% increase in the next quarter.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest animate-pulse">
              <Target className="w-3 h-3" /> Negotiation Opportunity
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
