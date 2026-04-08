'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Search, Activity, Ship, Clock, MapPin, RefreshCw, 
  ArrowRight, Plane, Truck, TrainFront, ExternalLink, Filter, 
  ChevronDown, Package
} from 'lucide-react'

interface CarrierDetail {
  name: string
  mode: string
  quoteUrl: string
  trackUrl: string
}

interface FreightRoute {
  id: string
  origin: string
  destination: string
  originPort: string
  destPort: string
  mode: 'sea' | 'air' | 'land' | 'rail'
  rate20ft?: number
  rate40ft?: number
  ratePerKg?: number
  rateFTL?: number
  rateLTL?: number
  transitDays: number
  carriers: string[]
  carrierDetails: CarrierDetail[]
}

const MODE_CONFIG = {
  sea:  { icon: Ship, label: 'Ocean', color: 'indigo', bg: 'bg-indigo-500' },
  air:  { icon: Plane, label: 'Air', color: 'amber', bg: 'bg-amber-500' },
  land: { icon: Truck, label: 'Truck', color: 'emerald', bg: 'bg-emerald-500' },
  rail: { icon: TrainFront, label: 'Rail', color: 'rose', bg: 'bg-rose-500' },
}

export default function FreightPage() {
  const [routes, setRoutes] = useState<FreightRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoute, setSelectedRoute] = useState<FreightRoute | null>(null)
  const [modeFilter, setModeFilter] = useState<string>('')
  const [containerCount, setContainerCount] = useState(1)
  const [containerType, setContainerType] = useState('40ft')
  const [airWeight, setAirWeight] = useState(500)

  const fetchRoutes = async (q: string, mode: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/freight?q=${encodeURIComponent(q)}&mode=${mode}`)
      if (res.ok) {
        const data = await res.json()
        setRoutes(data.routes)
      }
    } catch(e) {}
    setLoading(false)
  }

  useEffect(() => { fetchRoutes('', '') }, [])

  useEffect(() => {
    const interval = setInterval(() => fetchRoutes(searchQuery, modeFilter), 30000)
    return () => clearInterval(interval)
  }, [searchQuery, modeFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchRoutes(searchQuery, modeFilter)
  }

  const handleModeFilter = (mode: string) => {
    const newMode = modeFilter === mode ? '' : mode
    setModeFilter(newMode)
    fetchRoutes(searchQuery, newMode)
  }

  const calcTotal = () => {
    if (!selectedRoute) return 0
    if (selectedRoute.mode === 'air') return (selectedRoute.ratePerKg || 0) * airWeight
    if (selectedRoute.mode === 'land') return containerType === 'FTL' ? (selectedRoute.rateFTL || 0) * containerCount : (selectedRoute.rateLTL || 0) * containerCount
    return (containerType === '20ft' ? (selectedRoute.rate20ft || 0) : (selectedRoute.rate40ft || 0)) * containerCount
  }

  const getModeIcon = (mode: string) => {
    const cfg = MODE_CONFIG[mode as keyof typeof MODE_CONFIG]
    if (!cfg) return <Package size={16} />
    const Icon = cfg.icon
    return <Icon size={16} />
  }

  return (
    <div className="min-h-screen w-full bg-[var(--bg-0)] p-6 lg:p-10 font-sans custom-scrollbar overflow-y-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/market" className="w-10 h-10 rounded-xl bg-[var(--bg-1)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-2)] transition-all">
          <ArrowLeft size={18} className="text-[var(--text-secondary)]" />
        </Link>
        <div className="flex-1">
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Drewry WCI • Freightos FBX • DAT Analytics</div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">Freight Rate Explorer</h1>
        </div>
        <button onClick={() => fetchRoutes(searchQuery, modeFilter)} className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-1)] border border-[var(--border)] rounded-xl text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest hover:bg-[var(--bg-2)] transition-all">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Search + Mode Filters */}
      <div className="mb-6 max-w-5xl space-y-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-30" size={20} />
          <input 
            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by port, country, carrier, or city (e.g. Shanghai, FedEx, Vietnam, Dallas...)"
            className="w-full pl-14 pr-32 py-5 rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500/50 transition-colors shadow-lg"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-500 transition-all">
            Search
          </button>
        </form>

        {/* Mode Filter Tabs */}
        <div className="flex gap-2">
          {Object.entries(MODE_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon
            const isActive = modeFilter === key
            return (
              <button
                key={key}
                onClick={() => handleModeFilter(key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isActive ? `${cfg.bg} text-white border-transparent shadow-lg` : 'bg-[var(--bg-1)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--bg-2)]'}`}
              >
                <Icon size={14} /> {cfg.label}
              </button>
            )
          })}
          {modeFilter && (
            <button onClick={() => handleModeFilter('')} className="px-4 py-3 rounded-xl text-[10px] font-black text-[var(--text-secondary)] opacity-40 hover:text-[var(--text-primary)] border border-[var(--border)] bg-[var(--bg-1)]">
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Route List */}
        <div className="xl:col-span-7 space-y-3">
          <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-4">
            {routes.length} Routes • Auto-refresh 30s
          </div>

          {loading && routes.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="animate-spin text-indigo-500" size={32} />
            </div>
          ) : (
            <div className="space-y-3 max-h-[75vh] overflow-y-auto custom-scrollbar pr-2">
              {routes.map((route, i) => {
                const modeCfg = MODE_CONFIG[route.mode]
                const Icon = modeCfg.icon
                const isSelected = selectedRoute?.id === route.id
                return (
                  <motion.button
                    key={route.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => setSelectedRoute(route)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all ${isSelected ? `bg-${modeCfg.color}-500/10 border-${modeCfg.color}-500/30` : 'bg-[var(--bg-1)] border-[var(--border)] hover:border-[var(--border)] hover:bg-[var(--bg-2)]'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${modeCfg.bg}/20 flex items-center justify-center`}>
                          <Icon size={16} className={`text-${modeCfg.color}-400`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-[var(--text-primary)]">{route.originPort}</span>
                            <ArrowRight size={12} className="text-[var(--text-secondary)] opacity-30" />
                            <span className="font-black text-sm text-[var(--text-primary)]">{route.destPort}</span>
                          </div>
                          <div className="text-[10px] text-[var(--text-secondary)] opacity-40">{route.origin} → {route.destination}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${modeCfg.bg} text-white`}>{modeCfg.label}</span>
                        <div className="flex items-center gap-1 text-[var(--text-secondary)] opacity-40">
                          <Clock size={12} /><span className="text-xs font-black">{route.transitDays}d</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {route.mode === 'sea' && (
                        <>
                          <div>
                            <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase">20ft</div>
                            <div className="text-sm font-black text-[var(--text-primary)] tabular-nums">${route.rate20ft?.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase">40ft</div>
                            <div className="text-sm font-black text-indigo-400 tabular-nums">${route.rate40ft?.toLocaleString()}</div>
                          </div>
                        </>
                      )}
                      {route.mode === 'air' && (
                        <div>
                          <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase">Per KG</div>
                          <div className="text-sm font-black text-amber-400 tabular-nums">${route.ratePerKg?.toFixed(2)}</div>
                        </div>
                      )}
                      {route.mode === 'land' && (
                        <>
                          <div>
                            <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase">FTL</div>
                            <div className="text-sm font-black text-emerald-400 tabular-nums">${route.rateFTL?.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase">LTL</div>
                            <div className="text-sm font-black text-[var(--text-primary)] tabular-nums">${route.rateLTL?.toLocaleString()}</div>
                          </div>
                        </>
                      )}
                      {route.mode === 'rail' && (
                        <div>
                          <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase">40ft Container</div>
                          <div className="text-sm font-black text-rose-400 tabular-nums">${route.rate40ft?.toLocaleString()}</div>
                        </div>
                      )}

                      <div className="ml-auto flex gap-1.5 flex-wrap justify-end">
                        {route.carrierDetails.slice(0, 3).map(c => (
                          <span key={c.name} className="px-2 py-1 bg-[var(--bg-0)] border border-[var(--border)] rounded-lg text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-wider">{c.name.split(' ')[0]}</span>
                        ))}
                        {route.carrierDetails.length > 3 && (
                          <span className="px-2 py-1 text-[8px] font-black text-[var(--text-secondary)] opacity-30">+{route.carrierDetails.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>

        {/* Cost Calculator + Carrier Links */}
        <div className="xl:col-span-5">
          <div className="sticky top-6 space-y-6">
            <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[2rem] p-6">
              <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight mb-6 flex items-center gap-3">
                <Activity className="text-indigo-400" size={20} />
                Cost Calculator
              </h3>

              {selectedRoute ? (
                <div className="space-y-5">
                  <div className={`p-4 bg-${MODE_CONFIG[selectedRoute.mode].color}-500/10 border border-${MODE_CONFIG[selectedRoute.mode].color}-500/20 rounded-xl`}>
                    <div className="flex items-center gap-2 mb-1">
                      {getModeIcon(selectedRoute.mode)}
                      <span className="font-black text-sm text-[var(--text-primary)]">{selectedRoute.originPort} → {selectedRoute.destPort}</span>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] opacity-40">Transit: {selectedRoute.transitDays} days • {MODE_CONFIG[selectedRoute.mode].label} freight</div>
                  </div>

                  {/* Mode-specific inputs */}
                  {(selectedRoute.mode === 'sea' || selectedRoute.mode === 'rail') && (
                    <>
                      <div>
                        <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-2 block">Container Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedRoute.rate20ft && (
                            <button onClick={() => setContainerType('20ft')} className={`p-3 rounded-xl text-center font-black text-xs transition-all ${containerType === '20ft' ? 'bg-indigo-500 text-white' : 'bg-[var(--bg-0)] border border-[var(--border)] text-[var(--text-secondary)]'}`}>
                              20ft — ${selectedRoute.rate20ft.toLocaleString()}
                            </button>
                          )}
                          <button onClick={() => setContainerType('40ft')} className={`p-3 rounded-xl text-center font-black text-xs transition-all ${containerType === '40ft' ? 'bg-indigo-500 text-white' : 'bg-[var(--bg-0)] border border-[var(--border)] text-[var(--text-secondary)]'}`}>
                            40ft — ${selectedRoute.rate40ft?.toLocaleString()}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-2 block">Number of Containers</label>
                        <input type="number" value={containerCount} onChange={(e) => setContainerCount(Math.max(1, Number(e.target.value)))} className="w-full p-3 rounded-xl bg-[var(--bg-0)] border border-[var(--border)] text-sm font-black text-[var(--text-primary)] tabular-nums outline-none focus:border-indigo-500/50" />
                      </div>
                    </>
                  )}

                  {selectedRoute.mode === 'air' && (
                    <div>
                      <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-2 block">Cargo Weight (kg)</label>
                      <input type="number" value={airWeight} onChange={(e) => setAirWeight(Math.max(1, Number(e.target.value)))} className="w-full p-3 rounded-xl bg-[var(--bg-0)] border border-[var(--border)] text-sm font-black text-[var(--text-primary)] tabular-nums outline-none focus:border-amber-500/50" />
                      <div className="text-[10px] text-[var(--text-secondary)] opacity-30 mt-1">Rate: ${selectedRoute.ratePerKg?.toFixed(2)}/kg</div>
                    </div>
                  )}

                  {selectedRoute.mode === 'land' && (
                    <>
                      <div>
                        <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-2 block">Load Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => setContainerType('FTL')} className={`p-3 rounded-xl text-center font-black text-xs transition-all ${containerType === 'FTL' ? 'bg-emerald-500 text-white' : 'bg-[var(--bg-0)] border border-[var(--border)] text-[var(--text-secondary)]'}`}>
                            FTL — ${selectedRoute.rateFTL?.toLocaleString()}
                          </button>
                          <button onClick={() => setContainerType('LTL')} className={`p-3 rounded-xl text-center font-black text-xs transition-all ${containerType === 'LTL' ? 'bg-emerald-500 text-white' : 'bg-[var(--bg-0)] border border-[var(--border)] text-[var(--text-secondary)]'}`}>
                            LTL — ${selectedRoute.rateLTL?.toLocaleString()}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-2 block">Number of Loads</label>
                        <input type="number" value={containerCount} onChange={(e) => setContainerCount(Math.max(1, Number(e.target.value)))} className="w-full p-3 rounded-xl bg-[var(--bg-0)] border border-[var(--border)] text-sm font-black text-[var(--text-primary)] tabular-nums outline-none focus:border-emerald-500/50" />
                      </div>
                    </>
                  )}

                  {/* Total */}
                  <div className={`p-5 bg-${MODE_CONFIG[selectedRoute.mode].color}-500/10 border border-${MODE_CONFIG[selectedRoute.mode].color}-500/20 rounded-xl text-center`}>
                    <div className={`text-[9px] font-black text-${MODE_CONFIG[selectedRoute.mode].color}-400 uppercase tracking-widest mb-2`}>Estimated Total</div>
                    <div className="text-4xl font-black text-[var(--text-primary)] tabular-nums tracking-tighter">
                      ${calcTotal().toLocaleString()}
                    </div>
                  </div>

                  {/* Carrier Links — CLICKABLE to real websites */}
                  <div>
                    <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-3">Available Carriers — Click to Get Quote</div>
                    <div className="space-y-2">
                      {selectedRoute.carrierDetails.map(carrier => (
                        <div key={carrier.name} className="flex items-center gap-3 p-3 bg-[var(--bg-0)] border border-[var(--border)] rounded-xl hover:bg-[var(--bg-2)] transition-all group">
                          <div className="flex-1">
                            <div className="font-black text-sm text-[var(--text-primary)]">{carrier.name}</div>
                            <div className="text-[9px] text-[var(--text-secondary)] opacity-30 uppercase">{carrier.mode} carrier</div>
                          </div>
                          <a
                            href={carrier.quoteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-1.5"
                          >
                            Get Quote <ExternalLink size={10} />
                          </a>
                          <a
                            href={carrier.trackUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-[var(--bg-1)] text-[var(--text-secondary)] border border-[var(--border)] rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-[var(--text-primary)] transition-all flex items-center gap-1.5"
                          >
                            Track <ExternalLink size={10} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[var(--text-secondary)] opacity-30">
                  <Ship size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-bold">Select a route to calculate costs and access carrier quote pages</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
