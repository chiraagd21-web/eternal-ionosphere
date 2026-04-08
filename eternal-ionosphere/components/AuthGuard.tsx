'use client'

import { useAuth } from '@/lib/auth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2, Hexagon } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login')
    }
  }, [user, loading, pathname, router])

  if (pathname === '/login') {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-0)]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/20 animate-pulse">
            <Hexagon className="w-10 h-10 text-white" />
          </div>
          <Loader2 className="animate-spin text-emerald-500" size={24} />
          <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest opacity-30">Loading zo.flow</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
