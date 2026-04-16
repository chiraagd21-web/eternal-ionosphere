'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight,
  Zap,
  Cpu,
  Fingerprint,
  Search,
  Box,
  Truck,
  ShieldCheck,
  Command,
  Activity,
  Layers,
  ChevronDown,
  Globe,
  Settings,
  Database,
  BarChart3,
  Play,
  Monitor,
  Workflow,
  Factory,
  Ship,
  GanttChart
} from 'lucide-react'

// --- NAV ---
const Nav = () => (
  <motion.nav 
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="fixed top-0 left-0 w-full p-6 lg:px-10 lg:py-5 flex justify-between items-center z-[100] bg-[#0A0A0A]/60 backdrop-blur-xl border-b border-white/5"
  >
    <Link href="/" className="flex items-center gap-4 group">
      <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
        <Zap size={16} className="group-hover:scale-110 transition-transform"/>
      </div>
      <div className="text-xl font-bold tracking-tight text-white">zo.flow</div>
    </Link>
    <div className="hidden lg:flex items-center gap-8 font-medium text-sm text-neutral-400">
      <Link href="/product" className="hover:text-white transition-all">Product</Link>
      <Link href="/solutions" className="hover:text-white transition-all">Solutions</Link>
      <Link href="/pricing" className="hover:text-white transition-all">Pricing</Link>
      <Link href="/changelog" className="hover:text-white transition-all">Changelog</Link>
    </div>
    <div className="flex items-center gap-4">
      <Link href="/login" className="px-5 py-2 text-sm font-medium text-white hover:text-emerald-400 transition-colors hidden sm:block">Sign in</Link>
      <Link href="/login" className="px-5 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">Get Started</Link>
    </div>
  </motion.nav>
)

