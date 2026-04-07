'use client'

import React, { useState, useMemo } from 'react'
import { Plus, Search, Layers, Trash2, AlertTriangle, TrendingUp, DollarSign, Boxes, MousePointer2, Info, LayoutGrid, MoveRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, type SKUData } from '@/lib/store'

export default function InventoryLedgerPage() {
  const { inventory, addDailyRecord, addSKU, deleteSKU, setHoveredSKUId, hoveredSKUId, updateLocation, deductFromLocation } = useAppStore()
  const [search, setSearch] = useState('')
  const [timeScale, setTimeScale] = useState<'days' | 'weeks' | 'months'>('days')
  const [entryMode, setEntryMode] = useState<'balance' | 'sales'>('balance')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPutAway, setShowPutAway] = useState<string | null>(null)
  const [showPick, setShowPick] = useState<string | null>(null)
  
  const [newProduct, setNewProduct] = useState({ id: '', name: '', category: '', initialQty: 0 })
  const [putAwayData, setPutAwayData] = useState({ rack: '', bin: '', qty: 0 })
  const [pickQty, setPickQty] = useState(0)

  // --- EXECUTIVE ANALYTICS ---
  const kpis = useMemo(() => {
    const totalValue = inventory.reduce((acc, item) => acc + (item.qtyOnHand * (item.price || 0)), 0)
    const alertCount = inventory.filter(item => item.qtyOnHand < (item.safetyStock || 200)).length
    const totalAssets = inventory.length
    return { totalValue, alertCount, totalAssets }
  }, [inventory])

  const displayDates = useMemo(() => {
    const dates = new Set<string>()
    const today = new Date()
    for(let i = -14; i < 21; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() + i)
        if (d.getDay() !== 0 && d.getDay() !== 6) dates.add(d.toISOString().split('T')[0])
    }
    inventory.forEach(item => item.dailyRecords?.forEach(r => {
        const d = new Date(r.date)
        if (d.getDay() !== 0 && d.getDay() !== 6) dates.add(r.date)
    }))
    const sorted = Array.from(dates).sort((a,b) => new Date(a).getTime() - new Date(b).getTime())
    if (timeScale === 'days') return sorted
    if (timeScale === 'weeks') return sorted.filter(d => new Date(d).getDay() === 1)
    return sorted.filter(d => new Date(d).getDate() === 1)
  }, [inventory, timeScale])

  const groupedInventory = useMemo(() => {
    const groups: Record<string, SKUData[]> = {}
    inventory.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    ).sort((a,b) => a.id.localeCompare(b.id)).forEach(item => {
      if (!groups[item.category]) groups[item.category] = []
      groups[item.category].push(item)
    })
    return groups
  }, [inventory, search])

  const handleQtyChange = (skuId: string, date: string, value: string) => {
    if (value.trim() === '') {
       addDailyRecord(skuId, date, null as any)
       return
    }
    const num = parseInt(value)
    if (isNaN(num)) return
    if (entryMode === 'sales') {
       addDailyRecord(skuId, date, undefined, num)
    } else {
       addDailyRecord(skuId, date, num)
    }
  }

  const getDisplayVal = (item: SKUData, date: string) => {
    const records = item.dailyRecords || []
    const record = records.find(r => r.date === date)
    if (entryMode === 'sales') return record?.sales || ''
    if (record) return record.qty
    
    // LOOK BACK LOOKUP
    const prevDateObj = new Date(date)
    const dayOfWeek = prevDateObj.getDay()
    const backShift = (dayOfWeek === 1) ? 3 : 1
    prevDateObj.setDate(prevDateObj.getDate() - backShift)
    const prevDateStr = prevDateObj.toISOString().split('T')[0]
    const prevRecord = records.find(r => r.date === prevDateStr)
    if (prevRecord && (prevRecord.isManualQty || (prevRecord.sales || 0) > 0)) {
       return prevRecord.qty - (prevRecord.sales || 0)
    }
    return ''
  }

  const handleCreateProduct = () => {
    if (!newProduct.id || !newProduct.name || !newProduct.category) return
    addSKU({
        ...newProduct,
        qtyOnHand: newProduct.initialQty,
        safetyStock: 200,
        price: 999,
        utilizationRateMonth: 800,
        utilizationRateWeek: 200,
        growthRate: 10,
        shipments: [],
        locations: [], // V16 EMPTY SLATE
        dailyRecords: [{ date: new Date().toISOString().split('T')[0], qty: newProduct.initialQty, isManualQty: true }]
    })
    setShowAddModal(false)
    setNewProduct({ id: '', name: '', category: '', initialQty: 0 })
  }

  const handlePutAwaySubmit = () => {
    if (!showPutAway || !putAwayData.rack) return
    updateLocation(showPutAway, putAwayData.rack, putAwayData.bin, putAwayData.qty)
    setShowPutAway(null)
    setPutAwayData({ rack: '', bin: '', qty: 0 })
  }

  return (
    <div className="min-h-screen w-full bg-[var(--bg-0)] p-4 lg:p-10 font-sans overflow-x-hidden selection:bg-[var(--brand)]/20 italic-none">
      
      {/* EXECUTIVE KPI DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
         <div className="bg-[var(--bg-2)] p-6 rounded-[2rem] border border-[var(--border)] shadow-sm flex flex-col justify-between h-40 group hover:shadow-xl hover:border-[var(--brand)] transition-all">
            <div className="flex items-center justify-between">
               <div className="w-10 h-10 bg-[var(--brand)]/10 rounded-xl flex items-center justify-center text-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-[var(--bg-0)] transition-all"><DollarSign size={20} /></div>
               <span className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-[0.2em] opacity-40">Total Inventory Value</span>
            </div>
            <div className="text-3xl font-black text-[var(--text-primary)] tracking-tight">${kpis.totalValue.toLocaleString()}</div>
         </div>
         <div className="bg-[var(--bg-2)] p-6 rounded-[2rem] border border-[var(--border)] shadow-sm flex flex-col justify-between h-40 group hover:shadow-xl hover:border-[var(--brand)] transition-all">
            <div className="flex items-center justify-between">
               <div className={`w-10 h-10 ${kpis.alertCount > 0 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-emerald-50 text-emerald-600'} rounded-xl flex items-center justify-center`}><AlertTriangle size={20} /></div>
               <span className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-[0.2em] opacity-40">Stockout Warnings</span>
            </div>
            <div className="text-3xl font-black text-[var(--text-primary)] tracking-tight">{kpis.alertCount} <span className="text-sm font-bold text-[var(--text-secondary)] opacity-40">Critical SKU{kpis.alertCount !== 1 ? 's' : ''}</span></div>
         </div>
         <div className="bg-[var(--bg-2)] p-6 rounded-[2rem] border border-[var(--border)] shadow-sm flex flex-col justify-between h-40 group hover:shadow-xl hover:border-[var(--brand)] transition-all">
            <div className="flex items-center justify-between">
               <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600"><Boxes size={20} /></div>
               <span className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-[0.2em] opacity-40">Active Asset Inventory</span>
            </div>
            <div className="text-3xl font-black text-[var(--text-primary)] tracking-tight">{kpis.totalAssets} <span className="text-sm font-bold text-[var(--text-secondary)] opacity-40">Total Products</span></div>
         </div>
         <button onClick={() => setShowAddModal(true)} className="bg-[var(--brand)] p-6 rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all text-[var(--bg-0)] group overflow-hidden relative h-40">
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus size={32} />
            <div className="text-left font-black tracking-tight leading-none text-xl uppercase">Onboard<br/><span className="text-[var(--bg-0)] opacity-40">New SKU</span></div>
         </button>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row items-center gap-6 mb-10">
        <div className="flex items-center gap-2">
           <div className="w-14 h-14 bg-[var(--text-primary)] text-[var(--bg-0)] rounded-2xl flex items-center justify-center shadow-xl rotate-3 hover:rotate-0 transition-transform"><LayoutGrid size={28} /></div>
           <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter uppercase leading-none">Automated Ledger</h1>
        </div>
        
        <div className="flex-1 max-w-xl self-stretch relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-30 group-focus-within:text-[var(--brand)] transition-colors" size={20} />
           <input 
              type="text" 
              placeholder="Query by ID, Name or Category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-16 bg-[var(--bg-2)] border border-[var(--border)] rounded-[2rem] pl-16 pr-6 text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-[var(--brand)]/10 focus:border-[var(--brand)] transition-all text-[var(--text-primary)]"
           />
        </div>

        <div className="flex items-center gap-3">
           <div className="bg-[var(--bg-1)] border border-[var(--border)] p-2 rounded-2xl flex gap-1 shadow-sm">
              {(['balance', 'sales'] as const).map(mode => (
                <button key={mode} onClick={() => setEntryMode(mode)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${entryMode === mode ? 'bg-indigo-600 text-[var(--bg-0)] shadow-lg' : 'text-[var(--text-secondary)] opacity-40 hover:opacity-100 hover:bg-[var(--bg-2)]'}`}>{mode}</button>
              ))}
           </div>
           <div className="bg-[var(--bg-1)] border border-[var(--border)] p-2 rounded-2xl flex gap-1 shadow-sm">
              {(['days', 'weeks', 'months'] as const).map(scale => (
                <button key={scale} onClick={() => setTimeScale(scale)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeScale === scale ? 'bg-slate-900 text-[var(--bg-0)] shadow-lg' : 'text-[var(--text-secondary)] opacity-40 hover:opacity-100 hover:bg-[var(--bg-2)]'}`}>{scale}</button>
              ))}
           </div>
        </div>
      </div>

      {/* GRID HUB */}
      <div className="bg-[var(--bg-2)] rounded-[3rem] border border-[var(--border)] shadow-2xl overflow-hidden relative group">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-[11px] font-bold table-fixed">
            <thead>
              <tr className="bg-[var(--bg-1)] backdrop-blur-xl sticky top-0 z-30 border-b border-[var(--border)] uppercase tracking-widest text-[var(--text-secondary)] opacity-40">
                <th className="sticky left-0 bg-[var(--bg-1)] z-40 border-r border-[var(--border)] px-8 py-8 text-left w-[180px]">Group Unit</th>
                <th className="sticky left-[180px] bg-[var(--bg-1)] z-40 border-r border-[var(--border)] px-8 py-8 text-left w-[140px]">SKU Asset</th>
                <th className="sticky left-[320px] bg-[var(--bg-1)] z-40 border-r border-[var(--border)] px-8 py-8 text-left w-[240px]">Asset Name</th>
                <th className="sticky left-[560px] bg-yellow-400 z-40 border-r border-yellow-500 px-8 py-8 text-center text-[var(--bg-0)] w-[120px]">Live Total</th>
                {displayDates.map(date => (
                  <th key={date} className="border-r border-[var(--border)] px-6 py-8 text-center min-w-[120px]">
                    <div className="flex flex-col items-center">
                       <span className="opacity-30 font-bold mb-1">{new Date(date).toLocaleDateString('en-US', { month: 'short' })}</span>
                       <span className="text-[14px] font-black text-[var(--text-primary)]">{new Date(date).getDate()}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[var(--border)] italic-none">
              {Object.entries(groupedInventory).map(([category, items]) => (
                <React.Fragment key={category}>
                  {items.map((item, idx) => (
                    <tr 
                      key={item.id} 
                      onMouseEnter={() => setHoveredSKUId(item.id)}
                      onMouseLeave={() => setHoveredSKUId(null)}
                      className="hover:bg-indigo-50/20 transition-all group/row"
                    >
                       {idx === 0 && (
                        <td rowSpan={items.length} className="sticky left-0 bg-[var(--bg-2)] z-20 border-r border-[var(--border)] px-8 py-8 font-black align-top group-hover/row:bg-[var(--bg-1)] transition-colors">
                          <div className="pt-2">
                             <div className="text-indigo-600 text-lg tracking-tight leading-none uppercase">{category}</div>
                             <div className="mt-4 flex flex-col gap-2">
                                <div className="h-1.5 w-full bg-[var(--bg-0)] rounded-full overflow-hidden">
                                   <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, (items.length / 10) * 100)}%` }} />
                                </div>
                                <span className="text-[9px] opacity-40 uppercase tracking-widest">{items.length} SKUs in Sector</span>
                             </div>
                          </div>
                        </td>
                      )}
                      
                      <td className="sticky left-[180px] bg-[var(--bg-2)] z-20 border-r border-[var(--border)] px-8 py-8 text-[var(--text-secondary)] font-mono group-hover/row:bg-[var(--bg-1)] transition-colors">
                        <div className="flex items-center justify-between">
                           <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                 <span className="text-[var(--text-primary)] font-black">{item.id.toUpperCase()}</span>
                                 <button 
                                   onClick={() => setShowPutAway(item.id)}
                                   className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-[var(--bg-0)] transition-all transform active:scale-90"
                                   title="Put-Away Command"
                                 >
                                    <Boxes size={14} />
                                 </button>
                                 <button 
                                   onClick={() => setShowPick(item.id)}
                                   className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-[var(--bg-0)] transition-all transform active:scale-90"
                                   title="Ship from Rack (Sales Deduction)"
                                 >
                                    <MoveRight size={14} />
                                 </button>
                              </div>
                              {/* MINI SPARKLINE VELOCITY */}
                              <div className="flex gap-0.5 h-4 items-end opacity-40 group-hover/row:opacity-100 transition-opacity">
                                 {(item.dailyRecords || []).slice(-10).map((r, i) => (
                                    <div key={i} className={`w-1 rounded-t-sm ${r.sales ? 'bg-indigo-400' : 'bg-[var(--text-secondary)] opacity-10'}`} style={{ height: `${Math.min(100, ((r.sales || 0) / 200) * 100)}%` }} />
                                 ))}
                              </div>
                           </div>
                           <button onClick={() => { if(confirm(`Confirm Asset Purge: ${item.name}?`)) deleteSKU(item.id) }} className="opacity-0 group-hover/row:opacity-100 p-2 text-rose-300 hover:text-rose-600 transition-all transform hover:scale-125"><Trash2 size={18} /></button>
                        </div>
                      </td>
                      
                      <td className="sticky left-[320px] bg-[var(--bg-2)] z-20 border-r border-[var(--border)] px-8 py-8 text-[var(--text-primary)] uppercase group-hover/row:bg-[var(--bg-1)] transition-colors font-black tracking-tight">{item.name}</td>
                      
                      <td className="sticky left-[560px] bg-yellow-400/10 backdrop-blur-sm z-20 border-r border-yellow-200 px-8 py-8 text-center text-xl font-black text-yellow-600 group-hover/row:bg-yellow-400/20 shadow-[inset_-10px_0_20px_-10px_rgba(250,204,21,0.2)]">
                        {item.qtyOnHand.toLocaleString()}
                      </td>

                      {displayDates.map((date) => {
                        const record = (item.dailyRecords || []).find(r => r.date === date)
                        const val = getDisplayVal(item, date)
                        const isManual = record?.isManualQty
                        const isStockAlert = (typeof val === 'number' ? val : item.qtyOnHand) < (item.safetyStock || 200)
                        const isSalesEntry = entryMode === 'sales'
                        
                        return (
                           <td 
                            key={date} 
                            className={`border-r border-[var(--border)] px-0 py-0 text-center min-w-[120px] transition-all relative ${isStockAlert && !isSalesEntry ? 'bg-rose-50/20' : ''}`}
                          >
                            <input 
                              type="number"
                              key={`${date}-${entryMode}-${val}`}
                              defaultValue={isSalesEntry ? (record?.sales || '') : (val === 0 ? '0' : (val || ''))}
                              onBlur={(e) => handleQtyChange(item.id, date, e.target.value)}
                              placeholder="-"
                              className={`w-full h-full bg-transparent border-none text-center py-10 outline-none transition-all ${
                                isSalesEntry 
                                  ? 'text-rose-500 font-extrabold text-lg' 
                                  : (isManual ? 'text-[var(--text-primary)] font-black text-lg' : 'text-indigo-600/40 font-black italic-none text-lg')
                               } ${isStockAlert && !isSalesEntry ? 'text-rose-600' : ''}`}
                            />
                            {isStockAlert && !isSalesEntry && (
                               <div className="absolute top-2 right-2 flex gap-1">
                                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                               </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SPATIAL MINI-HUD (Protocol #4) */}
      <AnimatePresence>
        {hoveredSKUId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="fixed bottom-10 right-10 z-[100] w-72 bg-[var(--bg-card)] backdrop-blur-3xl border border-[var(--border)] rounded-[2.5rem] shadow-2xl p-8 pointer-events-none"
          >
            <div className="flex items-center gap-3 mb-6">
               <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-500">
                  <MousePointer2 size={24} className="animate-pulse" />
               </div>
               <div>
                  <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest leading-none">Spatial Mirror HUD</div>
                  <div className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">X-Ray Context</div>
               </div>
            </div>

            {(() => {
              const item = inventory.find(i => i.id === hoveredSKUId)
              if (!item) return null
              return (
                <div className="space-y-6">
                   <div>
                      <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-1">Asset ID / Description</div>
                      <div className="text-base font-black text-[var(--text-primary)]">{item.id.toUpperCase()}</div>
                      <div className="text-xs font-bold text-[var(--text-secondary)] opacity-60 leading-tight">{item.name}</div>
                   </div>

                   <div className="bg-[var(--bg-1)] border border-[var(--border)] p-4 rounded-2xl max-h-40 overflow-y-auto custom-scrollbar">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--border)]">
                         <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Distributed Grid Sectors</div>
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                      </div>
                      
                      {item.locations && item.locations.length > 0 ? (
                         <div className="space-y-3">
                            {item.locations.map((loc, i) => (
                               <div key={i} className="flex items-center justify-between group/loc">
                                  <div>
                                     <div className="text-[11px] font-black text-[var(--text-primary)] group-hover/loc:text-indigo-400 transition-colors">{loc.rack}</div>
                                     <div className="text-[8px] font-bold text-[var(--text-secondary)] opacity-30 uppercase">Bin {loc.bin || '00'}</div>
                                  </div>
                                  <div className="text-sm font-black text-[var(--text-primary)]">{loc.qty.toLocaleString()} <span className="text-[8px] text-[var(--text-secondary)] opacity-30 font-bold">U</span></div>
                               </div>
                            ))}
                         </div>
                      ) : (
                         <div className="py-4 text-center">
                            <div className="text-xl font-black text-[var(--text-secondary)] opacity-20 tracking-widest">UNSET</div>
                            <div className="text-[9px] font-bold text-[var(--text-secondary)] opacity-30 uppercase mt-1">Pending Put-Away</div>
                         </div>
                      )}
                   </div>

                   <div className="flex items-center gap-3 text-emerald-400">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center"><Info size={14} /></div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Synced to Floor Alpha</span>
                   </div>
                </div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PICKING COMMAND MODAL (Protocol #7) */}
      <AnimatePresence>
        {showPick && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-rose-900/20 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-[var(--bg-card)] w-full max-w-xl p-12 rounded-[3.5rem] border border-rose-500/20 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                   <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">Picking Command</div>
                   <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase leading-none mt-2">Deduct from Grid</h2>
                </div>
                <button onClick={() => setShowPick(null)} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[var(--bg-1)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">✕</button>
              </div>

              <div className="space-y-6">
                {inventory.find(i => i.id === showPick) ? (
                  <div className="space-y-6">
                    {(() => {
                      const item = inventory.find(i => i.id === showPick)!
                      return (
                        <>
                          <div className="bg-[var(--bg-1)] border border-[var(--border)] p-8 rounded-[2.5rem]">
                             <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-2">Total Distributed Units</div>
                             <div className="text-4xl font-black text-[var(--text-primary)]">{item.qtyOnHand} <span className="text-lg opacity-40">U</span></div>
                          </div>

                          <div className="space-y-4 max-h-60 overflow-y-auto pr-4 custom-scrollbar">
                            {item.locations?.map((loc, i) => (
                               <div key={i} className="flex items-center justify-between p-6 bg-[var(--bg-1)]/50 border border-[var(--border)] rounded-3xl group hover:bg-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer"
                                 onClick={() => {
                                    const qtyStr = prompt(`Enter Pick Quantity for ${loc.rack}:`, loc.qty.toString())
                                    const qty = parseInt(qtyStr || "0")
                                    if (qty > 0) {
                                       deductFromLocation(item.id, loc.rack, qty)
                                       addDailyRecord(item.id, new Date().toISOString().split('T')[0], undefined, qty)
                                       setShowPick(null)
                                    }
                                 }}
                               >
                                  <div>
                                     <div className="text-lg font-black text-[var(--text-primary)]">{loc.rack}</div>
                                     <div className="text-[9px] font-bold text-[var(--text-secondary)] opacity-40 uppercase">Bin {loc.bin || '00'}</div>
                                  </div>
                                  <div className="text-right">
                                     <div className="text-xl font-black text-[var(--text-primary)]">{loc.qty} <span className="text-[10px] opacity-40">U</span></div>
                                     <div className="text-[9px] font-black text-rose-500 uppercase tracking-widest group-hover:animate-pulse">Click to Pick</div>
                                  </div>
                               </div>
                            ))}
                            {(!item.locations || item.locations.length === 0) && (
                               <div className="text-center py-10 text-[var(--text-secondary)] opacity-40 font-bold text-sm">No localized stock found.</div>
                            )}
                          </div>
                        </>
                      )
                    })()}
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PUT-AWAY COMMAND MODAL (Protocol #5) */}
      <AnimatePresence>
        {showPutAway && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[var(--bg-0)]/40 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-[var(--bg-card)] w-full max-w-xl p-12 rounded-[3.5rem] border border-[var(--border)] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                   <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">Spatial Command</div>
                   <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase leading-none mt-2">Put-Away Asset</h2>
                </div>
                <button onClick={() => setShowPutAway(null)} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[var(--bg-1)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] opacity-40 tracking-widest pl-2">Target Rack (Select)</label>
                   <select 
                     value={putAwayData.rack} 
                     onChange={e => setPutAwayData({...putAwayData, rack: e.target.value})} 
                     className="w-full h-16 bg-[var(--bg-1)] border border-[var(--border)] px-8 rounded-3xl text-sm font-black text-[var(--text-primary)] outline-none focus:border-indigo-500 transition-all appearance-none uppercase"
                   >
                     <option value="" disabled className="bg-[var(--bg-1)]">Select Rack...</option>
                     {['A','B','C','D'].map(zone => Array.from({length: 8}).map((_, i) => {
                        const id = `${zone}-1-${i+1}`
                        return <option key={id} value={id} className="bg-[var(--bg-1)]">{id}</option>
                     }))}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] opacity-40 tracking-widest pl-2">Bin ID</label>
                   <input type="text" value={putAwayData.bin} onChange={e => setPutAwayData({...putAwayData, bin: e.target.value})} placeholder="01" className="w-full h-16 bg-[var(--bg-1)] border border-[var(--border)] px-8 rounded-3xl text-sm font-black text-[var(--text-primary)] outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div className="col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] opacity-40 tracking-widest pl-2">Quantity to Deposit</label>
                   <input type="number" value={putAwayData.qty} onChange={e => setPutAwayData({...putAwayData, qty: parseInt(e.target.value) || 0})} className="w-full h-16 bg-[var(--bg-1)] border border-[var(--border)] px-8 rounded-3xl text-sm font-black text-[var(--text-primary)] outline-none focus:border-indigo-500 transition-all" />
                </div>
              </div>

              <button onClick={handlePutAwaySubmit} className="w-full h-20 bg-indigo-600 text-[var(--bg-0)] rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-indigo-500 transition-all uppercase tracking-tight">Secure Placement</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADAPTIVE MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[var(--bg-2)]/80 backdrop-blur-2xl">
             <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="bg-[var(--bg-card)] w-full max-w-2xl p-12 rounded-[3.5rem] shadow-2xl border border-[var(--border)]">
                <div className="flex items-center justify-between mb-10">
                   <h2 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter uppercase leading-none">Register New Asset</h2>
                   <button onClick={() => setShowAddModal(false)} className="w-14 h-14 flex items-center justify-center rounded-full hover:bg-[var(--bg-1)] text-[var(--text-secondary)] opacity-40 hover:text-[var(--text-primary)] transition-all transform active:scale-90">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-10">
                   <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase text-[var(--text-secondary)] opacity-40 tracking-widest pl-2">SKU Asset ID</label>
                      <input type="text" value={newProduct.id} onChange={e => setNewProduct({...newProduct, id: e.target.value})} placeholder="PH11-X" className="w-full h-16 bg-[var(--bg-0)] border border-[var(--border)] px-8 rounded-3xl text-sm font-black text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase text-[var(--text-secondary)] opacity-40 tracking-widest pl-2">Product Description</label>
                      <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="iPhone 15 Pro Max" className="w-full h-16 bg-[var(--bg-0)] border border-[var(--border)] px-8 rounded-3xl text-sm font-black text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase text-[var(--text-secondary)] opacity-40 tracking-widest pl-2">Industrial Group</label>
                      <input type="text" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} placeholder="ELECTRONICS" className="w-full h-16 bg-[var(--bg-0)] border border-[var(--border)] px-8 rounded-3xl text-sm font-black text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase text-[var(--text-secondary)] opacity-40 tracking-widest pl-2">Opening Shift Balance</label>
                      <input type="number" value={newProduct.initialQty} onChange={e => setNewProduct({...newProduct, initialQty: parseInt(e.target.value) || 0})} className="w-full h-16 bg-[var(--bg-0)] border border-[var(--border)] px-8 rounded-3xl text-sm font-black text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all" />
                   </div>
                </div>
                <button onClick={handleCreateProduct} className="w-full h-20 bg-indigo-600 text-[var(--bg-0)] rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-indigo-500 hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-tight">Onboard into Grid</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
