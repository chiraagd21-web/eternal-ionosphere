'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Coffee, Zap, Palette } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-10 w-32 bg-[var(--bg-2)]/20 animate-pulse rounded-xl" />
  }

  const themes = [
    { id: 'light', label: 'Bloom', icon: Sun, color: 'text-amber-400' },
    { id: 'medium', label: 'Cream', icon: Coffee, color: 'text-orange-300' },
    { id: 'dark', label: 'Synk', icon: Zap, color: 'text-indigo-400' },
  ]

  return (
    <div className="flex bg-[var(--bg-2)]/50 backdrop-blur-3xl rounded-2xl p-1 gap-1 border border-[var(--border)] shadow-lg">
      <AnimatePresence mode="wait">
        {themes.map((t) => {
          const isActive = theme === t.id
          const Icon = t.icon
          
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-500 group ${
                isActive 
                  ? 'text-[var(--text-primary)] font-black' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <div className="relative z-10 flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${isActive ? t.color : 'opacity-40 group-hover:opacity-100 group-hover:scale-110'} transition-all duration-300`} />
                <span className="text-[9px] uppercase tracking-widest hidden sm:inline-block">{t.label}</span>
              </div>
              
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute inset-0 bg-[var(--bg-1)] border border-[var(--border)] rounded-xl shadow-inner"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
