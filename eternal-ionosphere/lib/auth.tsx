'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  role: 'master' | 'manager' | 'operator'
  permissions: string[] // List of allowed hrefs
  full_name: string
}

interface AuthContextType {
  user: any | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

import { usePathname, useRouter } from 'next/navigation'
import { ShieldAlert, Loader2, Home } from 'lucide-react'
import Link from 'next/link'

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        // Check if this is the first user to make them 'master'
        const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
        const role = count === 0 ? 'master' : 'operator'
        
        // Default permissions for new users
        const defaultPermissions = role === 'master' 
          ? ['/dashboard', '/market', '/forecasting', '/warehouse', '/inventory', '/shipments', '/outbound', '/suppliers', '/rfx', '/integrations', '/finances', '/contracts', '/settings']
          : ['/dashboard']

        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({ 
            id: userId, 
            role, 
            permissions: defaultPermissions,
            full_name: (user?.user_metadata?.full_name) || 'New User'
          })
          .select()
          .single()

        if (!createError) setProfile(newProfile)
      } else if (data) {
        setProfile(data)
      }
    } catch (e) {
      console.error('Error fetching profile:', e)
    }
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const currentUser = session?.user ?? null
        
        // --- DEV BYPASS ---
        if (!currentUser && process.env.NODE_ENV === 'development') {
          console.warn('[Neural Guard] Dev Bypass Active: Granting Master Access')
          setUser({ id: 'dev-master', email: 'master@ionosphere.local', user_metadata: { full_name: 'System Admin (Dev)' } })
          setProfile({
             id: 'dev-master',
             role: 'master',
             full_name: 'System Admin (Dev)',
             permissions: ['/dashboard', '/market', '/forecasting', '/warehouse', '/inventory', '/shipments', '/outbound', '/suppliers', '/rfx', '/integrations', '/finances', '/contracts', '/settings']
          })
          setLoading(false)
          return
        }

        setUser(currentUser)
        if (currentUser) {
          await fetchProfile(currentUser.id)
        }
      } catch (e) {
        setUser(null)
      }
      setLoading(false)
    }
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        await fetchProfile(currentUser.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function NeuralGate({ children }: { children: ReactNode }) {
  const { profile, loading, user } = useAuth()
  const pathname = usePathname()
  
  if (process.env.NODE_ENV === 'development') return <>{children}</>

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-0)]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    )
  }

  // Public routes
  if (['/login', '/register', '/'].includes(pathname)) return <>{children}</>
  
  // Not logged in
  if (!user) return <>{children}</>

  // Master has full access
  if (profile?.role === 'master') return <>{children}</>

  // Check if path is protected but permitted
  const isPermitted = profile?.permissions.some(p => pathname === p || pathname.startsWith(p + '/'))
  
  if (!isPermitted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-0)] p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-rose-500/10">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight mb-4">Access Restricted</h1>
          <p className="text-sm text-[var(--text-secondary)] opacity-60 mb-10 leading-relaxed font-medium">
            Your current neural profile does not have authorization to access <span className="text-rose-400 font-bold">"{pathname}"</span>. Contact the System Master to escalate your permissions.
          </p>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl text-sm font-black text-[var(--text-primary)] hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all"
          >
            <Home size={18} /> Return to Home Base
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
