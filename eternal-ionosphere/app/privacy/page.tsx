'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Shield, 
  Lock, 
  FileText, 
  Scale, 
  Eye, 
  ArrowLeft,
  Fingerprint,
  Activity,
  Zap,
  CheckCircle2
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
       <Link href="/features" className="hover:text-slate-950 transition-all">Features</Link>
       <Link href="/solutions" className="hover:text-slate-950 transition-all">Solutions</Link>
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

const CONTENT_MAP: Record<string, any> = {
  privacy: {
    title: 'Privacy Protocol',
    subtitle: 'DATA_INTEGRITY_INDEX',
    desc: 'Our neural infrastructure is designed with encryption-first principles. We do not sell your operational data. We orchestrate it.',
    icon: Eye,
    sections: [
      { title: 'Zero Protocol Collection', text: 'We only capture the data required for millisecond-exact logistics synchronization. Every node is encrypted at rest and in transit.' },
      { title: 'Operational Anonymity', text: 'Your proprietary sourcing bids are shielded via local-first neural scoring, ensuring your strategy remains private even in global RFx events.' }
    ]
  },
  terms: {
    title: 'Terms of Access',
    subtitle: 'LEGAL_ORCHESTRATION_LAYER',
    desc: 'Authorized use of the zo.flow ecosystem is governed by our strict enterprise resource planning standards.',
    icon: FileText,
    sections: [
      { title: 'Workspace Authorization', text: 'Access is limited to verified professional business entities. One workspace per corporation is standard.' },
      { title: 'Sync Integrity', text: 'Users are responsible for the validity of data inputs into the procurement and 3D orchestration modules.' }
    ]
  },
  security: {
    title: 'Security Architecture',
    subtitle: 'NEURAL_GATE_V4',
    desc: 'Built on proprietary Neural Flux v1.0, our framework is designed for state-tier operational stability.',
    icon: Shield,
    sections: [
      { title: 'SOC2 Type II Certified', text: 'Our infrastructure undergoes rigorous annual audits to ensure institutional-grade data protection.' },
      { title: 'Multi-Sig Authorization', text: 'Mission-critical actions (e.g., Awarding $1M+ bids) require multi-factor neural handshake verification.' }
    ]
  },
  compliance: {
    title: 'Compliance Hub',
    subtitle: 'REGULATORY_TELEMETRY',
    desc: 'Automated adherence to global trade and data protection regulations (GDPR, CCPA, Trade-Compliance).',
    icon: Scale,
    sections: [
      { title: 'Trade Lane Validation', text: 'Every shipping path is automatically screened against global trade restriction lists in real-time.' },
      { title: 'Automated Audit Trails', text: 'The zo.flow ledger maintains an immutable, cryptographically-signed record of every procurement decision.' }
    ]
  }
}

export default function InfoHubPage() {
  const pathname = usePathname()
  const route = pathname.split('/').pop() || 'privacy'
  const content = CONTENT_MAP[route] || CONTENT_MAP.privacy

  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] pt-48 pb-64 font-sans selection:bg-emerald-100">
       <Nav />
       
       <header className="max-w-7xl mx-auto px-12 mb-40 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-6 text-emerald-500 mb-12">
             <div className="p-4 bg-slate-950 text-white rounded-2xl shadow-2xl">
                <content.icon size={24} />
             </div>
             <span className="text-[11px] font-black uppercase tracking-[1em]">{content.subtitle}</span>
          </div>
          <h1 className="text-8xl lg:text-[12rem] font-black tracking-tighter leading-[0.8] uppercase italic mb-16 text-slate-950">
             {content.title}.
          </h1>
          <p className="text-2xl text-slate-400 font-medium max-w-4xl leading-relaxed italic">
             {content.desc}
          </p>
       </header>

       <section className="max-w-7xl mx-auto px-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {content.sections.map((s: any, i: number) => (
             <motion.div 
                key={s.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.1 }}
                className="p-16 bg-white border border-slate-100 rounded-[4rem] shadow-2xl space-y-8"
             >
                <div className="flex items-center gap-4 text-emerald-500">
                   <CheckCircle2 size={18} />
                   <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-950">{s.title}</h3>
                </div>
                <p className="text-lg text-slate-400 font-medium leading-relaxed italic">"{s.text}"</p>
             </motion.div>
          ))}
          
          <div className="lg:col-span-2 p-16 bg-slate-950 rounded-[4rem] text-white flex flex-col lg:flex-row items-center justify-between gap-12 group">
             <div className="space-y-4 text-center lg:text-left">
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.6em]">System Verification</div>
                <div className="text-4xl font-black uppercase italic tracking-tighter text-white">Production release 1.4.2 stable</div>
             </div>
             <div className="flex gap-12">
                <div className="text-center">
                   <div className="text-3xl font-black text-white italic">256-bit</div>
                   <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">AES Encryption</div>
                </div>
                <div className="text-center">
                   <div className="text-3xl font-black text-white italic">SOC2</div>
                   <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Compliance Level</div>
                </div>
             </div>
          </div>
       </section>
    </div>
  )
}
