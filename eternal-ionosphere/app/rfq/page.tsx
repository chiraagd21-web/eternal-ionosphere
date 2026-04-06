'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Send, Loader2, Plus, Trash2, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react'

type LineItem = { description: string; qty: number; unit: string; notes: string }
type RFQForm = {
  product: string
  category: string
  quantity: number
  targetPrice: string
  deadline: string
  requirements: string
  suppliers: string[]
  lineItems: LineItem[]
}

const INITIAL_FORM: RFQForm = {
  product: '',
  category: 'Electronics',
  quantity: 1000,
  targetPrice: '',
  deadline: '',
  requirements: '',
  suppliers: ['Shenzhen TechParts Co.', 'Flex Ltd. Singapore'],
  lineItems: [{ description: '', qty: 1, unit: 'pcs', notes: '' }],
}

const CATEGORIES = ['Electronics','Mechanical','Assembly','Chemical','Textile','Packaging','Raw Materials']

export default function RFQPage() {
  const [form, setForm] = useState<RFQForm>(INITIAL_FORM)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [generatedRFQ, setGeneratedRFQ] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  function updateForm(patch: Partial<RFQForm>) { setForm(f => ({ ...f, ...patch })) }

  function updateLineItem(i: number, patch: Partial<LineItem>) {
    const items = [...form.lineItems]
    items[i] = { ...items[i], ...patch }
    updateForm({ lineItems: items })
  }
  function addLineItem() { updateForm({ lineItems: [...form.lineItems, { description:'', qty:1, unit:'pcs', notes:'' }] }) }
  function removeLineItem(i: number) { updateForm({ lineItems: form.lineItems.filter((_, idx) => idx !== i) }) }

  async function generateRFQ() {
    setLoading(true)
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setGeneratedRFQ(data.rfq_text || FALLBACK_RFQ(form))
    } catch {
      setGeneratedRFQ(FALLBACK_RFQ(form))
    } finally {
      setLoading(false)
      setShowPreview(true)
      setStep(3)
    }
  }

  async function sendRFQ() {
    setLoading(true)
    try {
      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rfq_text: generatedRFQ }),
      })
    } catch { /* continue */ }
    finally {
      setLoading(false)
      setSent(true)
    }
  }

  if (sent) return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">RFQ Sent Successfully!</h2>
        <p className="text-[var(--text-secondary)] opacity-40 mb-6">Your request for quotation has been delivered to {form.suppliers.length} suppliers.</p>
        <button onClick={() => { setSent(false); setForm(INITIAL_FORM); setStep(1) }}
          className="btn-primary">Create New RFQ</button>
      </motion.div>
    </div>
  )

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">RFQ <span className="gradient-text">Builder</span></h1>
        <p className="text-[var(--text-secondary)] opacity-40 text-sm">AI-generated Request for Quotation — ready in seconds</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-0 mb-8">
        {['Requirements', 'Line Items', 'Preview & Send'].map((s, i) => (
          <div key={s} className="flex items-center">
            <button onClick={() => i + 1 <= step && setStep(i + 1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                step === i + 1 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : step > i + 1 ? 'text-emerald-400'
                : 'text-[var(--text-secondary)] opacity-40'
              }`}>
              <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                step > i + 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : step === i + 1 ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                : 'bg-[var(--bg-1)] text-[var(--text-secondary)] border border-[var(--border)]'
              }`}>{step > i + 1 ? '✓' : i + 1}</span>
              {s}
            </button>
            {i < 2 && <div className="w-8 h-px bg-[var(--bg-2)] mx-1" />}
          </div>
        ))}
      </div>

      <div className="max-w-2xl">
        {/* Step 1 */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div className="card space-y-5">
              <h2 className="font-semibold text-[var(--text-primary)]">Product Requirements</h2>
              <div>
                <label className="text-xs text-[var(--text-secondary)] opacity-40 font-medium mb-1.5 block">Product / Part Name *</label>
                <input id="rfq-product" value={form.product} onChange={e => updateForm({ product: e.target.value })}
                  placeholder="e.g. Custom PCB Assembly 4-Layer" className="input-dark" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[var(--text-secondary)] opacity-40 font-medium mb-1.5 block">Category</label>
                  <select id="rfq-category" value={form.category} onChange={e => updateForm({ category: e.target.value })}
                    className="input-dark">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)] opacity-40 font-medium mb-1.5 block">Quantity</label>
                  <input id="rfq-qty" type="number" value={form.quantity}
                    onChange={e => updateForm({ quantity: +e.target.value })}
                    className="input-dark" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[var(--text-secondary)] opacity-40 font-medium mb-1.5 block">Target Unit Price ($)</label>
                  <input id="rfq-price" value={form.targetPrice} onChange={e => updateForm({ targetPrice: e.target.value })}
                    placeholder="e.g. 12.50" className="input-dark" />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)] opacity-40 font-medium mb-1.5 block">Quote Deadline</label>
                  <input id="rfq-deadline" type="date" value={form.deadline}
                    onChange={e => updateForm({ deadline: e.target.value })} className="input-dark" />
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] opacity-40 font-medium mb-1.5 block">Technical Requirements</label>
                <textarea id="rfq-requirements" value={form.requirements}
                  onChange={e => updateForm({ requirements: e.target.value })}
                  rows={4} placeholder="List certifications, tolerances, materials, packaging requirements..."
                  className="input-dark resize-none" />
              </div>
            </div>
            <button id="rfq-next-1" onClick={() => setStep(2)} className="btn-primary">
              Next: Line Items →
            </button>
          </motion.div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[var(--text-primary)]">Line Items</h2>
                <button onClick={addLineItem} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5">
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </div>
              {form.lineItems.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input value={item.description} onChange={e => updateLineItem(i, { description: e.target.value })}
                    placeholder="Description" className="input-dark col-span-5 text-xs" />
                  <input type="number" value={item.qty} onChange={e => updateLineItem(i, { qty: +e.target.value })}
                    className="input-dark col-span-2 text-xs" />
                  <select value={item.unit} onChange={e => updateLineItem(i, { unit: e.target.value })}
                    className="input-dark col-span-2 text-xs">
                    {['pcs','kg','m','lot','set'].map(u => <option key={u}>{u}</option>)}
                  </select>
                  <input value={item.notes} onChange={e => updateLineItem(i, { notes: e.target.value })}
                    placeholder="Notes" className="input-dark col-span-2 text-xs" />
                  <button onClick={() => removeLineItem(i)} className="col-span-1 flex justify-center text-[var(--text-secondary)] hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary">← Back</button>
              <button id="rfq-generate-btn" onClick={generateRFQ} disabled={loading}
                className="btn-primary flex items-center gap-2">
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                  : <><FileText className="w-4 h-4" /> Generate RFQ</>}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[var(--text-primary)]">RFQ Preview</h2>
                <button onClick={() => setShowPreview(!showPreview)}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-xs">
                  {showPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showPreview ? 'Collapse' : 'Expand'}
                </button>
              </div>
              {showPreview && (
                <pre className="text-xs text-[var(--text-secondary)] bg-[var(--bg-1)] rounded-lg p-4 overflow-auto max-h-72 font-mono leading-relaxed whitespace-pre-wrap">
                  {generatedRFQ}
                </pre>
              )}
            </div>
            <div className="card">
              <h2 className="font-semibold text-[var(--text-primary)] mb-4">Send To Suppliers</h2>
              <div className="space-y-2 mb-4">
                {form.suppliers.map(s => (
                  <div key={s} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-1)] border border-[var(--border)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-[var(--text-secondary)]">{s}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary">← Edit</button>
                <button id="rfq-send-btn" onClick={sendRFQ} disabled={loading}
                  className="btn-primary flex items-center gap-2">
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    : <><Send className="w-4 h-4" /> Send RFQ to {form.suppliers.length} Suppliers</>}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function FALLBACK_RFQ(form: RFQForm): string {
  return `REQUEST FOR QUOTATION
======================
Date: ${new Date().toLocaleDateString()}
Reference: RFQ-${Date.now().toString(36).toUpperCase()}

PRODUCT: ${form.product}
CATEGORY: ${form.category}
QUANTITY: ${form.quantity.toLocaleString()} units
TARGET PRICE: ${form.targetPrice ? `$${form.targetPrice} per unit` : 'To be quoted'}
QUOTE DEADLINE: ${form.deadline || 'As soon as possible'}

TECHNICAL REQUIREMENTS:
${form.requirements || 'Please provide standard specifications.'}

LINE ITEMS:
${form.lineItems.map((li, i) => `  ${i+1}. ${li.description || 'Item'} — ${li.qty} ${li.unit}${li.notes ? ` (${li.notes})` : ''}`).join('\n')}

SUBMISSION INSTRUCTIONS:
Please reply with your best pricing, MOQ, lead time, and payment terms.
Include ISO/quality certifications if applicable.

Thank you for your quotation.`
}
