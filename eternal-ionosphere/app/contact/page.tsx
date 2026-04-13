'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  Globe,
  ArrowRight
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
      <Link href="/careers" className="hover:text-slate-950 transition-all">Careers</Link>
      <Link href="/pricing" className="hover:text-slate-950 transition-all">Pricing</Link>
      <Link href="/contact" className="text-slate-950 transition-all">Contact</Link>
    </div>
    <Link href="/login" className="px-10 py-3.5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.5em] rounded-full hover:bg-emerald-600 transition-all shadow-2xl">Login</Link>
  </nav>
)

export default function ContactPage() {
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
              Get. In.<br />Touch.
           </h1>
           <p className="text-2xl lg:text-4xl text-slate-400 font-medium max-w-4xl leading-relaxed italic border-l-8 border-emerald-500 pl-10 py-4">
              "Whether you're scaling a startup or managing global silos, our mission support is ready to synchronize."
           </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-48">
           {/* CONTACT FORM */}
           <section className="space-y-12">
              <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl space-y-10">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                       <input type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-100 py-6 px-8 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Business Email</label>
                       <input type="email" placeholder="john@company.com" className="w-full bg-slate-50 border border-slate-100 py-6 px-8 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Message</label>
                       <textarea rows={4} placeholder="How can we help?" className="w-full bg-slate-50 border border-slate-100 py-6 px-8 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none" />
                    </div>
                 </div>
                 <button className="w-full py-8 bg-slate-950 text-white font-black uppercase tracking-[0.6em] text-[11px] rounded-full hover:bg-emerald-600 transition-all shadow-2xl flex items-center justify-center gap-4">
                    Send Message <ArrowRight size={18} />
                 </button>
              </div>
           </section>

           {/* CONTACT INFO */}
           <section className="space-y-16 py-12">
              <div className="space-y-12">
                 {[
                   { icon: <Mail />, title: 'Email Us', detail: 'support@zo-flow.com', sub: '24/7 Mission Response' },
                   { icon: <Phone />, title: 'Call Us', detail: '+1 (555) 0123-FLOW', sub: 'Mon-Fri 9am-6pm EST' },
                   { icon: <MapPin />, title: 'Location', detail: 'San Francisco, CA', sub: 'Global HQ' }
                 ].map((item) => (
                    <div key={item.title} className="flex gap-8 group">
                       <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-all">
                          {item.icon}
                       </div>
                       <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.title}</h4>
                          <p className="text-2xl font-black italic tracking-tight text-slate-950 mt-1">{item.detail}</p>
                          <p className="text-[11px] font-medium text-slate-300 mt-2 italic">{item.sub}</p>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="p-12 bg-slate-950 rounded-[3rem] text-white relative overflow-hidden group">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                 <div className="relative z-10 flex items-center gap-8">
                    <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white animate-pulse">
                       <MessageSquare size={32} />
                    </div>
                    <div>
                       <h4 className="text-xl font-black uppercase italic tracking-tight">Live Support Active</h4>
                       <p className="text-sm font-medium text-slate-400 mt-2">Connect with a neural specialist now.</p>
                    </div>
                 </div>
              </div>
           </section>
        </div>
      </main>
    </div>
  )
}
