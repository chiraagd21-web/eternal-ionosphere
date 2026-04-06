'use client'

import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows, 
  Text,
  Float,
  PresentationControls,
  BakeShadows,
  MeshReflectorMaterial,
  Html,
  useCursor
} from '@react-three/drei'
import { 
  Physics, 
  RigidBody, 
  CuboidCollider,
  Debug
} from '@react-three/rapier'
import { 
  EffectComposer, 
  Bloom, 
  Noise, 
  Vignette,
  SelectiveBloom
} from '@react-three/postprocessing'
import * as THREE from 'three'

// --- Types ---

interface RackProps {
  position: [number, number, number]
  id: string
  color?: string
  utilization?: number
  onClick?: () => void
}

// --- Components ---

const GlassRack = ({ position, id, color = '#6366f1', utilization = 80, onClick }: RackProps) => {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  // Calculate shelves based on utilization
  const shelves = 5
  const activeShelves = Math.ceil((utilization / 100) * shelves)

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <group 
        position={position} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
      >
        {/* Futuristic Glass Rack Frame */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[2, 5, 0.1]} />
          <meshStandardMaterial 
            color="#1e293b" 
            metalness={0.9} 
            roughness={0.1} 
            transparent 
            opacity={0.8} 
          />
        </mesh>
        <mesh position={[0, 2.5, 2]}>
          <boxGeometry args={[2, 5, 0.1]} />
          <meshStandardMaterial 
            color="#1e293b" 
            metalness={0.9} 
            roughness={0.1} 
            transparent 
            opacity={0.8} 
          />
        </mesh>
        
        {/* Horizontal Shelves with Neon Accents */}
        {[...Array(shelves)].map((_, i) => (
          <group key={i} position={[0, i * 1, 1]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.9, 0.05, 1.9]} />
              <meshStandardMaterial 
                color={hovered ? color : "#334155"} 
                emissive={hovered ? color : "#000"} 
                emissiveIntensity={hovered ? 1 : 0} 
              />
            </mesh>
            
            {/* Intelligent Inventory Units */}
            {i < activeShelves && (
              <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh position={[0, 0.2, 0]}>
                  <boxGeometry args={[1.2, 0.6, 1.2]} />
                  <meshStandardMaterial 
                    color={hovered ? '#ffffff' : color} 
                    emissive={color} 
                    emissiveIntensity={hovered ? 2 : 0.5} 
                    roughness={0.1}
                    metalness={0.8}
                  />
                </mesh>
              </Float>
            )}
          </group>
        ))}

        {/* Floating Holographic Label */}
        <Html position={[0, 5.8, 1]} center distanceFactor={10}>
          <div className={`px-3 py-1 rounded-full border border-white/10 backdrop-blur-md transition-all duration-300 ${hovered ? 'bg-indigo-500 scale-125 opacity-100' : 'bg-slate-900/50 scale-100 opacity-60'}`}>
            <span className="text-[10px] font-black text-white whitespace-nowrap uppercase tracking-widest">{id}</span>
          </div>
        </Html>
      </group>
    </RigidBody>
  )
}

const AISwarmBot = ({ speed = 1.5, startPos = [0, 0, 0] as [number, number, number] }) => {
  const meshRef = useRef<THREE.Group>(null)
  const [target, setTarget] = useState(new THREE.Vector3(startPos[0], 0.2, (Math.random() - 0.5) * 20))
  
  useFrame((state, delta) => {
    if (!meshRef.current) return
    const current = meshRef.current.position
    
    // Smooth lerp to random targets in aisle
    current.lerp(target, delta * speed)
    
    if (current.distanceTo(target) < 0.5) {
      setTarget(new THREE.Vector3(startPos[0], 0.2, (Math.random() - 0.5) * 20))
    }
    
    // Add some "thinking" rotation
    meshRef.current.rotation.y += delta * 2
  })

  return (
    <group ref={meshRef} position={startPos}>
      <RigidBody colliders="ball" type="dynamic" linearDamping={1} angularDamping={1}>
        {/* Spherical Drone Design */}
        <mesh castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color="#f59e0b" 
            metalness={1} 
            roughness={0} 
            emissive="#f59e0b" 
            emissiveIntensity={0.2} 
          />
        </mesh>
        
        {/* Orbital Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.02, 16, 100]} />
          <meshBasicMaterial color="#fcd34d" transparent opacity={0.5} />
        </mesh>
        
        {/* Downward Telemetry Beam */}
        <pointLight color="#f59e0b" intensity={2} distance={5} />
      </RigidBody>
    </group>
  )
}

const NanoFloor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.05, 0]}>
      <planeGeometry args={[200, 200]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={15}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#080c14"
        metalness={0.5}
      />
    </mesh>
  )
}

// --- Main Engine ---

