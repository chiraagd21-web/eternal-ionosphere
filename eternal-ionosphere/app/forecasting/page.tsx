'use client'

import dynamic from 'next/dynamic'

const ForecastingContent = dynamic(() => import('./ForecastingContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[var(--bg-0)] flex flex-col items-center justify-center gap-6">
      <div className="flex gap-2">
        {[0,1,2,3].map(i => (
          <div
            key={i}
            className="w-2 h-8 bg-cyan-500 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.12}s`, animationDuration: '0.8s' }}
          />
        ))}
      </div>
      <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Loading Predictive Ops</p>
    </div>
  )
})

export default function ForecastingPage() {
  return <ForecastingContent />
}
