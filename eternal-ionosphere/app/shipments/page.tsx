'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Ship, Plane, Truck, FileSpreadsheet, Upload, Search, Filter, Download, Plus, 
  Package, Calendar, X, ChevronDown, Info, MapPin, ArrowRight, Activity, Brain, 
  Cpu, Globe, Zap, Box, Anchor, Clock, Activity as ActivityIcon, ShoppingCart,
  Save, Trash2, ChevronRight, BarChart3, ExternalLink, Share2, CheckCircle2
} from 'lucide-react'
import * as XLSX from 'xlsx'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { useAppStore } from '@/lib/store'

const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false, loading: () => (
  <div className="w-full h-full flex items-center justify-center bg-[var(--bg-0)]">
    <div className="w-8 h-8 border-2 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
  </div>
) })

// --- MODES CONFIG ---
const FREIGHT_MODES = [
  { id: 'sea', label: 'Sea Freight', icon: Anchor },
  { id: 'air', label: 'Air Cargo', icon: Plane },
  { id: 'land', label: 'Land Truck', icon: Truck },
]

// --- CONSTANTS & UTILS ---
const INITIAL_SHIPMENTS: any[] = []

const calculateProgress = (shipDateStr: string, etaStr: string) => {
  const start = new Date(shipDateStr).getTime()
  const end = new Date(etaStr).getTime()
  if (isNaN(start) || isNaN(end) || start === end) return 0
  const now = new Date().getTime()
  if (now <= start) return 0
  if (now >= end) return 1
  return (now - start) / (end - start)
}

