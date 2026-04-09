'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { ToastProvider } from '@/components/ui/Toast'
import { AuthProvider, NeuralGate } from '@/lib/auth'

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
          <ToastProvider>
            {children}
          </ToastProvider>
        </NeuralGate>
      </AuthProvider>
    </QueryClientProvider>
  )
}

