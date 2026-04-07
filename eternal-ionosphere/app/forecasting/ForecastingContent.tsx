'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronDown, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Zap, 
  Target, 
  Layers, 
  Globe, 
  Terminal, 
  Plus, 
  Download, 
  Boxes,
  Cpu,
  Shield,
  LayoutGrid,
  List,
  Eye,
  TrendingUp,
  ArrowUpRight,
  Database,
  Upload,
  Calendar,
  Anchor,
  Wind,
  MousePointer2,
  Sparkles,
  BarChart3,
  FileSpreadsheet,
  TrendingDown,
  ShoppingBag,
  History,
  Truck,
  DollarSign,
  Info,
  X,
  MessageSquare,
  Bot,
  BrainCircuit,
  Settings2,
  Maximize2,
  Bell,
  Clock,
  ArrowRight,
  Send,
  SendHorizontal
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import * as XLSX from 'xlsx'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  ReferenceLine,
  Cell
} from 'recharts'
import { useToast } from '@/components/ui/Toast'
import { useAppStore, PRE_DEFINED_CATALOG } from '@/lib/store'

// --- Interface Types ---
interface Shipment {
  name: string
  date: string
  qty: number
}

interface SKUData {
  id: string
  name: string
  category: string
  qtyOnHand: number
  safetyStock: number
  price: number 
  utilizationRateMonth: number
  utilizationRateWeek: number
  growthRate: number 
  shipments: Shipment[]
}

const TIME_RANGES = [
  { label: '4W', value: 4 },
  { label: '8W', value: 8 },
  { label: '3M', value: 13 },
  { label: '6M', value: 26 },
  { label: '1Y', value: 52 },
]

// Unified Warehouse Data is now exclusively sourced from useAppStore()


