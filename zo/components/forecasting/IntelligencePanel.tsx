
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, ArrowRight, BarChart3, Info, Loader2, CheckCircle2 } from 'lucide-react'
import { Insight, Recommendation } from '@/lib/forecasting'

interface IntelligencePanelProps {
  insights: Insight[]
  recommendations: Recommendation[]
}

export function IntelligencePanel({ insights, recommendations }: IntelligencePanelProps) {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [lastAction, setLastAction] = useState<string | null>(null)

  const handleAction = (action: string) => {
    setIsOptimizing(true)
    setTimeout(() => {
      setIsOptimizing(false)
      setLastAction(action)
      setTimeout(() => setLastAction(null), 3000)
    }, 1500)
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Dynamic Insights */}
      <div className="card flex-1 min-h-[400px]">
        <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-[var(--text-muted)]">
          <BarChart3 className="w-4 h-4 text-[var(--brand)]" />
          Supply Analysis
        </h3>
        <div className="space-y-3">
          {insights.length > 0 ? (
            insights.map((insight, idx) => (
              <InsightItem key={idx} {...insight} />
            ))
          ) : (
            <div className="p-8 text-center text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest bg-[var(--bg-3)] rounded-xl border border-dashed border-[var(--border)]">
              <Info className="w-6 h-6 mx-auto mb-2 opacity-20" />
              Processing market data...
            </div>
          )}
        </div>
      </div>

      {/* Recommendation */}
      <AnimatePresence mode="wait">
        {recommendations.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl border border-[var(--brand)] bg-[var(--bg-2)] relative overflow-hidden group shadow-xl"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] status-pulse" />
                <h4 className="font-bold text-[var(--brand-light)] text-[10px] uppercase tracking-widest">Operational Strategy</h4>
              </div>
              <div className="font-bold text-[var(--text-primary)] text-lg mb-2">{recommendations[0].title}</div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-6 font-medium">
                {recommendations[0].desc}
              </p>
              
              <button 
                onClick={() => handleAction(recommendations[0].action)}
                disabled={isOptimizing}
                className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-[var(--brand)] hover:bg-[var(--brand-dark)] disabled:bg-[var(--bg-4)] disabled:opacity-50 px-6 py-3 rounded-xl transition-all active:scale-95"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : lastAction === recommendations[0].action ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Action Applied
                  </>
                ) : (
                  <>
                    {recommendations[0].action} <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parameter Controls */}
      <div className="card shadow-xl">
        <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-6 flex items-center justify-between">
          Planning Parameters <span>(Active)</span>
        </h3>
        <div className="space-y-5">
          <ParamSlider label="Direct Cost Target" initial={88} color="from-indigo-500 to-indigo-600" />
          <ParamSlider label="Inventory Cushion" initial={65} color="from-emerald-500 to-emerald-600" />
          <ParamSlider label="Risk Threshold" initial={92} color="from-amber-500 to-amber-600" />
        </div>
      </div>
    </div>
  )
}

function InsightItem({ title, desc, severity }: Insight) {
  const styles = {
    success: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
    warning: 'border-amber-500/20 bg-amber-500/5 text-amber-400',
    danger: 'border-rose-500/20 bg-rose-500/5 text-rose-400'
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01, x: -2 }}
      className={`p-4 rounded-xl border ${styles[severity]} transition-all cursor-pointer`}
    >
      <div className="font-bold text-xs mb-1">{title}</div>
      <p className="text-[10px] opacity-80 leading-relaxed font-medium">{desc}</p>
    </motion.div>
  )
}

function ParamSlider({ label, initial, color }: { label: string, initial: number, color: string }) {
  const [val, setVal] = useState(initial)
  
  return (
    <div className="group space-y-3">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
        <span className="text-[var(--text-secondary)]">{label}</span>
        <span className="text-[var(--text-primary)] bg-[var(--bg-3)] px-1.5 py-0.5 rounded-md border border-[var(--border)]">{val}%</span>
      </div>
      <div 
        className="relative h-1.5 w-full bg-[var(--bg-4)] rounded-full overflow-hidden cursor-crosshair"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          setVal(Math.round((x / rect.width) * 100));
        }}
      >
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${val}%` }}
          className={`h-full bg-gradient-to-r ${color} relative`} 
        >
           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>
    </div>
  )
}
