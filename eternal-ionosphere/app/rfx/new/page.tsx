'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Search, 
  Users, 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Send,
  Loader2,
  CheckCircle2,
  HelpCircle,
  FileSearch,
  LayoutGrid,
  BadgeCheck
} from 'lucide-react'

type RFxType = 'RFI' | 'RFP' | 'RFQ'

interface RFxForm {
  type: RFxType
  title: string
  description: string
  deadline: string
  priority: 'High' | 'Medium' | 'Low'
  suppliers: string[]
  lineItems: Array<{ description: string; qty: number; unit: string; targetPrice: string }>
  technicalRequirements: string
  complianceChecklist: string[]
}

const INITIAL_FORM: RFxForm = {
  type: 'RFQ',
  title: '',
  description: '',
  deadline: '',
  priority: 'Medium',
  suppliers: [],
  lineItems: [{ description: '', qty: 100, unit: 'pcs', targetPrice: '' }],
  technicalRequirements: '',
  complianceChecklist: ['ISO 9001', 'RoHS Compliance'],
}

const MOCK_SUPPLIERS = [
  { name: 'Shenzhen TechParts Co.', score: 94, location: 'China', category: 'Electronics' },
  { name: 'Flex Ltd. Singapore', score: 88, location: 'Singapore', category: 'Electronics' },
  { name: 'Global Logistics Hub', score: 91, location: 'Germany', category: 'Logistics' },
  { name: 'Astra Global Sourcing', score: 95, location: 'USA', category: 'Manufacturing' },
  { name: 'Valiant Steel Works', score: 82, location: 'India', category: 'Raw Materials' },
]

