'use client'
import { usePathname } from 'next/navigation'
import { Bell, Search, ShoppingBag, Menu } from 'lucide-react'

export function TopNavigation() {
  const pathname = usePathname()
  
  // Format pathname for title
  const title = pathname === '/' ? 'Home' : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2);

  return (
    <header className="sticky top-0 z-[60] w-full bg-white/40 dark:bg-[var(--bg-1)]/40 backdrop-blur-xl border-b border-border h-16 transition-all duration-300 px-6 lg:px-10 flex items-center justify-between">
      <div className="flex items-center gap-6 flex-1">
        <button className="p-2 hover:bg-[var(--bg-3)] rounded-lg transition-colors text-[var(--text-secondary)] md:hidden">
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <Menu className="w-5 h-5 text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-primary)] transition-colors hidden md:block" />
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{title}</h1>
        </div>

        {/* Integrated Search */}
        <div className="flex-1 max-w-md ml-8 hidden lg:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-brand transition-colors" />
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full bg-white dark:bg-[var(--bg-2)] border border-gray-100 dark:border-border rounded-xl py-2 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand/30 transition-all placeholder:text-[var(--text-muted)]/60 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2">
           <button className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-3)] hover:text-[var(--text-primary)] transition-all relative group">
             <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
          </button>
          
          <button className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-3)] hover:text-[var(--text-primary)] transition-all relative group">
            <Bell className="w-5 h-5 stroke-[1.5]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white dark:border-bg-1" />
          </button>
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        <button className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-bg-3 dark:to-bg-4 border border-border overflow-hidden shadow-sm transition-transform group-hover:scale-105">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      </div>
    </header>
  )
}
