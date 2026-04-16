'use client'

import React, { useRef, useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box as DreiBox, Plane, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { 
  ArrowRight, Zap, Cpu, Fingerprint, Search, Box, Truck, ShieldCheck, 
  Activity, Globe, Database, Monitor, Server, Workflow 
} from 'lucide-react'

// --- 3D WAREHOUSE COMPONENT (ABC ANALYSIS & STOCK TRANSFER) ---
const MovingStock = ({ start, end, color, speed, offset, pathType }: any) => {
  const ref = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = ((clock.elapsedTime * speed) + offset) % 1
    
    // Simulate picking from high up, moving down aisle, then to dock
    if (pathType === 'complex') {
        if (t < 0.2) {
            // Move down from shelf
            ref.current.position.set(start[0], THREE.MathUtils.lerp(start[1], 0.25, t * 5), start[2])
        } else if (t < 0.5) {
            // Move out of aisle
            ref.current.position.set(start[0], 0.25, THREE.MathUtils.lerp(start[2], end[2], (t - 0.2) * 3.33))
        } else {
            // Move to dock
            ref.current.position.set(THREE.MathUtils.lerp(start[0], end[0], (t - 0.5) * 2), 0.25, end[2])
        }
    } else {
        // Simple straight lerp for others
        ref.current.position.x = THREE.MathUtils.lerp(start[0], end[0], t)
        ref.current.position.y = THREE.MathUtils.lerp(start[1], end[1], t)
        ref.current.position.z = THREE.MathUtils.lerp(start[2], end[2], t)
    }
  })

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} toneMapped={false} />
      <pointLight color={color} intensity={0.5} distance={2} />
    </mesh>
  )
}

const Shelf = ({ position, color, label }: any) => (
  <group position={position}>
    <DreiBox args={[1, 3, 4]} position={[0, 1.5, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.2} transparent opacity={0.6} />
    </DreiBox>
    {/* Colored base indicator for ABC zones */}
    <DreiBox args={[1.2, 0.1, 4.2]} position={[0, 0.05, 0]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </DreiBox>
  </group>
)

const WarehouseScene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-10, 10, -5]} intensity={0.2} color="#10b981" />
      
      {/* Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#0A0A0C" />
      </Plane>

      {/* Grid Helper for tech look */}
      <gridHelper args={[20, 40, '#222', '#111']} position={[0, 0.01, 0]} />

      {/* Racks - ABC Analysis Setup */}
      {/* Zone A - Fast Movers (Green) - Close to origin/dock */}
      <Shelf position={[-2, 0, -2]} color="#10b981" />
      <Shelf position={[-2, 0, 3]} color="#10b981" />
      
      {/* Zone B - Medium Movers (Amber) */}
      <Shelf position={[-5, 0, -2]} color="#f59e0b" />
      <Shelf position={[-5, 0, 3]} color="#f59e0b" />
      
      {/* Zone C - Slow Movers (Red) */}
      <Shelf position={[-8, 0, -2]} color="#ef4444" />
      <Shelf position={[-8, 0, 3]} color="#ef4444" />

      {/* Loading Dock Area */}
      <DreiBox args={[4, 0.2, 8]} position={[4, 0.1, 0]} receiveShadow>
        <meshStandardMaterial color="#222" />
      </DreiBox>
      <DreiBox args={[3.8, 0.1, 7.8]} position={[4, 0.2, 0]}>
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.1} />
      </DreiBox>

      {/* Animated Stock Transfers */}
      <MovingStock start={[-2, 2.5, -2]} end={[4, 0.25, -2]} color="#10b981" speed={0.4} offset={0} pathType="complex" />
      <MovingStock start={[-2, 1.5, 3]} end={[4, 0.25, 3]} color="#10b981" speed={0.4} offset={0.5} pathType="complex" />
      
      <MovingStock start={[-5, 2.5, -2]} end={[4, 0.25, 0]} color="#f59e0b" speed={0.2} offset={0.2} pathType="complex" />
      <MovingStock start={[-8, 2.5, 3]} end={[4, 0.25, 2]} color="#ef4444" speed={0.1} offset={0.8} pathType="complex" />

      {/* Orbit to give it a living, breathing feel */}
      <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 4} />
    </>
  )
}

