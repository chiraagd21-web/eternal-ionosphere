import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Sidebar } from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'zo.flow | Intelligent Supply Chain Intelligence',
  description: 'AI-powered procurement platform that finds global suppliers, scores them automatically, and generates RFQs in seconds.',
  keywords: 'procurement, sourcing, supply chain, AI, RFQ, suppliers',
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
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 min-h-screen overflow-x-hidden">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
