'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft,
  Briefcase,
  Rocket,
  Coffee,
  Heart,
  Globe,
  Plus,
  ArrowRight,
  Zap
} from 'lucide-react'

const Nav = () => (
  <nav className="fixed top-0 left-0 w-full p-6 lg:p-10 flex justify-between items-center z-[100] bg-white/80 backdrop-blur-3xl border-b border-slate-100">
    <Link href="/" className="flex items-center gap-6 group">
      <svg width="34" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-950">
         <circle cx="6" cy="6" r="6" fill="currentColor"/>
         <rect x="18" y="2" width="14" height="8" fill="currentColor"/>
      </svg>
      <div className="text-xl font-black uppercase tracking-[0.2em] text-slate-950 italic">zo.flow</div>
    </Link>
    <div className="hidden lg:flex items-center gap-12 font-bold uppercase tracking-[0.2em] text-[10px] text-slate-400">
      <Link href="/about" className="hover:text-slate-950 transition-all">About</Link>
      <Link href="/careers" className="text-slate-950 transition-all">Careers</Link>
      <Link href="/pricing" className="hover:text-slate-950 transition-all">Pricing</Link>
      <Link href="/contact" className="hover:text-slate-950 transition-all">Contact</Link>
    </div>
    <Link href="/login" className="px-10 py-3.5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.5em] rounded-full hover:bg-emerald-600 transition-all shadow-2xl">Login</Link>
  </nav>
)

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#fdfdfd] text-slate-950 font-sans selection:bg-emerald-500 selection:text-white pb-32">
      <Nav />
      
      <main className="pt-48 px-6 lg:px-24 max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-12 mb-32"
        >
           <Link href="/" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-950 transition-all w-fit">
              <ArrowLeft size={14} /> Back to Home
           </Link>
           <h1 className="text-7xl lg:text-[10rem] font-black tracking-tighter leading-[0.8] uppercase italic">
              Join.<br />The. Flow.
           </h1>
           <p className="text-2xl lg:text-4xl text-slate-400 font-medium max-w-4xl leading-relaxed italic border-l-8 border-indigo-500 pl-10 py-4">
              "We are looking for engineers, designers, and logistics visionaries to build the future of global commerce."
           </p>
        </motion.div>

        {/* PERKS */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-48">
           {[
             { title: 'Remote First', icon: <Globe />, detail: 'Work from anywhere in the world.' },
             { title: 'Full Health', icon: <Heart />, detail: 'Global healthcare for you and family.' },
             { title: 'Growth Budget', icon: <Rocket />, detail: '$5k annual learning stipend.' },
             { title: 'Premium Gear', icon: <Zap />, detail: 'Latest MacBook & custom workspace.' }
           ].map((perk, i) => (
              <div key={perk.title} className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-6">
                 <div className="text-slate-950">{perk.icon}</div>
                 <h4 className="text-lg font-black uppercase italic tracking-tight">{perk.title}</h4>
                 <p className="text-sm font-medium text-slate-400 leading-relaxed">{perk.detail}</p>
              </div>
           ))}
        </section>

        {/* OPEN POSITIONS */}
        <section className="space-y-16 mb-48">
           <div className="flex justify-between items-end border-b border-slate-100 pb-12">
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic">Open. Slots.</h2>
              <div className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Current Openings // ACTIVE</div>
           </div>
           
           <div className="divide-y divide-slate-100">
              {[
                { title: 'Neural Network Engineer', team: 'Kernel', location: 'Remote / SF', type: 'Full-Time' },
                { title: 'Product Designer', team: 'Interface', location: 'Remote / NYC', type: 'Full-Time' },
                { title: 'Logistics Protocol Lead', team: 'Supply Chain', location: 'Remote / LDN', type: 'Full-Time' },
                { title: 'DevOps & Telemetry', team: 'Infrastructure', location: 'Remote', type: 'Full-Time' }
              ].map((job) => (
                 <Link key={job.title} href="/careers" className="group py-12 flex flex-col md:flex-row justify-between items-center gap-8 hover:px-8 transition-all duration-500 rounded-3xl hover:bg-slate-50">
                    <div className="space-y-4">
                       <h3 className="text-3xl font-black uppercase italic tracking-tight group-hover:text-emerald-500 transition-all">{job.title}</h3>
                       <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                          <span>{job.team}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200 mt-1" />
                          <span>{job.location}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] px-6 py-3 border border-slate-100 rounded-full">{job.type}</span>
                       <div className="w-16 h-16 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:bg-emerald-500 transition-all">
                          <Plus size={24} />
                       </div>
                    </div>
                 </Link>
              ))}
           </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="p-24 bg-indigo-600 rounded-[4rem] text-center text-white">
           <h2 className="text-5xl lg:text-8xl font-black tracking-tighter uppercase italic mb-8">Not seeing<br />your fit?</h2>
           <p className="text-lg lg:text-2xl text-indigo-100 font-medium max-w-2xl mx-auto leading-relaxed italic mb-16">
              We are always looking for exceptional talent. Send us an open application and tell us how you can impact the flow.
           </p>
           <button className="px-16 py-8 bg-white text-indigo-600 font-black uppercase tracking-[0.6em] text-[12px] rounded-full hover:bg-emerald-400 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-6 mx-auto">
              Open Application <ArrowRight size={20} />
           </button>
        </section>
      </main>
    </div>
  )
}
