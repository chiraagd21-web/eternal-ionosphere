'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Zap, 
  Crown, 
  Globe, 
  Check,
  ShieldCheck,
  ArrowRight
} from 'lucide-react'

// --- REUSABLE NAV ---

const Nav = () => (
  <nav className="fixed top-0 left-0 w-full p-8 lg:p-12 flex justify-between items-center z-[100] transition-all bg-white/60 backdrop-blur-3xl border-b border-black/5">
    <Link href="/" className="flex items-center gap-6 group">
      <svg width="40" height="14" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-900 group-hover:scale-110 transition-transform">
         <circle cx="6" cy="6" r="6" fill="currentColor"/>
         <rect x="18" y="2" width="14" height="8" fill="currentColor"/>
      </svg>
      <div className="text-2xl font-black uppercase tracking-[0.2em] text-slate-900">zo.flow</div>
    </Link>
    
    <div className="hidden lg:flex items-center gap-12 font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">
       <Link href="/features" className="hover:text-slate-950 transition-all cursor-pointer">Features</Link>
       <Link href="/solutions" className="hover:text-slate-950 transition-all cursor-pointer">Solutions</Link>
       <Link href="/pricing" className="text-slate-950 transition-all cursor-pointer">Pricing</Link>
       <Link href="/company" className="hover:text-slate-950 transition-all cursor-pointer">Company</Link>
    </div>

    <Link 
      href="/login" 
      className="px-10 py-3.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-emerald-600 transition-all shadow-xl"
    >
      Authorize
    </Link>
  </nav>
)

const PriceCard = ({ title, price, desc, features, recommended = false }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-16 rounded-[4rem] border flex flex-col items-center text-center relative overflow-hidden ${recommended ? 'bg-slate-950 text-white scale-105 shadow-[0_64px_128px_-32px_rgba(16,185,129,0.3)]' : 'bg-white text-slate-900 border-slate-100 shadow-xl'}`}
  >
    {recommended && (
       <div className="absolute top-0 right-0 p-8">
          <div className="bg-emerald-500 text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">Recommended</div>
       </div>
    )}
    <div className={`text-[11px] font-black uppercase tracking-[0.6em] mb-12 ${recommended ? 'text-emerald-500' : 'text-slate-400'}`}>{title}</div>
    <div className="text-7xl font-black italic tracking-tighter mb-4">${price}<span className="text-xl font-medium not-italic">/mo</span></div>
    <p className={`text-sm font-medium mb-16 italic opacity-60`}>{desc}</p>
    
    <div className="w-full space-y-6 mb-16 px-4">
       {features.map((f: any) => (
          <div key={f} className="flex items-center gap-4 text-left">
             <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${recommended ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                <Check size={14} strokeWidth={3} />
             </div>
             <span className="text-xs font-bold tracking-tight opacity-80">{f}</span>
          </div>
       ))}
    </div>

    <Link 
       href="/login" 
       className={`w-full py-6 rounded-full font-black uppercase tracking-[0.4em] text-[10px] transition-all ${recommended ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-slate-950 text-white hover:bg-emerald-600'}`}
    >
       Get Started
    </Link>
  </motion.div>
)

export default function PricingPage() {
  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] pt-48 pb-64">
       <Nav />
       
       <header className="max-w-7xl mx-auto px-12 mb-40 text-center">
          <div className="text-emerald-500 text-[11px] font-black uppercase tracking-[0.8em] mb-12">Scalable Performance</div>
          <h1 className="text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] uppercase italic mb-16 text-slate-900">
             Clear Mission. <br />Clear Price.
          </h1>
          <p className="text-2xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed italic">
             Select the operational tier that matches your global ambitions. No hidden fees, just pure platform efficiency.
          </p>
       </header>

       <section className="max-w-7xl mx-auto px-12 grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <PriceCard 
            title="Individual" price="0" 
            desc="For early-stage sourcing missions."
            features={['Global Search Access', '3 Validated Suppliers', 'Basic Freight Telemetry', 'Manual Recon']}
          />
          <PriceCard 
            recommended={true}
            title="Enterprise" price="499" 
            desc="The standard for global operations."
            features={['Unlimited Neural Sourcing', 'Active 3D Logistics', 'Automated Financial Recon', 'Priority Lane Access']}
          />
          <PriceCard 
            title="Elite" price="1,999" 
            desc="For market leaders scaling fast."
            features={['24/7 Mission Control Support', 'Custom AI Agents', 'Unlimited Facility 3D Maps', 'Whitelist Sourcing Rights']}
          />
       </section>

       <div className="mt-64 max-w-7xl mx-auto px-12 border-t border-slate-100 pt-32 flex flex-col lg:flex-row justify-between gap-16">
          <div className="max-w-md">
             <div className="flex items-center gap-4 mb-8 text-emerald-500">
                <ShieldCheck size={28} />
                <h4 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Enterprise Ready</h4>
             </div>
             <p className="text-sm font-medium text-slate-400 leading-relaxed italic">"Our SOC2 compliant platform ensures your trade data is handled with millisecond-exact security."</p>
          </div>
          <div className="flex items-center gap-12 grayscale opacity-40">
             <div className="text-2xl font-black italic">VISA</div>
             <div className="text-2xl font-black italic">STRIPE</div>
             <div className="text-2xl font-black italic">APPLE PAY</div>
             <div className="text-2xl font-black italic">SECURE PAY</div>
          </div>
       </div>
    </div>
  )
}
