'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft,
  Globe,
  Users,
  Target,
  Rocket,
  Shield,
  Zap,
  Activity
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
      <Link href="/about" className="text-slate-950 transition-all">About</Link>
      <Link href="/careers" className="hover:text-slate-950 transition-all">Careers</Link>
      <Link href="/pricing" className="hover:text-slate-950 transition-all">Pricing</Link>
      <Link href="/contact" className="hover:text-slate-950 transition-all">Contact</Link>
    </div>
    <Link href="/login" className="px-10 py-3.5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.5em] rounded-full hover:bg-emerald-600 transition-all shadow-2xl">Login</Link>
  </nav>
)

export default function AboutPage() {
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
              Our.<br />Mission.
           </h1>
           <p className="text-2xl lg:text-4xl text-slate-400 font-medium max-w-4xl leading-relaxed italic border-l-8 border-emerald-500 pl-10 py-4">
              "To solve the fragmentation of global commerce by unifying supply chains into a single, intelligent operating system."
           </p>
        </motion.div>

        {/* CORE VALUES */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-48">
           {[
             { title: 'Radical Transparency', icon: <Target className="text-emerald-500" />, desc: 'We believe visibility is the foundation of trust in global trade.' },
             { title: 'Neural Velocity', icon: <Zap className="text-indigo-500" />, desc: 'Decision making should happen at the speed of thought, not the speed of paperwork.' },
             { title: 'Industrial Grade', icon: <Shield className="text-slate-950" />, desc: 'Security and reliability aren\'t features; they are the bedrock of our kernel.' }
           ].map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 bg-white border border-slate-100 rounded-[3rem] shadow-xl space-y-8"
              >
                 <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
                    {item.icon}
                 </div>
                 <h3 className="text-2xl font-black uppercase italic tracking-tight">{item.title}</h3>
                 <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
           ))}
        </section>

        {/* TEAM SECTION */}
        <section className="space-y-24 mb-48">
           <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic">The. Engineers.</h2>
              <div className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Architects of zo.flow // Stable_1.4.2</div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { name: 'Dr. Alex Chen', role: 'Neural Architect', id: '01' },
                { name: 'Sarah Jenkins', role: 'Logistics Protocol', id: '02' },
                { name: 'Marcus Thorne', role: 'Telemetry Specialist', id: '03' },
                { name: 'Elena Vance', role: 'Security Ops', id: '04' }
              ].map((member) => (
                <div key={member.name} className="space-y-6 group">
                   <div className="aspect-[3/4] bg-slate-100 rounded-[2.5rem] relative overflow-hidden flex items-center justify-center text-slate-200">
                      <Users size={80} className="group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-8 left-8 text-[10px] font-black opacity-30 tracking-widest italic">{member.id} // ID</div>
                   </div>
                   <div>
                      <h4 className="text-xl font-black uppercase italic tracking-tight">{member.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{member.role}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* GLOBAL REACH */}
        <section className="p-24 bg-slate-950 rounded-[4rem] relative overflow-hidden text-center text-white">
           <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
           <Globe size={160} className="mx-auto mb-16 opacity-20 animate-spin-slow" />
           <h2 className="text-5xl lg:text-8xl font-black tracking-tighter uppercase italic mb-8">Global. Scale.</h2>
           <p className="text-lg lg:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed italic mb-16">
              Processing 1.4M transactions daily across 42 countries. Powered by a neural network that never sleeps.
           </p>
           <div className="flex justify-center gap-12 text-emerald-500 text-[11px] font-black uppercase tracking-[0.5em]">
              <div className="flex items-center gap-3"><Activity size={14} /> 99.9% Uptime</div>
              <div className="flex items-center gap-3"><Shield size={14} /> SOC2 Compliant</div>
           </div>
        </section>
      </main>
    </div>
  )
}
