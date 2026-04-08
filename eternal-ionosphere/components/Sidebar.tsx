'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { useAuth } from '@/lib/auth'
import {
  LayoutDashboard,
  Box,
  Truck,
  FileCode,
  Globe,
  Settings,
  Activity,
  Hexagon,
  Moon,
  Sun,
  Coffee,
  TrendingUp,
  Search,
  Puzzle,
  DollarSign,
  ShieldCheck,
  ArrowUpRight,
  Database,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react'

const navGroups = [
  {
    label: 'Intelligence',
    items: [
      { href: '/dashboard', label: 'Executive Hub', icon: LayoutDashboard },
      { href: '/market', label: 'Macro Operations', icon: Activity },
      { href: '/forecasting', label: 'Predictive Ops', icon: TrendingUp },
    ]
  },
  {
    label: 'Logistics',
    items: [
      { href: '/warehouse', label: 'Warehouse 3D', icon: Box },
      { href: '/inventory', label: 'Daily Inventory Ledger', icon: Database },
      { href: '/shipments', label: 'Logistics Hub', icon: Truck },
      { href: '/outbound', label: 'Outbound Flow', icon: ArrowUpRight },
    ]
  },
  {
    label: 'Sourcing',
    items: [
      { href: '/suppliers', label: 'Global Search', icon: Search },
      { href: '/rfx', label: 'RFx Manager', icon: FileCode },
      { href: '/integrations', label: 'Integrations Hub', icon: Puzzle },
    ]
  },
  {
    label: 'Commerce',
    items: [
      { href: '/finances', label: 'Finance Hub', icon: DollarSign },
      { href: '/contracts', label: 'Contract Vault', icon: ShieldCheck },
      { href: '/settings', label: 'System Kernel', icon: Settings },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [theme, setTheme] = useState('synk')
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeWarehouse = useAppStore(state => state.activeWarehouse)
  const setActiveWarehouse = useAppStore(state => state.setActiveWarehouse)
  const zones = useAppStore(state => state.zones)
  const { user, signOut } = useAuth()

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'synk'
    setTheme(savedTheme)
    document.documentElement.className = `theme-${savedTheme}`
  }, [])

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme)
    document.documentElement.className = `theme-${newTheme}`
    localStorage.setItem('theme', newTheme)
  }

  useEffect(() => {
    const allRoutes = navGroups.flatMap(g => g.items.map(i => i.href))
    allRoutes.forEach(href => router.prefetch(href))
  }, [router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 lg:p-8 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Hexagon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-lg text-[var(--text-primary)] leading-tight tracking-tight">zo</div>
            <div className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase tracking-[0.2em]">Enterprise OS</div>
          </div>
        </Link>
        {/* Mobile close */}
        <button onClick={() => setMobileOpen(false)} className="lg:hidden p-2 rounded-xl hover:bg-[var(--bg-2)] transition-all">
          <X size={20} className="text-[var(--text-secondary)]" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 overflow-y-auto space-y-6 py-2">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.3em] px-4 mb-3 opacity-50">
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link 
                    key={href} 
                    href={href} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-75 group ${
                      isActive 
                        ? 'bg-[var(--brand)]/10 text-[var(--brand)]' 
                        : 'text-[var(--text-secondary)] hover:bg-[var(--text-secondary)]/5 hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[var(--brand)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`} />
                    <span className="truncate">{label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--brand)] shadow-[0_0_8px_var(--brand)] shrink-0"
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Info + Sign Out */}
      {user && (
        <div className="px-6 pb-4">
          <div className="bg-[var(--bg-2)] border border-[var(--border)] p-3 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shrink-0">
              <User size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[var(--text-primary)] truncate">{user.email}</div>
            </div>
            <button onClick={handleSignOut} className="p-2 hover:bg-[var(--bg-1)] rounded-lg transition-all shrink-0" title="Sign Out">
              <LogOut size={14} className="text-[var(--text-secondary)]" />
            </button>
          </div>
        </div>
      )}

      {/* Warehouse Selector */}
      <div className="px-6 pb-4">
        <div className="bg-[var(--bg-2)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
          <div className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <Activity className="w-3 h-3 text-[var(--brand)]" /> Active Facility
          </div>
          <select 
            value={activeWarehouse}
            onChange={(e) => setActiveWarehouse(e.target.value)}
            className="w-full bg-[var(--bg-1)] border border-[var(--border)] text-[11px] font-bold text-[var(--text-primary)] px-3 py-2 rounded-lg focus:ring-2 focus:ring-[var(--brand)] cursor-pointer appearance-none uppercase tracking-widest"
          >
            {zones.map(z => (
              <option key={z.id} value={z.id} className="bg-slate-900">{z.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Theme Toggles */}
      <div className="p-6 border-t border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.3em] px-2 opacity-50">
            Appearance
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-bold uppercase">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            Optimal
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'bloom', label: 'HI-VIZ', icon: Sun },
            { id: 'cream', label: 'CREAM', icon: Coffee },
            { id: 'synk', label: 'SYNK', icon: Moon },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => changeTheme(t.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                theme === t.id
                  ? 'bg-[var(--brand)]/10 border-[var(--brand)]/50 text-[var(--brand)] shadow-lg shadow-[var(--brand)]/5'
                  : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]/20'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span className="text-[9px] font-bold tracking-widest">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-xl bg-[var(--bg-1)] border border-[var(--border)] flex items-center justify-center shadow-xl hover:bg-[var(--bg-2)] transition-all"
      >
        <Menu size={20} className="text-[var(--text-primary)]" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="sidebar hidden lg:flex w-[280px] h-screen flex-col border-r border-[var(--border)] bg-[var(--bg-1)] transition-colors duration-300 sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay + Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 z-[70] w-[300px] flex flex-col bg-[var(--bg-1)] border-r border-[var(--border)] shadow-2xl overflow-y-auto"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