const WarehouseMockup3D = () => (
  <div className="w-full h-full bg-[#050505] relative overflow-hidden rounded-[1.4rem] border border-white/5 shadow-2xl flex flex-col">
    <div className="absolute top-6 left-6 z-10 flex gap-4">
        <div className="bg-[#1A1A1C]/80 backdrop-blur-md border border-white/10 p-2.5 rounded-xl flex items-center gap-3">
          <Workflow size={14} className="text-emerald-500" /> 
          <span className="text-xs font-bold text-white tracking-widest uppercase">Live Stock Transfer</span>
        </div>
        <div className="bg-[#1A1A1C]/80 backdrop-blur-md border border-white/10 p-2.5 rounded-xl flex gap-3 text-[10px] font-bold uppercase tracking-wider items-center">
            <span className="text-emerald-500">A</span>
            <span className="text-amber-500">B</span>
            <span className="text-red-500">C</span>
            <span className="text-neutral-400 border-l border-white/10 pl-3">Volume Mapping</span>
        </div>
    </div>
    
    <div className="flex-1 w-full relative">
      <Canvas shadows camera={{ position: [10, 8, 10], fov: 35 }}>
        <WarehouseScene />
      </Canvas>
    </div>
    
    <div className="absolute bottom-6 inset-x-6 z-10 grid grid-cols-3 gap-4">
        <div className="bg-black/80 backdrop-blur-md border border-white/5 rounded-lg p-3">
            <div className="text-[10px] text-neutral-500 font-mono mb-1">DOCK_THROUGHPUT</div>
            <div className="text-lg font-bold text-emerald-400">1,402 / hr</div>
        </div>
        <div className="bg-black/80 backdrop-blur-md border border-white/5 rounded-lg p-3">
            <div className="text-[10px] text-neutral-500 font-mono mb-1">A_HITS (FAST)</div>
            <div className="text-lg font-bold text-white">82%</div>
        </div>
        <div className="bg-black/80 backdrop-blur-md border border-white/5 rounded-lg p-3">
            <div className="text-[10px] text-neutral-500 font-mono mb-1">C_HITS (SLOW)</div>
            <div className="text-lg font-bold text-neutral-400">4%</div>
        </div>
    </div>
  </div>
)

