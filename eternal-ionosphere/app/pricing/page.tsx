'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft,
  Check,
  Zap,
  Shield,
  Activity,
  Globe,
  Plus,
  ArrowRight,
  Command
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
      <Link href="/pricing" className="text-slate-950 transition-all">Pricing</Link>
      <Link href="/contact" className="hover:text-slate-950 transition-all">Contact</Link>
    </div>
    <Link href="/login" className="px-10 py-3.5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.5em] rounded-full hover:bg-emerald-600 transition-all shadow-2xl">Login</Link>
  </nav>
)

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true)

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-slate-950 font-sans selection:bg-emerald-500 selection:text-white pb-32">
      <Nav />
      
      <main className="pt-48 px-6 lg:px-24 max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center space-y-12 mb-32"
        >
           <h1 className="text-7xl lg:text-[10rem] font-black tracking-tighter leading-[0.8] uppercase italic mx-auto">
              Pricing.<br />Models.
           </h1>
           <p className="text-xl max-w-2xl mx-auto text-slate-400 font-medium italic">
              Transparent, industrial-grade scaling for businesses of all sizes.
           </p>

           {/* TOGGLE */}
           <div className="flex items-center justify-center gap-8 mt-16">
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all ${!isYearly ? 'text-slate-950' : 'text-slate-300'}`}>Monthly</span>
              <button 
                onClick={() => setIsYearly(!isYearly)}
                className="w-20 h-10 bg-slate-100 rounded-full p-1.5 relative transition-all"
              >
                 <motion.div 
                   animate={{ x: isYearly ? 40 : 0 }}
                   className="w-7 h-7 bg-slate-950 rounded-full" 
                 />
              </button>
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all ${isYearly ? 'text-slate-950' : 'text-slate-300'}`}>Yearly 
                 <span className="ml-4 text-emerald-500 text-[8px] font-black">Save 20%</span>
              </span>
           </div>
        </motion.div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-48">
           {[
             { 
               name: 'Basic', 
               price: isYearly ? '0' : '0', 
               desc: 'For individual logistics exploration.', 
               features: ['10 SKUs / Month', 'Standard Search Agent', 'Basic Dashboards', 'Community Support'],
               icon: <Activity />,
               isPopular: false
             },
             { 
               name: 'Pro', 
               price: isYearly ? '199' : '249', 
               desc: 'For high-velocity growth operations.', 
               features: ['Unlimited SKUs', 'Neural Sourcing Engine', 'Real-time Telemetry', 'Priority Support', 'Custom Integrations'],
               icon: <Zap />,
               isPopular: true
             },
             { 
               name: 'Enterprise', 
               price: 'Custom', 
               desc: 'Global infrastructure for multinationals.', 
               features: ['Lattice-Locked Security', 'Dedicated AI Training', 'Global Logistics SLA', 'White-label Portal', 'Private Cloud'],
               icon: <Shield />,
               isPopular: false
             }
           ].map((plan, i) => (
              <motion.div 
                key={plan.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-16 rounded-[4rem] border flex flex-col justify-between ${plan.isPopular ? 'bg-slate-950 text-white border-slate-900 shadow-3xl scale-105' : 'bg-white border-slate-100 shadow-xl'}`}
              >
                 <div className="space-y-12">
                    <div className="flex justify-between items-start">
                       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${plan.isPopular ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-950'}`}>
                          {plan.icon}
                       </div>
                       {plan.isPopular && <div className="px-6 py-2 bg-emerald-500/10 text-emerald-500 rounded-full text-[8px] font-black uppercase tracking-widest">Recommended</div>}
                    </div>
                    <div>
                       <h3 className="text-4xl font-black uppercase italic tracking-tight">{plan.name}</h3>
                       <p className={`text-sm font-medium mt-4 leading-relaxed ${plan.isPopular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                       <span className="text-6xl font-black tracking-tighter italic">{plan.price !== 'Custom' ? `$${plan.price}` : 'Custom'}</span>
                       {plan.price !== 'Custom' && <span className={`text-[10px] font-black uppercase tracking-widest ${plan.isPopular ? 'text-slate-600' : 'text-slate-300'}`}>/ Month</span>}
                    </div>
                    <ul className="space-y-6 pt-12 border-t border-white/5">
                       {plan.features.map(feat => (
                          <li key={feat} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                             <Check size={14} className="text-emerald-500" /> {feat}
                          </li>
                       ))}
                    </ul>
                 </div>
                 <Link 
                   href="/login" 
                   className={`mt-20 w-full py-8 rounded-full font-black uppercase tracking-[0.6em] text-[11px] flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 ${plan.isPopular ? 'bg-white text-slate-950 hover:bg-emerald-400' : 'bg-slate-950 text-white hover:bg-emerald-600 shadow-2xl'}`}
                 >
                    Select Plan <ArrowRight size={18} />
                 </Link>
              </motion.div>
           ))}
        </div>

        {/* FAQ SECTION PREVIEW */}
        <section className="max-w-4xl mx-auto space-y-16">
           <div className="text-center">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic">Frequently.<br />Questioned.</h2>
           </div>
           <div className="space-y-8">
              {[
                { q: 'Can I switch plans mid-cycle?', a: 'Yes. Upgrades are immediate, downgrades occur at the end of the billing period.' },
                { q: 'Is there a free trial for Pro?', a: 'We offer a 14-day mission pass for qualified business workspaces.' },
                { q: 'How secure is our logistics data?', a: 'All data is AES-256 encrypted and stored across redundant global nodes.' }
              ].map((faq) => (
                 <div key={faq.q} className="p-12 bg-white border border-slate-50 rounded-[3rem] shadow-sm space-y-6">
                    <h4 className="text-xl font-black uppercase italic tracking-tight flex items-center gap-4">
                       <Command size={16} className="text-slate-300" /> {faq.q}
                    </h4>
                    <p className="text-slate-500 font-medium leading-relaxed pl-8">{faq.a}</p>
                 </div>
              ))}
           </div>
        </section>
      </main>
    </div>
  )
}
