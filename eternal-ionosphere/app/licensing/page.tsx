'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ArrowLeft,
  Mail,
  Globe,
  ShieldCheck,
  FileText,
  Users,
  Briefcase,
  HelpCircle,
  MessageSquare
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

export default function GenericInfoPage() {
  const pathname = usePathname()
  const title = pathname.slice(1).toUpperCase().replace('-', ' ')
  
  const getIcon = () => {
     if (pathname.includes('privacy') || pathname.includes('terms') || pathname.includes('legal')) return ShieldCheck
     if (pathname.includes('contact')) return Mail
     if (pathname.includes('careers')) return Briefcase
     if (pathname.includes('documentation') || pathname.includes('help')) return HelpCircle
     return FileText
  }

  const PageIcon = getIcon()

  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] pt-48 pb-64 font-sans">
       <Nav />
       
       <article className="max-w-4xl mx-auto px-12">
          <Link href="/" className="group flex items-center gap-4 text-slate-400 hover:text-slate-950 transition-all mb-20">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
             <span className="text-[10px] font-black uppercase tracking-widest">Return Home</span>
          </Link>

          <header className="space-y-12 mb-24">
             <div className="w-20 h-20 rounded-[1.8rem] bg-slate-900 text-white flex items-center justify-center shadow-2xl">
                <PageIcon size={32} />
             </div>
             <h1 className="text-7xl lg:text-[8rem] font-black tracking-tighter leading-[0.8] uppercase italic text-slate-900">
                {title}.
             </h1>
          </header>

          <div className="prose prose-slate max-w-none">
             <section className="space-y-12">
                <p className="text-2xl text-slate-400 font-medium leading-relaxed italic border-l-4 border-emerald-500 pl-8">
                   "This document details the operational framework and guidelines governing the {title} protocol within the zo.flow ecosystem."
                </p>
                
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">01. Operational Scope</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                   The zo.flow platform operates as a unified mission-control hub for global trade orchestration. This module ensures that all platform communications, data transfers, and logistical commands follow the strict {title} standards set by our secure kernel.
                </p>

                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">02. Data Integrity & Sync</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                   In accordance with SOC2 and GDPR requirements, our platform utilizes millisecond-exact historical auditing. Every action taken within the {title} environment is verified through our proprietary Neural Flux engine before being committed to the permanent ledger.
                </p>

                <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 flex items-center gap-8">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                      <MessageSquare size={24} />
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-900 uppercase italic mb-2 tracking-tight">Need immediate clarification?</h4>
                      <p className="text-sm font-medium text-slate-400">Our mission support team is active 24/7 to resolve complex operational queries.</p>
                   </div>
                </div>
             </section>
          </div>
       </article>

       {/* FOOTER MINI */}
       <div className="fixed bottom-12 right-12 opacity-30 text-[9px] font-black uppercase tracking-[0.5em] flex items-center gap-6">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Mission_Live // {title}_ACTIVE
       </div>
    </div>
  )
}
