'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Loader2, 
  Zap, 
  ArrowLeft,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Globe,
  Fingerprint,
  Activity,
  Cpu,
  Search
} from 'lucide-react'

// --- KINETIC BACKGROUND ---
const KineticFlux = () => (
  <div className="absolute inset-0 -z-10 bg-[#fdfdfd] overflow-hidden pointer-events-none">
     <motion.div 
        animate={{ 
           scale: [1, 1.15, 1],
           rotate: [0, 45, 0],
           x: [0, 50, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[10%] -left-[5%] w-[80vw] h-[80vw] bg-emerald-50 rounded-full blur-[150px]" 
     />
     <motion.div 
        animate={{ 
           scale: [1, 1.25, 1],
           rotate: [0, -45, 0],
           x: [0, -50, 0]
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[10%] -right-[5%] w-[100vw] h-[100vw] bg-indigo-50 rounded-full blur-[180px]" 
     />
     <div className="absolute inset-0 bg-[#000]/[0.02] mix-blend-overlay" />
  </div>
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) throw error
        setError('Verification email sent. Check your inbox.')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <KineticFlux />

      {/* TOP NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full p-8 lg:p-12 flex justify-between items-center z-[100]">
         <Link href="/" className="flex items-center gap-4 group text-slate-400 hover:text-slate-950 transition-all font-black uppercase tracking-[0.2em] text-[10px]">
            <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center bg-white shadow-sm group-hover:-translate-x-1 transition-transform">
               <ArrowLeft size={18} />
            </div>
            Back
         </Link>
         <Link href="/" className="flex items-center gap-6 group">
            <svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-950">
               <circle cx="6" cy="6" r="6" fill="currentColor"/>
               <rect x="18" y="2" width="14" height="8" fill="currentColor"/>
            </svg>
            <div className="text-2xl font-black uppercase tracking-[0.2em] text-slate-950">zo.flow</div>
         </Link>
      </nav>

      {/* LOGIN CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/90 backdrop-blur-[100px] p-12 lg:p-20 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden group">
           
           <div className="text-center mb-16 space-y-8">
              <div className="w-20 h-20 bg-slate-950 rounded-3xl mx-auto flex items-center justify-center text-white mb-10 shadow-2xl">
                 {isSignUp ? <Globe size={32} /> : <Fingerprint size={32} />}
              </div>
              <h1 className="text-6xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">
                 {isSignUp ? 'Create Account' : 'Login'}
              </h1>
              <p className="text-sm font-bold text-slate-400 max-w-xs mx-auto italic tracking-wide uppercase">
                 {isSignUp ? 'Sign up for a new account' : 'Enter your email and password to login'}
              </p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-6">
                 <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input
                       type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                       placeholder="Email Address"
                       className="w-full bg-slate-50 border border-slate-100 py-7 pl-16 pr-10 rounded-3xl text-[14px] font-bold text-slate-950 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all"
                    />
                 </div>

                 <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input
                       type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                       placeholder="Password"
                       className="w-full bg-slate-50 border border-slate-100 py-7 pl-16 pr-10 rounded-3xl text-[14px] font-bold text-slate-950 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all"
                    />
                 </div>
              </div>

              <div className="flex flex-col gap-6 pt-6">
                 <button
                    type="submit" disabled={loading}
                    className="w-full py-8 bg-slate-950 text-white font-black uppercase tracking-[0.6em] text-[11px] rounded-full transition-all flex items-center justify-center gap-4 hover:bg-emerald-600 shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                 >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : (isSignUp ? <Globe size={18} /> : <Zap size={18} fill="currentColor" />)}
                    {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Login')}
                 </button>

                 <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="text-center text-[10px] font-black uppercase tracking-widest p-6 rounded-3xl bg-rose-50 border border-rose-100 text-rose-500"
                      >
                        {error}
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </form>

           <div className="mt-16 pt-10 border-t border-slate-50 text-center">
              <button 
                 onClick={() => setIsSignUp(!isSignUp)}
                 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] hover:text-slate-950 transition-all flex items-center justify-center gap-4 mx-auto"
              >
                 {isSignUp ? 'Already have an account? Login' : "Don't have an account? Create Account"}
                 <ArrowRight size={14} />
              </button>
           </div>
        </div>

        {/* SYSTEM STATUS */}
        <div className="mt-16 flex flex-col lg:flex-row justify-center items-center gap-12 opacity-40 text-slate-400">
           <div className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Secure Connection</span>
           </div>
           <div className="w-1.5 h-1.5 rounded-full bg-slate-200 hidden lg:block" />
           <div className="flex items-center gap-3">
              <Activity size={16} className="text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Ready</span>
           </div>
        </div>
      </motion.div>

      {/* PLATFORM VERSION */}
      <div className="fixed bottom-12 flex items-center gap-12 opacity-10 text-[9px] font-black text-slate-900 uppercase tracking-[1.5em] pointer-events-none">
         <Cpu size={12} />
         <span>Build. 1.4.2. STABLE</span>
      </div>
    </div>
  )
}
