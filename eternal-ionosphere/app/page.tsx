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

// --- KINETIC BACKGROUND ---
const KineticFlux = () => (
  <div className="fixed inset-0 -z-10 bg-[#fdfdfd] overflow-hidden pointer-events-none">
     <motion.div 
       animate={{ opacity: [0.1, 0.2, 0.1] }}
       transition={{ duration: 8, repeat: Infinity }}
       className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#10b98111_0%,_transparent_70%)]" 
     />
     <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)', backgroundSize: '40px 40px' }} />
  </div>
)

// --- NAV ---
const Nav = () => (
  <motion.nav 
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="fixed top-0 left-0 w-full p-6 lg:p-10 flex justify-between items-center z-[100] bg-white/80 backdrop-blur-3xl border-b border-slate-100"
  >
    <Link href="/" className="flex items-center gap-6 group">
      <svg width="34" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-950 group-hover:rotate-180 transition-transform duration-500">
         <circle cx="6" cy="6" r="6" fill="currentColor"/>
         <rect x="18" y="2" width="14" height="8" fill="currentColor"/>
      </svg>
      <div className="text-xl font-black uppercase tracking-[0.2em] text-slate-950 italic">zo.flow</div>
    </Link>
    <div className="hidden lg:flex items-center gap-12 font-bold uppercase tracking-[0.2em] text-[10px] text-slate-400">
      <Link href="/features" className="hover:text-slate-950 transition-all">Inventory Controller</Link>
      <Link href="/solutions" className="hover:text-slate-950 transition-all">Sourcing Agent</Link>
      <Link href="/pricing" className="hover:text-slate-950 transition-all">Freight HUD</Link>
      <Link href="/company" className="hover:text-slate-950 transition-all">Governance</Link>
    </div>
    <Link href="/login" className="px-10 py-3.5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.5em] rounded-full hover:bg-emerald-600 transition-all shadow-2xl hover:scale-105 active:scale-95">Login</Link>
  </motion.nav>
)

// --- SIMULATED VIDEO COMPONENTS ---
const SourcingVideo = () => (
  <div className="w-full h-full bg-slate-50 relative overflow-hidden flex flex-col p-8 gap-4">
     <div className="flex gap-4 mb-4">
        <div className="w-full bg-white border border-slate-100 p-4 rounded-full flex items-center gap-4 text-slate-300">
           <Search size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest italic">Scanning_Global_Silos...</span>
        </div>
     </div>
     <div className="space-y-4">
        {[
          { name: 'Apple_v4X', price: '$1,299', site: 'APPLE.COM' },
          { name: 'Samsung_S24', price: '$1,199', site: 'AMAZON.US' },
          { name: 'Intel_Xeon', price: '$2,400', site: 'DIGIKEY' }
        ].map((item, i) => (
           <motion.div 
             key={i}
             initial={{ x: -100, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: i * 0.5, duration: 0.8, repeat: Infinity, repeatDelay: 5 }}
             className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex justify-between items-center"
           >
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Monitor size={16} /></div>
                 <div>
                    <div className="text-[10px] font-black text-slate-950 uppercase italic tracking-widest">{item.name}</div>
                    <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{item.site}</div>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-[14px] font-black italic text-emerald-500">{item.price}</div>
                 <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-300">Real-Time Sync</div>
              </div>
           </motion.div>
        ))}
     </div>
     <div className="absolute inset-0 border-[10px] border-white/50 pointer-events-none rounded-[3rem]" />
  </div>
)

const WarehouseVideo = () => (
  <div className="w-full h-full bg-white relative overflow-hidden p-8 flex flex-col justify-center">
     <div className="aspect-[4/3] relative rounded-3xl border border-slate-100 bg-slate-50/50 p-6">
        <div className="absolute top-6 left-6 text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-3">
           <Workflow size={12} /> Spatial_Inventory_Heatmap
        </div>
        <div className="grid grid-cols-6 grid-rows-6 gap-3 h-full pt-8">
           {[...Array(36)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ 
                   backgroundColor: ['#f8fafc', '#10b981', '#f8fafc'],
                   opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ 
                   duration: 4, 
                   repeat: Infinity, 
                   delay: Math.random() * 4,
                   ease: "easeInOut"
                }}
                className="w-full h-full rounded-md border border-slate-100/50"
              />
           ))}
        </div>
     </div>
  </div>
)

