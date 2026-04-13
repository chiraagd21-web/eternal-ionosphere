'use client'

import React, { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows, 
  useCursor,
  Float,
  PivotControls,
  Text
} from '@react-three/drei'
import { 
  Physics, 
  RigidBody, 
} from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Zap, Bot, Sparkles, CheckCircle2 } from 'lucide-react'
import { useAppStore, type SKUData } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'

// --- Types ---
interface RackProps {
  position: [number, number, number]
  id: string
  utilization?: number
  sku?: SKUData | null
  onClick?: (info: any) => void
  onMove?: (id: string, newPos: [number, number, number]) => void
  editable?: boolean
  selected?: boolean
  rackScale?: number
}

// --- Components ---

const BoxModel = ({ position, color = '#dcb98d' }: { position: [number, number, number], color?: string }) => (
  <mesh position={position} castShadow>
    <boxGeometry args={[0.8, 0.6, 0.8]} />
    <meshStandardMaterial color={color} roughness={0.8} />
  </mesh>
)

const DetailedRack = ({ position, id, utilization = 80, sku, onClick, onMove, editable, selected, rackScale = 1 }: RackProps) => {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered && !editable)

  const shelves = 4
  const boxesPerShelf = 2
  const rackColor = selected ? '#6366f1' : '#e5e7eb'

  const content = (
    <group 
      onPointerOver={() => !editable && setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        if (!editable) {
          onClick?.({ 
            id, 
            name: sku ? sku.name : `Rack ${id}`, 
            qty: sku ? sku.qtyOnHand : 0,
            sku: sku?.id || null,
            category: sku?.category || 'Empty',
            utilization,
            location: id,
          })
        }
      }}
    >
      {/* Frame */}
      <mesh position={[-0.9, 2, 0]} castShadow>
        <boxGeometry args={[0.1, 4, 1.8]} />
        <meshStandardMaterial color={rackColor} emissive={selected ? '#6366f1' : '#000000'} emissiveIntensity={selected ? 0.5 : 0} />
      </mesh>
      <mesh position={[0.9, 2, 0]} castShadow>
        <boxGeometry args={[0.1, 4, 1.8]} />
        <meshStandardMaterial color={rackColor} emissive={selected ? '#6366f1' : '#000000'} emissiveIntensity={selected ? 0.5 : 0} />
      </mesh>

      {/* Shelves */}
      {Array.from({ length: shelves }).map((_, i) => (
        <mesh key={i} position={[0, 0.8 + i * 1.0, 0]} castShadow>
          <boxGeometry args={[1.8, 0.06, 1.8]} />
          <meshStandardMaterial color={rackColor} />
        </mesh>
      ))}

      {/* Boxes on shelves */}
      {Array.from({ length: shelves }).map((_, si) =>
        Array.from({ length: boxesPerShelf }).map((_, bi) => {
          const filled = utilization / 100
          if (Math.random() > filled && !sku) return null
          return (
            <BoxModel 
              key={`${si}-${bi}`} 
              position={[-0.4 + bi * 0.8, 1.1 + si * 1.0, 0]} 
              color={sku ? '#6366f1' : '#dcb98d'}
            />
          )
        })
      )}

      {/* Hover glow */}
      {hovered && (
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[2, 4.5, 2.2]} />
          <meshStandardMaterial color="#6366f1" transparent opacity={0.05} />
        </mesh>
      )}

      {/* SKU label */}
      {sku && (
        <Text
          position={[0, 4.8, 0]}
          fontSize={0.35}
          color="#6366f1"
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          {sku.name}
        </Text>
      )}
    </group>
  )

  if (editable) {
    return (
      <PivotControls
        onDrag={(local) => {
          const w = new THREE.Matrix4()
          w.copy(local)
          const pos = new THREE.Vector3()
          pos.setFromMatrixPosition(w)
          onMove?.(id, [pos.x, 0, pos.z])
        }}
        depthTest={false}
        anchor={[0, 0, 0]}
        scale={2}
        disableRotations
        disableScaling
      >
        <group position={position} scale={rackScale}>{content}</group>
      </PivotControls>
    )
  }

  return <group position={position} scale={rackScale}>{content}</group>
}

