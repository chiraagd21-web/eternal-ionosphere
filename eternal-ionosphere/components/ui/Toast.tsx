'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
  toasts: ToastItem[]
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    // Neural Silence: Global notifications disabled as per user request
    // const id = Math.random().toString(36).substring(2, 9)
    // setToasts(prev => [...prev.slice(-4), { id, message, type }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, toasts, removeToast }}>
      {children}
      <div className="fixed bottom-10 right-10 z-[2000] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 10 }}
              layout
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-3xl shadow-2xl min-w-[320px] pointer-events-auto ${
                toast.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10' :
                toast.type === 'error' ? 'border-rose-500/30 bg-rose-500/10' : 'border-indigo-500/30 bg-indigo-500/10'
              }`}
            >
              <div className="flex-shrink-0">
                {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> :
                 toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-rose-400" /> : <Info className="w-5 h-5 text-indigo-400" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white uppercase tracking-tight">{toast.message}</p>
              </div>
              <button 
                onClick={() => removeToast(toast.id)} 
                className="p-1 hover:bg-white/10 rounded-lg transition-colors group"
              >
                <X className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// Support legacy exports for backward compatibility during refactor
export function ToastContainer({ toasts, removeToast }: { toasts: any[], removeToast: (id: string) => void }) {
  return null // Now handled by ToastProvider
}
