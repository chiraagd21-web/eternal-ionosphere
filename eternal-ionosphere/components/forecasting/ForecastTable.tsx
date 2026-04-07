
'use client'

import { motion } from 'framer-motion'
import { FileSpreadsheet, ArrowRight, Filter, Calendar, Search } from 'lucide-react'

const MOCK_ITEMS = [
  { item: "Silicon Wafer Gen-4", category: "Electronics", stock: 1200, avg: 450, proj: 620, risk: "Low" },
  { item: "Aluminum Chassis B2", category: "Raw Materials", stock: 350, avg: 520, proj: 780, risk: "High" },
  { item: "PET Packaging Film", category: "Packaging", stock: 4500, avg: 3800, proj: 4100, risk: "Medium" },
  { item: "Fiber Optic Cabling", category: "Electronics", stock: 800, avg: 1200, proj: 1500, risk: "High" },
  { item: "Seismic Isolators", category: "Raw Materials", stock: 120, avg: 80, proj: 95, risk: "Low" },
  { item: "Neodymium Magnets", category: "Raw Materials", stock: 25, avg: 150, proj: 310, risk: "Critical" },
  { item: "Sapphire Glass Substrate", category: "Electronics", stock: 15, avg: 45, proj: 80, risk: "Critical" },
]

export function ForecastTable() {
  return (
    <div className="mt-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Itemized Inventory Forecast</h2>
          <p className="text-xs text-[var(--text-muted)] font-medium">Detailed SKU-level risk assessment and demand projection.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Filter items..." 
              className="input-dark pl-9 py-1.5 text-xs w-48"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-[var(--border)] rounded-lg hover:bg-[var(--bg-3)] transition-colors">
            <Filter className="w-3 h-3" /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-[var(--border)] rounded-lg hover:bg-[var(--bg-3)] transition-colors">
            <Calendar className="w-3 h-3" /> Period
          </button>
        </div>
      </div>
      
      <div className="glass rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item Identity</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Avg Demand</th>
              <th>Projected Monthly</th>
              <th>Inventory Status</th>
              <th>Decision</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ITEMS.map((row, idx) => (
              <ForecastRow key={idx} {...row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ForecastRow({ item, category, stock, avg, proj, risk }: any) {
  const riskStyles: any = {
    Low: 'badge-success',
    Medium: 'badge-warning',
    High: 'badge-danger',
    Critical: 'bg-red-500/20 text-red-400 border border-red-500/30'
  }
  
  return (
    <motion.tr 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <td>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--bg-3)] flex items-center justify-center border border-[var(--border)] group-hover:border-[var(--brand)] transition-colors shadow-inner">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[var(--text-primary)] text-sm">{item}</span>
            <span className="text-[10px] text-[var(--text-muted)] font-bold tracking-tighter uppercase">SKU-{Math.floor(Math.random() * 10000)}</span>
          </div>
        </div>
      </td>
      <td>
        <span className="text-[var(--text-secondary)] text-xs font-medium">{category}</span>
      </td>
      <td>
        <div className="font-mono text-sm group-hover:text-[var(--text-primary)] transition-colors">{stock.toLocaleString()}</div>
      </td>
      <td>
        <div className="font-mono text-sm opacity-60">{avg.toLocaleString()}</div>
      </td>
      <td>
        <div className="font-mono font-bold text-indigo-400">{proj.toLocaleString()}</div>
      </td>
      <td>
        <span className={`badge ${riskStyles[risk]} text-[10px] py-0.5 px-2`}>{risk}</span>
      </td>
      <td>
        <button className="text-indigo-400 hover:text-indigo-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all hover:translate-x-1">
          {risk === 'Critical' ? 'Immediate IPO' : 'Optimize'} <ArrowRight className="w-3 h-3" />
        </button>
      </td>
    </motion.tr>
  )
}
