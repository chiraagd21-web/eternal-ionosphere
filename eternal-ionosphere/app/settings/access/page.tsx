'use client'

import React, { useEffect, useState } from 'react'
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
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  full_name: string
  role: string
  permissions: string[]
}

const ALL_PERMISSIONS = [
  { id: '/dashboard', label: 'Executive Hub', icon: LayoutDashboard },
  { id: '/market', label: 'Macro Operations', icon: Activity },
  { id: '/forecasting', label: 'Predictive Ops', icon: Activity },
  { id: '/warehouse', label: 'Warehouse 3D', icon: Box },
  { id: '/inventory', label: 'Daily Inventory Ledger', icon: Database },
  { id: '/shipments', label: 'Logistics Hub', icon: Truck },
  { id: '/outbound', label: 'Outbound Flow', icon: Truck },
  { id: '/suppliers', label: 'Global Search', icon: Search },
  { id: '/rfx', label: 'RFx Manager', icon: Layers },
  { id: '/finances', label: 'Finance Hub', icon: DollarSign },
  { id: '/settings', label: 'System Kernel', icon: Layers },
]

export default function AccessControlPage() {
  const { profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (!authLoading && profile?.role !== 'master') {
      router.push('/dashboard')
    }
  }, [profile, authLoading, router])

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('profiles').select('*')
      if (data && data.length > 0) {
        setProfiles(data)
      } else {
        // Fallback to high-fidelity mock data for demonstration
        console.warn('[Neural Guard] Database offline or empty. Loading neural mock matrix.')
        const mockData: Profile[] = [
          { id: 'dev-master', full_name: 'System Admin (Dev)', role: 'master', permissions: ALL_PERMISSIONS.map(p => p.id) },
          { id: 'demo-manager', full_name: 'Operations Lead', role: 'manager', permissions: ['/dashboard', '/warehouse', '/inventory'] },
          { id: 'demo-operator', full_name: 'Logistics Assoc', role: 'operator', permissions: ['/dashboard', '/shipments'] },
        ]
        setProfiles(mockData)
      }
    } catch (err) {
      console.error('Fetch Profile Failure:', err)
    }
    setLoading(false)
  }

  const togglePermission = async (targetProfile: Profile, permId: string) => {
    const isMaster = targetProfile.role === 'master'
    if (isMaster && permId === '/settings') return // Master can't lose settings access easily

    const newPermissions = targetProfile.permissions.includes(permId)
      ? targetProfile.permissions.filter(p => p !== permId)
      : [...targetProfile.permissions, permId]

    setSaving(targetProfile.id)
    const { error } = await supabase
      .from('profiles')
      .update({ permissions: newPermissions })
      .eq('id', targetProfile.id)

    if (!error) {
      setProfiles(prev => prev.map(p => p.id === targetProfile.id ? { ...p, permissions: newPermissions } : p))
      if (selectedProfile?.id === targetProfile.id) {
        setSelectedProfile({ ...selectedProfile, permissions: newPermissions })
      }
    }
    setSaving(null)
  }

  const changeRole = async (targetProfile: Profile, newRole: string) => {
    setSaving(targetProfile.id)
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', targetProfile.id)

    if (!error) {
      setProfiles(prev => prev.map(p => p.id === targetProfile.id ? { ...p, role: newRole } : p))
    }
    setSaving(null)
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto min-h-screen pb-20">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Access Control Center</h1>
            <p className="text-xs text-[var(--text-secondary)] opacity-50 uppercase tracking-widest font-bold">Manage Personnel & Permission Matrices</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] px-2 mb-4">
            Authorized Personnel ({profiles.length})
          </div>
          {profiles.map((p) => (
            <motion.button
              key={p.id}
              onClick={() => setSelectedProfile(p)}
              whileHover={{ x: 4 }}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                selectedProfile?.id === p.id 
                  ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-600/20' 
                  : 'bg-[var(--bg-1)] border-[var(--border)] hover:border-indigo-500/30'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                selectedProfile?.id === p.id ? 'bg-white/20' : 'bg-indigo-500/10'
              }`}>
                <UserIcon size={20} className={selectedProfile?.id === p.id ? 'text-white' : 'text-indigo-500'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-black truncate ${selectedProfile?.id === p.id ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                  {p.full_name}
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-widest ${selectedProfile?.id === p.id ? 'text-white/60' : 'text-[var(--text-secondary)] opacity-50'}`}>
                  {p.role} • {p.permissions.length} Modules
                </div>
              </div>
              <ChevronRight size={18} className={selectedProfile?.id === p.id ? 'text-white/40' : 'text-[var(--text-secondary)] opacity-20'} />
            </motion.button>
          ))}
        </div>

        {/* Permission Grid */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedProfile ? (
              <motion.div
                key={selectedProfile.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative"
              >
                {saving === selectedProfile.id && (
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-[var(--border)]">
                  <div>
                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">Configuring Access For</div>
                    <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">{selectedProfile.full_name}</h2>
                  </div>
                  <div className="flex items-center gap-2 bg-[var(--bg-0)] p-1.5 rounded-2xl border border-[var(--border)]">
                    {['operator', 'manager', 'master'].map((role) => (
                      <button
                        key={role}
                        onClick={() => changeRole(selectedProfile, role)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          selectedProfile.role === role 
                            ? 'bg-indigo-600 text-white shadow-lg' 
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ALL_PERMISSIONS.map((perm) => {
                    const isAllowed = selectedProfile.permissions.includes(perm.id)
                    return (
                      <button
                        key={perm.id}
                        onClick={() => togglePermission(selectedProfile, perm.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all group ${
                          isAllowed 
                            ? 'bg-emerald-500/5 border-emerald-500/20' 
                            : 'bg-transparent border-[var(--border)] opacity-60 grayscale'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isAllowed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                        }`}>
                          <perm.icon size={18} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className={`text-xs font-black ${isAllowed ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                            {perm.label}
                          </div>
                          <div className="text-[9px] font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">
                            {perm.id}
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                          isAllowed 
                            ? 'bg-emerald-500 border-emerald-400 text-white' 
                            : 'bg-transparent border-[var(--border)] text-transparent'
                        }`}>
                          <Check size={14} strokeWidth={4} />
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-10 p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex items-start gap-4">
                  <AlertCircle className="text-amber-500 shrink-0" size={20} />
                  <div className="text-[11px] leading-relaxed text-amber-500/70 font-medium italic">
                    Note: Permission changes are synchronized across all neural instances in real-time. Unauthorized attempts to bypass access will be logged by the system kernel.
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] border-2 border-dashed border-[var(--border)] rounded-[2.5rem] flex flex-col items-center justify-center text-center p-10">
                <div className="w-16 h-16 rounded-3xl bg-[var(--bg-1)] border border-[var(--border)] flex items-center justify-center mb-6 text-[var(--text-secondary)] opacity-20">
                  <Lock size={32} />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] opacity-30 mb-2">Select Personnel</h3>
                <p className="text-sm text-[var(--text-secondary)] opacity-20 max-w-xs">Select a user from the left panel to configure their specific access matrix and network role.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
