'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Loader2 } from 'lucide-react'

export function JarvisOrb() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const toggleListen = () => {
    if (!isListening) {
      setIsListening(true)
      setTranscript('')
      // Simulate listening for 3 seconds
      setTimeout(() => {
         setTranscript('zo, we are running low on cooling fans. Find 3 new suppliers in Taiwan, draft an RFQ for 5,000 units, and target 10% under our current price.')
         setIsProcessing(true)
         setIsListening(false)

         setTimeout(() => {
            setIsProcessing(false)
            setTranscript('Workflow executed: 3 suppliers found. RFQs drafted at 10% under current market price. Awaiting your approval in the RFx Manager.')
            
            setTimeout(() => setTranscript(''), 6000)
         }, 3000)

      }, 3000)
    } else {
      setIsListening(false)
    }
  }

  return (
    <div className="fixed bottom-10 right-10 z-50 flex items-end gap-6 pointer-events-none">
      
      {/* Transcript Bubble */}
      <AnimatePresence>
        {transcript && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.9, y: 20 }}
             className={`p-6 rounded-3xl max-w-sm pointer-events-auto shadow-2xl backdrop-blur-xl border ${isProcessing ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-[var(--bg-1)]/90 text-[var(--text-primary)] border-[var(--border)]'}`}
           >
              {isProcessing && <Loader2 className="animate-spin mb-3 text-indigo-400" size={20} />}
              <p className="text-sm font-medium leading-relaxed">&quot;{transcript}&quot;</p>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Orb */}
      <motion.button 
        onClick={toggleListen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`pointer-events-auto relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isListening ? 'bg-rose-500 shadow-rose-500/50' : 'bg-[var(--bg-1)] border-2 border-[var(--border)] shadow-[var(--bg-1)]/50 hover:border-[var(--brand)]'}`}
      >
         <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--bg-0)]/20 to-transparent" />
         {isListening ? (
            <>
               <div className="absolute inset-0 rounded-full border border-rose-400 animate-ping" />
               <MicOff size={28} className="text-white relative z-10 animate-pulse" />
            </>
         ) : (
            <Mic size={28} className="text-[var(--brand)] relative z-10" />
         )}
         
         <div className="absolute -bottom-6 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">JARVIS</div>
      </motion.button>
    </div>
  )
}
