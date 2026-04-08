'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Search, Activity, Ship, Clock, MapPin, RefreshCw, Filter, ArrowRight
} from 'lucide-react'

interface FreightRoute {
  code: string
  origin: string
  destination: string
  originPort: string
  destPort: string
  rate20ft: number
  rate40ft: number
  transitDays: number
  carriers: string[]
}

export default function FreightPage() {
  const [routes, setRoutes] = useState<FreightRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoute, setSelectedRoute] = useState<FreightRoute | null>(null)
  const [containerCount, setContainerCount] = useState(1)
  const [containerType, setContainerType] = useState<'20ft' | '40ft'>('40ft')

  const fetchRoutes = async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/freight?q=${encodeURIComponent(q)}`)
      if (res.ok) {
        const data = await res.json()
        setRoutes(data.routes)
      }
    } catch(e) {}
    setLoading(false)
  }

  useEffect(() => {
    fetchRoutes('')
  }, [])

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => fetchRoutes(searchQuery), 30000)
    return () => clearInterval(interval)
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchRoutes(searchQuery)
  }

  const totalCost = selectedRoute
    ? (containerType === '20ft' ? selectedRoute.rate20ft : selectedRoute.rate40ft) * containerCount
    : 0

  return (
    <div className="min-h-screen w-full bg-[var(--bg-0)] p-6 lg:p-10 font-sans custom-scrollbar overflow-y-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link href="/market" className="w-10 h-10 rounded-xl bg-[var(--bg-1)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-2)] transition-all">
          <ArrowLeft size={18} className="text-[var(--text-secondary)]" />
        </Link>
        <div className="flex-1">
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Benchmarked vs Drewry WCI & Freightos FBX</div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">Freight Rate Explorer</h1>
        </div>
        <button onClick={() => fetchRoutes(searchQuery)} className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-1)] border border-[var(--border)] rounded-xl text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest hover:bg-[var(--bg-2)] transition-all">
          <RefreshCw size={14} /> Refresh Rates
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 max-w-3xl">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-30" size={20} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by port, country, or route code (e.g. Shanghai, Vietnam, LAX...)"
            className="w-full pl-14 pr-32 py-5 rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500/50 transition-colors shadow-lg"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-500 transition-all">
            Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Route List */}
        <div className="xl:col-span-7 space-y-3">
          <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-4">
            {routes.length} Trade Lanes Found • Rates auto-refresh every 30s
          </div>

          {loading && routes.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="animate-spin text-indigo-500" size={32} />
            </div>
          ) : (
            routes.map((route, i) => (
              <motion.button
                key={route.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedRoute(route)}
                className={`w-full text-left p-6 rounded-2xl border transition-all ${selectedRoute?.code === route.code ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-[var(--bg-1)] border-[var(--border)] hover:border-indigo-500/20 hover:bg-[var(--bg-2)]'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Ship size={20} className="text-indigo-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[var(--text-primary)]">{route.originPort}</span>
                        <ArrowRight size={14} className="text-[var(--text-secondary)] opacity-30" />
                        <span className="font-black text-sm text-[var(--text-primary)]">{route.destPort}</span>
                      </div>
                      <div className="text-[10px] text-[var(--text-secondary)] opacity-40 mt-1">{route.origin} → {route.destination}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)] opacity-40">
                    <Clock size={14} />
                    <span className="text-xs font-black">{route.transitDays}d</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase">20ft</div>
                    <div className="text-lg font-black text-[var(--text-primary)] tabular-nums">${route.rate20ft.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase">40ft</div>
                    <div className="text-lg font-black text-indigo-400 tabular-nums">${route.rate40ft.toLocaleString()}</div>
                  </div>
                  <div className="ml-auto flex gap-2 flex-wrap justify-end">
                    {route.carriers.slice(0, 3).map(c => (
                      <span key={c} className="px-2 py-1 bg-[var(--bg-0)] border border-[var(--border)] rounded-lg text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-wider">{c}</span>
                    ))}
                    {route.carriers.length > 3 && (
                      <span className="px-2 py-1 text-[8px] font-black text-[var(--text-secondary)] opacity-30">+{route.carriers.length - 3}</span>
                    )}
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>

        {/* Cost Calculator */}
        <div className="xl:col-span-5">
          <div className="sticky top-6 space-y-6">
            <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[2rem] p-8">
              <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight mb-6 flex items-center gap-3">
                <Activity className="text-indigo-400" size={20} />
                Shipment Cost Calculator
              </h3>

              {selectedRoute ? (
                <div className="space-y-6">
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <div className="font-black text-indigo-400 text-sm mb-1">{selectedRoute.originPort} → {selectedRoute.destPort}</div>
                    <div className="text-xs text-[var(--text-secondary)] opacity-40">Transit: {selectedRoute.transitDays} days</div>
                  </div>

                  {/* Container Type */}
                  <div>
                    <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-2 block">Container Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setContainerType('20ft')}
                        className={`p-3 rounded-xl text-center font-black text-sm transition-all ${containerType === '20ft' ? 'bg-indigo-500 text-white' : 'bg-[var(--bg-0)] border border-[var(--border)] text-[var(--text-secondary)]'}`}
                      >
                        20ft — ${selectedRoute.rate20ft.toLocaleString()}
                      </button>
                      <button
                        onClick={() => setContainerType('40ft')}
                        className={`p-3 rounded-xl text-center font-black text-sm transition-all ${containerType === '40ft' ? 'bg-indigo-500 text-white' : 'bg-[var(--bg-0)] border border-[var(--border)] text-[var(--text-secondary)]'}`}
                      >
                        40ft — ${selectedRoute.rate40ft.toLocaleString()}
                      </button>
                    </div>
                  </div>

                  {/* Container Count */}
                  <div>
                    <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-2 block">Number of Containers</label>
                    <input 
                      type="number" value={containerCount} onChange={(e) => setContainerCount(Math.max(1, Number(e.target.value)))}
                      className="w-full p-3 rounded-xl bg-[var(--bg-0)] border border-[var(--border)] text-sm font-black text-[var(--text-primary)] tabular-nums outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  {/* Total */}
                  <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-center">
                    <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Estimated Total Freight Cost</div>
                    <div className="text-4xl font-black text-[var(--text-primary)] tabular-nums tracking-tighter">
                      ${totalCost.toLocaleString()}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] opacity-40 mt-2">
                      {containerCount}x {containerType} containers • ETA {selectedRoute.transitDays} days
                    </div>
                  </div>

                  {/* Carriers */}
                  <div>
                    <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-3">Available Carriers</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoute.carriers.map(c => (
                        <span key={c} className="px-3 py-2 bg-[var(--bg-0)] border border-[var(--border)] rounded-xl text-xs font-black text-[var(--text-primary)]">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[var(--text-secondary)] opacity-30">
                  <Ship size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-bold">Select a trade lane from the left to calculate shipping costs</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
