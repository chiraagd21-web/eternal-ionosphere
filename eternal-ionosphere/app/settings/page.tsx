'use client'

import { useAuth } from '@/lib/auth'
import { ShieldCheck, ArrowRight, Settings as SettingsIcon, Bell, Database, Globe } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SettingsHub() {
  const { profile } = useAuth()

  const settingsGroups = [
    {
      label: 'Security & Access',
      items: [
        { 
          id: 'access', 
          title: 'Neural Guard (RBAC)', 
          desc: 'Manage user roles and module permissions', 
          icon: ShieldCheck, 
          href: '/settings/access',
          adminOnly: true 
        },
      ]
    },
    {
      label: 'System Config',
      items: [
        { id: 'general', title: 'General Preferences', desc: 'Regional settings and defaults', icon: Globe, href: '#', comingSoon: true },
        { id: 'notif', title: 'Notifications', desc: 'Alert thresholds and routing', icon: Bell, href: '#', comingSoon: true },
        { id: 'data', title: 'Data Management', desc: 'Backup and purge policies', icon: Database, href: '#', comingSoon: true },
      ]
    }
  ]

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">System Kernel</h1>
          <p className="text-xs text-[var(--text-secondary)] opacity-50 uppercase tracking-widest font-bold">Configure Enterprise Parameters</p>
        </div>
      </div>

      <div className="space-y-10">
        {settingsGroups.map((group) => (
          <div key={group.label}>
            <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] px-4 mb-4 opacity-50">
              {group.label}
            </div>
            <div className="grid grid-cols-1 gap-3">
              {group.items.map((item) => {
                const isMaster = profile?.role === 'master'
                const isDisabled = (item.adminOnly && !isMaster) || item.comingSoon
                
                if (item.adminOnly && !isMaster) return null

                return (
                  <Link 
                    key={item.id}
                    href={item.href}
                    className={`block p-6 rounded-3xl border transition-all ${
                      isDisabled 
                        ? 'bg-[var(--bg-1)] border-[var(--border)] opacity-50 cursor-not-allowed' 
                        : 'bg-[var(--bg-1)] border-[var(--border)] hover:border-indigo-500/30 hover:shadow-xl group'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-2xl ${isDisabled ? 'bg-slate-500/10 text-slate-500' : 'bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform'}`}>
                        <item.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-sm font-black text-[var(--text-primary)]">{item.title}</h3>
                          {item.comingSoon && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 text-[8px] font-black uppercase tracking-tighter">Coming Soon</span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] opacity-60 font-medium">{item.desc}</p>
                      </div>
                      {!isDisabled && <ArrowRight size={18} className="text-[var(--text-secondary)] opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