const getAutomaticStatus = (progress: number) => {
  if (progress <= 0) return 'Pending'
  if (progress < 0.2) return 'Shipped'
  if (progress < 0.9) return 'In Transit'
  if (progress < 1) return 'Arriving Soon'
  return 'Delivered'
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// --- COMPONENTS ---

const AddressAutocomplete = ({ value, onChange, placeholder, hasCoords }: { value: string, onChange: (v: string, lat?: number, lon?: number) => void, placeholder: string, hasCoords: boolean }) => {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => { if (!isOpen) setQuery(value); }, [value, isOpen]);

  const debouncedQuery = useDebounce(query, 600);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && debouncedQuery && debouncedQuery.length > 2) {
      setLoading(true);
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedQuery)}&format=json&limit=5`)
      .then(r => r.json())
      .then(data => {
         setResults(Array.isArray(data) ? data : []);
         setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [debouncedQuery, isOpen]);

  return (
    <div ref={wrapperRef} className="relative w-full mb-1 group">
      <div className={`flex items-center bg-[var(--bg-3)] border rounded-lg focus-within:border-[var(--brand)] h-8 transition-all overflow-hidden ${hasCoords ? 'border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.1)]' : 'border-[var(--border)]'}`}>
        <input 
          className="bg-transparent border-none text-[10px] text-[var(--text-primary)] w-full py-0 px-2 focus:ring-0 h-full placeholder:text-[var(--text-muted)]"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); onChange(e.target.value); }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
        />
        {hasCoords && <MapPin size={12} className="mr-2 text-emerald-500 shrink-0 animate-in fade-in zoom-in duration-300" />}
        {loading && <div className="mr-2 w-2 h-2 border-2 border-[var(--brand)] border-t-transparent rounded-full animate-spin"></div>}
      </div>
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 z-[100] mt-1 bg-[var(--bg-2)] border border-[var(--border)] rounded-lg shadow-2xl max-h-48 overflow-auto backdrop-blur-xl">
          {results.map((res: any, idx: number) => (
            <div key={idx} 
              onClick={() => { 
                setQuery(res.display_name); 
                onChange(res.display_name, parseFloat(res.lat), parseFloat(res.lon));
                setIsOpen(false); 
              }}
              className="px-3 py-2 cursor-pointer text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--brand)]/10 border-b border-[var(--border)] last:border-0 truncate"
            >
              {res.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const ShipmentMap = ({ shipments }: { shipments: any[] }) => {
  return (
    <div className="card h-[450px] overflow-hidden p-0 relative bg-[var(--bg-0)] border border-[var(--border)] shadow-2xl rounded-[32px]">
      <LeafletMap shipments={shipments} />
    </div>
  )
}

const ShipmentSheet = ({ shipments, onShipmentsChange, onReceive, showToast }: { shipments: any[], onShipmentsChange: (s: any[] | ((prev: any[]) => any[])) => void, onReceive: (s: any) => void, showToast: any }) => {
  const [expandedAsn, setExpandedAsn] = useState<string | null>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (evt) => {
      const bstr = evt.target?.result
      const wb = XLSX.read(bstr, { type: 'binary' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(ws)
      const mappedData = data.map((row: any) => ({
        id: row.ID || row.id || `ASN-${Math.floor(Math.random()*10000)}`,
        supplier: row.Supplier || row.supplier || 'Unknown',
        items: [{ id: Math.random().toString(36).substr(2, 9), name: row.Product || row.product || 'Unknown', qty: row.Quantity || row.quantity || 0 }],
        type: (row.Type || row.type || 'sea').toLowerCase(),
        origin: row.Origin || row.origin || 'Shenzhen',
        destination: row.Destination || row.destination || 'Los Angeles',
        shipDate: row['Ship Date'] || row.shipDate || new Date().toISOString().split('T')[0],
        eta: row.ETA || row.eta || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        tracking: row.Tracking || row.tracking || '-',
        status: row.Status || row.status || 'In Transit'
      }))
      onShipmentsChange((prev: any[]) => [...prev, ...mappedData])
      
    }
    reader.readAsBinaryString(file)
  }

  const updateField = (id: string, field: string, value: any) => {
    onShipmentsChange((prev: any[]) => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const updateFields = (id: string, patch: any) => {
    onShipmentsChange((prev: any[]) => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  const updateItem = (asnId: string, itemIdx: number, patch: any) => {
    onShipmentsChange((prev: any[]) => prev.map(s => {
      if (s.id === asnId) {
        const newItems = s.items.map((it: any, i: number) => i === itemIdx ? { ...it, ...patch } : it)
        return { ...s, items: newItems }
      }
      return s
    }))
  }

  const addItem = (asnId: string) => {
    const newItem = { id: Math.random().toString(36).substr(2, 9), name: '', qty: 1 };
    onShipmentsChange((prev: any[]) => prev.map(s => {
      if (s.id === asnId) {
        return { ...s, items: [...(s.items || []), newItem] }
      }
      return s
    }))
  }

  const removeItem = (asnId: string, itemIdx: number) => {
    onShipmentsChange((prev: any[]) => prev.map(s => {
      if (s.id === asnId) {
        return { ...s, items: s.items.filter((_: any, i: number) => i !== itemIdx) }
      }
      return s
    }))
  }

  return (
    <div className="glass-panel p-0 overflow-hidden border border-[var(--border)] bg-[var(--bg-2)] rounded-[1.5rem] shadow-xl">
      <div className="p-8 border-b border-border flex items-center justify-between bg-[var(--bg-1)]/50">
        <div>
            <h3 className="text-xl font-bold flex items-center gap-3 text-[var(--text-primary)] uppercase tracking-tight">
            <BarChart3 className="w-6 h-6 text-brand" />
            Registry Hub
            </h3>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Global logistics management</p>
        </div>
        <div className="flex gap-4">
          <label className="bg-[var(--bg-0)] border border-border text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-2xl cursor-pointer flex items-center gap-2 text-[var(--text-muted)] hover:text-brand transition-all">
            <Upload size={16} /> Import Manifest
            <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleUpload} />
          </label>
          <button className="btn-primary text-[10px] px-6 py-3 flex items-center gap-2" onClick={() => {
            const newId = `ASN-${Date.now().toString().slice(-4)}`
            onShipmentsChange((prev: any[]) => [{
              id: newId, supplier: '', items: [], type: 'sea', origin: 'Shenzhen', destination: 'Los Angeles',
              originLat: 22.5431, originLon: 114.0579, destLat: 34.0522, destLon: -118.2437,
              shipDate: new Date().toISOString().split('T')[0], eta: new Date(Date.now() + 14 * 1000*60*60*24).toISOString().split('T')[0],
              tracking: '', status: 'Draft'
            }, ...prev])
          }}>
            <Plus size={18} /> New Shipment
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--bg-1)]/50 border-b border-border text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              <th className="p-6 w-12"></th>
              <th className="p-6">Registry ID</th>
              <th className="p-6">Freight Protocol</th>
              <th className="p-6">Entity</th>
              <th className="p-6">Assets</th>
              <th className="p-6">Terminal Route</th>
              <th className="p-6">Tracking</th>
              <th className="p-6">Timeline</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((s) => {
              const isExpanded = expandedAsn === s.id;
              const progress = calculateProgress(s.shipDate, s.eta);
              const isLastMile = progress > 0.9 && progress < 1.0;
              return (
                <React.Fragment key={s.id}>
                  <tr className={`border-b border-border transition-all ${isExpanded ? 'bg-[var(--bg-2)]' : 'hover:bg-[var(--bg-1)]/50 cursor-pointer'}`} onClick={(e) => {
                      if(!(e.target as HTMLElement).closest('button, select, input')) setExpandedAsn(isExpanded ? null : s.id)
                  }}>
                    <td className="p-6">
                      <button onClick={() => setExpandedAsn(isExpanded ? null : s.id)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-transform">
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>
                    </td>
                    <td className="p-6 font-mono font-bold text-brand text-xs uppercase">{s.id}</td>
                    <td className="p-6">
                       <div className="flex items-center gap-4">
                          <div className={`relative w-10 h-10 rounded-xl bg-[var(--bg-0)] border border-[var(--border)] flex items-center justify-center p-2 shadow-sm text-[var(--brand)]`}>
                             {isLastMile ? <Truck size={22} className="text-emerald-500" /> : s.type === 'sea' ? <Anchor size={22} /> : s.type === 'air' ? <Plane size={22} /> : <Box size={22} />}
                          </div>
                          <div className="flex flex-col">
                            <select className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] focus:ring-0 p-0 cursor-pointer hover:text-brand transition-colors" 
                              value={s.type} onChange={(e) => updateField(s.id, 'type', e.target.value)}>
                              {FREIGHT_MODES.map(m => <option key={m.id} value={m.id}>{m.label.toUpperCase()}</option>)}
                            </select>
                            <span className={`text-[8px] font-bold mt-1 ${isLastMile ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>
                              {isLastMile ? 'PRIORITY HUB' : 'GLOBAL FREIGHT'}
                            </span>
                          </div>
                       </div>
                    </td>
                    <td className="p-6">
                      <input className="bg-transparent border-none text-[11px] font-bold uppercase tracking-widest w-full focus:ring-2 focus:ring-brand/20 rounded-lg px-2 py-1 text-[var(--text-primary)] hover:bg-[var(--bg-1)] transition-colors" 
                        value={s.supplier} onChange={(e) => updateField(s.id, 'supplier', e.target.value)} />
                    </td>
                    <td className="p-6">
                       <button onClick={() => setExpandedAsn(isExpanded ? null : s.id)} 
                        className="bg-[var(--bg-1)] border border-border px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold text-[var(--text-primary)] hover:bg-brand hover:text-[var(--bg-0)] transition-all shadow-sm uppercase tracking-widest">
                         <Package size={14} /> {s.items?.length || 0} Assets
                       </button>
                    </td>
                    <td className="p-6 w-[280px]">
                        <div className="space-y-1">
                            <AddressAutocomplete value={s.origin} placeholder="Origin" 
                                hasCoords={!!s.originLat}
                                onChange={(v, lat, lon) => updateFields(s.id, { origin: v, originLat: lat, originLon: lon })} />
                            <AddressAutocomplete value={s.destination} placeholder="Destination" 
                                hasCoords={!!s.destLat}
                                onChange={(v, lat, lon) => updateFields(s.id, { destination: v, destLat: lat, destLon: lon })} />
                        </div>
                    </td>
                    <td className="p-6">
                       <div className="flex flex-col gap-1 group/track relative">
                          <input 
                            className="bg-[var(--bg-1)] border-none text-[10px] font-mono font-bold text-brand focus:ring-2 focus:ring-brand/20 rounded-lg p-2 w-32 tracking-widest placeholder:text-[var(--text-muted)]"
                            placeholder="T-ID"
                            value={s.tracking} 
                            onChange={(e) => updateField(s.id, 'tracking', e.target.value)} 
                          />
                       </div>
                    </td>
                    <td className="p-6">
                       <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 bg-[var(--bg-1)] px-3 py-1.5 rounded-lg border border-border">
                             <input type="date" className="bg-transparent border-none text-[9px] w-24 focus:ring-0 text-[var(--text-primary)] font-bold" value={s.shipDate} onChange={(e) => updateField(s.id, 'shipDate', e.target.value)} />
                          </div>
                          <div className="flex items-center gap-2 bg-brand/5 px-3 py-1.5 rounded-lg border border-brand/10">
                             <input type="date" className="bg-transparent border-none text-[10px] w-24 font-bold text-brand focus:ring-0" value={s.eta} onChange={(e) => updateField(s.id, 'eta', e.target.value)} />
                          </div>
                       </div>
                    </td>
                    <td className="p-6">
                       <span className={`px-3 py-1.5 rounded-xl font-bold text-[9px] border ${
                         isLastMile ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                         getAutomaticStatus(progress) === 'Arriving Soon' ? 'bg-emerald-600 text-[var(--bg-0)] border-transparent' : 
                         'bg-brand/10 text-brand border-brand/20'
                       }`}>
                         {isLastMile ? 'LAST MILE' : getAutomaticStatus(progress).toUpperCase()}
                       </span>
                    </td>
                    <td className="p-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-500 hover:text-[var(--bg-0)] hover:bg-emerald-500 transition-all border border-emerald-500/20 shadow-sm"
                            title="Receive into Inventory"
                            onClick={(e) => { e.stopPropagation(); onReceive(s) }}>
                            <Package size={16} />
                          </button>
                          <button 
                            className="bg-rose-500/10 p-2.5 rounded-xl text-rose-500 hover:text-[var(--bg-0)] hover:bg-rose-500 transition-all border border-rose-500/20 shadow-sm" 
                            onClick={(e) => { e.stopPropagation(); onShipmentsChange((prev: any[]) => prev.filter(x => x.id !== s.id));  }}>
                            <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                  
                  {/* EXPANDED ITEMS MANAGER */}
                  <AnimatePresence>
                    {isExpanded && (
                      <tr>
                        <td colSpan={10} className="p-0 border-b border-border overflow-hidden">
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="bg-[var(--bg-1)]/50 p-10 flex flex-col gap-8 overflow-hidden border-l-4 border-brand">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] text-brand flex items-center justify-center shadow-lg">
                                     <ShoppingCart size={24} />
                                   </div>
                                   <div>
                                      <h4 className="text-lg font-bold text-[var(--text-primary)] uppercase flex items-center gap-2">Payload Details <span className="text-brand/50">#</span>{s.id}</h4>
                                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase mt-1">Asset volume verification HUB</p>
                                   </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => addItem(s.id)} className="btn-primary text-[10px] font-bold px-8 py-3 rounded-2xl flex items-center gap-2 transition-all uppercase tracking-widest">
                                        <Plus size={16} /> Add Asset
                                    </button>
                                </div>
                             </div>

                             <div className="grid grid-cols-12 gap-8 px-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                <div className="col-span-8">Asset SKU Descriptor</div>
                                <div className="col-span-2 text-right">Volume</div>
                                <div className="col-span-2 text-right">Ops</div>
                             </div>
                             
                             <div className="space-y-3">
                                {s.items.map((item: any, idx: number) => (
                                  <motion.div key={item.id} layout initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }}
                                    className="grid grid-cols-12 gap-8 items-center bg-[var(--bg-2)] p-5 rounded-2xl border border-[var(--border)] hover:border-brand/30 transition-all group shadow-sm">
                                     <div className="col-span-8">
                                        <select 
                                          className="bg-transparent border-none text-sm font-bold text-[var(--text-primary)] w-full focus:ring-0 uppercase tracking-tight cursor-pointer hover:bg-[var(--bg-1)] rounded-lg"
                                          value={item.name} 
                                          onChange={(e) => {
                                            const selectedSku = useAppStore.getState().inventory.find(inv => inv.name === e.target.value)
                                            updateItem(s.id, idx, { id: selectedSku?.id || item.id, name: e.target.value })
                                          }}
                                        >
                                          <option value="" disabled className="bg-[var(--bg-0)]">Select Existing SKU...</option>
                                          {useAppStore.getState().inventory.map(inv => (
                                            <option key={inv.id} value={inv.name} className="bg-[var(--bg-0)]">{inv.name} ({inv.id})</option>
                                          ))}
                                        </select>
                                     </div>
                                     <div className="col-span-2">
                                        <input type="number" className="bg-[var(--bg-1)] border-none rounded-xl text-xl font-bold text-brand w-full text-right py-2 px-4 focus:ring-2 focus:ring-brand/20 transition-all font-mono"
                                          value={item.qty} onChange={(e) => updateItem(s.id, idx, { qty: parseInt(e.target.value) || 0 })} />
                                     </div>
                                     <div className="col-span-2 text-right">
                                        <button onClick={() => removeItem(s.id, idx)} className="text-[var(--text-secondary)] opacity-40 hover:text-rose-500 p-3 rounded-xl hover:bg-rose-500/10 transition-all">
                                          <Trash2 size={18} />
                                        </button>
                                     </div>
                                  </motion.div>
                                ))}
                             </div>
                             <div className="flex justify-end gap-6 pt-6 border-t border-border">
                                <button onClick={() => setExpandedAsn(null)} className="px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">
                                  Close Terminal
                                </button>
                                <button onClick={() => { setExpandedAsn(null);  }} className="btn-primary text-[10px] px-10 py-3 rounded-2xl active:scale-95 transition-all shadow-xl shadow-brand/20">
                                  <Save size={16} /> Sync Registry
                                </button>
                             </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- MAIN PAGE ---
