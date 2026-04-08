import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { AppShell } from '@/components/AppShell'

export const metadata: Metadata = {
  title: 'zo.flow | Intelligent Supply Chain Intelligence',
  description: 'AI-powered procurement platform that finds global suppliers, scores them automatically, and generates RFQs in seconds.',
  keywords: 'procurement, sourcing, supply chain, AI, RFQ, suppliers',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  openGraph: {
    title: 'zo.flow',
    description: 'Intelligent supply chain sourcing powered by AI',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--bg-0)] text-[var(--text-primary)] antialiased transition-colors duration-300">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
