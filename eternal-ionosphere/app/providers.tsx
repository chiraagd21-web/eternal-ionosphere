'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { ToastProvider } from '@/components/ui/Toast'
import { AuthProvider, NeuralGate, useAuth } from '@/lib/auth'
import { useAppStore } from '@/lib/store'
import { useEffect } from 'react'

function SyncObserver() {
  const { user } = useAuth()
  const syncFromCloud = useAppStore(s => s.syncFromCloud)

  useEffect(() => {
    if (user) {
      console.log('SYNC_OBSERVER: User detected, pulling cloud state...')
      syncFromCloud()
    }
  }, [user, syncFromCloud])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000, retry: 1 },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NeuralGate>
          <SyncObserver />
          <ToastProvider>
            {children}
          </ToastProvider>
        </NeuralGate>
      </AuthProvider>
    </QueryClientProvider>
  )
}

