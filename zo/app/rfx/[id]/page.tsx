'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Users, 
  ChevronRight, 
  MoreVertical,
  Download,
  Share2,
  Zap,
  ShieldCheck,
  Package,
  ArrowUpRight,
  TrendingDown,
  Info,
  X,
  MessageSquare,
  FileCheck,
  Scale,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react'
import Link from 'next/link'

interface Bid {
  id: string
  supplier: string
  score: number
  price: string
  leadTime: string
  validity: string
  compliance: 'Full' | 'Partial' | 'Action Needed'
  status: 'Received' | 'Evaluating' | 'Shortlisted' | 'Awarded'
}

const MOCK_BIDS: Bid[] = [
  { id: 'BID-001', supplier: 'Shenzhen Microchips Ltd.', score: 96, price: '$1,124,000', leadTime: '12 weeks', validity: '90 days', compliance: 'Full', status: 'Evaluating' },
  { id: 'BID-002', supplier: 'Flex Logix Singapore', score: 89, price: '$1,340,000', leadTime: '8 weeks', validity: '60 days', compliance: 'Full', status: 'Shortlisted' },
  { id: 'BID-003', supplier: 'Global Component Hub', score: 82, price: '$1,080,000', leadTime: '16 weeks', validity: '30 days', compliance: 'Partial', status: 'Received' },
]

