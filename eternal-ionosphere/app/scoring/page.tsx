'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sliders, TrendingUp, RefreshCw, Info } from 'lucide-react'

type Weight = { price: number; leadTime: number; quality: number; reliability: number; sustainability: number }

type Supplier = {
  id: string; name: string; flag: string; price: number
  leadTime: number; quality: number; reliability: number; sustainability: number
}

const SUPPLIERS: Supplier[] = [
  { id:'1', name:'Shenzhen TechParts Co.', flag:'🇨🇳', price:72,  leadTime:14, quality:92, reliability:88, sustainability:70 },
  { id:'2', name:'Flex Ltd. Singapore',   flag:'🇸🇬', price:89,  leadTime:18, quality:90, reliability:95, sustainability:85 },
  { id:'3', name:'Jabil Circuit Inc.',    flag:'🇺🇸', price:114, leadTime:21, quality:88, reliability:97, sustainability:90 },
  { id:'4', name:'Foxconn Industrial',    flag:'🇨🇳', price:68,  leadTime:12, quality:84, reliability:86, sustainability:65 },
  { id:'5', name:'Celestica Toronto',     flag:'🇨🇦', price:97,  leadTime:19, quality:87, reliability:92, sustainability:88 },
]

const DEFAULT_WEIGHTS: Weight = { price: 30, leadTime: 25, quality: 25, reliability: 15, sustainability: 5 }

function score(s: Supplier, w: Weight, allSuppliers: Supplier[]): number {
  const maxPrice  = Math.max(...allSuppliers.map(x => x.price))
  const minLead   = Math.min(...allSuppliers.map(x => x.leadTime))
  const pricePct  = ((maxPrice - s.price) / maxPrice) * 100
  const leadPct   = (minLead / s.leadTime) * 100
  return Math.round(
    (pricePct * w.price + leadPct * w.leadTime + s.quality * w.quality +
     s.reliability * w.reliability + s.sustainability * w.sustainability) / 100
  )
}

const CRITERIA = [
  { key: 'price',          label: 'Price',         color: '#6366f1', tip: 'Lower price = higher score' },
  { key: 'leadTime',       label: 'Lead Time',     color: '#8b5cf6', tip: 'Shorter lead time = higher score' },
  { key: 'quality',        label: 'Quality',       color: '#06b6d4', tip: 'Quality certification score' },
  { key: 'reliability',    label: 'Reliability',   color: '#10b981', tip: 'Delivery reliability rating' },
  { key: 'sustainability', label: 'ESG / Sustain', color: '#f59e0b', tip: 'Environmental & social governance' },
] as const

export default function ScoringPage() {
  const [weights, setWeights] = useState<Weight>(DEFAULT_WEIGHTS)

  function setWeight(key: keyof Weight, val: number) {
    setWeights(prev => ({ ...prev, [key]: val }))
  }

  const total = Object.values(weights).reduce((a, b) => a + b, 0)

  const ranked = [...SUPPLIERS]
    .map(s => ({ ...s, score: score(s, weights, SUPPLIERS) }))
    .sort((a, b) => b.score - a.score)

  function reset() { setWeights(DEFAULT_WEIGHTS) }

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Weighted <span className="gradient-text">Scoring</span></h1>
        <p className="text-[var(--text-secondary)] opacity-40 text-sm">Tune criteria weights — suppliers re-rank in real time</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Weights Panel */}
        <div className="xl:col-span-2 card bg-[var(--bg-1)] border border-[var(--border)] h-fit shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-[var(--text-primary)]">Criteria Weights</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${total === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {total}% {total !== 100 && '(should be 100%)'}
              </span>
              <button onClick={reset} className="text-[var(--text-secondary)] opacity-40 hover:text-indigo-400 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {CRITERIA.map(c => (
              <div key={c.key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    <span className="text-sm font-medium text-[var(--text-secondary)] opacity-40">{c.label}</span>
                    <div className="group relative cursor-help">
                      <Info className="w-3 h-3 text-[var(--text-secondary)] opacity-20" />
                      <div className="absolute left-4 top-0 z-10 hidden group-hover:block bg-[var(--bg-2)] border border-[var(--border)] rounded-lg p-2 text-xs text-[var(--text-secondary)] opacity-40 w-40 shadow-xl">
                        {c.tip}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[var(--text-primary)]">{weights[c.key]}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id={`weight-${c.key}`}
                    type="range" min={0} max={100}
                    value={weights[c.key]}
                    onChange={e => setWeight(c.key as keyof Weight, +e.target.value)}
                    className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: c.color }}
                  />
                </div>
                {/* Mini bar */}
                <div className="mt-1.5 h-1 rounded-full bg-[var(--bg-2)] shadow-inner">
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${weights[c.key]}%`, background: c.color, opacity: 0.6 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rankings */}
        <div className="xl:col-span-3 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-[var(--text-primary)]">Live Rankings</span>
          </div>
          {ranked.map((s, rank) => (
            <motion.div key={s.id} layout
              className={`card flex items-center gap-4 ${rank === 0 ? 'glass-brand glow-brand' : ''}`}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}>

              {/* Rank badge */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                rank === 0 ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                : rank === 1 ? 'bg-slate-400/20 text-[var(--text-secondary)] opacity-40 border border-slate-400/30'
                : rank === 2 ? 'bg-orange-700/20 text-orange-400 border border-orange-700/30'
                : 'bg-[var(--bg-1)] text-[var(--text-secondary)] opacity-40 border border-[var(--border)]'
              }`}>{rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank+1}`}</div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[var(--text-primary)] text-sm mb-2">{s.flag} {s.name}</div>
                <div className="flex gap-2 flex-wrap">
                  {CRITERIA.map(c => (
                    <div key={c.key} className="text-[10px] px-2 py-0.5 rounded-md" style={{
                      background: `${c.color}18`, color: c.color, border: `1px solid ${c.color}30`
                    }}>
                      {c.label.split(' ')[0]}: {c.key === 'price' ? `$${s[c.key]}` : c.key === 'leadTime' ? `${s[c.key]}d` : `${s[c.key]}`}
                    </div>
                  ))}
                </div>
              </div>

              {/* Score */}
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold text-[var(--text-primary)]">{s.score}</div>
                <div className="text-[10px] text-[var(--text-secondary)] opacity-40 font-medium">Score</div>
                <div className="mt-1 w-16 h-1.5 bg-[var(--bg-2)] shadow-inner rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
                    animate={{ width: `${s.score}%` }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
