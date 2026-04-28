'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { AuthGuard } from '@/components/AuthGuard'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const marketingRoutes = [
    '/', '/login', '/features', '/solutions', '/pricing', 
    '/company', '/about', '/careers', '/partners', 
    '/contact', '/privacy', '/terms', '/cookie-policy', 
    '/licensing', '/documentation', '/security', '/compliance'
  ]
  
  const isMarketingPage = marketingRoutes.includes(pathname)

  if (isMarketingPage) {
    return <main className="w-full min-h-screen bg-[var(--bg-0)]">{children}</main>
  }

  return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-h-screen overflow-x-hidden pt-16 lg:pt-0">
          {children}
        </main>
      </div>
  )
}