const TelemetryVideo = () => (
  <div className="w-full h-full bg-slate-950 relative overflow-hidden">
     <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
     <div className="w-full h-full p-12 flex flex-col justify-between relative z-10">
        <div className="flex justify-between items-start">
           <div className="space-y-4">
              <div className="text-emerald-500 text-[10px] font-black uppercase tracking-[1em] mb-4">Global_Telemetrics</div>
              <div className="text-white text-3xl font-black italic tracking-tighter uppercase leading-none">Transit_HUD<br />Active.</div>
           </div>
           <div className="p-4 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-[10px] font-bold text-white uppercase tracking-widest">v4.0_Stable</div>
           </div>
        </div>
        <div className="relative h-64 border-t border-white/5 flex items-end p-8 gap-4 overflow-hidden">
           {[...Array(20)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ 
                   height: [20, 100, 20],
                   opacity: [0.1, 0.5, 0.1]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
                className="flex-1 bg-emerald-500/50 rounded-t-full"
              />
           ))}
        </div>
     </div>
  </div>
)

// --- NARRATIVE ENGINE ---
const Hero = () => {
  return (
    <section className="h-screen w-full flex flex-col items-center justify-center relative p-12">
       <div className="text-emerald-500 text-[11px] font-black uppercase tracking-[1em] mb-12 flex items-center gap-6">
          <Zap size={14} className="fill-emerald-500" /> Operational Intelligence OS
       </div>
       <h1 className="text-7xl lg:text-[13rem] font-black tracking-tighter leading-[0.75] text-slate-950 uppercase italic text-center">
          Building.<br />The. Future.
       </h1>
       <p className="text-xl lg:text-3xl text-slate-400 font-medium max-w-4xl mx-auto leading-relaxed mt-16 italic text-center selection:bg-emerald-500 selection:text-white">
          Zo.flow solves the fragmentation of global commerce by unifying cross-platform procurement, spatial inventory localization, and real-time freight telemetry into a single, industrial-grade operating system.
       </p>
    </section>
  )
}