export default function NewRFxPage() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<RFxForm>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [published, setPublished] = useState(false)

  useEffect(() => {
    const typeParam = searchParams.get('type') as RFxType
    if (typeParam && ['RFI', 'RFP', 'RFQ'].includes(typeParam)) {
      setForm(prev => ({ ...prev, type: typeParam }))
    }
  }, [searchParams])

  const updateForm = (patch: Partial<RFxForm>) => setForm(prev => ({ ...prev, ...patch }))

  const nextStep = () => setStep(s => Math.min(s + 1, 4))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const handlePublish = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 2000))
    setLoading(false)
    setPublished(true)
  }

  if (published) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-lg bg-[var(--bg-1)] border border-[var(--border)] p-12 rounded-[2.5rem] shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Event Published Successfully!</h2>
          <p className="text-[var(--text-secondary)] opacity-40 mb-10 leading-relaxed text-lg italic">
            Your {form.type} &quot;{form.title}&quot; has been sent to {form.suppliers.length} suppliers. Live tracking is now active.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-[var(--bg-2)] border border-[var(--border)] text-[var(--text-primary)] rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[var(--bg-0)] transition-all" onClick={() => window.location.href = '/rfx'}>View Dashboard</button>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-indigo-500 shadow-lg active:scale-95 transition-all" onClick={() => window.location.reload()}>Create Another</button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-8 animate-fade-in max-w-5xl mx-auto">
      {/* Stepper Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Configure <span className="gradient-text">New Request</span></h1>
            <p className="text-[var(--text-secondary)] opacity-40 text-sm">Step {step} of 4: {['Event Type', 'Requirements', 'Supplier Selection', 'Final Review'][step-1]}</p>
          </div>
          <div className="flex gap-4">
            {step > 1 && (
              <button disabled={loading} onClick={prevStep} className="btn-secondary flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < 4 ? (
              <button onClick={nextStep} className="btn-primary flex items-center gap-2">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button disabled={loading || form.suppliers.length === 0} onClick={handlePublish} className="btn-primary flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? 'Publishing...' : 'Publish Event'}
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-indigo-500' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Step 1: Type & Info */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-[var(--bg-1)] border border-[var(--border)] p-10 rounded-[2.5rem] shadow-xl space-y-6">
                  <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-indigo-400" /> Event Configuration
                  </h2>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-2 block">Request Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['RFI', 'RFP', 'RFQ'] as RFxType[]).map(t => (
                        <button
                          key={t}
                          onClick={() => updateForm({ type: t })}
                          className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                            form.type === t ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-[var(--bg-0)] border-[var(--border)] text-[var(--text-secondary)] opacity-40 hover:border-indigo-500/30 hover:text-indigo-400'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-2 block">Event Title</label>
                    <input 
                      className="w-full bg-[var(--bg-0)] border border-[var(--border)] rounded-xl h-12 px-5 text-sm font-bold text-[var(--text-primary)] placeholder-[var(--text-secondary)]/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
                      placeholder="e.g. 2026 Core Materials Strategic Sourcing"
                      value={form.title}
                      onChange={e => updateForm({ title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-2 block">Response Deadline</label>
                    <input 
                      type="date" 
                      className="w-full bg-[var(--bg-0)] border border-[var(--border)] rounded-xl h-12 px-5 text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      value={form.deadline}
                      onChange={e => updateForm({ deadline: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-indigo-500/5 border border-indigo-500/10 p-10 rounded-[2.5rem] flex flex-col items-center text-center shadow-xl">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Smart Template Selection</h3>
                  <p className="text-[var(--text-secondary)] opacity-40 text-sm leading-relaxed mb-8">
                    Based on your selection of <span className="text-indigo-300 font-bold">{form.type}</span>, ProcureAI will pre-fill technical requirements and compliance standards.
                  </p>
                  <div className="w-full space-y-3">
                    <button className="w-full py-3 rounded-xl bg-[var(--bg-0)] border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] opacity-40 hover:opacity-100 hover:border-indigo-500/30 transition-all flex items-center justify-center gap-2">
                      <FileSearch className="w-4 h-4" /> Load Existing Template
                    </button>
                    <button className="w-full py-3 rounded-xl bg-[var(--bg-0)] border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] opacity-40 hover:opacity-100 hover:border-indigo-500/30 transition-all flex items-center justify-center gap-2">
                      <HelpCircle className="w-4 h-4" /> I&apos;m not sure which to use
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Requirements */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="bg-[var(--bg-1)] border border-[var(--border)] p-10 rounded-[2.5rem] shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" /> Commercial & Technical Details
                  </h2>
                  <span className="badge badge-brand">{form.type} Mode</span>
                </div>
 
                <div className="space-y-4">
                  <label className="text-xs font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest block">Executive Summary</label>
                  <textarea 
                    className="w-full bg-[var(--bg-0)] border border-[var(--border)] rounded-xl min-h-[120px] p-5 text-sm font-bold text-[var(--text-primary)] placeholder-[var(--text-secondary)]/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
                    placeholder="Provide a high-level overview of the request..."
                    value={form.description}
                    onChange={e => updateForm({ description: e.target.value })}
                  />
                </div>

                {form.type === 'RFQ' && (
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Line Items</label>
                      <button 
                        onClick={() => updateForm({ lineItems: [...form.lineItems, { description: '', qty: 100, unit: 'pcs', targetPrice: '' }] })}
                        className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Row
                      </button>
                    </div>
                    <div className="space-y-3">
                      {form.lineItems.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-3 items-center">
                          <input 
                            placeholder="Component / Part Description" 
                            className="col-span-6 bg-[var(--bg-0)] border border-[var(--border)] rounded-xl py-2 px-4 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            value={item.description}
                            onChange={e => {
                              const newList = [...form.lineItems]; newList[idx].description = e.target.value; updateForm({ lineItems: newList })
                            }}
                          />
                          <input 
                            placeholder="Qty" 
                            type="number"
                            className="col-span-2 bg-[var(--bg-0)] border border-[var(--border)] rounded-xl py-2 px-4 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            value={item.qty}
                            onChange={e => {
                              const newList = [...form.lineItems]; newList[idx].qty = +e.target.value; updateForm({ lineItems: newList })
                            }}
                          />
                          <select 
                            className="col-span-2 bg-[var(--bg-0)] border border-[var(--border)] rounded-xl py-2 px-4 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            value={item.unit}
                            onChange={e => {
                              const newList = [...form.lineItems]; newList[idx].unit = e.target.value; updateForm({ lineItems: newList })
                            }}
                          >
                            <option>pcs</option><option>lot</option><option>kg</option><option>m</option>
                          </select>
                          <input 
                            placeholder="Target $" 
                            className="col-span-1 bg-[var(--bg-0)] border border-[var(--border)] rounded-xl py-2 px-4 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            value={item.targetPrice}
                            onChange={e => {
                              const newList = [...form.lineItems]; newList[idx].targetPrice = e.target.value; updateForm({ lineItems: newList })
                            }}
                          />
                          <button 
                            className="col-span-1 p-2 text-slate-600 hover:text-red-400"
                            onClick={() => updateForm({ lineItems: form.lineItems.filter((_, i) => i !== idx) })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-[var(--border)]">
                  <label className="text-xs font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest block mb-4">Technical Requirements & Compliance</label>
                  <textarea 
                    className="w-full bg-[var(--bg-0)] border border-[var(--border)] rounded-xl min-h-[160px] p-5 text-sm font-bold text-[var(--text-primary)] placeholder-[var(--text-secondary)]/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono" 
                    placeholder="Certifications required, shipping terms (Incoterms), testing protocols..."
                    value={form.technicalRequirements}
                    onChange={e => updateForm({ technicalRequirements: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Supplier Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-1)] border border-[var(--border)] p-10 rounded-[2.5rem] shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" /> Targeted Suppliers
                  </h2>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] opacity-40" />
                    <input className="w-full bg-[var(--bg-0)] border border-[var(--border)] rounded-xl h-10 pl-10 pr-4 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="Search saved suppliers..." />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    <div className="text-[10px] font-bold text-[var(--text-secondary)] opacity-40 uppercase mb-2">Available in Network</div>
                    {MOCK_SUPPLIERS.map(s => (
                      <div 
                        key={s.name}
                        onClick={() => {
                          if (!form.suppliers.includes(s.name)) updateForm({ suppliers: [...form.suppliers, s.name] })
                        }}
                        className={`p-4 rounded-xl border border-[var(--border)] hover:border-indigo-500/30 transition-all cursor-pointer group flex items-center justify-between ${
                          form.suppliers.includes(s.name) ? 'bg-indigo-500/10 border-indigo-500/40' : 'bg-[var(--bg-0)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[var(--bg-1)] border border-[var(--border)] flex items-center justify-center font-bold text-indigo-400">{s.name[0]}</div>
                          <div>
                            <div className="text-sm font-bold text-[var(--text-primary)] group-hover:text-indigo-300">{s.name}</div>
                            <div className="text-[10px] text-[var(--text-secondary)] opacity-30 uppercase font-bold">{s.category} • {s.location}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-400">{s.score}%</div>
                          <div className="text-[9px] text-[var(--text-secondary)] opacity-40 uppercase font-black tracking-tight">AI Score</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[var(--bg-0)] rounded-2xl border border-[var(--border)] p-6 border-dashed flex flex-col items-center justify-center h-full min-h-[300px]">
                    <h3 className="text-sm font-bold text-[var(--text-secondary)] opacity-40 mb-4">Invited to Event ({form.suppliers.length})</h3>
                    {form.suppliers.length === 0 ? (
                      <div className="text-center">
                        <Users className="w-12 h-12 text-[var(--text-secondary)] opacity-10 mx-auto mb-4" />
                        <p className="text-xs text-[var(--text-secondary)] opacity-20 max-w-[180px]">Select suppliers from the network to invitation list</p>
                      </div>
                    ) : (
                      <div className="w-full space-y-2 overflow-y-auto max-h-[300px]">
                        {form.suppliers.map(name => (
                          <div key={name} className="flex items-center justify-between p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                            <span className="text-sm font-bold text-[var(--text-primary)]">{name}</span>
                            <button onClick={() => updateForm({ suppliers: form.suppliers.filter(n => n !== name) })} className="p-1 hover:text-red-400 text-[var(--text-secondary)] opacity-40 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Final Review */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Left Column: Document Preview --- */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[var(--bg-1)] border border-[var(--border)] p-10 rounded-[2.5rem] shadow-xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <ShieldCheck className="w-48 h-48 rotate-12 text-indigo-500" />
                    </div>
                    
                    <div className="flex items-start justify-between relative z-10">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-400 tracking-[0.5em] font-black uppercase mb-2 block">Enterprise Draft Preview</span>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight leading-none">{form.title || 'Untitled Requisition'}</h2>
                      </div>
                      <div className="text-right">
                        <div className="inline-block px-4 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest">{form.type} Protocol</div>
                      </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-5 rounded-2xl bg-[var(--bg-0)] border border-[var(--border)] shadow-inner">
                          <div className="text-[10px] text-[var(--text-secondary)] opacity-40 font-black uppercase tracking-widest mb-2">Registry Status</div>
                          <div className="text-xs font-bold text-amber-500 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> PRE-FLIGHT DRAFT
                          </div>
                        </div>
                        <div className="p-5 rounded-2xl bg-[var(--bg-0)] border border-[var(--border)] shadow-inner">
                          <div className="text-[10px] text-[var(--text-secondary)] opacity-40 font-black uppercase tracking-widest mb-2">Exp. Lock Date</div>
                          <div className="text-xs font-bold text-[var(--text-primary)]">{form.deadline || 'PENDING'}</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="text-[10px] text-[var(--text-secondary)] opacity-30 uppercase font-black tracking-widest border-b border-[var(--border)] pb-3 flex items-center justify-between">
                          Operational Overview
                          <button onClick={() => setStep(2)} className="text-indigo-400 hover:text-indigo-300 transition-colors text-[9px] font-bold uppercase tracking-widest">Modify Requirements</button>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] opacity-70 leading-relaxed italic pr-12">
                          {form.description || 'No executive summary provided. This request will be published with generic sourcing parameters.'}
                        </p>
                      </div>

                      {form.type === 'RFQ' && (
                        <div className="space-y-5 pt-4">
                          <div className="text-[10px] text-[var(--text-secondary)] opacity-30 uppercase font-black tracking-widest border-b border-[var(--border)] pb-3">Line Item Registry ({form.lineItems.length})</div>
                          <div className="space-y-3">
                            {form.lineItems.map((li, i) => (
                              <div key={i} className="flex items-center justify-between py-1 px-2 hover:bg-[var(--bg-2)] rounded-lg transition-colors group">
                                <span className="text-xs font-bold text-[var(--text-secondary)] opacity-80 group-hover:text-[var(--text-primary)]">{li.description || 'Unnamed Asset'}</span>
                                <div className="flex items-center gap-4">
                                   <span className="text-[10px] font-mono text-[var(--text-secondary)] opacity-40">{li.targetPrice ? `$${li.targetPrice}` : 'Mkt'}</span>
                                   <span className="text-xs font-mono font-black text-indigo-400">{li.qty} {li.unit}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* --- Right Column: Status & Publish --- */}
                <div className="space-y-6">
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[2.5rem] shadow-xl space-y-6">
                    <div className="flex items-center justify-between px-2">
                       <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-2">
                         <BadgeCheck className="w-4 h-4 text-emerald-500" /> Validation Log
                       </h3>
                    </div>
                    <div className="space-y-4 px-2">
                      {[
                        { label: 'Merchant Identity Locked', check: !!form.title && !!form.deadline },
                        { label: 'Technical Scope Defined', check: !!form.description || !!form.technicalRequirements },
                        { label: 'Supplier Shortlist Set', check: form.suppliers.length > 0 },
                        { label: 'Compliance Protocol Cleared', check: true },
                      ].map(item => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className="text-[10px] text-[var(--text-secondary)] opacity-40 uppercase font-bold tracking-tight">{item.label}</span>
                          {item.check ? (
                             <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                             <div className="w-4 h-4 border-2 border-[var(--border)] border-dashed rounded-full" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[var(--bg-1)] border border-[var(--border)] p-10 rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                       <Zap className="w-24 h-24 text-indigo-400 rotate-12" />
                    </div>
                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest relative z-10">Event Summary</h3>
                    <div className="p-5 bg-[var(--bg-0)] border border-[var(--border)] rounded-2xl space-y-3 relative z-10 shadow-inner">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                         <span className="text-[var(--text-secondary)] opacity-40">Target Partners</span>
                         <span className="text-indigo-400">{form.suppliers.length} Enlisted</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                         <span className="text-[var(--text-secondary)] opacity-40">Priority Class</span>
                         <span className={`text-xs font-black ${form.priority === 'High' ? 'text-rose-500' : 'text-indigo-400'}`}>{form.priority}</span>
                      </div>
                      <div className="pt-2 border-t border-[var(--border)] text-[9px] text-[var(--text-secondary)] opacity-20 font-mono">
                         REF://ARC-{Math.floor(Math.random() * 100000)}::SECURED
                      </div>
                    </div>
                    <button 
                      disabled={loading || form.suppliers.length === 0}
                      onClick={handlePublish}
                      className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(79,70,229,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative z-10"
                    >
                      {loading ? (
                         <><Loader2 className="w-5 h-5 animate-spin" /> Verifying Ledger...</>
                      ) : (
                         <><Send className="w-5 h-5" /> Launch RFP Protocol</>
                      )}
                    </button>
                    <p className="text-[9px] text-center text-[var(--text-secondary)] opacity-20 px-8 relative z-10 font-medium">
                      Blockchain-backed requisition will notify all selected partners via terminal uplink.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