// --- MOCKUP COMPONENTS FOR "VIDEO" REPLACEMENT ---
const SourcingMockup = () => (
  <div className="w-full h-full bg-[#0F0F11] relative overflow-hidden flex flex-col p-6 rounded-[1.4rem] border border-white/5 shadow-2xl">
     <div className="flex gap-4 mb-6 border-b border-white/5 pb-4">
        <div className="w-full bg-[#1A1A1C] border border-white/5 p-3 rounded-xl flex items-center gap-3 text-neutral-400">
           <Search size={16} /> <span className="text-xs font-medium">Scanning global silos for optimal tensor cores...</span>
        </div>
     </div>
     <div className="space-y-3 flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F0F11] z-10 pointer-events-none" />
        {[
          { name: 'NVIDIA H100 Tensor Core', price: '$30,500', site: 'SUPPLIER_01', latency: '4ms' },
          { name: 'AMD Instinct MI300X', price: '$22,100', site: 'SUPPLIER_02', latency: '8ms' },
          { name: 'Intel Gaudi 3 AI Accl', price: '$18,000', site: 'SUPPLIER_03', latency: '12ms' }
        ].map((item, i) => (
           <motion.div 
             key={i}
             initial={{ x: 20, opacity: 0 }}
             whileInView={{ x: 0, opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: i * 0.2, duration: 0.6 }}
             className="bg-[#151517] border border-white/5 p-4 rounded-xl flex justify-between items-center group hover:bg-[#1C1C1F] transition-colors relative overflow-hidden"
           >
              <motion.div 
                 animate={i === 0 ? { opacity: [0, 0.1, 0] } : {}} 
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute inset-0 bg-emerald-500 pointer-events-none" 
              />
              <div className="flex items-center gap-4 relative z-10">
                 <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-white/5 border border-white/10 text-neutral-400'}`}>
                    <Cpu size={16} />
                 </div>
                 <div>
                    <div className="text-sm font-semibold text-white">{item.name}</div>
                    <div className="text-xs text-neutral-500 font-mono mt-0.5">{item.site} • {item.latency}</div>
                 </div>
              </div>
              <div className="text-right relative z-10">
                 <div className={`text-base font-semibold ${i === 0 ? 'text-emerald-400' : 'text-neutral-300'}`}>{item.price}</div>
                 <div className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${i === 0 ? 'text-emerald-500/70' : 'text-neutral-600'}`}>{i === 0 ? 'Purchasing' : 'Available'}</div>
              </div>
           </motion.div>
        ))}
     </div>
  </div>
)

const TelemetryMockup = () => (
  <div className="w-full h-full bg-[#0F0F11] relative overflow-hidden rounded-[1.4rem] border border-white/5 p-8 flex flex-col shadow-2xl">
     <div className="flex justify-between items-start mb-12 relative z-10">
        <div>
           <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Live Routing</span>
           </div>
           <div className="text-xl font-bold text-white">Global Transit HUD</div>
        </div>
        <div className="px-3 py-1 bg-white/5 rounded-md border border-white/10 text-xs font-mono text-neutral-300">
           PORT_LAX • ACTIVE
        </div>
     </div>
     
     {/* Simulated Map / Node Grid */}
     <div className="absolute inset-x-8 bottom-8 top-32 border border-white/5 rounded-xl bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 overflow-hidden" />
     
     <div className="absolute inset-x-8 bottom-8 top-32 border border-white/5 rounded-xl overflow-hidden pointer-events-none">
         <div className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-center" />
     </div>
     
     {/* Floating nodes routing animation */}
     <div className="absolute inset-x-8 bottom-8 top-32 pointer-events-none overflow-hidden rounded-xl z-20">
        <svg fill="none" className="w-full h-full absolute inset-0 text-white/10" viewBox="0 0 100 100" preserveAspectRatio="none">
           <path d="M10,90 Q40,40 90,10" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
        <motion.div 
           initial={{ left: '10%', top: '90%' }}
           animate={{ left: '90%', top: '10%' }}
           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
           className="absolute w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_15px_#6366f1] -translate-x-1.5 -translate-y-1.5" 
        />
        <div className="absolute bottom-[10%] left-[10%] w-6 h-6 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center -translate-x-3 -translate-y-3">
           <Truck size={10} className="text-white" />
        </div>
        <div className="absolute top-[10%] right-[10%] w-6 h-6 bg-indigo-500/20 backdrop-blur-md rounded-full border border-indigo-500/50 flex items-center justify-center -translate-x-3 -translate-y-3">
           <AnchorIcon size={10} className="text-indigo-400" />
        </div>
     </div>
  </div>
)

const AnchorIcon = ({size, className}:any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="5" r="3"/><line x1="12" x2="12" y1="22" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
)

// --- MAIN PAGE LAYOUT ---
export default function LandingPage() {
  return (
     <div className="bg-[#0A0A0A] text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-200 min-h-screen">
        <Nav />
        
        <main className="relative z-10 pt-40 pb-20">
           {/* HERO */}
           <section className="max-w-6xl mx-auto px-6 lg:px-10 flex flex-col items-center text-center mb-40 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
              
              <Link href="/changelog" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neutral-300 mb-8 hover:bg-white/10 transition-colors relative z-10">
                 <span className="text-emerald-400 font-bold">What's New</span> Announcing Neural Procurement Engine v2 <ArrowRight size={12} />
              </Link>
              
              <h1 className="text-5xl sm:text-6xl lg:text-[6rem] font-bold tracking-tighter leading-[1.05] text-white max-w-5xl mb-8 relative z-10 drop-shadow-2xl">
                 The operating system for <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-600">global supply chains.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl font-medium leading-relaxed mb-12 relative z-10">
                 Zo.flow unifies cross-platform procurement, spatial inventory localization, and real-time freight telemetry into a single, high-performance platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full sm:w-auto">
                 <button className="w-full sm:w-auto h-12 px-8 bg-white text-black text-sm font-semibold rounded-full hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95">Book Demo</button>
                 <button className="w-full sm:w-auto h-12 px-8 bg-neutral-900 border border-neutral-800 text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-all hover:border-neutral-700">Explore Platform</button>
              </div>
           </section>
           
           {/* ALTERNATING FEATURE SECTIONS (Pallet Style) */}
           <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-40">
              
              {/* Feature 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="order-2 lg:order-1 h-[450px] sm:h-[550px] w-full relative group"
                 >
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950 rounded-3xl p-2 border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                       <SourcingMockup />
                    </div>
                 </motion.div>
                 
                 <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="order-1 lg:order-2 space-y-8 lg:pl-12"
                 >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                       <Globe size={28} />
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">Cross-Platform <br/> Procurement.</h2>
                    <p className="text-lg text-neutral-400 leading-relaxed font-medium">
                       Eliminate manual price comparisons. Zo.flow scans global markets simultaneously, unifying retail silos and industrial suppliers into a single, millisecond-exact ledger.
                    </p>
                    <ul className="space-y-4 pt-4 border-t border-white/5">
                       {[
                         'Real-time price arbitration across 140+ marketplaces',
                         'Automated bulk purchasing workflows',
                         'Predictive shortage warnings via ML'
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-4 text-sm text-neutral-300 font-medium">
                            <ShieldCheck size={18} className="text-emerald-500" /> {item}
                         </li>
                       ))}
                    </ul>
                 </motion.div>
              </div>

              {/* Feature 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-8 lg:pr-12"
                 >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                       <Activity size={28} />
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">Global Freight <br/> Telemetry.</h2>
                    <p className="text-lg text-neutral-400 leading-relaxed font-medium">
                       Gain absolute visibility into your geographic movement. Monitor ELD positions, port congestion, and intermodal shipping lines with zero latency.
                    </p>
                    <div className="pt-4 border-t border-white/5">
                        <Link href="/telemetry" className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-white/5 border border-white/10 rounded-full text-sm font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all">
                           Explore Telemetry <ArrowRight size={16} />
                        </Link>
                    </div>
                 </motion.div>
                 
                 <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="h-[450px] sm:h-[550px] w-full relative group"
                 >
                    <div className="absolute inset-0 bg-gradient-to-tl from-neutral-800 to-neutral-950 rounded-3xl p-2 border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                       <TelemetryMockup />
                    </div>
                 </motion.div>
              </div>

           </div>

           {/* BENTO GRID (Pallet Style) */}
           <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-48">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
                 <div>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-white">Command the stack.</h2>
                    <p className="text-lg text-neutral-400 max-w-xl">Everything you need to orchestrate complex global operations in a unified interface.</p>
                 </div>
                 <Link href="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                    View all features <ArrowRight size={16} />
                 </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 {/* Card 1 */}
                 <motion.div 
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="bg-[#111111] border border-white/5 rounded-3xl p-10 flex flex-col justify-between group hover:border-white/10 h-[450px] relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
                    <div className="relative z-10 space-y-4 max-w-sm">
                       <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center text-neutral-300 mb-8 shadow-inner">
                          <Database size={24} />
                       </div>
                       <h3 className="text-2xl font-bold text-white">Neural Mapping</h3>
                       <p className="text-neutral-400 text-base leading-relaxed">
                          Solve facility blind spots with spatial inventory heatmaps. High-fidelity rendering optimizes picking paths natively.
                       </p>
                    </div>
                    {/* Simulated visual inside bento */}
                    <div className="absolute right-0 bottom-0 w-3/4 h-[55%] bg-[#0A0A0A] border-t border-l border-white/5 rounded-tl-3xl p-6 overflow-hidden shadow-2xl flex flex-col gap-2">
                       <div className="text-[10px] font-mono text-neutral-500 mb-2 uppercase tracking-widest flex items-center gap-2"><Box size={10}/> Heatmap Grid</div>
                       <div className="grid grid-cols-5 grid-rows-3 gap-2 h-full opacity-80">
                          {[...Array(15)].map((_, i) => (
                             <motion.div 
                               key={i}
                               animate={{ backgroundColor: ['#10b98110', '#10b98140', '#10b98110'] }}
                               transition={{ duration: 3, repeat: Infinity, delay: (Math.random() * 2) }}
                               className="rounded-md border border-emerald-500/10 w-full h-full"
                             />
                          ))}
                       </div>
                    </div>
                 </motion.div>

                 {/* Card 2 */}
                 <motion.div 
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="bg-[#111111] border border-white/5 rounded-3xl p-10 flex flex-col justify-between group hover:border-white/10 h-[450px] relative overflow-hidden"
                 >
                    <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500/5 blur-[100px] rounded-full pointer-events-none" />
                    <div className="relative z-10 space-y-4 max-w-sm">
                       <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center text-neutral-300 mb-8 shadow-inner">
                          <Fingerprint size={24} />
                       </div>
                       <h3 className="text-2xl font-bold text-white">Automated Compliance</h3>
                       <p className="text-neutral-400 text-base leading-relaxed">
                          Verify Tier-1 suppliers instantly. Our autonomous scoring engine validates ISO certifications and custom clearances.
                       </p>
                    </div>
                    {/* Simulated visual inside bento */}
                    <div className="absolute left-10 bottom-0 right-10 h-[45%] border-t border-l border-r border-white/5 rounded-t-3xl bg-[#0A0A0A] p-6 flex flex-col justify-center gap-4 shadow-2xl">
                       <div className="h-8 w-full bg-[#151515] rounded-xl flex items-center px-4 border border-white/5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 mr-4 shadow-[0_0_10px_#10b981]" />
                          <div className="h-2 w-1/3 bg-white/10 rounded-full" />
                       </div>
                       <div className="h-8 w-full bg-[#151515] rounded-xl flex items-center px-4 border border-white/5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 mr-4 shadow-[0_0_10px_#10b981]" />
                          <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                       </div>
                       <div className="h-8 w-full bg-[#151515] rounded-xl flex items-center px-4 border border-white/5 relative overflow-hidden">
                          <motion.div animate={{ opacity: [0, 0.1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 bg-rose-500 pointer-events-none" />
                          <div className="h-2 w-2 rounded-full bg-rose-500 mr-4 shadow-[0_0_10px_#f43f5e]" />
                          <div className="flex-1 flex justify-between items-center">
                             <div className="h-2 w-2/3 bg-rose-500/30 rounded-full" />
                             <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">Flagged</span>
                          </div>
                       </div>
                    </div>
                 </motion.div>
                 
                 {/* Card 3 (Full Width) */}
                 <motion.div 
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="md:col-span-2 bg-gradient-to-r from-[#111111] to-[#0A0A0A] border border-white/5 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10 group hover:border-white/10 relative overflow-hidden"
                 >
                    <div className="absolute right-0 bottom-0 w-96 h-96 bg-white/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="flex-1 relative z-10 space-y-6">
                       <h3 className="text-3xl font-bold text-white">Join the leading operators</h3>
                       <p className="text-neutral-400 text-lg leading-relaxed max-w-lg">
                          Thousands of supply chain managers rely on Zo.flow to securely encrypt, sync, and deliver their goods on time.
                       </p>
                       <ul className="grid grid-cols-2 gap-4 max-w-sm pt-4">
                          {['SOC2 Certified', 'ISO 27001', 'End-to-End Encryption', '99.99% Uptime'].map(cert => (
                             <li key={cert} className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                                <ShieldCheck size={14} className="text-white" /> {cert}
                             </li>
                          ))}
                       </ul>
                    </div>
                    <div className="flex-1 w-full bg-[#151515] rounded-2xl h-64 border border-white/5 relative flex items-center justify-center shadow-xl">
                       {/* Abstract Graphic */}
                       <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="w-48 h-48 rounded-full border border-dashed border-white/10 flex items-center justify-center">
                             <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-32 h-32 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center justify-center">
                                   <Zap size={24} className="text-black" />
                                </div>
                             </motion.div>
                          </motion.div>
                       </div>
                    </div>
                 </motion.div>

              </div>
           </section>

        </main>

        {/* DARK FOOTER */}
        <footer className="mt-32 pt-20 pb-10 px-6 lg:px-10 border-t border-white/5 bg-[#0a0a0a]">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16 mb-20">
              <div className="space-y-6 max-w-sm">
                 <Link href="/" className="flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-black">
                       <Zap size={14} />
                    </div>
                    <div className="text-xl font-bold tracking-tight text-white">zo.flow</div>
                 </Link>
                 <p className="text-neutral-500 text-sm leading-relaxed">
                    The definitive logistics operating system for modern business. Re-engineered for mission-critical clarity down to the millisecond.
                 </p>
                 <div className="flex gap-4 pt-4">
                     <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-medium text-neutral-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> All systems operational
                     </div>
                 </div>
              </div>
              <div className="flex flex-wrap gap-16 md:gap-24">
                 {[
                   { title: 'Product', links: ['Sourcing Engine', 'Global Telemetry', 'Warehouse HUD', 'Pricing'] },
                   { title: 'Company', links: ['About Us', 'Changelog', 'Careers', 'Contact'] }
                 ].map(group => (
                    <div key={group.title} className="space-y-6">
                       <h4 className="text-white font-semibold text-sm tracking-wide">{group.title}</h4>
                       <div className="flex flex-col gap-4 text-sm text-neutral-500 font-medium">
                          {group.links.map(link => (
                             <Link key={link} href="#" className="hover:text-emerald-400 transition-colors">{link}</Link>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
           <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-neutral-600 font-medium font-mono gap-4">
              <p>© 2026 ZO.FLOW TECHNOLOGIES INC.</p>
              <div className="flex gap-6">
                 <Link href="#" className="hover:text-white transition-colors">PRIVACY</Link>
                 <Link href="#" className="hover:text-white transition-colors">TERMS</Link>
                 <Link href="#" className="hover:text-white transition-colors">SECURITY</Link>
              </div>
           </div>
        </footer>
     </div>
  )
}
