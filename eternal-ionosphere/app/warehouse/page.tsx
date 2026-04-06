'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  X, 
  Search,
  MoreHorizontal,
  CheckSquare,
  Activity,
  BarChart3,
  LineChart as LineIcon,
  LayoutGrid,
  Zap,
  MousePointer2,
  Settings2,
  Blocks
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'

const Warehouse3D = dynamic(() => import('@/components/Warehouse3D').then(mod => mod.Warehouse3D), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[var(--bg-0)] animate-pulse" />
})

export default function WarehousePage() {
  const { inventory, addInventoryCount, pendingPutAway, clearPutAway, updateLocation } = useAppStore()
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [layoutMode, setLayoutMode] = useState(false)
  const [putAwayItem, setPutAwayItem] = useState<any>(null)
  const [isSelectingRack, setIsSelectingRack] = useState(false)
  const { showToast } = useToast()

  const handleOptimizeSlotting = () => {
    // This is handled inside Warehouse3D component via applySlottingOptimization
    // We can also trigger notifications here
    showToast('Neural Slotting Algorithm Initiated', 'success')
  }

  return (
    <div className="h-screen w-full relative bg-[var(--bg-0)] overflow-hidden font-sans">
      
      {/* FULLSCREEN 3D VIEW */}
      <div className="absolute inset-0 z-0">
        <Warehouse3D 
          onSelectItem={(item: any) => {
            if (isSelectingRack && putAwayItem) {
              // Assign the item to this rack
              updateLocation(putAwayItem.id, item.id)
              clearPutAway(putAwayItem.id)
              setIsSelectingRack(false)
              setPutAwayItem(null)
              showToast(`Item ${putAwayItem.name} placed on Rack ${item.id}`, 'success')
            } else {
              setSelectedItem(item)
            }
          }} 
          inventory={inventory} 
          layoutMode={layoutMode}
        />
      </div>

      {/* CLEAN SIDEBAR CONTROLS */}
      <div className="relative z-10 w-full h-full pointer-events-none p-10">
        
        {/* TOP LEFT: Breadcrumbs/Status */}
        <div className="absolute top-10 left-10 flex items-center gap-6 pointer-events-auto">
           <div className="bg-[var(--bg-2)]/80 backdrop-blur-xl border border-[var(--border)] px-6 py-4 rounded-3xl shadow-soft flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">Facility Status</span>
                 <span className="text-sm font-black text-[var(--text-primary)]">Global Grid Alpha • Active</span>
              </div>
           </div>
        </div>

        {/* LEFT TOOLBAR */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto">
           <button 
             onClick={() => setLayoutMode(!layoutMode)}
             className={`w-14 h-14 rounded-[1.25rem] shadow-xl flex items-center justify-center transition-all group ${
               layoutMode ? 'bg-[var(--text-primary)] text-[var(--bg-0)] border-[var(--text-primary)]' : 'bg-[var(--bg-2)] border border-[var(--border)] text-[var(--text-secondary)] opacity-40 hover:text-[var(--text-primary)]'
             }`}
             title={layoutMode ? 'Exit Layout Mode' : 'Enter Layout Mode'}
           >
              {layoutMode ? <MousePointer2 size={24} /> : <LayoutGrid size={24} />}
           </button>
           
           <button className="w-14 h-14 bg-[var(--bg-2)] rounded-[1.25rem] border border-[var(--border)] shadow-xl flex items-center justify-center text-[var(--text-secondary)] opacity-40 hover:text-emerald-600 transition-all">
              <Blocks size={24} />
           </button>

           <button className="w-14 h-14 bg-[var(--bg-2)] rounded-[1.25rem] border border-[var(--border)] shadow-xl flex items-center justify-center text-[var(--text-secondary)] opacity-40 hover:text-amber-600 transition-all">
              <Settings2 size={24} />
           </button>
        </div>

        {/* MODE INDICATOR */}
        <AnimatePresence>
          {layoutMode && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-10 left-1/2 -translate-x-1/2 bg-[var(--bg-card)] border border-[var(--text-primary)]/30 px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 pointer-events-auto"
            >
               <div className="w-2 h-2 rounded-full bg-[var(--text-primary)]" />
               <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest">Layout Orchestration Mode Active</span>
               <div className="w-px h-4 bg-[var(--border)]" />
               <span className="text-[10px] text-[var(--text-secondary)] opacity-40 font-medium">Drag racks to rearrange the floor plan</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* PENDING PUT-AWAY BANNER */}
        <AnimatePresence>
          {(pendingPutAway.length > 0 && !isSelectingRack) && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-10 right-10 w-80 bg-[var(--bg-2)]/90 backdrop-blur-2xl border border-[var(--border)] p-8 rounded-[2.5rem] shadow-2xl pointer-events-auto"
            >
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner"><Package size={24} /></div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Pending Put-Away</span>
                     <span className="text-sm font-black text-[var(--text-primary)]">{pendingPutAway.length} Assets Waiting</span>
                  </div>
               </div>
               
               <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {pendingPutAway.map(item => (
                    <div key={item.id} className="p-4 bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl group hover:border-emerald-300 transition-all">
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-black text-[var(--text-primary)] uppercase truncate w-32">{item.name}</span>
                          <span className="text-[10px] font-bold text-[var(--text-secondary)] opacity-40">#{item.id.slice(-4)}</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[var(--text-secondary)] opacity-20">{item.qty} QTY</span>
                          <button 
                            onClick={() => {
                              setPutAwayItem(item)
                              setIsSelectingRack(true)
                            }}
                            className="bg-[var(--text-primary)] text-[var(--bg-0)] text-[9px] font-black px-4 py-2 rounded-xl hover:opacity-80 transition-all opacity-0 group-hover:opacity-100"
                          >
                             ASSIGN RACK
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

           {isSelectingRack && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-[var(--bg-0)] px-8 py-4 rounded-full shadow-2xl flex items-center gap-6 pointer-events-auto border border-emerald-500"
            >
               <div className="w-8 h-8 bg-[var(--bg-0)]/20 rounded-xl flex items-center justify-center"><MousePointer2 size={18} /></div>
               <div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Receiving Process</div>
                  <div className="text-xs font-black">Click on a target rack to place <span className="underline decoration-2 underline-offset-4 decoration-emerald-300">{putAwayItem?.name}</span></div>
               </div>
               <button 
                onClick={() => setIsSelectingRack(false)}
                className="ml-4 p-2 hover:bg-[var(--bg-0)]/10 rounded-full transition-all"
               >
                 <X size={20} />
               </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <AnimatePresence>
        {(selectedItem && !layoutMode) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/10 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="w-full max-w-lg bg-[var(--bg-card)] rounded-[3rem] shadow-2xl p-12 border border-[var(--border)]"
             >
                <div className="flex items-center justify-between mb-10">
                   <div className="w-16 h-16 bg-[var(--brand)]/10 text-[var(--brand)] rounded-3xl flex items-center justify-center"><Package size={32} /></div>
                   <button onClick={() => setSelectedItem(null)} className="p-3 hover:bg-[var(--bg-1)] rounded-full text-[var(--text-secondary)] opacity-40 transition-all"><X size={32} /></button>
                </div>
                
                <div className="mb-10">
                   <h2 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter mb-2">{selectedItem.name}</h2>
                   <div className="flex items-center gap-3">
                      <span className="bg-[var(--bg-1)] px-3 py-1 rounded-lg text-[10px] font-bold text-[var(--text-secondary)] opacity-60 uppercase tracking-widest">{selectedItem.id}</span>
                      <span className="text-[var(--text-secondary)] opacity-20 text-xs">•</span>
                      <span className="text-xs font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">{selectedItem.category}</span>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-12">
                   <div className="p-8 bg-[var(--bg-1)] rounded-[2rem] border border-[var(--border)]">
                      <div className="text-[10px] font-bold text-[var(--text-secondary)] opacity-40 uppercase mb-2 tracking-widest">Availability</div>
                      <div className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">{selectedItem.qty?.toLocaleString()} <span className="text-lg text-[var(--text-secondary)] opacity-40 font-bold ml-1">Units</span></div>
                   </div>
                   <div className="p-8 bg-[var(--bg-1)] rounded-[2rem] border border-[var(--border)]">
                      <div className="text-[10px] font-bold text-[var(--text-secondary)] opacity-40 uppercase mb-2 tracking-widest">Rack Efficiency</div>
                      <div className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">{selectedItem.utilization}%</div>
                   </div>
                </div>

                 <div className="flex gap-4">
                   <button 
                     onClick={() => {
                        const qty = prompt('Enter quantity to receive:', '0')
                        if (qty) {
                          addInventoryCount(selectedItem.sku, parseInt(qty))
                          showToast(`Received ${qty} units for ${selectedItem.name}`, 'success')
                        }
                        setSelectedItem(null)
                     }}
                     className="flex-1 bg-indigo-600 text-[var(--bg-0)] font-bold py-5 rounded-[1.5rem] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
                   >
                     Receive Stock
                   </button>
                   <button className="flex-1 bg-[var(--text-primary)] text-[var(--bg-0)] font-bold py-5 rounded-[1.5rem] hover:opacity-90 transition-all transform hover:-translate-y-1">
                     Full Audit
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
