'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Building2, 
  Store, 
  Globe2, 
  Zap, 
  ArrowRight,
  Target,
  BarChart,
  Shield,
  Truck,
  Database
} from 'lucide-react'

// --- REUSABLE NAV ---
const Nav = () => (
  <nav className="fixed top-0 left-0 w-full p-8 lg:p-10 flex justify-between items-center z-[100] transition-all bg-white/90 backdrop-blur-2xl border-b border-slate-100">
    <Link href="/" className="flex items-center gap-6 group">
      <svg width="36" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-950 group-hover:rotate-180 transition-transform duration-500">
         <circle cx="6" cy="6" r="6" fill="currentColor"/>
         <rect x="18" y="2" width="14" height="8" fill="currentColor"/>
      </svg>
      <div className="text-xl font-black uppercase tracking-[0.2em] text-slate-950">zo.flow</div>
    </Link>
    
    <div className="hidden lg:flex items-center gap-10 font-bold uppercase tracking-[0.2em] text-[10px] text-slate-400">
       <Link href="/features" className="hover:text-slate-950 transition-all font-black">Features</Link>
       <Link href="/solutions" className="text-slate-950 transition-all font-black">Solutions</Link>
       <Link href="/pricing" className="hover:text-slate-950 transition-all">Pricing</Link>
       <Link href="/company" className="hover:text-slate-950 transition-all">Company</Link>
    </div>

    <Link 
      href="/login" 
      className="px-10 py-3.5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-emerald-600 transition-all shadow-xl"
    >
      Authorize
    </Link>
  </nav>
)

const SolutionBlock = ({ icon: Icon, title, subtitle, desc, features, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
    className="p-16 lg:p-24 bg-white border border-slate-100 rounded-[4rem] shadow-2xl space-y-12 group"
  >
    <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
       <div className="w-24 h-24 rounded-[2rem] bg-slate-950 text-white flex items-center justify-center shadow-2xl group-hover:bg-emerald-600 transition-colors">
          <Icon size={40} />
       </div>
       <div>
          <span className="text-emerald-500 text-[11px] font-black uppercase tracking-[0.6em] mb-4 block">{subtitle}</span>
          <h3 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter text-slate-950 leading-none">{title}</h3>
       </div>
    </div>
    <p className="text-2xl text-slate-400 font-medium leading-relaxed italic max-w-3xl">"{desc}"</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-12 border-t border-slate-50">
       {features.map((f: string) => (
          <div key={f} className="flex gap-6 items-start">
             <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mt-1"><Zap size={14} /></div>
             <div className="flex-1">
                <div className="text-[12px] font-black uppercase tracking-widest text-slate-950 mb-2">{f.split(':')[0]}</div>
                <div className="text-sm font-medium text-slate-400 italic leading-relaxed">{f.split(':')[1]}</div>
             </div>
          </div>
       ))}
    </div>
  </motion.div>
)

export default function SolutionsPage() {
  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] pt-48 pb-64 font-sans selection:bg-emerald-100">
       <Nav />
       
       <header className="max-w-7xl mx-auto px-12 mb-40">
          <div className="text-emerald-500 text-[11px] font-black uppercase tracking-[1em] mb-12">Targeted Intelligence</div>
          <h1 className="text-8xl lg:text-[12rem] font-black tracking-tighter leading-[0.8] uppercase italic mb-16 text-slate-950">
             Tailored.<br />Optimized. Fast.
          </h1>
          <p className="text-2xl text-slate-400 font-medium max-w-4xl leading-relaxed italic">
             We provide extensive, industry-specific operational frameworks designed to scale with your complexity. From rapid-growth brands to global shipping giants.
          </p>
       </header>

       <section className="max-w-7xl mx-auto px-12 space-y-16">
          <SolutionBlock 
             icon={Store} title="D2C Orchestration" subtitle="DIRECT_TO_CONSUMER"
             desc="Accelerate scaling with unified search and automated inventory reconciliation across all sales channels."
             features={[
                'Multi-Channel Sync: Unify Amazon, Shopify, and retail data streams.',
                'Predictive Sourcing: Automatically identify supply gaps before they occur.',
                'Financial Reconciliation: Millisecond audit traces for every transaction.',
                'Global Search: Real-time price arbitration across 15,000+ retailers.'
             ]}
          />
          <SolutionBlock 
             icon={Building2} title="Enterprise Logistics" subtitle="INDUSTRIAL_SCALE"
             desc="Maximize facility efficiency with spatial 3D command and automated freight orchestration."
             features={[
                '3D Floor Mapping: Isometric control of global warehouse nodes.',
                'Throughput Audit: Real-time telemetry on every industrial asset.',
                'Freight Terminal: Direct bid evaluation with neural scoring.',
                'Customs Automation: Zero-touch filing for global trade lanes.'
             ]}
          />
       </section>

       {/* FINAL CTA */}
       <div className="mt-64 max-w-6xl mx-auto text-center px-12 py-40 border border-slate-100 bg-white rounded-[5rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
             <h2 className="text-7xl lg:text-[10rem] font-black uppercase italic tracking-tighter text-slate-950 mb-16 leading-none">Connect your <br />operational silos.</h2>
             <Link href="/login" className="px-20 py-10 bg-slate-950 text-white font-black uppercase tracking-[0.5em] text-[11px] rounded-full hover:bg-emerald-600 transition-all shadow-2xl hover:scale-110 active:scale-90">
                Authorized Access
             </Link>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-50" />
       </div>
    </div>
  )
}
