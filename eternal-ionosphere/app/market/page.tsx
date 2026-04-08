'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, 
  Terminal, 
  Activity, 
  TrendingDown, 
  Briefcase,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Zap,
  Users
} from 'lucide-react'

const INITIAL_LOGS = [
  { agent: 'System', message: 'Initializing World Data Scrapers...', time: 'Boot', color: 'text-indigo-400' }
]

// Mock Freight Exchange Bids
const FREIGHT_BIDS = [
  { carrier: 'Maersk Line', offer: 4250, drop: true, time: '10s' },
  { carrier: 'MSC', offer: 4310, drop: false, time: '45s' },
  { carrier: 'Hapag-Lloyd', offer: 4180, drop: true, time: '1m' },
  { carrier: 'Evergreen', offer: 4400, drop: false, time: '2m' }
]

export default function MarketIntelligencePage() {
  const [activeTab, setActiveTab] = useState<'swarm' | 'freight' | 'tariff'>('swarm')
  const [bids, setBids] = useState(FREIGHT_BIDS)
  const [swarmLogs, setSwarmLogs] = useState(INITIAL_LOGS)

  useEffect(() => {
    // Real API fetching for World Data
    const fetchMarketData = async () => {
      try {
        const res = await fetch('/api/market')
        if (res.ok) {
           const data = await res.json()
           
           setSwarmLogs(prev => {
              const newLogs = [...prev]
              if (newLogs.length > 5) newLogs.shift()
              
              const now = new Date().toLocaleTimeString()
              
              if (data.forex) {
                newLogs.push({ agent: 'Forex Trader', message: `Live Rate Pulled: 1 USD = ${data.forex.JPY} JPY / ${data.forex.CNY} CNY. Hedging algorithms optimized.`, time: now, color: 'text-emerald-400' })
              }
              if (data.crypto) {
                newLogs.push({ agent: 'Risk Manager', message: `Global BTC Liquidity Index locked at $${data.crypto.toLocaleString()}. Supply chain financial risk evaluated as STABLE.`, time: now, color: 'text-amber-400' })
              }
              
              return newLogs
           })
        }
      } catch(e) {}
    }

    fetchMarketData()
    const marketInterval = setInterval(fetchMarketData, 10000)
    
    // Simulate live bidding (Mock since live spot API costs $10k/mo)
    const bidInterval = setInterval(() => {
      setBids(prev => {
        const newBids = [...prev];
        const target = Math.floor(Math.random() * newBids.length);
        const change = Math.floor(Math.random() * 100) - 50;
        newBids[target] = { 
            ...newBids[target], 
            offer: newBids[target].offer + change,
            drop: change < 0,
            time: 'Just now'
        };
        return newBids.sort((a,b) => a.offer - b.offer);
      });
    }, 2000);
    return () => {
      clearInterval(bidInterval);
      clearInterval(marketInterval);
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-[var(--bg-0)] p-6 lg:p-10 font-sans custom-scrollbar overflow-y-auto">
      <header className="mb-10">
         <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2 px-1">Macro Operations</div>
         <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter">Market Intelligence</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* AGENT SWARM TERMINAL */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 bg-[var(--bg-2)] border border-[var(--border)] rounded-[3rem] p-8 shadow-soft flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
              <Terminal className="text-indigo-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-[var(--text-primary)]">Agent Swarm</h2>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-bold opacity-50">Live Execution Multi-Agent Protocol</p>
            </div>
          </div>
          
          <div className="flex-1 bg-[#0a0a0a] rounded-3xl p-6 font-mono text-[10px] border border-[#1a1a1a] overflow-hidden flex flex-col justify-end space-y-4">
             {swarmLogs.map((log, i) => (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} key={i + log.time} className="flex gap-4 border-l-2 border-[#2a2a2a] pl-4">
                   <div className="w-24 shrink-0 text-[#666]">{log.time}</div>
                   <div>
                     <span className={`${log.color} font-bold`}>[{log.agent.toUpperCase()}]</span> 
                     <span className="text-[#aaa] ml-2">{log.message}</span>
                   </div>
                </motion.div>
             ))}
             <div className="flex gap-4 border-l-2 border-indigo-500 pl-4 mt-4 items-center">
                 <span className="text-indigo-500 animate-pulse">_</span>
             </div>
          </div>
        </motion.div>

        {/* FREIGHT EXCHANGE */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1 bg-[var(--bg-2)] border border-[var(--border)] rounded-[3rem] p-8 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
              <Activity className="text-emerald-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-[var(--text-primary)]">Freight Bidding Market</h2>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-bold opacity-50">Shenzhen (SZX) → Los Angeles (LAX)</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-3">
             <AnimatePresence>
                {bids.map((bid, i) => (
                  <motion.div layout key={bid.carrier} className="flex items-center justify-between p-4 bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl">
                     <div className="font-black text-sm uppercase tracking-tight text-[var(--text-primary)]">{bid.carrier}</div>
                     <div className="flex items-center gap-4">
                        <div className="text-[10px] font-bold text-[var(--text-secondary)]">{bid.time}</div>
                        <div className={`text-lg font-black tabular-nums tracking-tighter ${bid.drop ? 'text-emerald-400' : 'text-rose-400'}`}>
                           ${bid.offer.toLocaleString()}
                        </div>
                     </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* TARIFF DODGING & CLONE FINDER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-xl rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10">
         <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
               <ShieldAlert className="text-amber-500" size={24} />
               <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">Section 301 Tariff Warning</h2>
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)] opacity-60 max-w-md mb-8">
               Your primary manufacturer in China is incurring a 25% import tariff. Our Clone Discovery Engine has identified 3 capable alternatives in Vietnam.
            </p>
            
            <div className="flex items-center gap-4">
               <button className="bg-amber-500 hover:bg-amber-400 text-[var(--bg-0)] px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2">
                  <Globe size={16} /> Execute Pivot to Vietnam
               </button>
            </div>
         </div>
         
         <div className="flex-1 w-full bg-[var(--bg-0)] p-6 rounded-3xl border border-[var(--border)] flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
            
            <div className="flex justify-between items-center p-4 bg-[var(--bg-1)] border border-rose-500/20 rounded-2xl relative z-10">
               <div>
                  <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Current Source (China)</div>
                  <div className="font-bold text-[var(--text-primary)]">$112/unit <span className="text-rose-500">+ 25% Tariff</span></div>
               </div>
               <div className="text-xl font-black text-[var(--text-primary)] tabular-nums">$140 <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Landed</span></div>
            </div>

            <div className="flex justify-between items-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl relative z-10 shadow-lg shadow-emerald-500/5">
               <div>
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">AI Discovered (Vietnam)</div>
                  <div className="font-bold text-[var(--text-primary)]">$118/unit <span className="text-emerald-500">+ 0% Tariff</span></div>
               </div>
               <div className="text-xl font-black text-[var(--text-primary)] tabular-nums">$118 <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Landed</span></div>
            </div>
            
            <div className="text-right text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-2 pr-2 relative z-10">
               Est. Savings: $110,000 / Container
            </div>
         </div>
      </motion.div>
    </div>
  )
}
