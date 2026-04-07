'use client'
import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      <motion.div
        initial={{ width: '0%', opacity: 1 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.5, ease: 'circOut' }}
        className="h-1 bg-gradient-to-r from-emerald-400 via-indigo-500 to-purple-600 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
      />
    </div>
  )
}
