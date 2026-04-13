'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Users, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Globe, 
  Cpu,
  ArrowRight,
  TrendingUp
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
       <Link href="/pricing" className="hover:text-slate-950 transition-all cursor-pointer">Pricing</Link>
       <Link href="/company" className="text-slate-950 transition-all cursor-pointer">Company</Link>
    </div>

    <Link 
      href="/login" 
      className="px-10 py-3.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-emerald-600 transition-all shadow-xl"
    >
      Authorize
    </Link>
  </nav>
)

export default function CompanyPage() {
  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] pt-48">
       <Nav />
       
       <header className="max-w-7xl mx-auto px-12 mb-40 text-center lg:text-left">
          <div className="text-emerald-500 text-[11px] font-black uppercase tracking-[0.8em] mb-12">The Mission</div>
          <h1 className="text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] uppercase italic mb-16 text-slate-900">
             Building the <br />Future Hub.
          </h1>
          <p className="text-2xl text-slate-400 font-medium max-w-4xl leading-relaxed italic">
             Our vision is to become the universal operating system for global trade. We build tools that make the complex simple, the opaque transparent, and the slow immediate.
          </p>
       </header>

       {/* STATS SECTION */}
       <section className="bg-slate-950 py-32 text-white">
          <div className="max-w-7xl mx-auto px-12 grid grid-cols-2 lg:grid-cols-4 gap-24">
             {[
               { label: 'TRANSITIONS', value: '4B+' },
               { label: 'GLOBAL_HUBS', value: '142' },
               { label: 'NEURAL_SPEED', value: '0.4ms' },
               { label: 'EFFICIENCY', value: '84%' }
             ].map(stat => (
                <div key={stat.label} className="text-center lg:text-left border-l border-white/10 pl-10 space-y-4">
                   <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">{stat.label}</div>
                   <div className="text-6xl font-black italic tracking-tighter">{stat.value}</div>
                </div>
             ))}
          </div>
       </section>

       <section className="py-48 max-w-7xl mx-auto px-12 space-y-48">
          <div className="flex flex-col lg:flex-row gap-32 items-center">
             <div className="flex-1 space-y-12">
                <h2 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Global Coverage. <br />Local Presence.</h2>
                <p className="text-xl text-slate-400 font-medium leading-relaxed italic">
                   "With operational nodes in San Francisco, London, and Singapore, we provide 24/7 mission critical support to the world's most ambitious companies."
                </p>
                <div className="flex gap-12">
                   <Link href="/careers" className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-950 flex items-center gap-3 hover:text-emerald-600 transition-all">
                      Open Roles <ArrowRight size={14} />
                   </Link>
                   <Link href="/contact" className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-950 flex items-center gap-3 hover:text-emerald-600 transition-all">
                      Contact HQ <ArrowRight size={14} />
                   </Link>
                </div>
             </div>
             <div className="flex-1 w-full aspect-square bg-slate-50 rounded-[4rem] flex items-center justify-center p-24">
                <Globe size={180} className="text-slate-200" />
             </div>
          </div>
       </section>

       {/* FOOTER CALL */}
       <section className="h-[60vh] flex flex-col items-center justify-center text-center p-24 border-t border-slate-100">
          <TrendingUp size={64} className="text-emerald-500 mb-16" />
          <h3 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900 mb-12">Join the mission movement.</h3>
          <Link href="/careers" className="px-16 py-8 bg-slate-950 text-white font-black uppercase tracking-[0.5em] text-[10px] rounded-full hover:bg-emerald-600 transition-all shadow-2xl">
             Explore Careers
          </Link>
       </section>
    </div>
  )
}
