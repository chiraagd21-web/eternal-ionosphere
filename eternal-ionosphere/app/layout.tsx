import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { AppShell } from '@/components/AppShell'

export const metadata: Metadata = {
  title: 'Zo.Flow | Operational Authority OS',
  description: 'The single operating system to unify sourcing arbitration, global freight telemetry, and spatial 3D inventory modeling.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  openGraph: {
    title: 'Zo.Flow',
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
