'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { Hexagon, ArrowRight, Loader2, Eye, EyeOff, Zap } from 'lucide-react'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, name)
        if (error) { setError(error.message); setLoading(false); return }
        setError('')
        setIsSignUp(false)
        setLoading(false)
        // Show success message for signup
        setError('Account created! Check your email to confirm, then sign in.')
        return
      } else {
        const { error } = await signIn(email, password)
        if (error) { setError(error.message); setLoading(false); return }
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Hero Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0a0e1a] via-[#0d1525] to-[#0a1628] flex-col justify-between p-16">
        {/* Animated background orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <Hexagon className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="font-black text-3xl text-white tracking-tight">zo.flow</div>
            <div className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-[0.3em]">Enterprise OS</div>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <h1 className="text-5xl font-black text-white tracking-tight leading-tight mb-6">
            Autonomous<br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Supply Chain</span><br />
            Intelligence
          </h1>
          <p className="text-lg text-white/40 max-w-md leading-relaxed">
            Live forex rates. Real tariff data. Global freight intelligence. All powered by AI agents that never sleep.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-12">
          <div>
            <div className="text-3xl font-black text-white tabular-nums">40+</div>
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Trade Routes</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white tabular-nums">30+</div>
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Carriers</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white tabular-nums">55+</div>
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">HTS Codes</div>
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-[var(--bg-0)] relative">
        {/* Mobile logo */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg">
            <Hexagon className="w-6 h-6 text-white" />
          </div>
          <div className="font-black text-xl text-[var(--text-primary)]">zo.flow</div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 mt-16 lg:mt-0">
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] opacity-50">
              {isSignUp ? 'Set up your logistics command center' : 'Sign in to your logistics command center'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {isSignUp && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-2 block">Full Name</label>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)} required={isSignUp}
                    placeholder="Your name"
                    className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] text-sm text-[var(--text-primary)] outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-2 block">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="you@company.com"
                className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] text-sm text-[var(--text-primary)] outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] text-sm text-[var(--text-primary)] outline-none focus:border-emerald-500/50 transition-colors pr-14"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-30 hover:opacity-60 transition-all">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 rounded-xl text-sm font-medium ${error.includes('created') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`}>
                {error}
              </motion.div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
              {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={() => { setIsSignUp(!isSignUp); setError('') }} className="text-sm text-[var(--text-secondary)] opacity-50 hover:opacity-100 hover:text-emerald-400 transition-all">
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
