'use client'
import { motion } from 'framer-motion'
import { Construction } from 'lucide-react'

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 rounded-3xl bg-[var(--brand)]/10 flex items-center justify-center mb-8 border border-[var(--brand)]/20 shadow-xl shadow-[var(--brand)]/5"
      >
        <Construction className="w-12 h-12 text-[var(--brand)]" />
      </motion.div>
      <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
        {title} <span className="gradient-text">Coming Soon</span>
      </h1>
      <p className="text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
        Our engineers are currently building the advanced neural mapping for this module. 
        Expect deployment in the next sprint cycle.
      </p>
      <div className="mt-12 flex items-center gap-4">
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--bg-0)] bg-[var(--bg-2)] overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="avatar" />
            </div>
          ))}
        </div>
        <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest text-left">
          <div className="text-[var(--text-primary)]">12 Engineers</div>
          Working on it
        </div>
      </div>
    </div>
  )
}
