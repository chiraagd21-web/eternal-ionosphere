'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Cable, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  Plus, 
  Settings2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Truck,
  DollarSign,
  MessageSquare,
  Lock,
  ChevronRight,
  Database
} from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

type IntegrationStatus = 'connected' | 'disconnected' | 'connecting' | 'error'

interface Integration {
  id: string
  name: string
  category: 'Logistics' | 'Finance' | 'Workflow' | 'Communication'
  description: string
  icon: any
  status: IntegrationStatus
  lastSync?: string
  color: string
}

const INITIAL_INTEGRATIONS: Integration[] = [
  { id: 'shippo', name: 'Shippo', category: 'Logistics', description: 'Multi-carrier shipping rates and label printing.', icon: Truck, status: 'disconnected', color: 'from-blue-500 to-indigo-600' },
  { id: 'shipstation', name: 'ShipStation', category: 'Logistics', description: 'Direct fulfillment and warehouse automation.', icon: Database, status: 'disconnected', color: 'from-orange-500 to-red-600' },
  { id: 'ups', name: 'UPS Developer', category: 'Logistics', description: 'Direct carrier integration for negotiated rates.', icon: Zap, status: 'disconnected', color: 'from-amber-600 to-yellow-800' },
  { id: 'qbo', name: 'QuickBooks Online', category: 'Finance', description: 'Automated invoice and expense reconciliation.', icon: DollarSign, status: 'disconnected', color: 'from-emerald-500 to-teal-600' },
  { id: 'qbd', name: 'QuickBooks Desktop', category: 'Finance', description: 'Web Connector for legacy financial sync.', icon: Lock, status: 'disconnected', color: 'from-slate-600 to-slate-800' },
  { id: 'zapier', name: 'Zapier', category: 'Workflow', description: 'Connect with over 5,000+ app automations.', icon: Plus, status: 'disconnected', color: 'from-orange-400 to-orange-600' },
  { id: 'slack', name: 'Slack Enterprise', category: 'Communication', description: 'Real-time approval alerts and team orchestration.', icon: MessageSquare, status: 'disconnected', color: 'from-purple-500 to-pink-600' }
]

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [showConnectModal, setShowConnectModal] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem('sourcing_integrations')
    if (saved) setIntegrations(JSON.parse(saved))
  }, [])

  const saveIntegrations = (newInts: Integration[]) => {
    setIntegrations(newInts)
    localStorage.setItem('sourcing_integrations', JSON.stringify(newInts))
  }

  const connectIntegration = async (id: string, name: string) => {
    setIsConnecting(true)
    showToast(`Initializing secure handshake with ${name}...`, 'info')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const updated = integrations.map(int => {
      if (int.id === id) {
        return { ...int, status: 'connected' as IntegrationStatus, lastSync: new Date().toLocaleTimeString() }
      }
      return int
    })
    
    saveIntegrations(updated)
    setIsConnecting(false)
    setShowConnectModal(null)
    setApiKey('')
    showToast(`Successfully linked ${name} to Sourcing Core`, 'success')
  }

  const disconnectIntegration = (id: string, name: string) => {
    const updated = integrations.map(int => {
      if (int.id === id) return { ...int, status: 'disconnected' as IntegrationStatus }
      return int
    })
    saveIntegrations(updated)
    showToast(`${name} disconnected from ecosystem`, 'error')
  }

  const filteredIntegrations = integrations.filter(int => {
    const matchesSearch = int.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || int.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['All', 'Logistics', 'Finance', 'Workflow', 'Communication']
  const activeInt = integrations.find(i => i.id === showConnectModal)

  return (
    <div className="p-10 animate-fade-in max-w-[1900px] mx-auto min-h-screen pb-32 bg-[var(--bg-0)] text-[var(--text-primary)] space-y-12">
      
      {/* Header Hub */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12">
        <div>
           <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-[var(--brand)] shadow-[0_0_10px_rgba(var(--brand-rgb),0.5)]" />
              <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-1)] px-2 py-0.5 rounded border border-[var(--border)]">Connected Services</span>
           </div>
           <h1 className="text-5xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
             App <span className="text-[var(--brand)]">Integrations</span>
           </h1>
           <p className="text-[var(--text-muted)] text-sm mt-3 font-medium">Connect your logistics and financial stack for unified supply chain orchestration.</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">Secure</div>
           </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         {[
           { label: 'Live Connections', value: integrations.filter(i => i.status === 'connected').length, icon: Cable, color: 'text-indigo-400' },
           { label: 'Data Syncs (24h)', value: integrations.filter(i => i.status === 'connected').length * 12, icon: RefreshCw, color: 'text-emerald-400' },
           { label: 'Protocol Coverage', value: '100%', icon: ShieldCheck, color: 'text-purple-400' },
         ].map((stat, i) => (
           <motion.div 
             key={stat.label}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white/[0.02] backdrop-blur-3xl p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group"
           >
              <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:scale-110 transition-transform duration-700 ${stat.color}`} />
              <div className="relative z-10">
                 <div className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                 <div className="text-4xl font-black text-[var(--text-primary)] tracking-tighter">{stat.value}</div>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Control Console */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="relative flex-1 group w-full">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--brand)] transition-colors" />
           <input 
              type="text" 
              placeholder="Search ecosystem registry..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-2)] border border-[var(--border)] rounded-[2rem] py-5 px-16 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--brand)] transition-all font-black uppercase tracking-wider placeholder:text-[var(--text-muted)]"
           />
        </div>
        
        <div className="flex items-center bg-[var(--bg-2)] border border-[var(--border)] rounded-[2rem] p-1.5 self-stretch whitespace-nowrap">
           {categories.map(cat => (
             <button
               key={cat}
               onClick={() => {
                   setActiveCategory(cat)
                   showToast(`Filtering for ${cat} plugins`, 'info')
               }}
               className={`px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                 activeCategory === cat 
                 ? 'bg-indigo-600 text-[var(--text-primary)] shadow-xl shadow-indigo-500/20' 
                 : 'text-[var(--text-secondary)] opacity-40 hover:text-[var(--text-primary)]'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredIntegrations.map((int, i) => (
            <motion.div
              layout
              key={int.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[var(--bg-1)] backdrop-blur-3xl border border-[var(--border)] rounded-[48px] p-10 flex flex-col group hover:border-indigo-500/30 transition-all relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-8">
                 <div className={`w-16 h-16 rounded-[2rem] bg-gradient-to-br ${int.color} p-0.5 shadow-2xl group-hover:scale-110 transition-all`}>
                    <div className="w-full h-full bg-[var(--bg-0)] rounded-[inherit] flex items-center justify-center backdrop-blur-xl text-[var(--text-primary)]">
                       <int.icon size={32} />
                    </div>
                 </div>
                 <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-inner ${
                   int.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-[var(--bg-2)] text-[var(--text-secondary)] opacity-40 border-[var(--border)]'
                 }`}>
                    {int.status}
                 </div>
              </div>

              <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-3 group-hover:text-indigo-400 transition-colors">{int.name}</h3>
              <p className="text-[var(--text-secondary)] opacity-40 text-[11px] font-black uppercase tracking-widest leading-relaxed mb-10 min-h-[44px]">{int.description}</p>
              
              {int.status === 'connected' && (
                <div className="p-6 rounded-3xl bg-[var(--bg-2)] border border-[var(--border)] space-y-4 mb-10 animate-fade-in shadow-inner">
                   <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                      <span className="text-[var(--text-secondary)] opacity-40">Last Sync Cycle</span>
                      <span className="text-indigo-400">{int.lastSync}</span>
                   </div>
                   <div className="h-1 w-full bg-[var(--bg-1)] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} className="h-full bg-indigo-500 shadow-[0_0_8px_indigo]" />
                   </div>
                </div>
              )}

              <div className="mt-auto">
                 {int.status === 'connected' ? (
                   <div className="flex gap-4">
                      <button 
                         onClick={() => disconnectIntegration(int.id, int.name)}
                         className="flex-1 py-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-2)] text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest hover:text-rose-500 hover:bg-rose-500/10 transition-all active:scale-95"
                      >
                         Deactivate
                      </button>
                      <button className="w-14 h-14 rounded-2xl bg-[var(--bg-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                         <Settings2 size={20} />
                      </button>
                   </div>
                 ) : (
                   <button 
                     onClick={() => setShowConnectModal(int.id)}
                     className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 group/btn flex items-center justify-center gap-3 active:scale-95 transition-all"
                   >
                     Initialize Node
                     <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                 )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal Hub */}
      <AnimatePresence>
        {showConnectModal && activeInt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowConnectModal(null)}
               className="absolute inset-0 bg-[var(--bg-0)]/80 backdrop-blur-3xl" 
            />
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
               className="relative w-full max-w-xl bg-[var(--bg-2)] border border-[var(--border)] rounded-[2rem] shadow-3xl overflow-hidden"
            >
               <div className={`h-2 bg-gradient-to-r ${activeInt.color}`} />
               <div className="p-12">
                  <div className="flex items-center gap-8 mb-12">
                     <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${activeInt.color} flex items-center justify-center shadow-2xl shrink-0`}>
                        <activeInt.icon size={40} className="text-[var(--text-primary)]" />
                     </div>
                     <div>
                        <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none mb-2">Init {activeInt.name}</h2>
                        <p className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">Secure Handshake Required</p>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div>
                        <label className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest mb-3 block">Neural API Key</label>
                        <div className="relative group">
                           <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] opacity-20 group-focus-within:text-indigo-400 transition-colors" />
                           <input 
                              type="password" 
                              placeholder="••••••••••••••••••••"
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                              className="w-full bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl py-6 pl-16 pr-6 text-[var(--text-primary)] text-sm focus:outline-none focus:border-indigo-500 transition-all font-mono"
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <button className="p-5 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 text-[10px] font-black uppercase tracking-widest">Mainnet</button>
                        <button className="p-5 rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] text-[var(--text-secondary)] opacity-40 text-[10px] font-black uppercase tracking-widest">Devnet</button>
                     </div>

                     <div className="flex flex-col gap-4 pt-4">
                        <button 
                           onClick={() => connectIntegration(activeInt.id, activeInt.name)}
                           disabled={!apiKey || isConnecting}
                           className={`w-full py-6 rounded-2xl font-black text-[var(--text-primary)] uppercase tracking-widest text-[10px] transition-all active:scale-95 flex items-center justify-center gap-4 ${
                             !apiKey || isConnecting ? 'bg-[var(--bg-1)] text-[var(--text-secondary)] opacity-20 border border-[var(--border)]' : 'bg-indigo-600 shadow-xl shadow-indigo-600/30 hover:bg-indigo-500'
                           }`}
                        >
                           {isConnecting ? <><RefreshCw className="animate-spin" /> Verifying Credentials...</> : <>Establish Ecosystem Link <ChevronRight /></>}
                        </button>
                        <button 
                           onClick={() => setShowConnectModal(null)}
                           className="w-full py-6 rounded-2xl text-[var(--text-secondary)] opacity-40 font-black uppercase tracking-widest text-[9px] hover:text-[var(--text-primary)] transition-all"
                        >
                           Abort Synchronization
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
