'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Terminal, 
  Activity, 
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Globe,
  Zap,
  Radio
} from 'lucide-react'

export default function MarketIntelligencePage() {
  const [forexData, setForexData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/market')
        if (res.ok) {
          const data = await res.json()
          setForexData(data)
        }
      } catch(e) {}
    }
    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [])

  const cards = [
    {
      href: '/market/forex',
      title: 'Live Forex Terminal',
      subtitle: 'Real-time currency exchange rates from global markets',
      icon: TrendingUp,
      color: 'emerald',
      live: true,
      stat: forexData?.forex ? `1 USD = ¥${forexData.forex.JPY}` : 'Connecting...',
      statLabel: 'JPY Rate'
    },
    {
      href: '/market/freight',
      title: 'Freight Rate Explorer',
      subtitle: 'Search real container shipping rates by route',
      icon: Activity,
      color: 'indigo',
      live: false,
      stat: '40+ Routes',
      statLabel: 'Coverage'
    },
    {
      href: '/market/tariff',
      title: 'Tariff & HTS Lookup',
      subtitle: 'Search real US tariff rates by HTS code or product',
      icon: ShieldAlert,
      color: 'amber',
      live: true,
      stat: '99 Chapters',
      statLabel: 'HTS Coverage'
    },
  ]

  return (
    <div className="min-h-screen w-full bg-[var(--bg-0)] p-6 lg:p-10 font-sans custom-scrollbar overflow-y-auto">
      <header className="mb-12">
         <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2 px-1">Macro Operations</div>
         <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter mb-2">Market Intelligence</h1>
         <p className="text-sm text-[var(--text-secondary)] opacity-50 max-w-lg">Click any module below to open its full interactive dashboard with live data.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
        {cards.map((card, i) => (
          <Link href={card.href} key={card.href}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              className={`group relative bg-[var(--bg-1)] border border-[var(--border)] rounded-[2.5rem] p-8 shadow-soft hover:border-${card.color}-500/40 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col`}
            >
              {/* Live indicator */}
              {card.live && (
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${card.color}-500 animate-pulse`} />
                  <span className={`text-[9px] font-black uppercase tracking-widest text-${card.color}-500`}>Live</span>
                </div>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 bg-${card.color}-500/10 rounded-2xl flex items-center justify-center border border-${card.color}-500/20 mb-6`}>
                <card.icon className={`text-${card.color}-400`} size={24} />
              </div>

              {/* Title */}
              <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight mb-2">{card.title}</h2>
              <p className="text-xs text-[var(--text-secondary)] opacity-50 mb-8 flex-1">{card.subtitle}</p>

              {/* Stat */}
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-1">{card.statLabel}</div>
                  <div className={`text-lg font-black text-${card.color}-400 tabular-nums tracking-tight`}>{card.stat}</div>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-${card.color}-500/10 flex items-center justify-center border border-${card.color}-500/20 group-hover:bg-${card.color}-500 group-hover:text-[var(--bg-0)] transition-all`}>
                  <ArrowRight size={18} />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Quick Stats Bar */}
      {forexData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl p-6 flex flex-wrap gap-8 items-center max-w-7xl"
        >
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Live Feed</span>
          </div>
          {forexData.forex && (
            <>
              <div>
                <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase">USD/JPY</div>
                <div className="text-sm font-black text-[var(--text-primary)] tabular-nums">{forexData.forex.JPY}</div>
              </div>
              <div>
                <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase">USD/CNY</div>
                <div className="text-sm font-black text-[var(--text-primary)] tabular-nums">{forexData.forex.CNY}</div>
              </div>
            </>
          )}
          {forexData.crypto && (
            <div>
              <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase">BTC/USD</div>
              <div className="text-sm font-black text-[var(--text-primary)] tabular-nums">${Number(forexData.crypto).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
            </div>
          )}
          <div className="ml-auto text-[9px] font-bold text-[var(--text-secondary)] opacity-30">
            Updated: {new Date(forexData.timestamp).toLocaleTimeString()}
          </div>
        </motion.div>
      )}
    </div>
  )
}