export default function ForecastingContent() {
  const { inventory: skuList, setInventory, receiveShipment, addInventoryCount, shipments: allShipments } = useAppStore()
  
  const [horizon, setHorizon] = useState(26) 
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkuId, setSelectedSkuId] = useState<string>(skuList.length > 0 ? skuList[0].id : '')
  const [viewMode, setViewMode] = useState<'sku' | 'category'>('sku')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiMessage, setAiMessage] = useState<string>("Ready for analysis. Add products to begin forecasting.")
  const [userInput, setUserInput] = useState('')
  const [poDrafted, setPoDrafted] = useState(false)
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState<string>(new Date(Date.now() + 26 * 7 * 86400000).toISOString().split('T')[0])
  const [receiveModal, setReceiveModal] = useState<{ skuId: string, skuName: string } | null>(null)
  const [receiveQty, setReceiveQty] = useState(0)

  const { showToast } = useToast()

  const handleAiAsk = (e: React.FormEvent) => {
     e.preventDefault()
     if (!userInput.trim()) return
     setIsAiLoading(true)
     setAiMessage(`Analyzing patterns for "${userInput}"...`)
     setTimeout(() => {
        setIsAiLoading(false)
        if (userInput.toLowerCase().includes('stockout')) {
           setAiMessage("My models project STOCKOUT for AW-LLB by week 4 unless you reorder 500 units now. Would you like to proceed with the draft?")
        } else if (userInput.toLowerCase().includes('save')) {
           setAiMessage("You could save 12% on shipping by batching AW-LMB and AW-LLB into a single ocean manifest scheduled for 04/15.")
        } else if ((skuList.length > 0 ? skuList[0] : null)) {
           setAiMessage("Insights: Demand for " + (skuList.length > 0 ? skuList[0].name : "Unknown assets") + " is tracking 5.2% above baseline. Re-re-baselining your safety stock is recommended.")
        } else {
           setAiMessage("Add some products to the registry to analyze pattern recognition streams.")
        }
        setUserInput('')
        showToast('AI analysis finalized', 'success')
     }, 1500)
  }

  // Memoized Projection Matrix
  const matrixDates = useMemo(() => {
    const dates: string[] = []
    let curr = new Date(startDate)
    let end = new Date(endDate)
    
    // Safety check to prevent infinite loop
    if (end.getTime() <= curr.getTime()) {
      end = new Date(curr.getTime() + 26 * 7 * 86400000)
    }

    while (curr.getTime() <= end.getTime()) {
      dates.push(curr.toISOString().split('T')[0])
      curr.setUTCDate(curr.getUTCDate() + 7)
    }
    return dates
  }, [startDate, endDate])

  const projections = useMemo(() => {
    // 1. Pre-process shipments for faster lookup
    // Create a map of shipments by potential SKU matching keywords to avoid O(N) filtering inside the SKU loop
    const shipmentsBySku = new Map<string, any[]>()
    
    skuList.forEach(sku => {
      const skuIncoming: any[] = []
      const skuNameLower = sku.name.toLowerCase()

      allShipments.forEach(s => {
        if (s.status === 'Delivered') return // Only show pending shipments in forecast
        (s.items || []).forEach((item: any) => {
          const itemNameLower = item.name.toLowerCase()
          if (itemNameLower === skuNameLower) {
            skuIncoming.push({
              name: s.id,
              date: s.eta,
              qty: item.qty
            })
          }
        })
      })
      shipmentsBySku.set(sku.id, skuIncoming)
    })

      return skuList.map(sku => {
        const matrix: { date: string, balance: number, incoming: number, isDeficit: boolean }[] = []
        
        // SYNC STARTING BALANCE WITH DAILY LEDGER (Absolute Timeline Final Balance)
        let currentBalance = sku.qtyOnHand;

        let totalDeficitWeeks = 0
        let stockoutEta: string | null = null

      const incomingFromRegistry = shipmentsBySku.get(sku.id) || []
      const combinedShipments = [...(sku.shipments || []), ...incomingFromRegistry]

      // 2. Pre-index shipments by week to avoid O(N) filter inside the week loop
      const shipmentsByWeek = new Map<number, number>()
      combinedShipments.forEach(sh => {
        const weekTime = new Date(sh.date).getTime()
        // Find which matrix date this shipment belongs to
        // We'll calculate this during the matrix loop instead for precision,
        // or just sort shipments once.
      })
      
      // Sorting shipments once per SKU is faster than filtering for every week
      const sortedShipments = [...combinedShipments].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      let shipmentIdx = 0
      let weekIndex = 0

      matrixDates.forEach(dateStr => {
        const dateObj = new Date(dateStr)
        const nextWeekTime = dateObj.getTime() + 7 * 86400000
        
        let incoming = 0
        while (shipmentIdx < sortedShipments.length) {
          const shDate = new Date(sortedShipments[shipmentIdx].date).getTime()
          if (shDate < dateObj.getTime()) {
            shipmentIdx++
            continue
          }
          if (shDate < nextWeekTime) {
            incoming += sortedShipments[shipmentIdx].qty
            shipmentIdx++
          } else {
            break 
          }
        }

        currentBalance += incoming
        
        const baseWeeklyUsage = sku.utilizationRateWeek || (sku.utilizationRateMonth / 4.333)
        let trueWeeklyUsage = baseWeeklyUsage
        
        const periodRate = (sku.growthRate || 0) / 100
        if (sku.growthPeriod === 'week') {
            trueWeeklyUsage = baseWeeklyUsage * Math.pow(1 + periodRate, weekIndex)
        } else {
            trueWeeklyUsage = baseWeeklyUsage * Math.pow(1 + periodRate, weekIndex / 4.333)
        }

        currentBalance -= trueWeeklyUsage
        
        const isDeficit = currentBalance < sku.safetyStock
        if (isDeficit) totalDeficitWeeks++
        if (currentBalance <= 0 && !stockoutEta) {
          stockoutEta = new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        }

        matrix.push({
          date: dateStr,
          balance: Math.max(-10000, Math.round(currentBalance)),
          incoming,
          isDeficit
        })
        weekIndex++
      })

      return { sku, matrix, totalDeficitWeeks, stockoutEta }
    })
  }, [skuList, matrixDates, allShipments])

  const activeProjections = useMemo(() => {
    if (viewMode === 'category' && selectedCategory) {
      return projections.filter(p => p.sku.category === selectedCategory)
    }
    const single = projections.find(p => p.sku.id === selectedSkuId) || projections[0]
    return single ? [single] : []
  }, [projections, viewMode, selectedCategory, selectedSkuId])

  const chartData = useMemo(() => {
    if (activeProjections.length === 0) return []
    if (viewMode === 'sku') return activeProjections[0].matrix
    
    // Combine for category mode
    const dates = activeProjections[0].matrix.map(m => m.date)
    return dates.map((date, idx) => {
        const row: any = { date, isDeficit: false, incoming: 0, balance: 0 }
        activeProjections.forEach(p => {
           row[p.sku.id] = p.matrix[idx].balance 
           row.balance += p.matrix[idx].balance
           if (p.matrix[idx].isDeficit) row.isDeficit = true
           row.incoming += p.matrix[idx].incoming
        })
        return row
    })
  }, [activeProjections, viewMode])

  const isUp = useMemo(() => {
    if (activeProjections.length === 0 || chartData.length === 0) return false
    const lastBalance = chartData[chartData.length - 1].balance
    const initialBalance = activeProjections.reduce((sum, p) => sum + p.sku.qtyOnHand, 0)
    return lastBalance > initialBalance
  }, [activeProjections, chartData])

  const brandColor = activeProjections.some(p => p.totalDeficitWeeks > 0) ? '#ff5000' : 'var(--brand)'
  return (
    <div className="bg-[var(--bg-0)] min-h-screen text-[var(--text-primary)] font-sans selection:bg-[var(--brand)]/30">
      <main className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 p-10 h-[calc(100vh)] overflow-hidden">
        
        {/* --- LEFT SECTION: CHART & DATA --- */}
        <div className="overflow-y-auto pr-6 custom-scrollbar space-y-12 pb-32">
          
          {/* Header Stats */}
          <header>
            {activeProjections.length > 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                 <div className="flex items-center gap-4 mb-4">
                    <button 
                       onClick={() => setViewMode('sku')} 
                       className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'sku' ? 'bg-[var(--brand)] text-[var(--bg-0)] shadow-lg' : 'text-[var(--text-secondary)] opacity-40 hover:bg-[var(--bg-1)]'}`}
                    >Single Asset</button>
                    <button 
                       onClick={() => { setViewMode('category'); setSelectedCategory(activeProjections[0].sku.category || '') }} 
                       className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'category' ? 'bg-[var(--brand)] text-[var(--bg-0)] shadow-lg' : 'text-[var(--text-secondary)] opacity-40 hover:bg-[var(--bg-1)]'}`}
                    >Category Filter</button>
                 </div>
                 {viewMode === 'sku' ? (
                   <h1 className="text-6xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-6 leading-none">
                     {activeProjections[0].sku.name}
                   </h1>
                 ) : (
                   <select 
                     value={selectedCategory} 
                     onChange={e => setSelectedCategory(e.target.value)}
                     className="bg-transparent border-none text-6xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-6 leading-none focus:ring-0 p-0 hover:text-[var(--brand)] transition-colors cursor-pointer"
                   >
                      {Array.from(new Set(skuList.map(s => s.category).filter(Boolean))).map(c => (
                         <option key={c as string} value={c as string} className="bg-[var(--bg-1)] text-sm">{c as string}</option>
                      ))}
                   </select>
                 )}
                 <div className="flex items-end gap-6 mb-8">
                   <span className="text-7xl text-[var(--text-primary)] font-black tracking-tighter tabular-nums leading-none">
                     {activeProjections.reduce((sum, p) => sum + p.sku.qtyOnHand, 0).toLocaleString()} 
                   </span>
                   <div className="flex flex-col mb-1">
                      <div className={`flex items-center gap-1.5 text-base font-black uppercase tracking-widest ${isUp ? 'text-indigo-600' : 'text-rose-600'}`}>
                         {isUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                         {isUp ? '+12.4%' : '-8.2%'}
                      </div>
                      <div className="text-[11px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mt-1">Net Flow</div>
                   </div>
                 </div>
              </motion.div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-[var(--text-secondary)] opacity-40 uppercase font-black tracking-widest">
                No active asset selected. Add products below.
              </div>
            )}

            {activeProjections.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pb-2">
                  <div className="bg-[var(--bg-2)] border border-[var(--border)] rounded-3xl p-6 shadow-inner cursor-pointer" onClick={() => {}}>
                     <div className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4">Total Inventory Exposure</div>
                     <div className="text-3xl font-black text-[var(--text-primary)] tabular-nums">${activeProjections.reduce((sum, p) => sum + (p.sku.qtyOnHand * (p.sku.price || 0)), 0).toLocaleString()}</div>
                  </div>
                  <div className="bg-[var(--bg-2)] border border-[var(--border)] rounded-3xl p-6 shadow-inner">
                     <div className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4">Current Burn Velocity</div>
                     <div className="text-3xl font-black text-indigo-400 tabular-nums">{activeProjections.reduce((sum, p) => sum + p.sku.utilizationRateWeek, 0).toFixed(1)} <span className="text-xs uppercase ml-1 text-indigo-400/50">/ WK</span></div>
                  </div>
                  <div className="bg-[var(--bg-2)] border border-[var(--border)] rounded-3xl p-6 shadow-inner">
                     <div className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4">Replenishment Logic</div>
                     <div className="text-3xl font-black text-[var(--brand)] tabular-nums">4.0W <span className="text-xs uppercase ml-1 text-[var(--brand)] opacity-50">LEAD</span></div>
                  </div>
              </div>
            )}
          </header>

          {/* THE MAIN CHART */}
          <div className="w-full h-[480px] relative group bg-[var(--bg-2)] rounded-[48px] border border-[var(--border)] p-10 shadow-2xl overflow-hidden">
            <div className="absolute top-8 left-10 z-10">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">START</span>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-[var(--bg-1)] border border-[var(--border)] rounded-xl px-4 py-1.5 text-[9px] font-black text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">END</span>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-[var(--bg-1)] border border-[var(--border)] rounded-xl px-4 py-1.5 text-[9px] font-black text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                    />
                  </div>
                  <div className="h-6 w-px bg-[var(--border)] mx-2" />
                  <div className="flex items-center gap-2">
                    {TIME_RANGES.map(range => (
                      <button 
                        key={range.label}
                        onClick={() => {
                            const start = new Date(startDate)
                            const end = new Date(start.getTime() + range.value * 7 * 86400000)
                            setEndDate(end.toISOString().split('T')[0])
                        }}
                        className="px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-60 hover:opacity-100 hover:bg-[var(--bg-1)] transition-all border border-transparent hover:border-[var(--border)]"
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="absolute top-8 right-10 z-10 flex gap-3">
               <button onClick={() => {}} className="p-3 bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all shadow-xl">
                  <Download size={18} />
               </button>
               <button onClick={() => {}} className="p-3 bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all shadow-xl">
                  <Maximize2 size={18} />
               </button>
            </div>

            <div className="h-full pt-12">
                {activeProjections.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                  >
                      {activeProjections.map((p, i) => {
                         const color = viewMode === 'sku' ? brandColor : ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'][i % 7]
                         return (
                           <defs key={`def-${p.sku.id}`}>
                             <linearGradient id={`color-${p.sku.id}`} x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                                 <stop offset="95%" stopColor={color} stopOpacity={0}/>
                             </linearGradient>
                           </defs>
                         )
                      })}
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                      <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--text-secondary)', opacity: 0.4, fontSize: 10, fontWeight: 'black' }}
                      tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      minTickGap={60}
                      />
                      <YAxis hide domain={['dataMin - 1000', 'auto']} />
                      <Tooltip 
                      cursor={{ stroke: brandColor, strokeWidth: 1, strokeDasharray: '3 3' }}
                      content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                              <div className="bg-[var(--bg-1)] border border-[var(--border)] p-6 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] backdrop-blur-3xl min-w-[200px]">
                              <p className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.2em] mb-4 border-b border-[var(--border)] pb-2">{new Date(data.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              
                              {viewMode === 'sku' ? (
                                <p className="text-3xl font-black text-[var(--text-primary)] mb-2 tabular-nums">{data.balance.toLocaleString()} <span className="text-sm text-[var(--text-secondary)] opacity-40 uppercase ml-2 tracking-widest">Units</span></p>
                              ) : (
                                <div className="flex flex-col gap-3 mb-4 border-b border-[var(--border)] pb-4">
                                   {payload.map((entry: any) => {
                                      const pInfo = activeProjections.find(ap => ap.sku.id === entry.dataKey)
                                      return (
                                         <div key={entry.name} className="flex justify-between items-center text-sm font-black tabular-nums gap-6">
                                            <span style={{ color: entry.stroke }} className="uppercase tracking-widest text-[9px]">{pInfo?.sku.name || entry.name}</span>
                                            <span className="text-[var(--text-primary)]">{entry.value.toLocaleString()}</span>
                                         </div>
                                      )
                                   })}
                                </div>
                              )}

                              {data.incoming > 0 && (
                                  <div className="mt-2 flex items-center gap-3 text-cyan-400 bg-cyan-400/5 border border-cyan-400/10 p-3 rounded-2xl">
                                      <div className="w-8 h-8 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                                         <Anchor size={16} />
                                      </div>
                                      <div>
                                         <div className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">Incoming Manifest</div>
                                         <div className="text-xs font-black">+{data.incoming.toLocaleString()} ASSETS</div>
                                      </div>
                                  </div>
                              )}
                              {data.isDeficit && (
                                  <div className="mt-4 flex items-center gap-3 text-orange-400 bg-orange-400/5 border border-orange-400/10 p-3 rounded-2xl">
                                      <div className="w-8 h-8 rounded-xl bg-orange-400/10 flex items-center justify-center">
                                         <AlertTriangle size={16} />
                                      </div>
                                      <div className="text-[9px] font-black uppercase tracking-widest">Safety Breach Level</div>
                                  </div>
                              )}
                              </div>
                          )
                          }
                          return null
                      }}
                      />
                      {viewMode === 'sku' && (
                        <ReferenceLine 
                          y={activeProjections[0].sku.safetyStock} 
                          stroke="#ff5000" 
                          strokeDasharray="10 10" 
                          label={{ position: 'right', value: 'STRATEGIC SAFETY', fill: '#ff5000', fontSize: 10, fontWeight: 'black', offset: 20 }} 
                        />
                      )}
                      
                      {viewMode === 'sku' ? (
                        <Area 
                          type="monotone" 
                          dataKey="balance" 
                          stroke={brandColor} 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill={`url(#color-${activeProjections[0].sku.id})`} 
                          animationDuration={2500}
                        />
                      ) : (
                        activeProjections.map((p, i) => {
                           const color = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'][i % 7]
                           return (
                              <Area 
                                key={p.sku.id}
                                type="monotone" 
                                dataKey={p.sku.id} 
                                stroke={color} 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill={`url(#color-${p.sku.id})`} 
                                animationDuration={1500}
                              />
                           )
                        })
                      )}
                  </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center opacity-20">
                       <BarChart3 size={64} className="text-[var(--text-primary)] mx-auto mb-6" />
                       <div className="text-xs font-black text-[var(--text-primary)] uppercase tracking-[0.5em]">No Temporal Data Stream</div>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {activeProjections.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard label="Vault Safety" value={activeProjections.reduce((s,p)=>s+p.sku.safetyStock, 0)} icon={Shield} />
              <StatCard label="Registry Horizon" value={activeProjections[0].sku.utilizationRateWeek > 0 ? (activeProjections[0].sku.qtyOnHand / activeProjections[0].sku.utilizationRateWeek).toFixed(1) + ' WKS' : 'INF'} icon={Clock} />
              <StatCard label="Anomalous Gaps" value={activeProjections.reduce((s,p)=>s+p.totalDeficitWeeks, 0) > 0 ? `${activeProjections.reduce((s,p)=>s+p.totalDeficitWeeks, 0)} WKS` : 'ZERO'} icon={AlertTriangle} isDanger={activeProjections.some(p => p.totalDeficitWeeks > 0)} />
              <StatCard label="Entities Tracked" value={activeProjections.length} icon={Zap} />
            </div>
          )}

          {/* Product Registry Sheet */}
          <section className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[48px] overflow-hidden shadow-2xl">
            <div className="p-10 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                 <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tighter flex items-center gap-3">
                    <Boxes size={22} className="text-cyan-500" /> Product Registry
                 </h3>
                 <p className="text-[10px] text-[var(--text-secondary)] opacity-40 font-black uppercase tracking-widest mt-1">Manage forecasting assets</p>
              </div>
                <div className="flex gap-4">
                  <select 
                    onChange={(e) => {
                      const catalogItem = PRE_DEFINED_CATALOG.find(c => c.name === e.target.value)
                      if (!catalogItem) return;
                      const newSku: SKUData = {
                        ...catalogItem,
                        id: `${catalogItem.id}-${Math.floor(Math.random()*1000)}`,
                        shipments: [],
                        dailyRecords: []
                      }
                      setInventory([...skuList, newSku])
                      setSelectedSkuId(newSku.id)
                      showToast(`Added ${catalogItem.name} to Forecast Registry`, 'success')
                    }}
                    className="bg-[var(--bg-0)] border border-[var(--border)] text-[10px] font-black px-6 py-4 rounded-2xl text-[var(--text-primary)] focus:ring-2 focus:ring-cyan-500 uppercase tracking-widest cursor-pointer"
                  >
                    <option value="" disabled selected>Pre-Add from Catalog...</option>
                    {PRE_DEFINED_CATALOG.map(c => <option key={c.id} value={c.name} className="bg-[var(--bg-1)]">{c.name} ({c.category})</option>)}
                  </select>
                  <button 
                    onClick={() => {
                      const newSku: SKUData = {
                        id: `NEW-${Math.floor(Math.random()*10000)}`,
                        name: 'Custom Component',
                        category: 'Misc',
                        qtyOnHand: 100,
                        safetyStock: 50,
                        price: 1,
                        utilizationRateMonth: 100,
                        utilizationRateWeek: 25,
                        growthRate: 1,
                        growthPeriod: 'month',
                        shipments: []
                      }
                      setInventory([...skuList, newSku])
                      setSelectedSkuId(newSku.id)
                    }}
                    className="bg-cyan-500 text-black text-[10px] font-black px-8 py-4 rounded-2xl flex items-center gap-3 shadow-xl transition-all uppercase tracking-widest"
                  >
                    <Plus size={18} /> Add Custom
                  </button>
                </div>
            </div>

            <div className="overflow-x-auto p-10 mt-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                    <th className="pb-6">ID (MS-MF)</th>
                    <th className="pb-6">Description</th>
                    <th className="pb-6">Category</th>
                    <th className="pb-6 text-right">Qty On Hand</th>
                    <th className="pb-6 text-right">Price</th>
                    <th className="pb-6 text-right">Burn/Wk</th>
                    <th className="pb-6 text-right w-40">Growth Δ</th>
                    <th className="pb-6 text-right">Safety</th>
                    <th className="pb-6 text-right">Location</th>
                    <th className="pb-6 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">                   {skuList.map((sku, idx) => (
                    <tr key={sku.id} className={`group hover:bg-[var(--bg-2)] transition-colors ${selectedSkuId === sku.id ? 'bg-[var(--bg-2)] border-l-4 border-[var(--brand)]' : ''}`}>
                      <td className="py-6">
                        <input 
                          className="bg-transparent border-none text-[11px] font-black text-cyan-400 w-full focus:ring-0 uppercase"
                          value={sku.id}
                          onChange={(e) => {
                            const newList = [...skuList]
                            newList[idx].id = e.target.value
                            setInventory(newList)
                          }}
                        />
                      </td>
                      <td className="py-6">
                        <input 
                          className="bg-transparent border-none text-[11px] font-black text-[var(--text-primary)] w-full focus:ring-0 uppercase"
                          value={sku.name}
                          onChange={(e) => {
                            const newList = [...skuList]
                            newList[idx].name = e.target.value
                            setInventory(newList)
                          }}
                        />
                      </td>

                      <td className="py-6">
                        <input 
                          list={`cat-list-${sku.id}`}
                          className="bg-transparent border-none text-[11px] font-black text-emerald-400 w-full focus:ring-0 uppercase placeholder:text-emerald-400/30"
                          placeholder="UNCATEGORIZED"
                          value={sku.category || ''}
                          onChange={(e) => {
                            const newList = [...skuList]
                            newList[idx].category = e.target.value
                            setInventory(newList)
                          }}
                        />
                        <datalist id={`cat-list-${sku.id}`}>
                           {Array.from(new Set(skuList.map(s => s.category).filter(Boolean))).map(c => (
                              <option key={c as string} value={c as string} />
                           ))}
                        </datalist>
                      </td>
                      <td className="py-6">
                        <div className="bg-transparent border-none text-[11px] font-black text-[var(--text-primary)] w-24 text-right focus:ring-0">
                          {sku.qtyOnHand.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-6">
                        <input 
                          type="number"
                          className="bg-transparent border-none text-[11px] font-black text-[var(--text-primary)] w-20 text-right focus:ring-0"
                          value={sku.price}
                          onChange={(e) => {
                            const newList = [...skuList]
                            newList[idx].price = parseFloat(e.target.value) || 0
                            setInventory(newList)
                          }}
                        />
                      </td>
                      <td className="py-6">
                        <input 
                          type="number"
                          className="bg-transparent border-none text-[11px] font-black text-indigo-400 w-24 text-right focus:ring-0"
                          value={sku.utilizationRateWeek}
                          onChange={(e) => {
                            const newList = [...skuList]
                            newList[idx].utilizationRateWeek = parseFloat(e.target.value) || 0
                            setInventory(newList)
                          }}
                        />
                      </td>
                      <td className="py-6 border-b border-transparent">
                        <div className="flex flex-col items-end gap-1">
                          <input 
                            type="number"
                            className="bg-transparent border-none text-[11px] font-black w-14 text-right focus:ring-0 p-0 text-cyan-300"
                            value={sku.growthRate}
                            onChange={(e) => {
                              const newList = [...skuList]
                              newList[idx].growthRate = parseFloat(e.target.value) || 0
                              setInventory(newList)
                            }}
                          />
                          <select 
                            className="bg-transparent border-none text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] focus:ring-0 p-0 text-right cursor-pointer"
                            value={sku.growthPeriod || 'month'}
                            onChange={(e) => {
                              const newList = [...skuList]
                              newList[idx].growthPeriod = e.target.value as 'month' | 'week'
                              setInventory(newList)
                            }}
                          >
                            <option value="month" className="bg-[var(--bg-1)]">% / MO</option>
                            <option value="week" className="bg-[var(--bg-1)]">% / WK</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-6">
                        <input 
                          type="number"
                          className="bg-transparent border-none text-[11px] font-black text-rose-400 w-24 text-right focus:ring-0"
                          value={sku.safetyStock}
                          onChange={(e) => {
                            const newList = [...skuList]
                            newList[idx].safetyStock = parseInt(e.target.value) || 0
                            setInventory(newList)
                          }}
                        />
                      </td>
                      <td className="py-6">
                        <input 
                          className="bg-transparent border-none text-[11px] font-black text-emerald-400 w-20 text-right focus:ring-0 uppercase"
                          value={(sku as any).location || ''}
                          placeholder="A-1"
                          onChange={(e) => {
                            const newList = [...skuList] as any[]
                            newList[idx].location = e.target.value
                            setInventory(newList)
                          }}
                        />
                      </td>                       <td className="py-6 text-right">
                        <div className="flex justify-end gap-2 text-[var(--text-secondary)]">
                          <button 
                            onClick={() => { setReceiveModal({ skuId: sku.id, skuName: sku.name }); setReceiveQty(0) }}
                            className="p-2 rounded-xl transition-all bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-[var(--bg-0)] border border-emerald-500/20"
                            title="Receive Shipment"
                          >
                            <Truck size={16} />
                          </button>
                          <button 
                            onClick={() => setSelectedSkuId(sku.id)}
                            className={`p-2 rounded-xl transition-all ${selectedSkuId === sku.id ? 'bg-cyan-500 text-[var(--bg-0)]' : 'bg-[var(--bg-0)] border border-[var(--border)] opacity-40 hover:opacity-100 hover:text-[var(--text-primary)]'}`}
                          >
                            <TrendingUp size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              const newList = skuList.filter(s => s.id !== sku.id)
                              setInventory(newList)
                              if (selectedSkuId === sku.id) setSelectedSkuId(newList[0]?.id || '')
                            }}
                            className="p-2 bg-[var(--bg-0)] border border-[var(--border)] opacity-40 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                  {skuList.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-20 text-center text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">
                        Registry Empty - Add products to begin
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* --- RIGHT SECTION: AI COPILOT & ACTIONS --- */}
        <aside className="flex flex-col gap-8 h-full overflow-hidden">
          
          {/* AI COPILOT & ACTIONS */}
          <section className="bg-[var(--bg-2)] backdrop-blur-3xl rounded-[48px] border border-[var(--border)] p-8 flex flex-col h-[600px] shadow-[0_40px_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-600/10 blur-[100px] pointer-events-none transition-all duration-1000 group-hover:opacity-100" />
            
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                    <BrainCircuit size={28} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest leading-none">Forge.AI</h3>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_indigo]" />
                       <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Neural Sync</span>
                    </div>
                  </div>
               </div>
               <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer">
                  <Settings2 size={18} />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
               <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[32px] p-8 text-sm leading-relaxed text-[var(--text-secondary)] font-bold shadow-inner border-[var(--border)]">
                  {aiMessage}
               </div>

               {activeProjections.some(p => p.totalDeficitWeeks > 0) && (
                 <div className="bg-orange-500/10 border border-orange-500/30 rounded-[32px] p-8 relative group overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                        <AlertTriangle size={80} />
                    </div>
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                       <AlertTriangle size={18} className="text-orange-600" />
                       <span className="text-[11px] font-black text-orange-600 uppercase tracking-[0.2em]">Priority Alert</span>
                    </div>
                    <p className="text-sm text-[var(--text-primary)] leading-relaxed relative z-10 font-bold">
                       Inventory collapse projected for critical assets: <span className="text-[var(--brand)] font-black underline decoration-orange-500 decoration-2 underline-offset-4">{activeProjections.filter(p => p.totalDeficitWeeks > 0).map(p => p.sku.name).join(', ')}</span>. Earliest collapse in {26 - Math.max(...activeProjections.map(p => p.totalDeficitWeeks))} weeks. Lead time from origin is currently 28 days. 
                    </p>
                    <button 
                       onClick={() => {
                          setPoDrafted(true)
                          setAiMessage("Protocol established. Draft PO #8271-X has been generated and broadcasted to Supply Chain Command.")
                          showToast('Expedited PO #8271-X Drafted', 'success')
                       }}
                       className={`mt-8 w-full py-5 ${poDrafted ? 'bg-emerald-600 text-[var(--text-primary)] shadow-emerald-500/40' : 'bg-orange-600 text-[var(--text-primary)] shadow-orange-600/40'} rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 relative z-10`}
                    >
                       {poDrafted ? <CheckCircle2 size={24} /> : <Zap size={24} />}
                       {poDrafted ? 'DRAFT BROADCASTED' : 'Sync Expedited PO'}
                    </button>
                 </div>
               )}

               <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-[32px] p-8 group cursor-pointer hover:border-cyan-600/50 transition-all shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                     <Zap size={18} className="text-cyan-600" />
                     <span className="text-[11px] font-black text-cyan-600 uppercase tracking-[0.2em]">Velocity Sync</span>
                  </div>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed font-bold">
                    Current growth is 4.2% above baseline. System recommends increasing safety buffer to 6,000 units to avoid stockout.
                  </p>
                   <button onClick={() => {}} className="mt-6 text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2 group/btn">
                    Apply Refactoring <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>

            <form onSubmit={handleAiAsk} className="mt-8 relative">
               <input 
                 type="text" 
                 placeholder="Communicate with Forge.AI..." 
                 value={userInput}
                 onChange={(e) => setUserInput(e.target.value)}
                 className="w-full bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl py-4 pl-6 pr-14 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-[var(--brand)] transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
               />
               <button 
                 type="submit"
                 disabled={isAiLoading}
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--brand)] hover:text-[var(--text-primary)] disabled:opacity-50 transition-colors"
               >
                  {isAiLoading ? (
                     <div className="w-5 h-5 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                  ) : (
                     <SendHorizontal size={20} />
                  )}
               </button>
            </form>
          </section>

          {/* Quick Assets / SKU Watchlist */}
          <section className="bg-[var(--bg-2)] border border-[var(--border)] rounded-[32px] p-8 shadow-2xl flex-1 overflow-hidden flex flex-col">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-[11px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.3em]">Watchlist Core</h3>
                <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-[32px] border border-indigo-500/30">{projections.length} NODES</span>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                {projections.map(p => (
                  <div 
                    key={p.sku.id}
                    onClick={() => {
                        setSelectedSkuId(p.sku.id)
                        setSelectedCategory('')
                        setViewMode('sku')
                        showToast(`Visualizing assets for ${p.sku.id}`, 'info')
                    }}
                    className={`p-6 rounded-[32px] border transition-all cursor-pointer group ${selectedSkuId === p.sku.id ? 'bg-[var(--brand)] border-[var(--brand)] shadow-2xl shadow-[var(--brand)]/20' : 'bg-[var(--bg-1)] border-[var(--border)] hover:border-[var(--brand)] shadow-md'}`}
                  >
                     <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                           <span className={`text-[11px] font-black uppercase tracking-widest ${selectedSkuId === p.sku.id ? 'text-[var(--bg-2)]/80' : 'text-[var(--text-secondary)]'}`}>{p.sku.id}</span>
                           <span className={`text-base font-black uppercase tracking-tight ${selectedSkuId === p.sku.id ? 'text-[var(--bg-2)]' : 'text-[var(--text-primary)]'}`}>{p.sku.name}</span>
                        </div>
                        <div className="text-right">
                           <div className={`text-xl font-black tabular-nums ${selectedSkuId === p.sku.id ? 'text-[var(--bg-2)]' : 'text-[var(--text-primary)]'}`}>{p.sku.qtyOnHand}</div>
                           {p.totalDeficitWeeks > 0 && <div className="flex gap-1 mt-1 animate-pulse"><div className="w-1.5 h-1.5 bg-rose-600 rounded-full" /><div className="w-1.5 h-1.5 bg-rose-600 rounded-full" /><div className="w-1.5 h-1.5 bg-rose-600 rounded-full" /></div>}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
             <button onClick={() => {}} className="mt-8 w-full py-5 border-2 border-dashed border-[var(--border)] rounded-[32px] flex items-center justify-center gap-4 text-[var(--text-secondary)] opacity-20 hover:opacity-100 hover:border-indigo-500/30 hover:bg-[var(--bg-1)] transition-all group">
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sync Data Asset</span>
             </button>
          </section>
        </aside>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6366f1; border: 0px solid transparent; background-clip: border-box; }
      `}</style>

      {/* --- RECEIVE SHIPMENT MODAL --- */}
      <AnimatePresence>
        {receiveModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-8 backdrop-blur-3xl bg-[var(--bg-2)]/70">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-[var(--bg-2)] border border-[var(--border)] rounded-[48px] p-12 w-full max-w-lg shadow-[0_0_80px_rgba(16,185,129,0.15)]"
            >
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 rounded-[24px] bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Truck size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Receive Shipment</h2>
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-1">{receiveModal.skuName}</p>
                </div>
              </div>
              <label className="block text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-3">Quantity Received</label>
              <input
                type="number"
                className="w-full bg-[var(--bg-1)] border border-emerald-500/20 rounded-2xl px-6 py-4 text-3xl font-black text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-center mb-8"
                value={receiveQty}
                onChange={(e) => setReceiveQty(parseInt(e.target.value) || 0)}
                autoFocus
                min={0}
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setReceiveModal(null)}
                  className="flex-1 py-5 bg-[var(--bg-1)] border border-[var(--border)] text-[var(--text-secondary)] opacity-40 rounded-3xl text-xs font-black uppercase tracking-widest hover:opacity-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (receiveQty <= 0) return
                    addInventoryCount(receiveModal.skuId, receiveQty)
                    showToast(`+${receiveQty.toLocaleString()} units received for ${receiveModal.skuName}`, 'success')
                    setReceiveModal(null)
                  }}
                  className="flex-[2] py-5 bg-emerald-600 text-white rounded-3xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-600/30 hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
                >
                  <Truck size={18} /> Receive & Update Inventory
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, isDanger = false }: any) {
  return (
    <div className="bg-[var(--bg-2)] border border-[var(--border)] p-8 rounded-[40px] group hover:border-[var(--brand)] transition-all shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700">
          <Icon size={48} />
      </div>
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className={`p-3 rounded-2xl ${isDanger ? 'bg-orange-500/20 text-orange-400' : 'bg-cyan-500/20 text-cyan-400'} border border-[var(--border)]`}>
          <Icon size={20} />
        </div>
        <div className={`w-2 h-2 rounded-full ${isDanger ? 'bg-orange-500 status-pulse' : 'bg-[var(--text-muted)]'} transition-colors shadow-xl`} />
      </div>
      <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-2 relative z-10">{label}</p>
      <p className={`text-3xl font-black tabular-nums tracking-tighter relative z-10 ${isDanger ? 'text-orange-500' : 'text-[var(--text-primary)]'}`}>{value}</p>
    </div>
  )
}

function SendIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}