export const Warehouse3D = ({ onSelectItem }: { onSelectItem: (item: any) => void }) => {
  const aisles = 8
  const racksPerAisle = 10

  return (
    <div className="w-full h-full min-h-[750px] bg-black rounded-[40px] overflow-hidden border border-white/5 relative group/canvas">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[30, 30, 30]} fov={40} />
        
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            <Environment preset="night" blur={1} />
            
            {/* Lighting Design */}
            <ambientLight intensity={0.2} />
            <spotLight 
              position={[20, 40, 20]} 
              angle={0.2} 
              penumbra={1} 
              intensity={2} 
              castShadow 
              shadow-mapSize={[1024, 1024]} 
            />
            
            <PresentationControls 
              global 
              config={{ mass: 2, tension: 500 }} 
              snap={{ mass: 4, tension: 1500 }} 
              rotation={[0, 0, 0]} 
              polar={[-Math.PI / 3, Math.PI / 3]} 
              azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
              <group scale={0.8}>
                {/* Global Grid & Floor */}
                <NanoFloor />
                <gridHelper args={[200, 100, '#1e293b', '#0f172a']} position={[0, 0, 0]} transparent opacity={0.1} />

                {/* Intelligent Racking Network */}
                {[...Array(aisles)].map((_, aisleIdx) => {
                  const x = (aisleIdx - (aisles - 1) / 2) * 10
                  return (
                    <group key={aisleIdx}>
                      {[...Array(racksPerAisle)].map((__, rackIdx) => {
                        const z = (rackIdx - (racksPerAisle - 1) / 2) * 6
                        const id = `${String.fromCharCode(65 + aisleIdx)}-${rackIdx + 1}`
                        return (
                          <GlassRack 
                            key={id}
                            id={id}
                            position={[x, 0, z]} 
                            utilization={20 + Math.random() * 80}
                            color={aisleIdx % 2 === 0 ? '#6366f1' : '#10b981'}
                            onClick={() => onSelectItem({ 
                                id, 
                                name: `V3 High-Density Core ${id}`, 
                                qty: Math.floor(Math.random() * 5000) + 500,
                                status: Math.random() > 0.15 ? 'Optimal' : 'Risk_Detected',
                                location: `SEC_${aisleIdx}-${rackIdx}`
                            })}
                          />
                        )
                      })}
                      
                      {/* Autonomous Swarm Intelligence Bots */}
                      <AISwarmBot startPos={[x + 5, 0.5, (Math.random() - 0.5) * 10]} speed={0.8 + Math.random()} />
                    </group>
                  )
                })}
              </group>
            </PresentationControls>

            {/* Ground Collision */}
            <CuboidCollider args={[100, 0.1, 100]} position={[0, -0.1, 0]} />
          </Physics>

          {/* Visual Polish - Post Processing */}
          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={0.5} 
              mipmapBlur 
              intensity={1.5} 
              radius={0.4} 
            />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>

          <BakeShadows />
          <ContactShadows 
            position={[0, 0.01, 0]} 
            opacity={0.4} 
            scale={100} 
            blur={3} 
            far={10} 
            resolution={1024} 
          />
        </Suspense>

        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={10}
          maxDistance={100}
        />
      </Canvas>

      {/* Futuristic HUD Layer */}
      <div className="absolute top-10 left-10 pointer-events-none select-none">
        <div className="flex flex-col gap-4">
          <div className="bg-slate-900/60 backdrop-blur-3xl border-l-[4px] border-indigo-500 p-6 rounded-r-2xl animate-in slide-in-from-left duration-700">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Spatial Digital Twin</h4>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">ENGINE_v26.0_LTS</h2>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 rounded-md border border-emerald-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-emerald-400 uppercase">Neural Stream Live</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">80 Racks Active</span>
            </div>
          </div>
          
          <div className="flex gap-3">
             <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/5 px-4 py-3 rounded-2xl flex flex-col">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Physics Eng</span>
                <span className="text-[10px] font-black text-white uppercase italic">Rapier_v1.6</span>
             </div>
             <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/5 px-4 py-3 rounded-2xl flex flex-col">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Visuals</span>
                <span className="text-[10px] font-black text-white uppercase italic">RT_Bloom_v3</span>
             </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="bg-slate-950/80 backdrop-blur-3xl border border-white/10 px-8 py-3 rounded-full flex items-center gap-10">
           <div className="flex flex-col items-center">
              <span className="text-[8px] font-black text-slate-500 uppercase mb-0.5">Throughput</span>
              <span className="text-sm font-black text-white">4.2k/h</span>
           </div>
           <div className="w-px h-6 bg-white/10" />
           <div className="flex flex-col items-center">
              <span className="text-[8px] font-black text-slate-500 uppercase mb-0.5">Latency</span>
              <span className="text-sm font-black text-emerald-400">12ms</span>
           </div>
           <div className="w-px h-6 bg-white/10" />
           <div className="flex flex-col items-center">
              <span className="text-[8px] font-black text-slate-500 uppercase mb-0.5">Uptime</span>
              <span className="text-sm font-black text-white">99.9%</span>
           </div>
        </div>
      </div>
      
      <style jsx>{`
        .group/canvas:hover .bg-slate-900/60 {
          border-left-color: #ffffff;
          background: rgba(15, 23, 42, 0.8);
        }
      `}</style>
    </div>
  )
}