export default function RFxDetailPage() {
  const { id } = useParams()
  const [activeView, setActiveView] = useState<'Comparison' | 'Details' | 'Documents'>('Comparison')
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
  const [showAwardModal, setShowAwardModal] = useState(false)
  const [showNegotiateModal, setShowNegotiateModal] = useState(false)
  const [isAwarding, setIsAwarding] = useState(false)
  const [awardedId, setAwardedId] = useState<string | null>(null)

  const handleAward = (bid: Bid) => {
    setSelectedBid(bid)
    setShowAwardModal(true)
  }

  const handleNegotiate = (bid: Bid) => {
    setSelectedBid(bid)
    setShowNegotiateModal(true)
  }

  const confirmAward = () => {
    setIsAwarding(true)
    setTimeout(() => {
      setIsAwarding(false)
      setAwardedId(selectedBid?.id || null)
      setShowAwardModal(false)
    }, 2000)
  }

  return (
    <div className="p-10 animate-fade-in max-w-[1400px] mx-auto min-h-screen bg-[var(--bg-0)] text-[var(--text-primary)] pb-20">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500 blur-[200px]" />
      </div>
 
      {/* Top Nav */}
      <div className="flex items-center gap-6 mb-12 relative z-10">
        <Link href="/rfx" className="w-12 h-12 rounded-[20px] bg-[var(--bg-1)] hover:bg-[var(--bg-2)] flex items-center justify-center text-[var(--text-secondary)] opacity-40 group transition-all border border-[var(--border)] shadow-xl backdrop-blur-md">
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-mono text-[var(--text-secondary)] opacity-20 font-black tracking-widest uppercase">{id}</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-500/10 rounded-md border border-indigo-500/20 shadow-sm">
               <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
               <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">RFQ LIVE</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter uppercase leading-none">Q3 Semiconductor <span className="text-indigo-400">Registry</span></h1>
        </div>
        <div className="ml-auto flex gap-4">
          <button className="h-12 px-6 bg-[var(--bg-1)] hover:bg-[var(--bg-2)] border border-[var(--border)] rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
            <Share2 className="w-4 h-4 text-indigo-400" /> Share Access
          </button>
          <button className="h-12 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(99,102,241,0.2)] active:scale-95">
            <Download className="w-4 h-4" /> Technical Dossier
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 relative z-10">
        {[
          { label: 'Total Responses', value: '03', icon: Users, sub: 'from 5 invited', color: 'indigo' },
          { label: 'Redline Bid', value: '$1.08M', icon: TrendingDown, sub: 'Global Component Hub', color: 'rose' },
          { label: 'Quality Floor', value: '96/100', icon: Zap, sub: 'Shenzhen Microchips', color: 'amber' },
          { label: 'Delta Target', value: '14.2%', icon: BarChart3, sub: 'vs Market Average', color: 'emerald' },
        ].map(stat => (
          <div key={stat.label} className="bg-[var(--bg-1)] backdrop-blur-3xl p-8 rounded-[32px] border border-[var(--border)] shadow-2x transition-all hover:bg-[var(--bg-2)] group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-[14px] bg-[var(--bg-0)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] opacity-40 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest leading-none">{stat.label}</span>
            </div>
            <div className="flex items-end gap-3 mb-2">
               <div className="text-4xl font-black text-[var(--text-primary)] tracking-tighter leading-none">{stat.value}</div>
            </div>
            <div className="text-[10px] text-[var(--text-secondary)] opacity-10 font-black uppercase tracking-widest">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border)] mb-12 relative z-10">
        {['Comparison', 'Details', 'Documents'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveView(tab as any)}
            className={`px-10 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
              activeView === tab ? 'text-indigo-400' : 'text-[var(--text-secondary)] opacity-40 hover:text-[var(--text-primary)]'
            }`}
          >
            {tab}
            {activeView === tab && (
              <motion.div layoutId="detail-tab-active" className="absolute bottom-[-1px] left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_15px_indigo]" />
            )}
          </button>
        ))}
      </div>

      {/* Views */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {activeView === 'Comparison' && (
            <motion.div 
               key="comparison"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-8"
            >
              <div className="bg-[var(--bg-1)] backdrop-blur-3xl rounded-[40px] border border-[var(--border)] overflow-hidden shadow-2xl">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--bg-2)] text-left border-b border-[var(--border)]">
                      <th className="p-8 text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">Supplier Response</th>
                      <th className="p-8 text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">Total Bid Price</th>
                      <th className="p-8 text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest text-center">Lead Time</th>
                      <th className="p-8 text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest text-center">AI Score</th>
                      <th className="p-8 text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest text-center">Compliance</th>
                      <th className="p-8 text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest text-right px-12">Action Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-[var(--border)]">
                    {MOCK_BIDS.map((bid, i) => (
                      <tr key={bid.supplier} className={`hover:bg-[var(--bg-2)] transition-all group ${awardedId === bid.id ? 'bg-emerald-500/5' : ''}`}>
                        <td className="p-8">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] flex items-center justify-center text-2xl font-black text-indigo-400 group-hover:scale-110 transition-transform shadow-xl">
                              {bid.supplier[0]}
                            </div>
                            <div>
                              <div className="text-base font-black text-[var(--text-primary)] uppercase tracking-tight">{bid.supplier}</div>
                              <div className="flex items-center gap-2 mt-2">
                                 <div className={`w-1.5 h-1.5 rounded-full ${awardedId === bid.id ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-indigo-500'}`} />
                                 <div className="text-[10px] text-[var(--text-secondary)] opacity-40 uppercase font-black tracking-widest leading-none">{awardedId === bid.id ? 'AWARDED' : bid.status}</div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-8 text-lg font-mono font-black text-[var(--text-primary)]">{bid.price}</td>
                        <td className="p-8 text-sm font-black text-[var(--text-secondary)] opacity-10 text-center uppercase tracking-widest">{bid.leadTime}</td>
                        <td className="p-8 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="h-2 w-24 bg-[var(--bg-0)] rounded-full overflow-hidden shadow-inner flex-shrink-0">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${bid.score}%` }}
                                 transition={{ delay: 0.1 * i, duration: 1.5 }}
                                 className={`h-full ${bid.score >= 90 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`} 
                              />
                            </div>
                            <span className="text-[10px] font-black text-[var(--text-primary)] tracking-widest">{bid.score} PNT</span>
                          </div>
                        </td>
                        <td className="p-8 text-center">
                          <span className={`px-4 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest shadow-sm ${
                            bid.compliance === 'Full' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                          }`}>{bid.compliance} LOCK</span>
                        </td>
                        <td className="p-8 text-right px-12">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={() => handleNegotiate(bid)}
                                className="w-10 h-10 rounded-xl bg-[var(--bg-1)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] opacity-10 hover:text-indigo-400 hover:border-indigo-500/30 transition-all shadow-lg active:scale-95"
                                title="Negotiate"
                             >
                                <MessageSquare className="w-5 h-5" />
                             </button>
                             <button 
                                onClick={() => handleAward(bid)}
                                className={`px-6 py-2.5 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                                   awardedId === bid.id ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 hover:shadow-indigo-500/20'
                                }`}
                             >
                                {awardedId === bid.id ? 'CONTRACT LIVE' : 'Award Phase'}
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="bg-gradient-to-br from-indigo-500/10 to-transparent backdrop-blur-3xl border border-indigo-500/20 rounded-[40px] p-10 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-[var(--text-primary)] mb-6 uppercase tracking-widest flex items-center gap-3 leading-none">
                      <Zap className="w-6 h-6 text-indigo-400" /> PROCUREMENT STRATEGY
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] opacity-40 leading-relaxed font-medium italic pr-10">
                      "Shenzhen Microchips demonstrates the highest technical fidelity and historic reliability. However, Flex Logix offers significant lead-time compression. Recommended Path: Execute tiered award strategy with 70% volume to Shenzhen and 30% to Flex to mitigate geographic risk."
                    </p>
                  </div>
                  <div className="mt-10 flex items-center gap-4 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/10">
                    <Info className="w-5 h-5 text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Decision Confidence: 94%</span>
                  </div>
                </div>
 
                <div className="bg-[var(--bg-1)] backdrop-blur-3xl border border-[var(--border)] rounded-[40px] p-10 flex items-center justify-between shadow-2xl overflow-hidden relative group">
                  <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] transition-opacity opacity-0 group-hover:opacity-100" />
                  <div className="relative">
                    <h3 className="text-xl font-black text-[var(--text-primary)] mb-2 uppercase tracking-tight">Lifecycle Manager</h3>
                    <p className="text-[10px] text-[var(--text-secondary)] opacity-10 uppercase tracking-[0.2em] font-black">All conditions met for finalist selection</p>
                  </div>
                  <button className="bg-[var(--text-primary)] text-[var(--bg-0)] px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:opacity-90 active:scale-95 flex items-center gap-3 relative overflow-hidden group/btn">
                     <div className="absolute inset-0 bg-indigo-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                     <span className="relative z-10 group-hover/btn:text-white transition-colors">Finalize Registry</span>
                     <ArrowUpRight className="w-5 h-5 relative z-10 group-hover/btn:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'Details' && (
            <motion.div 
               key="details"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="bg-[var(--bg-1)] backdrop-blur-3xl p-12 rounded-[48px] border border-[var(--border)] shadow-2xl space-y-12"
            >
              <div>
                <h3 className="text-xs font-black text-[var(--text-secondary)] opacity-10 uppercase tracking-[0.4em] mb-10 text-center">Technical Specification Hub</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: 'Calibration Delta', val: '±0.05mm Dynamic', icon: ShieldCheck, sub: 'Level 1 Critical' },
                    { title: 'Substrate Class', val: 'FR4 High-TG 170°C', icon: Package, sub: 'Mil-Spec Compliant' },
                    { title: 'Validation Protocol', val: 'IPC Class 3', icon: FileText, sub: 'Digital Signage Logged' },
                  ].map(item => (
                    <div key={item.title} className="p-8 rounded-[32px] bg-[var(--bg-2)] border border-[var(--border)] hover:border-indigo-500/30 transition-all shadow-inner group">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg">
                         <item.icon className="w-6 h-6" />
                      </div>
                      <div className="text-[10px] text-[var(--text-secondary)] opacity-40 uppercase font-black mb-2 tracking-widest leading-none">{item.title}</div>
                      <div className="text-xl font-black text-[var(--text-primary)] tracking-tight mb-1">{item.val}</div>
                      <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-12 border-t border-[var(--border)] max-w-3xl mx-auto text-center">
                <h3 className="text-[10px] font-black text-[var(--text-secondary)] opacity-10 uppercase tracking-[0.3em] mb-6">Workflow Pedigree</h3>
                <p className="text-base text-[var(--text-secondary)] opacity-40 leading-relaxed font-medium">
                  Constructed for strategic sourcing of high-density interconnect (HDI) PCBs for the next-gen automotive refresh. 
                  Sourcing engine identified <span className="text-[var(--text-primary)] font-bold">12 qualified candidates</span>, of which 5 passed initial financial audits. 
                  Audit trails are cryptographically locked for ESG/Compliance reporting.
                </p>
              </div>
            </motion.div>
          )}

          {activeView === 'Documents' && (
            <motion.div 
               key="documents"
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
               {[
                  { name: 'Master Services Agreement.pdf', size: '2.4 MB', type: 'LEGAL', date: 'Mar 12, 2025' },
                  { name: 'Technical_Spec_v1.2.xlsx', size: '15.8 MB', type: 'TECH', date: 'Mar 10, 2025' },
                  { name: 'Compliance_Audit_Shenzhen.p7s', size: '840 KB', type: 'AUDIT', date: 'Mar 15, 2025' },
                  { name: 'Financial_Risk_Assessment.pdf', size: '4.2 MB', type: 'FINANCE', date: 'Mar 08, 2025' },
                  { name: 'ISO_9001_Certification.jpg', size: '1.1 MB', type: 'CERT', date: 'Jan 20, 2025' },
               ].map((doc, i) => (
                  <div key={i} className="bg-[var(--bg-1)] backdrop-blur-2xl rounded-[32px] p-8 border border-[var(--border)] hover:border-indigo-500/40 transition-all group flex items-start gap-6 shadow-xl cursor-pointer">
                     <div className="w-16 h-16 rounded-2xl bg-[var(--bg-0)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] opacity-10 group-hover:text-indigo-400 group-hover:scale-110 transition-all">
                        <FileText size={32} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="text-sm font-black text-[var(--text-primary)] truncate uppercase tracking-tight mb-2 group-hover:text-indigo-400 transition-colors">{doc.name}</div>
                        <div className="flex flex-wrap gap-2 items-center text-[9px] font-black">
                           <span className="text-indigo-400 tracking-widest">{doc.type}</span>
                           <span className="text-[var(--text-secondary)] opacity-10">•</span>
                           <span className="text-[var(--text-secondary)] opacity-20 tracking-widest">{doc.size}</span>
                        </div>
                        <div className="text-[8px] text-[var(--text-secondary)] opacity-10 mt-3 uppercase tracking-widest flex items-center gap-2">
                           <Calendar size={10} /> REVISED: {doc.date}
                        </div>
                     </div>
                  </div>
               ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Award Modal */}
      <AnimatePresence>
        {showAwardModal && selectedBid && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 backdrop-blur-3xl bg-black/60">
             <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[48px] p-12 w-full max-w-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
             >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] pointer-events-none" />
                
                <button onClick={() => setShowAwardModal(false)} className="absolute top-10 right-10 text-[var(--text-secondary)] opacity-40 hover:text-[var(--text-primary)] transition-colors p-2 bg-[var(--bg-1)] border border-[var(--border)] rounded-full">
                   <X className="w-6 h-6" />
                </button>
 
                <div className="mb-12 relative z-10 flex items-center gap-8">
                   <div className="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center shadow-[0_15px_30px_rgba(79,70,229,0.3)]">
                      <FileCheck className="w-10 h-10 text-white" />
                   </div>
                   <div>
                      <h2 className="text-4xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-tight">Generate <span className="text-indigo-400">Award</span></h2>
                      <p className="text-xs text-[var(--text-secondary)] opacity-40 font-bold uppercase tracking-widest mt-2">{selectedBid.supplier} • FINAL_BID: {selectedBid.price}</p>
                   </div>
                </div>

                <div className="space-y-10 relative z-10">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="p-8 bg-[var(--bg-1)] rounded-[32px] border border-[var(--border)] shadow-inner">
                         <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-10 uppercase tracking-widest mb-4">Commercial Summary</div>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center">
                               <span className="text-xs text-[var(--text-secondary)] opacity-40">Award Volume</span>
                               <span className="text-xs font-black text-[var(--text-primary)]">Full Commitment</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-xs text-[var(--text-secondary)] opacity-40">Contract Value</span>
                               <span className="text-xs font-black text-indigo-400">{selectedBid.price}</span>
                            </div>
                         </div>
                      </div>
                      <div className="p-8 bg-[var(--bg-1)] rounded-[32px] border border-[var(--border)] shadow-inner">
                         <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-10 uppercase tracking-widest mb-4">Risk Evaluation</div>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center">
                               <span className="text-xs text-[var(--text-secondary)] opacity-40">Compliance Stance</span>
                               <span className="text-xs font-black text-emerald-500 uppercase">FULLY_CLEARED</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-xs text-[var(--text-secondary)] opacity-40">Performance Index</span>
                               <span className="text-xs font-black text-[var(--text-primary)] uppercase">TOP_TIER (9.4)</span>
                            </div>
                         </div>
                      </div>
                   </div>
 
                   <div className="bg-[var(--bg-0)] p-10 rounded-[40px] border border-[var(--border)] shadow-inner relative group overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Scale className="w-20 h-20 text-[var(--text-primary)]" />
                      </div>
                      <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Contract Payload Preview</h4>
                      <div className="space-y-4 max-h-[160px] overflow-y-auto pr-4 custom-scrollbar">
                         <div className="p-5 bg-[var(--bg-2)] rounded-2xl border border-[var(--border)] font-mono text-[10px] text-[var(--text-secondary)] opacity-40 leading-relaxed shadow-sm">
                            <p className="mb-4">"THIS_MASTER_SUPPLY_AGREEMENT (MSA) is entered into effective Mar 19, 2026..."</p>
                            <p className="mb-4">"1.1 COMMODITY: Q3 Semiconductor Units. QUANTITY: 40,000 Pcs per month."</p>
                            <p className="mb-4">"1.2 DELIVERY: EXW Shenzhen Logistics Hub. LEAD_TIME: {selectedBid.leadTime}."</p>
                            <p>"1.3 PAYMENT: Net-30 via SWIFT wire for qualified bids."</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <button 
                        onClick={() => setShowAwardModal(false)}
                        className="flex-1 py-5 bg-white/5 border border-white/10 text-slate-400 rounded-3xl text-xs font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all active:scale-95"
                      >
                         Discard Draft
                      </button>
                      <button 
                        onClick={confirmAward}
                        disabled={isAwarding}
                        className="flex-[2] py-5 bg-indigo-600 text-white rounded-3xl text-xs font-black uppercase tracking-widest shadow-[0_15px_30px_rgba(99,102,241,0.3)] hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                         {isAwarding ? (
                            <>
                               <Activity className="w-5 h-5 animate-spin" /> EXECUTING_PROTOCOL...
                            </>
                         ) : (
                            <>
                               <FileCheck className="w-5 h-5" /> Execute Master Award
                            </>
                         )}
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Negotiate Modal */}
      <AnimatePresence>
         {showNegotiateModal && selectedBid && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 backdrop-blur-3xl bg-black/60">
               <motion.div 
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  className="bg-[var(--bg-0)] border border-indigo-500/20 rounded-[48px] overflow-hidden w-full max-w-4xl shadow-[0_0_150px_rgba(99,102,241,0.2)] flex h-[700px]"
               >
                  {/* Left: Supplier Info */}
                  <div className="w-[340px] bg-[var(--bg-1)] p-12 border-r border-[var(--border)] flex flex-col justify-between relative overflow-hidden">
                     <div className="absolute top-[-10%] left-[-10%] w-[200px] h-[200px] bg-indigo-500/10 blur-[80px]" />
                     <div className="relative z-10">
                        <div className="w-20 h-20 rounded-[32px] bg-[var(--text-primary)] text-[var(--bg-0)] flex items-center justify-center text-3xl font-black mb-8 shadow-2xl">
                           {selectedBid.supplier[0]}
                        </div>
                        <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-tight mb-4">{selectedBid.supplier}</h2>
                        <div className="space-y-3">
                           <div className="flex items-center gap-3 px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                              <Zap className="w-4 h-4 text-indigo-400" />
                              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Power Score: {selectedBid.score}</span>
                           </div>
                           <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                              <Clock className="w-4 h-4 text-emerald-400" />
                              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Avg. Response: 2h</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="relative z-10 pt-12 border-t border-[var(--border)]">
                        <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-6">Negotiation Target</div>
                        <div className="p-6 bg-[var(--bg-2)] rounded-3xl border border-[var(--border)] shadow-inner">
                           <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-20 uppercase mb-2">Ideal Price Point</div>
                           <div className="text-2xl font-black text-indigo-400">$1.02M</div>
                           <div className="text-[8px] font-bold text-[var(--text-secondary)] opacity-10 mt-2 uppercase">Decrease of 8.2% Required</div>
                        </div>
                     </div>
                  </div>

                  {/* Right: Negotiation Chat Simulation */}
                  <div className="flex-1 flex flex-col bg-[var(--bg-1)] opacity-90 relative">
                     <header className="p-10 border-b border-[var(--border)] flex items-center justify-between">
                        <div>
                           <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-[0.3em]">Communication Hub</h3>
                           <p className="text-[9px] text-[var(--text-secondary)] opacity-40 font-bold uppercase mt-1">Direct Encrypted Terminal</p>
                        </div>
                        <button onClick={() => setShowNegotiateModal(false)} className="p-3 bg-[var(--bg-2)] border border-[var(--border)] rounded-2xl hover:bg-[var(--bg-1)] transition-all text-[var(--text-secondary)] opacity-40 hover:text-[var(--text-primary)]">
                           <X className="w-6 h-6" />
                        </button>
                     </header>

                     <div className="flex-1 p-10 overflow-y-auto space-y-8 custom-scrollbar">
                        <div className="flex flex-col items-center opacity-10 my-10">
                           <ShieldCheck className="w-12 h-12 text-[var(--text-secondary)] mb-4" />
                           <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">End-to-End Encrypted Session Established</p>
                        </div>
                        
                        <div className="flex justify-end">
                           <div className="max-w-[70%] bg-indigo-600 p-6 rounded-[24px] rounded-tr-none shadow-xl">
                              <p className="text-xs font-medium text-white leading-relaxed">
                                 "We appreciate the detailed bid. However, we're looking to bring the total commitment closer to the $1.02M mark to align with our Q3 budget delta. If we extend the contract validity to 180 days, could we adjust the unit price?"
                              </p>
                           </div>
                        </div>

                        <div className="flex justify-start">
                           <div className="max-w-[70%] bg-[var(--bg-2)] border border-[var(--border)] p-6 rounded-[24px] rounded-tl-none shadow-xl">
                              <p className="text-xs font-medium text-[var(--text-secondary)] opacity-40 leading-relaxed italic">
                                 "Supplier is typing..."
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="p-10 bg-[var(--bg-2)] border-t border-[var(--border)]">
                        <div className="relative">
                           <textarea 
                              placeholder="Type your counter-proposal..."
                              className="w-full bg-[var(--bg-0)] border border-[var(--border)] rounded-[32px] p-6 pr-20 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[100px] shadow-inner"
                           />
                           <button className="absolute bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-500 transition-all active:scale-90">
                              <Zap className="w-5 h-5 fill-white" />
                           </button>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                           <div className="flex gap-3">
                              <button className="px-4 py-2 bg-[var(--bg-1)] border border-[var(--border)] rounded-xl text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest hover:text-[var(--text-primary)] transition-colors">Attach Asset</button>
                              <button className="px-4 py-2 bg-[var(--bg-1)] border border-[var(--border)] rounded-xl text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest hover:text-[var(--text-primary)] transition-colors">Insert Term</button>
                           </div>
                           <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">AI Suggestion: Request 5% DPA</div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.3); }
      `}</style>
    </div>
  )
}
