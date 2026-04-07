'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Trash2, Send, Download, Plus, Package } from 'lucide-react'

type Supplier = { id: string; name: string; flag: string; score: number; category: string; price: number; leadTime: number; note: string }

const INITIAL: Supplier[] = [
  { id:'1', name:'Shenzhen TechParts Co.', flag:'🇨🇳', score:94, category:'Electronics', price:72,  leadTime:14, note:'' },
  { id:'2', name:'Flex Ltd. Singapore',   flag:'🇸🇬', score:91, category:'EMS',         price:89,  leadTime:18, note:'' },
  { id:'4', name:'Foxconn Industrial',    flag:'🇨🇳', score:86, category:'Assembly',    price:68,  leadTime:12, note:'' },
]

export default function ShortlistPage() {
  const [list, setList] = useState<Supplier[]>(INITIAL)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function remove(id: string) { setList(l => l.filter(s => s.id !== id)) }
  function toggle(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function updateNote(id: string, note: string) {
    setList(l => l.map(s => s.id === id ? { ...s, note } : s))
  }
  function exportCSV() {
    const rows = [['Name','Country','Score','Category','Price','Lead Time','Note'],
      ...list.map(s => [s.name, s.flag, s.score, s.category, s.price, s.leadTime, s.note])]
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'shortlist.csv'; a.click()
  }

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">
            <span className="gradient-text">Shortlist</span> Manager
          </h1>
          <p className="text-[var(--text-secondary)] opacity-40 text-sm">{list.length} suppliers · {selected.size} selected</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Export XLSX
          </button>
          <button disabled={selected.size === 0}
            className="btn-primary flex items-center gap-2 disabled:opacity-40">
            <Send className="w-4 h-4" /> Bulk RFQ ({selected.size})
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <Package className="w-12 h-12 text-[var(--text-secondary)] opacity-10 mb-4" />
          <h3 className="text-[var(--text-secondary)] opacity-40 font-medium mb-2">Your shortlist is empty</h3>
          <p className="text-[var(--text-secondary)] opacity-20 text-sm mb-4">Add suppliers from the search page</p>
          <a href="/suppliers" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Browse Suppliers
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {list.map((s, i) => (
              <motion.div key={s.id} layout
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.25 }}
                className={`card flex items-center gap-4 transition-all ${
                  selected.has(s.id) ? 'border-indigo-500/30 bg-indigo-500/5' : ''
                }`}>

                {/* Checkbox */}
                <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggle(s.id)}
                  className="w-4 h-4 accent-indigo-500 rounded flex-shrink-0" />

                {/* Rank */}
                <div className="w-7 h-7 rounded-full bg-[var(--bg-2)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)] opacity-40 shadow-inner">
                  {i + 1}
                </div>

                {/* Score */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: s.score >= 90 ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)',
                    color: s.score >= 90 ? '#6ee7b7' : '#a5b4fc',
                    border: `1px solid ${s.score >= 90 ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)'}`,
                  }}>
                  {s.score}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[var(--text-primary)] text-sm">{s.flag} {s.name}</div>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className="badge badge-brand">{s.category}</span>
                    <span className="text-xs text-[var(--text-secondary)] opacity-40">${s.price}/unit</span>
                    <span className="text-xs text-[var(--text-secondary)] opacity-40">{s.leadTime}d lead</span>
                  </div>
                </div>

                {/* Note */}
                <input
                  value={s.note}
                  onChange={e => updateNote(s.id, e.target.value)}
                  placeholder="Add note..."
                  className="input-dark max-w-xs text-xs py-1.5"
                />

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                    <Send className="w-3 h-3" /> RFQ
                  </button>
                  <button onClick={() => remove(s.id)}
                    className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
