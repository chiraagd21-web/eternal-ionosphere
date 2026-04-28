'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box as DreiBox, Plane } from '@react-three/drei'
import * as THREE from 'three'
import { ArrowRight, Zap, Box, Database, Server, Workflow, ShieldCheck } from 'lucide-react'

// --- 3D WAREHOUSE COMPONENT (ABC ANALYSIS) ---
const MovingStock = ({ start, end, color, speed, offset }: any) => {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = ((clock.elapsedTime * speed) + offset) % 1
    ref.current.position.x = THREE.MathUtils.lerp(start[0], end[0], t)
    ref.current.position.y = THREE.MathUtils.lerp(start[1], end[1], t)
    ref.current.position.z = THREE.MathUtils.lerp(start[2], end[2], t)
  })
  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
}

const Shelf = ({ position, color }: any) => (
  <group position={position}>
    <DreiBox args={[1, 3, 4]} position={[0, 1.5, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
    </DreiBox>
    <DreiBox args={[1.2, 0.1, 4.2]} position={[0, 0.05, 0]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </DreiBox>
  </group>
)

const WarehouseScene = () => (
  <>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} intensity={1} castShadow />
    <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial color="#f0f0f0" />
    </Plane>
    <gridHelper args={[20, 40, '#ddd', '#eee']} position={[0, 0.01, 0]} />
    <Shelf position={[-3, 0, -2]} color="#10b981" />
    <Shelf position={[-3, 0, 3]} color="#10b981" />
    <Shelf position={[-6, 0, -2]} color="#f59e0b" />
    <MovingStock start={[-3, 2.5, -2]} end={[4, 0.25, -2]} color="#10b981" speed={0.4} offset={0} />
    <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
  </>
)

// --- COMPONENTS ---
const Logo = () => (
  <div className="flex items-center gap-3">
    <svg width="24" height="10" viewBox="0 0 32 12" fill="none" className="text-black">
      <circle cx="6" cy="6" r="6" fill="currentColor"/>
      <rect x="18" y="2" width="14" height="8" fill="currentColor"/>
    </svg>
    <span className="text-lg font-black tracking-tighter italic text-black">Zo.Flow</span>
  </div>
)

const Nav = () => (
  <nav className="fixed top-0 left-0 w-full p-8 lg:px-12 flex justify-between items-center z-[100] bg-white/80 backdrop-blur-xl border-b border-black/5">
    <Link href="/"><Logo /></Link>
    <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
      <Link href="/about" className="hover:text-black transition-colors">About</Link>
      <Link href="/features" className="hover:text-black transition-colors">Features</Link>
      <Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link>
      <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
    </div>
    <Link href="/login" className="px-10 py-3 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-emerald-600 transition-all shadow-2xl hover:scale-105 active:scale-95">
      Login
    </Link>
  </nav>
)

export default function LandingPage() {
  return (
    <div className="bg-[#f8f9fa] text-black min-h-screen selection:bg-emerald-500 selection:text-white">
      <Nav />
      
      <main className="pt-48 pb-32">
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-8 lg:px-12 flex flex-col items-center text-center mb-64">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-500 font-black tracking-[0.4em] text-[10px] uppercase mb-10 flex items-center gap-3"
          >
            <Zap size={12} fill="currentColor" /> Operational Authority OS
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-8xl lg:text-[11rem] font-black italic tracking-tighter leading-[0.85] text-black uppercase mb-16"
          >
            Supply Chain <br/> Unified
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-neutral-500 max-w-2xl font-bold leading-relaxed mb-16 italic"
          >
            Procurement, inventory tracking, and global freight telemetry — fused into one high-velocity command center. Stop scrolling spreadsheets. Master your logistics.
          </motion.p>
        </section>

        {/* FEATURE 1: SOURCING */}
        <section className="max-w-7xl mx-auto px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-64">
          <div className="space-y-10">
            <div className="text-emerald-500 font-black tracking-[0.4em] text-[10px] uppercase">
              Global _ Procurement _ Engine
            </div>
            <h2 className="text-6xl lg:text-8xl font-black italic tracking-tighter leading-[0.9] text-black uppercase">
              Sourcing <br/> Automated
            </h2>
            <p className="text-lg text-neutral-500 font-bold leading-relaxed italic max-w-md">
              Instantly scan global suppliers. Discover the lowest prices in milliseconds and execute purchase orders autonomously to protect your margins.
            </p>
            <ul className="space-y-4 pt-6 border-t border-black/5">
              {['Arbitrage AI Mapping.', 'Instant Contract Execution.', 'Automated Supplier Audits.'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-emerald-500/5 rounded-[3rem] blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="bg-white border border-black/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden h-[400px]">
               <div className="flex justify-between items-center mb-8 pb-4 border-b border-black/5">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">By 5,000x NVIDIA H100 Tensor</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[8px] font-black uppercase rounded-md border border-emerald-500/20">Autonomous Mode</span>
               </div>
               <div className="space-y-4 opacity-20">
                  <div className="h-12 bg-neutral-100 rounded-xl w-full" />
                  <div className="h-12 bg-neutral-100 rounded-xl w-3/4" />
                  <div className="h-12 bg-neutral-100 rounded-xl w-full" />
               </div>
            </div>
          </div>
        </section>

        {/* FEATURE 2: INVENTORY */}
        <section className="max-w-7xl mx-auto px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-64">
          <div className="order-2 lg:order-1 h-[600px] w-full relative group">
            <div className="absolute -inset-4 bg-emerald-500/5 rounded-[3rem] blur-2xl opacity-50" />
            <div className="w-full h-full bg-white border border-black/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
               <div className="absolute top-8 left-8 z-10">
                  <div className="bg-white/90 backdrop-blur border border-black/5 p-3 rounded-xl flex items-center gap-3">
                    <Workflow size={14} className="text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Live Stock Transfer</span>
                  </div>
               </div>
               <Canvas shadows camera={{ position: [8, 8, 8], fov: 35 }}>
                 <WarehouseScene />
               </Canvas>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 space-y-10 lg:pl-12">
            <div className="text-emerald-500 font-black tracking-[0.4em] text-[10px] uppercase">
              3D _ Spatial _ Localization
            </div>
            <h2 className="text-6xl lg:text-8xl font-black italic tracking-tighter leading-[0.9] text-black uppercase">
              Inventory <br/> Mapped
            </h2>
            <p className="text-lg text-neutral-500 font-bold leading-relaxed italic max-w-md">
              Eliminate facility blind spots. Zo.Flow renders your warehouse in active 3D, optimizing dense storage routing and real-time fulfillments.
            </p>
            <div className="pt-8">
               <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-black group">
                  Explore Spatial HUD <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-black/5 bg-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center sm:items-start gap-4">
            <Logo />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">© 2026 ZO.FLOW TECHNOLOGIES INC.</p>
          </div>
          <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500">
            <Link href="/suppliers" className="hover:text-black transition-colors">Search Agent</Link>
            <Link href="/warehouse" className="hover:text-black transition-colors">Inventory Localization</Link>
            <Link href="/contracts" className="hover:text-black transition-colors">Compliance</Link>
            <Link href="#" className="hover:text-black transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-black transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
