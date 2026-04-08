'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Search, ShieldAlert, AlertTriangle, Globe, CheckCircle2, Filter, Download, X
} from 'lucide-react'

interface TariffResult {
  code: string
  description: string
  generalRate: string
  chinaRate: string
  notes: string
}

export default function TariffPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TariffResult[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<TariffResult | null>(null)
  const [unitPrice, setUnitPrice] = useState(100)
  const [quantity, setQuantity] = useState(1000)

  useEffect(() => {
    fetchTariffs('')
  }, [])

  const fetchTariffs = async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/tariff?q=${encodeURIComponent(q)}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data.results)
      }
    } catch(e) {}
    setLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTariffs(query)
  }

  // Calculate landed cost
  const calcLandedCost = (rateStr: string) => {
    const match = rateStr.match(/[\d.]+/)
    const rate = match ? parseFloat(match[0]) / 100 : 0
    const duty = unitPrice * quantity * rate
    const total = (unitPrice * quantity) + duty
    return { duty, total, rate: rate * 100 }
  }

  const exportCSV = () => {
    const headers = 'HTS Code,Description,General Rate,China Rate,Notes\n'
    const csv = headers + results.map(r => `${r.code},"${r.description}",${r.generalRate},${r.chinaRate},"${r.notes}"`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'tariff_lookup.csv'; a.click()
  }

  return (
    <div className="min-h-screen w-full bg-[var(--bg-0)] p-6 lg:p-10 font-sans custom-scrollbar overflow-y-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link href="/market" className="w-10 h-10 rounded-xl bg-[var(--bg-1)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-2)] transition-all">
          <ArrowLeft size={18} className="text-[var(--text-secondary)]" />
        </Link>
        <div className="flex-1">
          <div className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">US Harmonized Tariff Schedule</div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">Tariff & HTS Lookup</h1>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-1)] border border-[var(--border)] rounded-xl text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest hover:bg-[var(--bg-2)] transition-all">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 max-w-3xl">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-30" size={20} />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by HTS code (e.g. 8542) or product (e.g. batteries, steel, electronics...)"
            className="w-full pl-14 pr-32 py-5 rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] text-sm text-[var(--text-primary)] outline-none focus:border-amber-500/50 transition-colors shadow-lg"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-amber-500 text-[var(--bg-0)] rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-all">
            Search
          </button>
        </div>
        <p className="text-[10px] text-[var(--text-secondary)] opacity-30 mt-2 pl-2">
          Data covers Section 301 (China), Section 232 (Steel/Aluminum), and MFN rates. Source: US International Trade Commission.
        </p>
      </form>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Results List */}
        <div className="xl:col-span-7 space-y-3">
          <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-4">
            {results.length} Results Found
          </div>
          
          {results.map((item, i) => {
            const hasChina = item.chinaRate !== item.generalRate
            return (
              <motion.button
                key={item.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedItem(item)}
                className={`w-full text-left p-6 rounded-2xl border transition-all ${selectedItem?.code === item.code ? 'bg-amber-500/10 border-amber-500/30' : 'bg-[var(--bg-1)] border-[var(--border)] hover:border-amber-500/20 hover:bg-[var(--bg-2)]'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-black text-amber-400 text-sm">{item.code}</span>
                      {hasChina && (
                        <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[8px] font-black text-rose-500 uppercase tracking-widest">
                          China Tariff
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-primary)] font-medium mb-2">{item.description}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] opacity-40 italic">{item.notes}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase mb-1">General</div>
                    <div className="text-sm font-black text-emerald-400 mb-2">{item.generalRate}</div>
                    {hasChina && (
                      <>
                        <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase mb-1">China</div>
                        <div className="text-sm font-black text-rose-400">{item.chinaRate}</div>
                      </>
                    )}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Landed Cost Calculator */}
        <div className="xl:col-span-5">
          <div className="sticky top-6 space-y-6">
            <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[2rem] p-8">
              <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight mb-6 flex items-center gap-3">
                <ShieldAlert className="text-amber-500" size={20} />
                Landed Cost Calculator
              </h3>

              {selectedItem ? (
                <div className="space-y-6">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <div className="font-mono font-black text-amber-400 text-sm mb-1">{selectedItem.code}</div>
                    <div className="text-xs text-[var(--text-primary)]">{selectedItem.description}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-2 block">Unit Price (USD)</label>
                      <input 
                        type="number" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))}
                        className="w-full p-3 rounded-xl bg-[var(--bg-0)] border border-[var(--border)] text-sm font-black text-[var(--text-primary)] tabular-nums outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-2 block">Quantity</label>
                      <input 
                        type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full p-3 rounded-xl bg-[var(--bg-0)] border border-[var(--border)] text-sm font-black text-[var(--text-primary)] tabular-nums outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>

                  {/* General Rate Calculation */}
                  <div className="p-4 bg-[var(--bg-0)] border border-[var(--border)] rounded-xl">
                    <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">General (MFN) Rate</div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--text-secondary)]">Goods Value</span>
                      <span className="font-black text-[var(--text-primary)] tabular-nums">${(unitPrice * quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-[var(--text-secondary)]">Duty ({selectedItem.generalRate})</span>
                      <span className="font-black text-amber-400 tabular-nums">${calcLandedCost(selectedItem.generalRate).duty.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </div>
                    <div className="border-t border-[var(--border)] mt-3 pt-3 flex justify-between items-center">
                      <span className="font-black text-sm text-[var(--text-primary)]">Total Landed</span>
                      <span className="font-black text-lg text-emerald-400 tabular-nums">${calcLandedCost(selectedItem.generalRate).total.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </div>
                  </div>

                  {/* China Rate Calculation */}
                  {selectedItem.chinaRate !== selectedItem.generalRate && (
                    <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                      <div className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-2">China (Section 301) Rate</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[var(--text-secondary)]">Goods Value</span>
                        <span className="font-black text-[var(--text-primary)] tabular-nums">${(unitPrice * quantity).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-[var(--text-secondary)]">Duty ({selectedItem.chinaRate})</span>
                        <span className="font-black text-rose-400 tabular-nums">${calcLandedCost(selectedItem.chinaRate).duty.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      </div>
                      <div className="border-t border-rose-500/20 mt-3 pt-3 flex justify-between items-center">
                        <span className="font-black text-sm text-[var(--text-primary)]">Total Landed</span>
                        <span className="font-black text-lg text-rose-400 tabular-nums">${calcLandedCost(selectedItem.chinaRate).total.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      </div>
                    </div>
                  )}

                  {/* Savings */}
                  {selectedItem.chinaRate !== selectedItem.generalRate && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                      <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Potential Savings by Reshoring</div>
                      <div className="text-2xl font-black text-emerald-400 tabular-nums">
                        ${(calcLandedCost(selectedItem.chinaRate).total - calcLandedCost(selectedItem.generalRate).total).toLocaleString(undefined, {maximumFractionDigits: 0})}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-[var(--text-secondary)] opacity-30">
                  <ShieldAlert size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-bold">Select a tariff code from the left to calculate landed costs</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
