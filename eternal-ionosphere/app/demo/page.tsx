'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, 
  User as UserIcon, 
  ChevronRight, 
  Check, 
  X, 
  Lock, 
  Unlock, 
  Activity, 
  LayoutDashboard, 
  Box, 
  Truck, 
  Search, 
  Database, 
  DollarSign, 
  Layers,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react'

// --- MOCK DATA FOR DEMO ONLY ---
const MOCK_PROFILES = [
  { id: '1', full_name: 'System Master', role: 'master', permissions: ['/dashboard', '/market', '/warehouse', '/inventory', '/shipments', '/suppliers', '/settings'] },
  { id: '2', full_name: 'Operations Lead', role: 'manager', permissions: ['/dashboard', '/warehouse', '/inventory'] },
  { id: '3', full_name: 'Sourcing Assoc', role: 'operator', permissions: ['/dashboard', '/suppliers'] },
  { id: '4', full_name: 'Warehouse staff', role: 'operator', permissions: ['/warehouse'] },
]

const ALL_PERMISSIONS = [
  { id: '/dashboard', label: 'Executive Hub', icon: LayoutDashboard },
  { id: '/market', label: 'Macro Operations', icon: Activity },
  { id: '/warehouse', label: 'Warehouse 3D', icon: Box },
  { id: '/inventory', label: 'Daily Inventory Ledger', icon: Database },
  { id: '/shipments', label: 'Logistics Hub', icon: Truck },
  { id: '/suppliers', label: 'Global Search', icon: Search },
  { id: '/settings', label: 'System Kernel', icon: Layers },
]

export default function DemoAccessControl() {
  const [profiles, setProfiles] = useState(MOCK_PROFILES)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [saving, setSaving] = useState(null)

  const togglePermission = (profileId, permId) => {
    setSaving(profileId)
    setTimeout(() => {
      setProfiles(prev => prev.map(p => {
        if (p.id === profileId) {
          const newPerms = p.permissions.includes(permId)
            ? p.permissions.filter(id => id !== permId)
            : [...p.permissions, permId]
          return { ...p, permissions: newPerms }
        }
        return p
      }))
      setSaving(null)
    }, 400)
  }

  return (
    <div className="p-10 max-w-[1400px] mx-auto min-h-screen bg-[var(--bg-0)]">
        <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-2xl shadow-amber-500/10">
                    <ShieldCheck size={32} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter">Neural Guard Preview</h1>
                    <p className="text-sm text-[var(--text-secondary)] font-bold opacity-40 uppercase tracking-[0.4em]">Live System Prototype • Pre-Authentication View</p>
                </div>
            </div>
            <div className="px-6 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                Demo Protocol Active
            </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-4">
          <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] px-3 mb-6">
            Personnel Matrix
          </div>
          {profiles.map((p) => (
            <motion.button
              key={p.id}
              onClick={() => setSelectedProfile(p)}
              className={`w-full text-left p-5 rounded-[2rem] border transition-all flex items-center gap-5 ${
                selectedProfile?.id === p.id 
                  ? 'bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-600/30' 
                  : 'bg-[var(--bg-1)] border-[var(--border)] hover:border-indigo-500/30'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                selectedProfile?.id === p.id ? 'bg-white/20' : 'bg-indigo-500/10'
              }`}>
                <UserIcon size={24} className={selectedProfile?.id === p.id ? 'text-white' : 'text-indigo-500'} />
              </div>
              <div className="flex-1">
                <div className={`text-md font-black ${selectedProfile?.id === p.id ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                  {p.full_name}
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedProfile?.id === p.id ? 'text-white/60' : 'text-[var(--text-secondary)] opacity-50'}`}>
                  {p.role} • {p.permissions.length} Modules
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
                {selectedProfile ? (
                    <motion.div
                        key={selectedProfile.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
                    >
                        {saving === selectedProfile.id && (
                             <div className="absolute inset-0 bg-[var(--bg-1)]/60 backdrop-blur-sm z-10 flex items-center justify-center">
                                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                             </div>
                        )}

                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-4xl font-black text-[var(--text-primary)] tracking-tight mb-2 uppercase">{selectedProfile.full_name}</h2>
                                <p className="text-xs text-indigo-500 font-black uppercase tracking-widest">Adjusting Access Matrix</p>
                            </div>
                            <div className="px-6 py-2 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                                {selectedProfile.role}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ALL_PERMISSIONS.map((perm) => {
                                const active = selectedProfile.permissions.includes(perm.id)
                                return (
                                    <button
                                        key={perm.id}
                                        onClick={() => togglePermission(selectedProfile.id, perm.id)}
                                        className={`flex items-center gap-5 p-6 rounded-3xl border transition-all ${
                                            active ? 'border-amber-500/30 bg-amber-500/5' : 'border-[var(--border)] opacity-40 grayscale grayscale-[50%]'
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${active ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-500/10'}`}>
                                            <perm.icon size={22} />
                                        </div>
                                        <div className="text-left flex-1">
                                            <div className="text-sm font-black text-[var(--text-primary)]">{perm.label}</div>
                                            <div className="text-[10px] font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">{perm.id}</div>
                                        </div>
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-amber-500 text-white rotate-0' : 'bg-transparent border border-[var(--border)] rotate-90 opacity-0'}`}>
                                            <Check size={16} strokeWidth={4} />
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-[600px] border-4 border-dashed border-[var(--border)] rounded-[4rem] flex flex-col items-center justify-center text-center p-20 opacity-30">
                        <Lock size={64} className="mb-6" />
                        <h3 className="text-2xl font-black tracking-tight mb-4 uppercase">Select Node</h3>
                        <p className="max-w-xs text-sm font-medium">Select a system entity from the left portal to calibrate their authorization certificates.</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