const ForkliftModel = ({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={1.5}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1, 0.6, 1.6]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[0, 1.2, -0.2]} castShadow>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color="#1f2937" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 1.2, 0.9]} castShadow>
        <boxGeometry args={[0.1, 2.4, 0.2]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      <mesh position={[0.3, 0.1, 1.4]} castShadow>
        <boxGeometry args={[0.1, 0.05, 1]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      <mesh position={[-0.3, 0.1, 1.4]} castShadow>
        <boxGeometry args={[0.1, 0.05, 1]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      {[0.5, -0.5].map(z => [0.55, -0.55].map(x => (
        <mesh key={`${x}-${z}`} position={[x, 0.2, z]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      )))}
    </group>
  )
}

const RoomWall = ({ position, args, rotation = [0, 0, 0] as [number, number, number] }: any) => (
  <mesh position={position} rotation={rotation} castShadow receiveShadow>
    <boxGeometry args={args} />
    <meshStandardMaterial color="#f0ede9" />
  </mesh>
)

const WarehouseStructure = () => {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.05, 0]}>
        <planeGeometry args={[120, 100]} />
        <meshStandardMaterial color="#cbd5e1" roughness={1} />
      </mesh>
      <gridHelper args={[120, 120, '#94a3b8', '#e2e8f0']} position={[0, 0, 0]} />
      <RoomWall position={[0, 6, -50]} args={[120, 12, 1]} />
      <RoomWall position={[-60, 6, 0]} args={[100, 12, 1]} rotation={[0, Math.PI / 2, 0]} />
      <RoomWall position={[60, 6, 0]} args={[100, 12, 1]} rotation={[0, Math.PI / 2, 0]} />
      <RoomWall position={[35, 6, -15]} args={[50, 12, 1]} />
      <RoomWall position={[10, 6, -32]} args={[35, 12, 1]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  )
}

// --- Main Warehouse3D Component ---
interface Warehouse3DProps {
  inventory: SKUData[]
  layoutMode?: boolean
  onSelectItem?: (item: any) => void
  onOptimizeSlotting?: (layout: any) => void
}