const FeatureSection = ({ title, subtitle, desc, video: VideoComponent, align = 'left' }: any) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  
  return (
    <section ref={ref} className="min-h-screen w-full flex items-center justify-center p-8 lg:p-24 relative overflow-hidden bg-white border-t border-slate-50">
       <div className={`max-w-7xl w-full flex flex-col ${align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-32`}>
          <div className="flex-1 space-y-12">
             <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
               transition={{ type: "spring", stiffness: 400, damping: 30 }}
             >
                <div className="text-emerald-500 text-[11px] font-black uppercase tracking-[1em] mb-12 italic">{subtitle}</div>
                <h2 className="text-6xl lg:text-[8rem] font-black tracking-tighter leading-[0.8] text-slate-950 uppercase italic mb-12">
                   {title}
                </h2>
                <div className="space-y-10">
                   <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl italic">
                      {desc}
                   </p>
                   <div className="w-20 h-px bg-slate-200" />
                   <ul className="space-y-6">
                      {[
                        'Millisecond API Synchronization',
                        'High-Fidelity Neural Mapping',
                        'Autonomous Contract Execution'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-[11px] font-black text-slate-950 uppercase tracking-[0.2em]">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {item}
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="pt-16">
                   <Link href="/login" className="px-12 py-5 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.5em] rounded-full hover:bg-emerald-600 transition-all shadow-2xl flex items-center justify-center gap-4 w-fit">
                      Login <ArrowRight size={18} />
                   </Link>
                </div>
             </motion.div>
          </div>
          <div className="flex-1 w-full relative">
             <div className="w-full aspect-square rounded-[4rem] overflow-hidden shadow-2xl border border-slate-100 bg-white group relative">
                <VideoComponent />
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                <div className="absolute top-10 right-10 flex gap-2">
                   <div className="px-6 py-3 bg-white/90 backdrop-blur-xl shadow-2xl rounded-full text-[10px] font-black text-slate-950 tracking-[0.3em] border border-slate-50 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE_SYNC
                   </div>
                </div>
                <div className="absolute bottom-10 left-10 flex flex-col gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest italic opacity-0 group-hover:opacity-100 transition-opacity">
                   <span>Build_1.4.2_Production</span>
                   <span>Authorized_Node_Primary</span>
                </div>
             </div>
          </div>
       </div>
    </section>
  )
}

// --- MAIN PAGE ---
export default function LandingPage() {
  return (
     <div className="bg-[#fdfdfd] text-slate-950 font-sans selection:bg-emerald-500 selection:text-white">
        <KineticFlux />
        <Nav />
        
        <main className="relative z-10 pt-20">
           <Hero />
           
           <FeatureSection 
             title={<>Sourcing<br />Agent.</>} 
             subtitle="CROSS_PLATFORM_PROCUREMENT"
             video={SourcingVideo}
             desc="Zo.flow eliminates manual price comparisons by scanning cross-platform markets simultaneously. Unify your retail silos and industrial suppliers into a single, millisecond-exact procurement ledger."
           />

           <FeatureSection 
             title={<>Warehouse<br />Command.</>} 
             subtitle="3D_INVENTORY_LOCALIZATION"
             video={WarehouseVideo}
             align="right"
             desc="Solve facility blind spots with spatial inventory localized heatmaps. Our high-fidelity neural mapping engine optimizes picking paths and facility throughput automatically."
           />

           <FeatureSection 
             title={<>Transit.<br />HUD.</>} 
             subtitle="GLOBAL_FREIGHT_TELEMETRY"
             video={TelemetryVideo}
             desc="Gain absolute visibility into your global movement. Zo.flow monitors ELD positions, port congestion, and shipping lane telemetrics with zero latency to prevent chain disruptions."
           />

           {/* STRATEGIC EVALUATION (RFx) */}
           <section className="min-h-screen w-full flex flex-col items-center justify-center p-24 text-center border-t border-slate-50">
              <div className="text-emerald-500 text-[11px] font-black uppercase tracking-[1em] mb-12 flex items-center gap-6">
                 <ShieldCheck size={16} /> Autonomous_RFx_Reconciliation
              </div>
              <h2 className="text-7xl lg:text-[13rem] font-black tracking-tighter leading-none text-slate-950 uppercase italic mb-20">
                 The. Data.<br />Authority.
              </h2>
              <p className="text-xl lg:text-3xl text-slate-400 font-medium max-w-5xl mx-auto leading-relaxed italic mb-24 font-serif">
                 "Automate your contractual handshakes. Verify Tier-1 suppliers in milliseconds using our autonomous neural scoring engine."
              </p>
              <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-4 gap-12 mt-20">
                 {[
                   { label: 'Latency', value: '<1ms', icon: <Zap /> },
                   { label: 'Throughput', value: '1.4M', icon: <Activity /> },
                   { label: 'Uptime', value: '99.9%', icon: <Command /> },
                   { label: 'Reliability', value: '98%', icon: <Fingerprint /> }
                 ].map((stat, i) => (
                    <motion.div 
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, damping: 30, delay: i * 0.1 }}
                      className="p-10 bg-white border border-slate-50 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all group"
                    >
                       <div className="w-12 h-12 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center text-slate-300 mb-8 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                          {stat.icon}
                       </div>
                       <div className="text-5xl font-black text-slate-950 tracking-tighter italic mb-4">
                          {stat.value}
                       </div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{stat.label}</div>
                    </motion.div>
                 ))}
              </div>
           </section>

           {/* FINAL GAUNTLET */}
           <section className="h-screen w-full flex flex-col items-center justify-center p-24 text-center bg-slate-950 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
              <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 whileInView={{ scale: 1, opacity: 1 }}
                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 className="relative z-10"
              >
                 <h2 className="text-7xl lg:text-[12rem] font-black tracking-tighter leading-none text-white uppercase italic mb-24">
                    Ready to<br />Join.
                 </h2>
                 <Link href="/login" className="px-24 py-11 bg-white text-slate-950 font-black uppercase tracking-[0.6em] text-[12px] rounded-full hover:bg-emerald-400 hover:text-white transition-all shadow-[0_0_100px_rgba(255,255,255,0.1)] hover:scale-110 active:scale-95">
                    Login Now
                 </Link>
              </motion.div>
           </section>
        </main>

        <footer className="py-48 px-12 lg:px-24 border-t border-slate-50 bg-white grid grid-cols-1 lg:grid-cols-4 gap-24">
           <div className="lg:col-span-2 space-y-12">
              <Link href="/" className="flex items-center gap-6 group">
                <svg width="34" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-950 group-hover:rotate-180 transition-transform duration-500">
                   <circle cx="6" cy="6" r="6" fill="currentColor"/>
                   <rect x="18" y="2" width="14" height="8" fill="currentColor"/>
                </svg>
                <div className="text-3xl font-black uppercase tracking-[0.2em] text-slate-950 italic">zo.flow</div>
              </Link>
              <p className="text-lg font-medium text-slate-400 max-w-sm leading-relaxed italic">
                 The definitive logistics operating system for modern business. Re-engineered for mission-critical clarity and industrial-grade throughput.
              </p>
           </div>
           {[
             { title: 'Company', links: ['About', 'Careers', 'Pricing', 'Contact'] },
             { title: 'Information Protocol', links: ['Privacy Policy', 'Terms of Access', 'Security Gate', 'Compliance'] }
           ].map((group) => (
              <div key={group.title} className="space-y-12">
                 <div className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-950">{group.title}</div>
                 <div className="flex flex-col gap-8">
                    {group.links.map(link => (
                       <Link 
                         key={link} 
                         href={`/${link.toLowerCase().replace(' ', '-')}`} 
                         className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-all uppercase tracking-widest"
                       >
                          {link}
                       </Link>
                    ))}
                 </div>
              </div>
           ))}
        </footer>
     </div>
  )
}
