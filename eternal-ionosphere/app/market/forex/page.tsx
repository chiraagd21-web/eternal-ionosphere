'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, TrendingUp, TrendingDown, RefreshCw, Radio, ArrowRight, Search
} from 'lucide-react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart
} from 'recharts'

const SUPPLY_CHAIN_CURRENCIES = [
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', region: 'Asia Pacific' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', region: 'Asia Pacific' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', region: 'Europe' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', region: 'Europe' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷', region: 'Asia Pacific' },
  { code: 'TWD', name: 'New Taiwan Dollar', flag: '🇹🇼', region: 'Asia Pacific' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', region: 'South Asia' },
  { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽', region: 'Americas' },
  { code: 'VND', name: 'Vietnamese Dong', flag: '🇻🇳', region: 'Asia Pacific' },
  { code: 'THB', name: 'Thai Baht', flag: '🇹🇭', region: 'Asia Pacific' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', region: 'Americas' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', region: 'Oceania' },
]

export default function ForexPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCurrency, setSelectedCurrency] = useState('JPY')
  const [searchTerm, setSearchTerm] = useState('')
  const [convertAmount, setConvertAmount] = useState(10000)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/market')
        if (res.ok) {
          const d = await res.json()
          setData(d)
        }
      } catch(e) {}
      setLoading(false)
    }
    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [])

  const chartData = useMemo(() => {
    if (!data?.history) return []
    return Object.entries(data.history).map(([date, rates]: [string, any]) => ({
      date: date.slice(5),
      [selectedCurrency]: rates[selectedCurrency] || 0,
    }))
  }, [data?.history, selectedCurrency])

  const filteredCurrencies = SUPPLY_CHAIN_CURRENCIES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.region.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedRate = data?.forex?.[selectedCurrency] || 0
  const convertedAmount = convertAmount * selectedRate

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-0)]">
        <RefreshCw className="animate-spin text-indigo-500" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[var(--bg-0)] p-6 lg:p-10 font-sans custom-scrollbar overflow-y-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link href="/market" className="w-10 h-10 rounded-xl bg-[var(--bg-1)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-2)] transition-all">
          <ArrowLeft size={18} className="text-[var(--text-secondary)]" />
        </Link>
        <div className="flex-1">
          <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Live Data from Frankfurter API</div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">Forex Terminal</h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <Radio size={12} className="text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live — Auto-refreshing every 15s</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-[1600px]">
        {/* LEFT: Currency List */}
        <div className="xl:col-span-4 bg-[var(--bg-1)] border border-[var(--border)] rounded-[2rem] p-6 flex flex-col max-h-[80vh]">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-30" size={16} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search currencies or regions..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-0)] border border-[var(--border)] text-sm text-[var(--text-primary)] outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
            {filteredCurrencies.map(currency => {
              const rate = data?.forex?.[currency.code]
              const isSelected = selectedCurrency === currency.code
              return (
                <button
                  key={currency.code}
                  onClick={() => setSelectedCurrency(currency.code)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${isSelected ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-[var(--bg-0)] border border-transparent hover:border-[var(--border)] hover:bg-[var(--bg-2)]'}`}
                >
                  <div className="text-2xl">{currency.flag}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-sm ${isSelected ? 'text-emerald-400' : 'text-[var(--text-primary)]'}`}>{currency.code}</span>
                      <span className="text-[9px] font-bold text-[var(--text-secondary)] opacity-30 uppercase">{currency.region}</span>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] opacity-50">{currency.name}</div>
                  </div>
                  <div className={`text-right ${isSelected ? 'text-emerald-400' : 'text-[var(--text-primary)]'}`}>
                    <div className="text-sm font-black tabular-nums">{rate ? rate.toLocaleString(undefined, {maximumFractionDigits: 4}) : '—'}</div>
                    <div className="text-[9px] font-bold text-[var(--text-secondary)] opacity-30">per USD</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* RIGHT: Chart + Converter */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Rate Display */}
          <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[2rem] p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-1">USD / {selectedCurrency}</div>
                <div className="text-5xl font-black text-[var(--text-primary)] tabular-nums tracking-tighter">
                  {selectedRate.toLocaleString(undefined, {maximumFractionDigits: 4})}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-1">Source</div>
                <div className="text-sm font-bold text-[var(--text-primary)]">European Central Bank</div>
                <div className="text-xs text-[var(--text-secondary)] opacity-40">via Frankfurter API</div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="forexGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }}
                    labelStyle={{ color: 'var(--text-secondary)' }}
                  />
                  <Area type="monotone" dataKey={selectedCurrency} stroke="#10b981" fill="url(#forexGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Currency Converter */}
          <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[2rem] p-8">
            <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight mb-6">Live Converter</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 w-full">
                <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-2 block">Amount (USD)</label>
                <input 
                  type="number"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(Number(e.target.value))}
                  className="w-full p-4 rounded-xl bg-[var(--bg-0)] border border-[var(--border)] text-2xl font-black text-[var(--text-primary)] tabular-nums outline-none focus:border-emerald-500/50"
                />
              </div>
              <ArrowRight size={24} className="text-[var(--text-secondary)] opacity-20 shrink-0" />
              <div className="flex-1 w-full">
                <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-2 block">Result ({selectedCurrency})</label>
                <div className="w-full p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-2xl font-black text-emerald-400 tabular-nums">
                  {convertedAmount.toLocaleString(undefined, {maximumFractionDigits: 2})}
                </div>
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] opacity-30 mt-4">
              Rate sourced live from the European Central Bank. Updated: {data?.date || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