export function Warehouse3D({ inventory, layoutMode = false, onSelectItem, onOptimizeSlotting }: Warehouse3DProps) {
  const [racks, setRacks] = useState<Array<{ id: string; position: [number,number,number]; skuId: string|null; zone: string }>>(() => {
    const initial: Array<{ id: string; position: [number,number,number]; skuId: string|null; zone: string }> = []
    const cols = ['A','B','C','D','E']
    const rows = 4
    cols.forEach((col, ci) => {
      for (let r = 0; r < rows; r++) {
        initial.push({
          id: `${col}-1-${r+1}`,
          position: [-30 + ci * 8, 0, -20 + r * 8],
          skuId: null,
          zone: 'A'
        })
      }
    })
    initial.push({ id: 'B-1', position: [31, 0, -35], skuId: null, zone: 'B' })
    initial.push({ id: 'B-2', position: [39, 0, -35], skuId: null, zone: 'B' })
    initial.push({ id: 'B-3', position: [31, 0, -29], skuId: null, zone: 'B' })
    initial.push({ id: 'B-4', position: [39, 0, -29], skuId: null, zone: 'B' })
    return initial
  })

  const [selectedRackId, setSelectedRackId] = useState<string | null>(null)
  const [aiInput, setAiInput] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [rackScale, setRackScale] = useState(1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const [showAbcPanel, setShowAbcPanel] = useState(false)
  const [abcResult, setAbcResult] = useState<{A: any[], B: any[], C: any[]} | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const appStore = useAppStore()

  const COMMAND_CATEGORIES = [
    { id: 'layout', label: 'Layout', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', commands: [
      { cmd: 'Move the first rack on the right', desc: 'Shift rightmost rack outward' },
      { cmd: 'Remove the racks on the left', desc: 'Delete leftmost aisle' },
      { cmd: 'Remove the last column', desc: 'Delete back row of racks' },
      { cmd: 'Remove the front column', desc: 'Delete front row of racks' },
      { cmd: 'Add 2 new racks to zone C', desc: 'Spawn racks in expansion zone' },
      { cmd: 'Add a full aisle of racks', desc: 'Spawn 4 new racks in a row' },
    ]},
    { id: 'slotting', label: 'Slotting AI', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', commands: [
      { cmd: 'Run ABC slotting analysis', desc: 'Classify SKUs by velocity & value' },
      { cmd: 'Apply ABC optimal layout', desc: 'Slot A items near dock, C items back' },
      { cmd: 'Show ABC classification', desc: 'Display A/B/C item breakdown' },
      { cmd: 'Slot high velocity items to front', desc: 'Move fast movers near inbound' },
      { cmd: 'Move slow movers to back racks', desc: 'Relocate C-class to rear racks' },
    ]},
    { id: 'inventory', label: 'Inventory', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', commands: [
      { cmd: 'Add 50 qty of Phone to A-1-1', desc: 'Inject units to specific rack' },
      { cmd: 'Add 100 qty of Laptop to B-1', desc: 'Stock laptop rack' },
      { cmd: 'Fill all racks to max capacity', desc: 'Maximize bin density' },
      { cmd: 'Clear rack A-1-1', desc: 'Remove all inventory from rack' },
      { cmd: 'Add more bins to all racks', desc: 'Increase bin capacity across fleet' },
    ]},
    { id: 'scale', label: 'Structure', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', commands: [
      { cmd: 'Increase the rack size by 30%', desc: 'Scale up all rack volumes' },
      { cmd: 'Decrease rack size by 20%', desc: 'Compact all racks' },
      { cmd: 'Double storage capacity', desc: 'Scale racks to 2x volume' },
      { cmd: 'Reset rack size to default', desc: 'Restore original scale' },
    ]},
    { id: 'analysis', label: 'Analysis', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', commands: [
      { cmd: 'Show utilization heatmap', desc: 'Color racks by fill level' },
      { cmd: 'Highlight overstocked racks', desc: 'Flag racks above 90% capacity' },
      { cmd: 'Find understocked racks', desc: 'Flag racks below 30% fill' },
      { cmd: 'Show stockout risk zones', desc: 'Highlight critical low-stock racks' },
    ]},
  ]

  const ALL_COMMANDS = COMMAND_CATEGORIES.flatMap(c => c.commands.map(d => ({ ...d, category: c.id })))
  const visibleCmds = activeCategory === 'all' ? ALL_COMMANDS : ALL_COMMANDS.filter(c => c.category === activeCategory)
  const filteredSuggestions = aiInput.length > 0 ? ALL_COMMANDS.filter(c => c.cmd.toLowerCase().includes(aiInput.toLowerCase())) : visibleCmds

  const skuByLocation = useMemo(() => {
    const map: Record<string, SKUData> = {}
    inventory.forEach(sku => {
      if ((sku as any).location) map[(sku as any).location] = sku
    })
    return map
  }, [inventory])

  const handleMoveRack = (id: string, newPos: [number, number, number]) => {
    setRacks(prev => prev.map(r => r.id === id ? { ...r, position: newPos } : r))
  }

  const handleAiCommand = (e: React.FormEvent | { preventDefault: () => void }) => {
    e.preventDefault()
    if (!aiInput.trim()) return
    const cmd = aiInput.toLowerCase()
    let response = "Command executed."

    if (cmd.includes('move') && cmd.includes('right')) {
      const maxX = Math.max(...racks.map(r => r.position[0]))
      const rightRacks = racks.filter(r => r.position[0] === maxX)
      if (rightRacks.length > 0) {
        const target = rightRacks[0]
        handleMoveRack(target.id, [target.position[0] + 15, target.position[1], target.position[2]])
        response = `Shifted rack ${target.id} further right.`
      }
    } else if (cmd.includes('remove') && cmd.includes('left')) {
      const minX = Math.min(...racks.map(r => r.position[0]))
      setRacks(prev => prev.filter(r => r.position[0] !== minX))
      response = "Removed leftmost aisle of racks."
    } else if (cmd.includes('remove') && cmd.includes('last') && cmd.includes('column')) {
      const maxZ = Math.max(...racks.map(r => r.position[2]))
      setRacks(prev => prev.filter(r => r.position[2] !== maxZ))
      response = "Removed back column of racks."
    } else if (cmd.includes('front') && cmd.includes('column')) {
      const minZ = Math.min(...racks.map(r => r.position[2]))
      setRacks(prev => prev.filter(r => r.position[2] !== minZ))
      response = "Removed front row of racks."
    } else if (cmd.includes('aisle') || (cmd.includes('add') && cmd.includes('full'))) {
      setRacks(prev => {
        const base = Date.now()
        return [...prev,
          { id: `AISLE-${base}-1`, position: [-10, 0, 22], skuId: null, zone: 'C' },
          { id: `AISLE-${base}-2`, position: [0, 0, 22], skuId: null, zone: 'C' },
          { id: `AISLE-${base}-3`, position: [10, 0, 22], skuId: null, zone: 'C' },
          { id: `AISLE-${base}-4`, position: [20, 0, 22], skuId: null, zone: 'C' },
        ]
      })
      response = "Deployed a full aisle of 4 racks in expansion zone."
    } else if (cmd.includes('add') && cmd.includes('rack')) {
      setRacks(prev => {
        const base = Date.now().toString().slice(-4)
        return [...prev,
          { id: `NEW-${base}-1`, position: [0, 0, 25], skuId: null, zone: 'C' },
          { id: `NEW-${base}-2`, position: [10, 0, 25], skuId: null, zone: 'C' }
        ]
      })
      response = "Deployed 2 additional racks in experimental zone."
    } else if (cmd.includes('reset') && cmd.includes('size')) {
      setRackScale(1)
      response = "Rack scale reset to default."
    } else if (cmd.includes('double') && cmd.includes('capacity')) {
      setRackScale(prev => prev * 2)
      response = "All rack storage volumes doubled."
    } else if (cmd.includes('decrease') && cmd.includes('size')) {
      setRackScale(prev => Math.max(0.5, prev * 0.8))
      response = "Decreased all rack volumes by 20%."
    } else if (cmd.includes('increase') && cmd.includes('size')) {
      setRackScale(prev => prev * 1.3)
      response = "Increased volume constraints for all structural racks by 30%."
    } else if (cmd.includes('abc') || cmd.includes('slotting') || cmd.includes('optimal layout') || cmd.includes('classification') || cmd.includes('velocity items') || cmd.includes('slow movers')) {
      runAbcAnalysis(cmd.includes('apply') || cmd.includes('optimal') || cmd.includes('velocity items') || cmd.includes('slow movers'))
      response = "ABC analysis launched. Check the panel →"
    } else if (cmd.includes('fill all') || (cmd.includes('max') && cmd.includes('capacity'))) {
      appStore.setInventory(inventory.map(sku => ({ ...sku, qtyOnHand: sku.qtyOnHand + 2000 })))
      response = "All racks filled to maximum capacity."
    } else if (cmd.includes('clear') && cmd.includes('rack')) {
      const targetRack = racks.find(r => cmd.includes(r.id.toLowerCase()))
      if (targetRack) {
        setRacks(prev => prev.map(r => r.id === targetRack.id ? { ...r, skuId: null } : r))
        response = `Rack ${targetRack.id} cleared.`
      } else {
        response = "Could not find specified rack to clear."
      }
    } else if (cmd.includes('add') && cmd.includes('bin')) {
      appStore.setInventory(inventory.map((sku, i) => i < 3 ? { ...sku, qtyOnHand: sku.qtyOnHand + 800 } : sku))
      response = "Maximized bin density by injecting inventory volumes."
    } else if (cmd.includes('add') && cmd.includes('to')) {
      const words = cmd.split(' ')
      const qtyIdx = words.findIndex(w => !isNaN(parseInt(w)))
      if (qtyIdx !== -1) {
        const qty = parseInt(words[qtyIdx])
        const sku = inventory.find(s => cmd.includes(s.name.toLowerCase()) || cmd.includes(s.id.toLowerCase()))
        const targetRack = racks.find(r => cmd.includes(r.id.toLowerCase()))
        if (sku && targetRack) {
          appStore.setInventory(inventory.map(s => s.id === sku.id ? { ...s, qtyOnHand: s.qtyOnHand + qty } : s))
          appStore.updateLocation(sku.id, targetRack.id)
          setRacks(prev => prev.map(r => r.id === targetRack.id ? { ...r, skuId: sku.id } : r))
          response = `Added ${qty} ${sku.name} to rack ${targetRack.id}.`
        } else if (sku) {
          appStore.setInventory(inventory.map(s => s.id === sku.id ? { ...s, qtyOnHand: s.qtyOnHand + qty } : s))
          response = `Added ${qty} ${sku.name} to general inventory.`
        } else {
          response = "Could not identify product or destination rack."
        }
      } else {
        response = "Could not parse numeric quantity from instructions."
      }
    } else {
      response = "Tip: Click the input to browse all available commands by category."
    }

    setAiResponse(response)
    setAiInput('')
    setShowSuggestions(true)
    setTimeout(() => setAiResponse(''), 5000)
  }

  // --- ABC ANALYSIS ENGINE ---
  const runAbcAnalysis = (applyLayout = false) => {
    if (inventory.length === 0) {
      setAiResponse("No inventory data found. Add products in Predictive Ops first.")
      setTimeout(() => setAiResponse(''), 4000)
      return
    }
    const scored = inventory.map(sku => ({
      ...sku,
      score: (sku.utilizationRateWeek || 0) * (sku.price || 1)
    })).sort((a, b) => b.score - a.score)

    const total = scored.length
    const aCount = Math.max(1, Math.ceil(total * 0.2))
    const bCount = Math.max(1, Math.ceil(total * 0.3))

    const A = scored.slice(0, aCount)
    const B = scored.slice(aCount, aCount + bCount)
    const C = scored.slice(aCount + bCount)

    setAbcResult({ A, B, C })
    setShowAbcPanel(true)

    if (applyLayout) applyAbcSlotting(A, B, C)
  }

  const applyAbcSlotting = (A: any[], B: any[], C: any[]) => {
    const sorted = [...racks].sort((a, b) => b.position[2] - a.position[2])
    const allSkus = [...A, ...B, ...C]
    const updated = sorted.map((rack, idx) => ({
      ...rack,
      skuId: allSkus[idx]?.id || null,
      zone: idx < A.length ? 'A' : idx < A.length + B.length ? 'B' : 'C'
    }))
    updated.forEach(rack => {
      if (rack.skuId) appStore.updateLocation(rack.skuId, rack.id)
    })
    setRacks(updated)
    setAiResponse(`ABC slotting applied: ${A.length} A-items front, ${B.length} B-items mid, ${C.length} C-items rear.`)
    setTimeout(() => setAiResponse(''), 6000)
  }

  React.useEffect(() => {
    if (!layoutMode) setSelectedRackId(null)
  }, [layoutMode])

  return (
    <div className="w-full h-full min-h-[750px] bg-transparent overflow-hidden relative">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[70, 70, 70]} fov={25} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={20}
          maxDistance={200}
        />

        <Suspense fallback={null}>
          <group>
            <Environment preset="city" />
            <ambientLight intensity={0.8} />
            <directionalLight 
              position={[50, 100, 50]} 
              intensity={1} 
              castShadow 
              shadow-mapSize={[2048, 2048]} 
            />
            
            <group position={[0, 0, 0]}>
              <WarehouseStructure />
              
              {racks.map(rack => {
                const sku = skuByLocation[rack.id] || null
                const util = sku ? Math.min(100, (sku.qtyOnHand / 1000) * 100) : 60
                
                return (
                  <DetailedRack 
                    key={rack.id}
                    id={rack.id}
                    position={rack.position} 
                    utilization={util}
                    sku={sku}
                    onClick={onSelectItem}
                    onMove={handleMoveRack}
                    editable={layoutMode}
                    selected={selectedRackId === rack.id}
                    rackScale={rackScale}
                  />
                )
              })}

              <ForkliftModel position={[0, 0, 5]} rotation={-Math.PI / 4} />
              <ForkliftModel position={[40, 0, 40]} rotation={Math.PI} />
              <ForkliftModel position={[48, 0, 38]} rotation={Math.PI} />
              
              <group position={[35, 0, 10]}>
                <BoxModel position={[0, 0.3, 0]} />
                <BoxModel position={[1, 0.3, 0]} />
                <BoxModel position={[0.5, 0.9, 0]} />
              </group>
            </group>

            <ContactShadows 
              position={[0, 0.01, 0]} 
              opacity={0.4} 
              scale={150} 
              blur={2.5} 
              far={10} 
              resolution={1024} 
            />

            <EffectComposer>
              <N8AO
                intensity={1}
                aoRadius={5}
                distanceFalloff={1}
                quality="high"
                screenSpaceRadius
              />
            </EffectComposer>
          </group>
        </Suspense>

        {layoutMode && (
          <mesh visible={false} onClick={() => setSelectedRackId(null)}>
            <planeGeometry args={[1000, 1000]} />
          </mesh>
        )}
      </Canvas>
      
      {/* ABC Buttons (always visible, not just in layout mode) */}
      <div className="absolute top-8 right-8 flex flex-col gap-3 pointer-events-auto">
        <button onClick={() => runAbcAnalysis()} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-2xl shadow-xl font-bold flex items-center gap-2 transition-all text-xs">
          <Zap size={16} /> ABC Analysis
        </button>
        {layoutMode && (
          <button onClick={() => runAbcAnalysis(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl shadow-xl font-bold flex items-center gap-2 transition-all text-xs">
            <Sparkles size={16} /> Apply Optimal Slotting
          </button>
        )}
      </div>

      {/* ABC ANALYSIS PANEL */}
      <AnimatePresence>
        {showAbcPanel && abcResult && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="absolute top-8 right-8 w-80 bg-[#0a0f1e]/97 border border-slate-700 rounded-3xl shadow-2xl backdrop-blur-xl z-30 overflow-hidden pointer-events-auto"
          >
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Supply Chain AI</div>
                <div className="text-sm font-black text-white">ABC Slotting Analysis</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => applyAbcSlotting(abcResult.A, abcResult.B, abcResult.C)} className="text-[9px] font-black bg-emerald-500 text-black px-3 py-1.5 rounded-xl uppercase tracking-widest hover:bg-emerald-400 transition-colors">Apply</button>
                <button onClick={() => setShowAbcPanel(false)} className="w-7 h-7 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-xs">✕</button>
              </div>
            </div>
            <div className="p-4 max-h-[65vh] overflow-y-auto space-y-4">
              {(['A','B','C'] as const).map(cls => {
                const items = abcResult[cls]
                const styles = {
                  A: { badge:'bg-amber-500 text-black', text:'text-amber-400', row:'bg-amber-500/5 border-amber-500/10', loc:'Front Dock — Pick First', desc:'Top 20% velocity × value' },
                  B: { badge:'bg-blue-500 text-white', text:'text-blue-400', row:'bg-blue-500/5 border-blue-500/10', loc:'Middle Aisles', desc:'Next 30% — moderate priority' },
                  C: { badge:'bg-slate-600 text-white', text:'text-slate-400', row:'bg-slate-800/50 border-slate-700', loc:'Rear Storage', desc:'Bottom 50% — slow movers' },
                }[cls]
                return (
                  <div key={cls}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${styles.badge}`}>{cls}</div>
                      <div>
                        <div className={`text-xs font-black ${styles.text}`}>Class {cls} — {styles.loc}</div>
                        <div className="text-[9px] text-slate-500">{styles.desc}</div>
                      </div>
                    </div>
                    {items.length === 0 && <div className="text-[9px] text-slate-600 text-center py-2">No items</div>}
                    {items.map((sku: any) => (
                      <div key={sku.id} className={`flex items-center justify-between border rounded-xl px-3 py-2 mb-1 ${styles.row}`}>
                        <div>
                          <div className="text-[10px] font-black text-white uppercase">{sku.name}</div>
                          <div className="text-[9px] text-slate-500">{sku.utilizationRateWeek}/wk · ${(sku.price||0).toLocaleString()}</div>
                        </div>
                        <div className={`text-[9px] font-black ${styles.text}`}>{sku.qtyOnHand} u</div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI COMMAND INTERFACE */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 pointer-events-auto">
        <AnimatePresence>
          {aiResponse && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl backdrop-blur-md shadow-xl whitespace-nowrap"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} /> {aiResponse}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-cyan-500 rounded-[20px] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          
          <form onSubmit={handleAiCommand} className="relative bg-[var(--bg-1)]/80 backdrop-blur-2xl border border-[var(--border)] rounded-[20px] p-2 flex items-center shadow-2xl z-20">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)] ml-2 shrink-0">
              <Bot size={20} />
            </div>
            <input 
              className="flex-1 bg-transparent border-none text-sm font-bold text-[var(--text-primary)] px-4 focus:ring-0 placeholder:text-[var(--text-muted)]"
              placeholder="Command spatial AI — click to browse all commands by category"
              value={aiInput}
              onChange={(e) => {
                setAiInput(e.target.value)
                setShowSuggestions(true)
                setActiveSuggestionIndex(0)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setActiveSuggestionIndex(p => Math.min(p + 1, filteredSuggestions.length - 1))
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setActiveSuggestionIndex(p => Math.max(p - 1, 0))
                } else if (e.key === 'Tab' && showSuggestions && filteredSuggestions[activeSuggestionIndex]) {
                  e.preventDefault()
                  setAiInput(filteredSuggestions[activeSuggestionIndex].cmd)
                }
              }}
            />
            <button 
              type="submit"
              className="w-10 h-10 rounded-xl bg-[var(--brand)] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shrink-0 mr-1 shadow-md shadow-indigo-500/20"
            >
              <Sparkles size={18} />
            </button>
          </form>

          <AnimatePresence>
            {showSuggestions && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 w-full mb-4 bg-[#0a0f1e]/97 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] z-10"
              >
                {/* Category Tabs */}
                <div className="flex items-center gap-1 p-3 border-b border-slate-800/60 overflow-x-auto">
                  <button onClick={() => setActiveCategory('all')} className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === 'all' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>All ({ALL_COMMANDS.length})</button>
                  {COMMAND_CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat.id ? `${cat.bg} ${cat.color} border ${cat.border}` : 'text-slate-500 hover:text-slate-300'}`}>{cat.label}</button>
                  ))}
                </div>
                {/* Commands List */}
                <div className="max-h-64 overflow-y-auto p-2">
                  {filteredSuggestions.length === 0 && <div className="text-[9px] text-slate-600 text-center py-6 uppercase tracking-widest">No matching commands</div>}
                  {filteredSuggestions.map((item, idx) => {
                    const cat = COMMAND_CATEGORIES.find(c => c.id === item.category)
                    return (
                      <div
                        key={item.cmd}
                        onClick={() => { setAiInput(item.cmd); setShowSuggestions(false); setTimeout(() => { const e = { preventDefault: () => {} }; handleAiCommand(e as any) }, 50) }}
                        onMouseEnter={() => setActiveSuggestionIndex(idx)}
                        className={`px-4 py-3 rounded-2xl cursor-pointer flex items-start gap-3 transition-all ${idx === activeSuggestionIndex ? 'bg-white/5' : 'hover:bg-white/[0.03]'}`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center text-[8px] font-black shrink-0 ${cat?.bg||'bg-slate-800'} ${cat?.color||'text-slate-400'}`}>{(item.category[0]||'?').toUpperCase()}</div>
                        <div>
                          <div className={`text-xs font-bold ${idx === activeSuggestionIndex ? 'text-white' : 'text-slate-300'}`}>{item.cmd}</div>
                          <div className="text-[9px] text-slate-600 mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {/* Footer hint */}
                <div className="px-4 py-3 border-t border-slate-800/60 flex items-center justify-between">
                  <div className="text-[9px] text-slate-600 uppercase tracking-widest">Tip: Try &quot;Run ABC slotting analysis&quot;</div>
                  <button onClick={() => { runAbcAnalysis(); setShowSuggestions(false) }} className="text-[9px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest">Run ABC →</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