// --- SOURCING MOCKUP (Refined for more intuitive Video feel) ---
const SourcingMockup = () => (
  <div className="w-full h-full bg-[#050505] relative overflow-hidden flex flex-col p-6 rounded-[1.4rem] border border-white/5 shadow-2xl">
     <div className="flex gap-4 mb-6 border-b border-white/5 pb-4">
        <div className="w-full bg-[#111] border border-white/10 p-3 rounded-xl flex items-center gap-3 text-neutral-400">
           <Search size={16} className="text-emerald-500" /> <span className="text-xs font-mono">Running arbitrage across 140 suppliers...</span>
        </div>
     </div>
     <div className="space-y-3 flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-10 pointer-events-none" />
        {[
          { name: 'NV H100 GPU', price: '$28,400', drop: '↓ 5%', site: 'SUPPLIER_01', latency: '4ms', selected: true },
          { name: 'NV H100 GPU', price: '$31,100', drop: '-', site: 'SUPPLIER_02', latency: '8ms', selected: false },
          { name: 'NV A100 GPU', price: '$14,000', drop: '-', site: 'SUPPLIER_03', latency: '12ms', selected: false }
        ].map((item, i) => (
           <motion.div 
             key={i}
             initial={{ x: 30, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: i * 0.2, duration: 0.5 }}
             className={`p-4 rounded-xl flex justify-between items-center transition-all relative overflow-hidden ${item.selected ? 'bg-[#151A15] border border-emerald-500/30' : 'bg-[#111] border border-white/5'}`}
           >
              {item.selected && (
                 <motion.div 
                   animate={{ opacity: [0, 0.15, 0], x: ['-100%', '100%'] }} 
                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent pointer-events-none" 
                 />
              )}
              <div className="flex items-center gap-4 relative z-10">
                 <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.selected ? 'bg-emerald-500/20 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white/5 text-neutral-400'}`}>
                    <Server size={16} />
                 </div>
                 <div>
                    <div className="text-sm font-semibold text-white">{item.name}</div>
                    <div className="text-[10px] text-neutral-500 font-mono mt-1">{item.site} • {item.latency}</div>
                 </div>
              </div>
              <div className="text-right relative z-10">
                 <div className={`text-base font-bold ${item.selected ? 'text-emerald-400' : 'text-neutral-300'}`}>{item.price} <span className="text-[10px] text-emerald-500">{item.drop !== '-' ? item.drop : ''}</span></div>
                 {item.selected ? (
                     <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] uppercase font-bold tracking-wider mt-1 inline-block border border-emerald-500/30">Auto-Purchasing</div>
                 ) : (
                     <div className="text-[9px] uppercase font-bold tracking-wider mt-1 text-neutral-600">Available</div>
                 )}
              </div>
           </motion.div>
        ))}
     </div>
  </div>
)

// --- NAV ---
const Nav = () => (
  <motion.nav 
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="fixed top-0 left-0 w-full p-6 lg:px-10 lg:py-5 flex justify-between items-center z-[100] bg-[#050505]/80 backdrop-blur-xl border-b border-white/5"
  >
    <Link href="/" className="flex items-center gap-4 group">
      <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
        <Zap size={16} className="group-hover:scale-110 transition-transform"/>
      </div>
      <div className="text-xl font-bold tracking-tight text-white">zo.flow</div>
    </Link>
    <div className="hidden lg:flex items-center gap-8 font-medium text-sm text-neutral-400">
      <Link href="/product" className="hover:text-white transition-all">Product</Link>
      <Link href="/solutions" className="hover:text-white transition-all">Solutions</Link>
      <Link href="/pricing" className="hover:text-white transition-all">Pricing</Link>
    </div>
    <div className="flex items-center gap-4">
      <Link href="/login" className="px-5 py-2 text-sm font-medium text-white hover:text-emerald-400 transition-colors hidden sm:block">Sign in</Link>
      <Link href="/login" className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">Get Started</Link>
    </div>
  </motion.nav>
)

// --- MAIN PAGE LAYOUT ---
export default function LandingPage() {
  return (
     <div className="bg-[#050505] text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-200 min-h-screen">
        <Nav />
        
        <main className="relative z-10 pt-40 pb-20 overflow-hidden">
           {/* Abstract Background Elements */}
           <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
           <div className="absolute top-[60%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
           
           {/* HERO */}
           <section className="max-w-6xl mx-auto px-6 lg:px-10 flex flex-col items-center text-center mb-40 relative z-10">
              <Link href="/changelog" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111] border border-white/10 text-xs font-semibold text-neutral-300 mb-8 hover:bg-[#1A1A1A] transition-colors shadow-2xl">
                 <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">New</span> Announcing 3D Spatial Warehousing <ArrowRight size={12} />
              </Link>
              
              <h1 className="text-5xl sm:text-7xl lg:text-[7rem] font-bold tracking-tighter leading-[1.0] text-white max-w-5xl mb-8 drop-shadow-2xl">
                 Logic for the <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 to-neutral-600">Physical World.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl font-medium leading-relaxed mb-12">
                 The single operating system to unify sourcing arbitration, global freight telemetry, and spatial 3D inventory modeling natively.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                 <button className="w-full sm:w-auto h-12 px-8 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105">Book Demo</button>
                 <button className="w-full sm:w-auto h-12 px-8 bg-[#111] border border-white/10 text-white text-sm font-bold rounded-full hover:bg-white/5 transition-all">Explore Platform</button>
              </div>
           </section>
           
           {/* ALTERNATING FEATURE SECTIONS (Pallet Style Cinematic Presentation) */}
           <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-48">
              
              {/* Feature 1: The 3D WAREHOUSE (The Video requested) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="order-2 lg:order-1 h-[500px] sm:h-[600px] w-full relative group"
                 >
                    <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-[1.6rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                    <WarehouseMockup3D />
                 </motion.div>
                 
                 <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="order-1 lg:order-2 space-y-8 lg:pl-12"
                 >
                    <div className="w-14 h-14 rounded-2xl bg-[#111] flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                       <Box size={28} />
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">Live Spatial <br/> ABC Analysis.</h2>
                    <p className="text-lg text-neutral-400 leading-relaxed font-medium">
                       Watch your facility in real-time. Our 3D Digital Twin visualizes actual stock transfers, highlighting fast-movers (A) vs slow-movers (C) to dynamically optimize loading dock proximity and pick paths.
                    </p>
                    <ul className="space-y-4 pt-4 border-t border-white/5">
                       {[
                         'Real-time automated 3D rendering of inventory',
                         'Visual ABC Volume sorting & heatmaps',
                         'Millisecond integration with actual robotic pickers'
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-4 text-sm text-neutral-300 font-medium">
                            <ShieldCheck size={18} className="text-emerald-500" /> {item}
                         </li>
                       ))}
                    </ul>
                 </motion.div>
              </div>

              {/* Feature 2: SOURCING */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-8 lg:pr-12"
                 >
                    <div className="w-14 h-14 rounded-2xl bg-[#111] flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                       <Database size={28} />
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">Autonomous <br/> Arbitrage.</h2>
                    <p className="text-lg text-neutral-400 leading-relaxed font-medium">
                       Eliminate manual price comparisons. Zo.flow scans global markets simultaneously, auto-executing contracts when prices drop below your specified thresholds natively.
                    </p>
                    <div className="pt-4 border-t border-white/5">
                        <Link href="/market" className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-white/5 border border-white/10 rounded-full text-sm font-semibold text-white hover:bg-white/10 transition-all">
                           See The Ledger <ArrowRight size={16} />
                        </Link>
                    </div>
                 </motion.div>
                 
                 <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="h-[450px] w-full relative group"
                 >
                    <div className="absolute -inset-1 bg-gradient-to-tl from-indigo-500/20 to-transparent rounded-[1.6rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                    <SourcingMockup />
                 </motion.div>
              </div>

           </div>

           {/* PREMIUM BENTO GRID */}
           <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-48">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
                 <div>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-white">The complete stack.</h2>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Card 1 */}
                 <motion.div 
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-10 flex flex-col justify-between group hover:border-white/10 h-[400px] relative overflow-hidden"
                 >
                    <div className="relative z-10 space-y-4 max-w-sm">
                       <div className="w-12 h-12 rounded-xl bg-[#151515] border border-white/5 flex items-center justify-center text-white mb-8 shadow-inner">
                          <Truck size={24} />
                       </div>
                       <h3 className="text-2xl font-bold text-white">Global Telemetry HUD</h3>
                       <p className="text-neutral-400 text-base leading-relaxed">
                          Port congestion tracking, ocean lane vectors, and ELD ping mapping all combined on one zero-latency global map layer.
                       </p>
                    </div>
                    {/* Minimal graphic */}
                    <div className="absolute right-0 bottom-0 w-3/4 h-[50%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 border-t border-l border-white/5 rounded-tl-3xl pointer-events-none" />
                 </motion.div>

                 {/* Card 2 */}
                 <motion.div 
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-10 flex flex-col justify-between group hover:border-white/10 h-[400px] relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />
                    <div className="relative z-10 space-y-4 max-w-sm">
                       <div className="w-12 h-12 rounded-xl bg-[#151515] border border-white/5 flex items-center justify-center text-white mb-8 shadow-inner">
                          <Fingerprint size={24} />
                       </div>
                       <h3 className="text-2xl font-bold text-white">Immutable Compliance</h3>
                       <p className="text-neutral-400 text-base leading-relaxed">
                          Automated ISO certification validation. Our neural engine checks custom forms and blocks non-compliant vendor transactions instantly.
                       </p>
                    </div>
                 </motion.div>
              </div>
           </section>

        </main>

        <footer className="mt-32 pt-20 pb-10 px-6 lg:px-10 border-t border-white/5 bg-[#050505]">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-600 font-medium font-mono gap-4">
              <p>© 2026 ZO.FLOW TECHNOLOGIES INC.</p>
              <div className="flex gap-6">
                 <Link href="#" className="hover:text-white transition-colors">SYSTEM STATUS: OPTIMAL</Link>
                 <Link href="#" className="hover:text-white transition-colors">SECURITY</Link>
              </div>
           </div>
        </footer>
     </div>
  )
}