export default function ShipmentsPage() {
  const { shipments, setShipments, receiveShipment: receiveIntoInventory } = useAppStore()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [alerts, setAlerts] = useState<any[]>([])
  const [aiInsight, setAiInsight] = useState('')
  const [loading, setLoading] = useState(false)
  const [systemPulse, setSystemPulse] = useState<any>({ heartbeat: 72, volatility: 'Normal', neuralSentiment: 0.85, color: '#6366f1' })
  const [receiveModal, setReceiveModal] = useState<any | null>(null)
  const { showToast } = useToast()

  const handleShipmentsChange = (updater: any[] | ((prev: any[]) => any[])) => {
    const next = typeof updater === 'function' ? updater(shipments) : updater
    setShipments(next as any)
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  // Real-time Alerts & Insights
  useEffect(() => {
    const poll = async () => {
      try {
        const isProd = window.location.hostname !== 'localhost'
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (isProd ? '/_/backend' : 'http://localhost:8001')
        const aRes = await fetch(`${backendUrl}/ag/shipments/alerts`)
        if (aRes.ok) setAlerts(await aRes.json())
        const iRes = await fetch(`${backendUrl}/ag/shipments/insights`)
        if (iRes.ok) setAiInsight((await iRes.json()).insight)
        const pRes = await fetch(`${backendUrl}/ag/system-pulse`)
        if (pRes.ok) setSystemPulse(await pRes.json())
      } catch (err) { console.error('Polling error:', err) }
    }
    poll()
    const itv = setInterval(poll, 15000)
    return () => clearInterval(itv)
  }, [])

  // Autosave & Sync
  useEffect(() => {
    if (loading) return;
    localStorage.setItem('ag-shipments', JSON.stringify(shipments))
    
    if (shipments.length === 0) return;
    const timer = setTimeout(async () => {
      const isProd = window.location.hostname !== 'localhost'
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (isProd ? '/_/backend' : 'http://localhost:8001')
      for (const s of shipments) {
         fetch(`${backendUrl}/ag/shipments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(s)
        }).catch(e => console.error(e))
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [shipments, loading])

  const filtered = useMemo(() => {
    return (shipments || []).filter(s => {
      const q = search.toLowerCase()
      const mSearch = s.supplier?.toLowerCase().includes(q) || s.id?.toLowerCase().includes(q) || (s.items && s.items.some((it: any) => it.name.toLowerCase().includes(q)))
      const mType = filterType === 'all' || s.type === filterType
      return mSearch && mType
    })
  }, [shipments, search, filterType])

  const stats = useMemo(() => ({
    active: (shipments || []).length,
    sea: (shipments || []).filter(s => s.type === 'sea').length,
    air: (shipments || []).filter(s => s.type === 'air').length,
    eta7: (shipments || []).filter(s => { const d = new Date(s.eta).getTime() - Date.now(); return d > 0 && d < 7 * 86400000 }).length
  }), [shipments])

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-fade-in max-w-[1900px] mx-auto min-h-screen pb-32 bg-[var(--bg-0)] text-[var(--text-primary)]">
      
      {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="flex items-center gap-10">
          <div className="p-6 rounded-[1.5rem] bg-[var(--bg-2)] border border-[var(--border)] shadow-xl flex items-center justify-center">
            <ActivityIcon size={40} className="text-[var(--brand)]" />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.3em] text-[var(--text-muted)] mb-2 uppercase">Core Logistics Engine</div>
            <h1 className="text-5xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
              Shipment <span className="text-emerald-500">Hub</span>
            </h1>
            <div className="flex flex-wrap items-center gap-6 mt-4 text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
               <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Network Active</span>
               <span className="flex items-center gap-2 text-[var(--brand)]/70"><BarChart3 size={14} /> Stability: {systemPulse.neuralSentiment}</span>
               <span className="flex items-center gap-2"><Globe size={14} /> Global Sync</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('zo-flow-production-v1'); window.location.reload(); }}
          className="px-6 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-xl"
        >
          Reset Master State
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Active Shipments', val: stats.active, icon: Box, color: 'blue' },
          { label: 'Maritime Hub', val: stats.sea, icon: Anchor, color: 'cyan' },
          { label: 'Air Logistics', val: stats.air, icon: Plane, color: 'amber' },
          { label: 'Time At Risk', val: stats.eta7, icon: Clock, color: 'rose' },
        ].map((s, i) => (
          <div key={i} className="glass-panel group">
            <div className={`w-14 h-14 rounded-2xl bg-[var(--bg-1)] text-[var(--text-primary)] flex items-center justify-center border border-[var(--border)] mb-6 shadow-sm group-hover:bg-[var(--brand)] group-hover:text-[var(--bg-0)] transition-all`}>
              <s.icon size={24} />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">{s.label}</div>
            <div className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">{s.val.toString().padStart(2, '0')}</div>
          </div>
        ))}
      </div>

      {/* SEARCH/FILTERS */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex-1 w-full bg-[var(--bg-2)] border border-[var(--border)] rounded-2xl p-2 focus-within:ring-4 focus-within:ring-[var(--brand)]/5 focus-within:border-[var(--brand)]/30 transition-all shadow-sm flex items-center group">
          <Search className="ml-4 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[var(--brand)] transition-colors" />
          <input className="w-full bg-transparent border-none py-3 px-4 text-[var(--text-primary)] text-lg font-bold placeholder:text-[var(--text-muted)] focus:ring-0" 
            placeholder="Search shipments, suppliers, SKUs..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="bg-[var(--bg-2)] border border-[var(--border)] px-6 py-2 rounded-2xl flex items-center gap-4 shadow-sm">
          <ActivityIcon size={18} className="text-[var(--brand)]" />
          <select className="bg-transparent border-none text-[10px] font-bold text-[var(--text-primary)] focus:ring-0 uppercase tracking-widest p-2 cursor-pointer appearance-none"
            value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Modes</option>
            <option value="sea">Maritime (Sea)</option>
            <option value="air">Cargo (Air)</option>
          </select>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8">
           <div className="bg-[var(--bg-2)] border border-[var(--border)] rounded-[1.5rem] p-4 group relative shadow-xl overflow-hidden aspect-video">
             <div className="absolute top-8 left-8 z-10">
                <div className="bg-[var(--bg-1)]/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-bold uppercase text-[var(--brand)] border border-[var(--border)] flex items-center gap-2 shadow-lg">
                   <div className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" /> Live Telemetry
                </div>
             </div>
             <ShipmentMap shipments={filtered} />
           </div>
        </div>
        
        <div className="xl:col-span-4 flex flex-col gap-8">
           <div className="glass-panel flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand flex items-center gap-2">
                   <Brain size={14} /> AI Intel
                 </h2>
              </div>
              <p className="text-xl text-[var(--text-primary)] font-bold leading-tight mb-8">
                &quot;{aiInsight || 'Analyzing global logistics streams for pattern anomalies...'}&quot;
              </p>
              
              <div className="space-y-4 flex-1">
                 {alerts.slice(0,3).map((a,i) => (
                   <motion.div key={i} initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i*0.1 }}
                     className={`p-5 rounded-2xl border-l-4 bg-[var(--bg-1)] border-border shadow-sm hover:translate-x-1 transition-all cursor-pointer ${a.level==='danger'?'border-l-rose-500':'border-l-brand'}`}>
                      <div className="text-[10px] font-bold uppercase text-[var(--text-primary)] mb-1 flex items-center gap-2">
                         {a.level==='danger' ? <Zap size={14} className="text-rose-500"/> : <Info size={14} className="text-brand"/>}
                         {a.title}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] font-medium">{a.desc}</div>
                   </motion.div>
                 ))}
                 {alerts.length === 0 && (
                   <div className="py-12 rounded-[2rem] border-2 border-dashed border-border text-center opacity-40">
                      <CheckCircle2 size={24} className="mx-auto mb-3" />
                      <div className="text-[10px] font-bold uppercase tracking-widest">Systems Clear</div>
                   </div>
                 )}
              </div>
               <button className="bg-slate-950 text-[var(--bg-0)] hover:bg-emerald-600 transition-all w-full py-4 mt-8 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-2xl italic">
                   Full Logistics Audit <ExternalLink size={14} />
               </button>
           </div>
        </div>
      </div>

      <div className="pb-20">
        <ShipmentSheet shipments={shipments} onShipmentsChange={handleShipmentsChange} onReceive={setReceiveModal} showToast={showToast} />
      </div>

      {/* RECEIVE MODAL */}
      <AnimatePresence>
        {receiveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-[var(--bg-0)]/40">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--bg-2)] border border-[var(--border)] rounded-[1.5rem] p-10 w-full max-w-lg shadow-2xl"
            >
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shadow-inner">
                  <Package size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tight">Receive Shipment</h2>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Registry: {receiveModal.id}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-8 max-h-48 overflow-y-auto pr-2">
                {receiveModal.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-[var(--bg-1)] border border-border rounded-xl p-4">
                    <span className="text-[10px] font-bold text-[var(--text-primary)] uppercase">{item.name}</span>
                    <span className="text-lg font-bold text-emerald-600">{item.qty?.toLocaleString()} <span className="text-[10px] opacity-50 uppercase">qty</span></span>
                  </div>
                ))}
              </div>
              
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wide mb-8">This action will synchronize the above assets with the central inventory core.</p>
              
              <div className="flex gap-4">
                <button onClick={() => setReceiveModal(null)} className="flex-1 py-4 text-[10px] font-bold uppercase border border-border rounded-2xl hover:bg-[var(--bg-1)] transition-all">Cancel</button>
                 <button
                   onClick={() => {
                     receiveIntoInventory(receiveModal.id)
                     setReceiveModal(null)
                     showToast('Shipment Received. Opening Warehouse Put-Away...', 'success')
                     setTimeout(() => router.push('/warehouse'), 800)
                   }}
                   className="bg-slate-950 text-[var(--bg-0)] hover:bg-emerald-600 flex-[2] py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-2xl italic"
                 >
                   <CheckCircle2 size={16} /> Finalize Reception
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

function Maximize2({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 21H3V15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 21L10 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}
