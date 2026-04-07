
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  trend?: string
  trendUp?: boolean | null
  icon: ReactNode
}

export function StatCard({ label, value, trend, trendUp, icon }: StatCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="card flex flex-col justify-between group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-xl bg-[var(--bg-3)] border border-[var(--border)] shadow-inner group-hover:border-[var(--brand-light)] transition-colors">
          {icon}
        </div>
        {trend && (
          <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            trendUp === true ? 'bg-emerald-500/10 text-emerald-400' : 
            trendUp === false ? 'bg-rose-500/10 text-rose-400' : 
            'bg-[var(--bg-3)] text-[var(--text-muted)]'
          }`}>
            {trend}
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-extrabold mb-1 tracking-tight text-[var(--text-primary)]">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{label}</div>
      </div>
    </motion.div>
  )
}
