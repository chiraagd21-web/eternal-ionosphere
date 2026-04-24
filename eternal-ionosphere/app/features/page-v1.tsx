'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
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
  Monitor,
  Workflow,
  Factory,
  Ship,
  GanttChart
} from 'lucide-react'

// --- KINETIC BACKGROUND ---
const KineticFlux = () => (
  <div className="fixed inset-0 -z-10 bg-[#fdfdfd] overflow-hidden pointer-events-none">
     <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)', backgroundSize: '40px 40px' }} />
  </div>
)

const Nav = () => (
  <motion.nav className="fixed top-0 left-0 w-full p-6 lg:p-10 flex justify-between items-center z-[100] bg-white/80 backdrop-blur-3xl border-b border-slate-100 shadow-sm">
    <Link href="/" className="flex items-center gap-6 group">
      <svg width="34" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-950 group-hover:rotate-180 transition-transform duration-500">
         <circle cx="6" cy="6" r="6" fill="currentColor"/>
         <rect x="18" y="2" width="14" height="8" fill="currentColor"/>
      </svg>
      <div className="text-xl font-black uppercase tracking-[0.2em] text-slate-950 italic">zo.flow</div>
    </Link>
    <div className="hidden lg:flex items-center gap-12 font-bold uppercase tracking-[0.2em] text-[10px] text-slate-400">
      <Link href="/features" className="text-slate-950 font-black">Inventory Controller</Link>
      <Link href="/solutions" className="hover:text-slate-950 transition-all">Sourcing Agent</Link>
      <Link href="/pricing" className="hover:text-slate-950 transition-all">Freight HUD</Link>
      <Link href="/company" className="hover:text-slate-950 transition-all">Governance</Link>
    </div>
    <Link href="/login" className="px-10 py-3.5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.5em] rounded-full hover:bg-emerald-600 transition-all shadow-2xl">Authorize Portal</Link>
  </motion.nav>
)

const CapabilityCard = ({ title, desc, icon: Icon, video: VideoComponent }: any) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      className="bg-white border border-slate-50 p-12 rounded-[4rem] shadow-xl hover:shadow-3xl transition-all group flex flex-col h-full"
    >
       <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-10 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
          <Icon size={28} />
       </div>
       <h3 className="text-4xl font-black text-slate-950 uppercase italic tracking-tighter mb-8">{title}</h3>
       <p className="text-base text-slate-400 font-medium leading-relaxed italic mb-12 flex-grow">{desc}</p>
       
       <div className="w-full aspect-video rounded-3xl overflow-hidden border border-slate-50 relative bg-slate-50/50 mb-10">
          <VideoComponent />
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-xl rounded-full text-[8px] font-black text-slate-950 tracking-widest border border-slate-50 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> SIMULATION
          </div>
       </div>

       <Link href="/login" className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-950 hover:text-emerald-500 transition-all">
          Request Access <ArrowRight size={14} />
       </Link>
    </motion.div>
  )
}

// --- SIMULATED VIDEO MINI-COMPONENTS ---
const SourcingMini = () => (
  <div className="w-full h-full p-6 flex flex-col gap-2">
     {[1, 2, 3].map(i => (
        <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} className="h-4 bg-white rounded-full w-full" />
     ))}
     <div className="mt-auto h-8 bg-emerald-100 rounded-full w-1/2" />
  </div>
)

const WarehouseMini = () => (
  <div className="w-full h-full flex items-center justify-center p-6">
     <div className="grid grid-cols-4 gap-2 w-full">
        {[...Array(12)].map((_, i) => (
           <motion.div key={i} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }} className="aspect-square bg-slate-200 rounded-md" />
        ))}
     </div>
  </div>
)

const TelemetryMini = () => (
  <div className="w-full h-full p-6 flex items-center justify-center">
     <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-2 border-dashed border-emerald-500 rounded-full flex items-center justify-center">
        <Globe size={16} className="text-emerald-500" />
     </motion.div>
  </div>
)

export default function FeaturesPage() {
  return (
    <div className="bg-[#fdfdfd] text-slate-950 font-sans selection:bg-emerald-500 selection:text-white">
      <KineticFlux />
      <Nav />
      
      <main className="relative z-10 pt-48 pb-40 px-8 lg:px-24">
         <div className="max-w-7xl mx-auto">
            <div className="text-emerald-500 text-[11px] font-black uppercase tracking-[1em] mb-12">Capability_Inventory</div>
            <h1 className="text-8xl lg:text-[14rem] font-black tracking-tighter leading-[0.75] text-slate-950 uppercase italic mb-32">
               The. Feature.<br />Ecosystem.
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-40">
               <CapabilityCard 
                  title="Cross-Platform Procurement" 
                  desc="Unify your manual price comparisons into a single autonomous ledger that scans retail and industrial silos in milliseconds."
                  icon={Search}
                  video={SourcingMini}
               />
               <CapabilityCard 
                  title="3D Inventory Localization" 
                  desc="Eliminate facility blind spots with spatial heatmaps and high-fidelity neural picking path optimization."
                  icon={Box}
                  video={WarehouseMini}
               />
               <CapabilityCard 
                  title="Global Freight Telemetry" 
                  desc="Real-time monitoring of maritime, air, and last-mile shipping lanes with zero-latency ELD synchronization."
                  icon={Truck}
                  video={TelemetryMini}
               />
            </div>

            {/* SECOND LAYER */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-16">
               <CapabilityCard 
                  title="Automated RFx Reconciliation" 
                  desc="Execute millisecond vendor evaluation and autonomous contract execution using our proprietary neural scoring engine."
                  icon={ShieldCheck}
                  video={SourcingMini}
               />
               <CapabilityCard 
                  title="Neural Finance Ledger" 
                  desc="Reconcile multi-channel transactions and tariff adjustments with sub-second accuracy and automated tax compliance."
                  icon={BarChart3}
                  video={SourcingMini}
               />
            </div>
         </div>
      </main>

      <footer className="py-48 px-12 lg:px-24 border-t border-slate-50 bg-white grid grid-cols-1 lg:grid-cols-4 gap-24">
           {/* SAME REDUCED FOOTER */}
           <div className="lg:col-span-2 space-y-12">
              <Link href="/" className="flex items-center gap-6 group">
                <svg width="34" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-950 group-hover:rotate-180 transition-transform duration-500">
                   <circle cx="6" cy="6" r="6" fill="currentColor"/>
                   <rect x="18" y="2" width="14" height="8" fill="currentColor"/>
                </svg>
                <div className="text-3xl font-black uppercase tracking-[0.2em] text-slate-950 italic">zo.flow</div>
              </Link>
              <p className="text-lg font-medium text-slate-400 max-w-sm leading-relaxed italic">
                 The definitive logistics operating system for modern business. Re-engineered for mission-critical clarity.
              </p>
           </div>
           {[
             { title: 'Intelligence', links: ['Search Agent', 'Inventoryocalization', 'Pricing Audit', 'Governance'] },
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
