'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Search, Box, Truck, BarChart3, TrendingUp, ShieldCheck,
  CheckCircle2, Ship, Plane, Zap, Activity, Globe, Database,
  AlertCircle, Timer, Package, Cpu, BarChart2, Lock, Users, RefreshCw
} from 'lucide-react'
import Navbar from '@/components/Navbar'

// ============================================================
// NAV
// ============================================================


// ============================================================
// SIMULATION COMPONENTS — Each is visually unique
// ============================================================

// 1. PROCUREMENT — Live supplier matrix with scoring nodes
const ProcurementSim = () => {
  const [active, setActive] = useState(0)
  const suppliers = [
    { name: 'Apex Global Ltd', country: 'CN', score: 98, price: 4200, risk: 'Low', delivery: 14, status: 'SELECTED' },
    { name: 'Vantage Mfg Co', country: 'VN', score: 94, price: 4850, risk: 'Low', delivery: 18, status: 'BIDDING' },
    { name: 'Solterra Inc', country: 'IN', score: 91, price: 5100, risk: 'Med', delivery: 21, status: 'BIDDING' },
    { name: 'Nordex Supply', country: 'DE', score: 99, price: 6400, risk: 'Low', delivery: 10, status: 'PREMIUM' },
  ]
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % suppliers.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="w-full h-full bg-[#f8fafc] flex flex-col p-6 gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Cpu size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Neural Match Engine</span>
        </div>
        <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          Scanning 180 markets
        </motion.div>
      </div>

      {/* Score ring + detail */}
      <div className="flex gap-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <motion.circle cx="40" cy="40" r="34" fill="none" stroke="#10b981" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 34}`}
              animate={{ strokeDashoffset: [2 * Math.PI * 34, 2 * Math.PI * 34 * (1 - suppliers[active].score / 100)] }}
              transition={{ duration: 0.8 }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-black text-emerald-600">{suppliers[active].score}</span>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-1">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3 }}>
              <div className="text-xs font-black uppercase text-slate-900">{suppliers[active].name}</div>
              <div className="text-[10px] text-slate-400 font-semibold">{suppliers[active].country} · ${suppliers[active].price.toLocaleString()} · {suppliers[active].delivery}d</div>
              <div className={`text-[9px] font-black mt-1 uppercase tracking-widest ${suppliers[active].status === 'SELECTED' ? 'text-emerald-500' : suppliers[active].status === 'PREMIUM' ? 'text-amber-500' : 'text-slate-400'}`}>
                ● {suppliers[active].status}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Supplier list */}
      <div className="flex flex-col gap-2 flex-1">
        {suppliers.map((s, i) => (
          <motion.div key={s.name} animate={{ backgroundColor: i === active ? '#f0fdf4' : '#ffffff', borderColor: i === active ? '#86efac' : '#e2e8f0' }}
            className="flex items-center gap-3 p-3 rounded-xl border transition-colors">
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-[9px] font-black text-slate-600 flex items-center justify-center shrink-0">{s.country}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black uppercase text-slate-700 truncate">{s.name}</div>
              <div className="h-1 bg-slate-100 rounded-full mt-1">
                <motion.div className={`h-full rounded-full ${i === active ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  animate={{ width: `${s.score}%` }} transition={{ duration: 0.8 }} />
              </div>
            </div>
            <span className={`text-[10px] font-black shrink-0 ${i === active ? 'text-emerald-600' : 'text-slate-400'}`}>${s.price.toLocaleString()}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// 2. LOCALIZATION — Live floor map with pick-path routing (LIGHT)
const LocalizationSim = () => {
  const [step, setStep] = useState(0)
  const grid = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    col: i % 8, row: Math.floor(i / 8),
    fill: Math.random() > 0.65 ? (Math.random() > 0.5 ? 'high' : 'medium') : Math.random() > 0.4 ? 'low' : 'empty'
  }))
  const route = [[0,2],[0,5],[2,5],[2,1],[4,1],[4,6],[5,6]]
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % route.length), 900)
    return () => clearInterval(t)
  }, [])
  const [ar, ac] = route[step]

  return (
    <div className="w-full h-full bg-white flex flex-col p-5 gap-3 overflow-hidden border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Live Pick Routing · Zone A</span>
        </div>
        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">Bay 3 Active</span>
      </div>

      <div className="flex-1 grid gap-1 bg-slate-50 rounded-2xl p-3 border border-slate-100" style={{ gridTemplateRows: 'repeat(6, 1fr)', gridTemplateColumns: 'repeat(8, 1fr)' }}>
        {grid.map(cell => {
          const isActive = cell.row === ar && cell.col === ac
          const isRoute = route.some(([r,c]) => r === cell.row && c === cell.col)
          return (
            <motion.div key={cell.id}
              animate={isActive ? { scale: [1, 1.3, 1], backgroundColor: ['#10b981','#34d399','#10b981'] } : {}}
              transition={{ duration: 0.5 }}
              className={`rounded-sm ${
                isActive ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' :
                isRoute ? 'bg-emerald-200' :
                cell.fill === 'high' ? 'bg-indigo-200' :
                cell.fill === 'medium' ? 'bg-slate-200' :
                cell.fill === 'low' ? 'bg-slate-100' : 'bg-white border border-slate-100'
              }`}
            />
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[{ v: '847', l: 'SKUs Located' }, { v: '98.1%', l: 'Accuracy' }, { v: '2.3m', l: 'Route Dist' }].map(s => (
          <div key={s.l} className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
            <div className="text-sm font-black text-emerald-600">{s.v}</div>
            <div className="text-[7px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 3. TELEMETRY — Light-theme global route tracker
const TelemetrySim = () => {
  const vessels = [
    { id: 'MSC-4421', type: 'ship', startX: 8, startY: 60, endX: 78, endY: 25, color: '#6366f1', duration: 22 },
    { id: 'DHL-787', type: 'plane', startX: 5, startY: 15, endX: 92, endY: 68, color: '#10b981', duration: 11 },
    { id: 'EVER-88', type: 'ship', startX: 88, startY: 50, endX: 12, endY: 72, color: '#8b5cf6', duration: 28 },
    { id: 'QF-302', type: 'plane', startX: 60, startY: 8, endX: 38, endY: 85, color: '#f59e0b', duration: 9 },
  ]
  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-100">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 flex items-center gap-2">
          <Globe size={12} className="text-indigo-500" /> Global Freight Tracker
        </span>
        <div className="flex gap-4">
          {[{ l: 'Sea', c: 'bg-indigo-400' }, { l: 'Air', c: 'bg-emerald-400' }, { l: 'Alert', c: 'bg-red-400' }].map(t => (
            <div key={t.l} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${t.c}`} />
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{t.l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 relative mx-4 my-3 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
        {/* Light grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(100,116,139,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,0.07)_1px,transparent_1px)] bg-[size:20px_20px]" />
        {[25, 50, 75].map(y => <div key={y} className="absolute left-0 right-0 h-px bg-slate-200" style={{ top: `${y}%` }} />)}
        {[25, 50, 75].map(x => <div key={x} className="absolute top-0 bottom-0 w-px bg-slate-200" style={{ left: `${x}%` }} />)}

        {/* Route lines (static SVG) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {vessels.map(v => (
            <line key={v.id} x1={`${v.startX}`} y1={`${v.startY}`} x2={`${v.endX}`} y2={`${v.endY}`}
              stroke={v.color} strokeWidth="0.3" strokeDasharray="2 2" strokeOpacity="0.4" />
          ))}
        </svg>

        {/* Vessels */}
        {vessels.map(v => (
          <motion.div key={v.id}
            animate={{ left: [`${v.startX}%`, `${v.endX}%`], top: [`${v.startY}%`, `${v.endY}%`] }}
            transition={{ duration: v.duration, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
            className="absolute z-10" style={{ transform: 'translate(-50%,-50%)' }}
          >
            <motion.div animate={{ scale: [1, 2.8], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border" style={{ borderColor: v.color }} />
            <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${v.color}18`, border: `1.5px solid ${v.color}` }}>
              {v.type === 'ship' ? <Ship size={9} style={{ color: v.color }} /> : <Plane size={9} style={{ color: v.color }} />}
            </div>
          </motion.div>
        ))}

        {/* Port dots */}
        {[[20,45],[55,28],[74,62],[34,80],[60,50]].map(([x,y],i) => (
          <div key={i} className="absolute w-2.5 h-2.5 rounded-full bg-white border-2 border-slate-400 shadow-sm" style={{ left:`${x}%`,top:`${y}%`,transform:'translate(-50%,-50%)' }} />
        ))}
      </div>

      <div className="px-4 pb-4 grid grid-cols-2 gap-2">
        {vessels.map(v => (
          <div key={v.id} className="flex items-center gap-2 bg-slate-50 rounded-xl p-2 border border-slate-100">
            <div className="w-2 h-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: v.color }} />
            <div>
              <div className="text-[9px] font-black uppercase text-slate-700">{v.id}</div>
              <div className="text-[7px] text-slate-400 uppercase tracking-widest font-bold">{v.type === 'ship' ? 'Ocean' : 'Air'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 4. RECONCILIATION — Light-theme 3-way auto-matching
const ReconciliationSim = () => {
  const [matched, setMatched] = useState<number[]>([])
  const docs = [
    { po: 'PO-9021', gr: 'GR-9021', inv: 'INV-8843', amount: '$42,500', status: 'match' },
    { po: 'PO-8714', gr: 'GR-8714', inv: 'INV-7001', amount: '$18,200', status: 'flag' },
    { po: 'PO-7654', gr: 'GR-7654', inv: 'INV-7654', amount: '$9,300', status: 'match' },
    { po: 'PO-6611', gr: 'GR-6611', inv: 'INV-6609', amount: '$31,800', status: 'flag' },
  ]
  useEffect(() => {
    docs.forEach((_, i) => { setTimeout(() => setMatched(m => [...m, i]), i * 900 + 500) })
    const reset = setInterval(() => {
      setMatched([])
      docs.forEach((_, i) => { setTimeout(() => setMatched(m => [...m, i]), i * 900 + 500) })
    }, 9000)
    return () => clearInterval(reset)
  }, [])

  return (
    <div className="w-full h-full bg-white flex flex-col p-5 gap-3 overflow-hidden">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
          <RefreshCw size={11} className="text-emerald-500 animate-spin" /> Auto-Match Engine
        </span>
        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">{matched.length}/{docs.length} matched</span>
      </div>

      <div className="grid grid-cols-3 gap-2 px-1">
        {['Purchase Order', 'Goods Receipt', 'Invoice'].map(h => (
          <div key={h} className="text-[8px] font-black uppercase tracking-widest text-slate-400 text-center">{h}</div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 flex-1">
        {docs.map((d, i) => {
          const isMatched = matched.includes(i)
          return (
            <motion.div key={d.po} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
              className="grid grid-cols-3 gap-2 items-center">
              {[d.po, d.gr, d.inv].map((id, j) => (
                <motion.div key={id}
                  animate={isMatched
                    ? { backgroundColor: d.status === 'match' ? '#f0fdf4' : '#fef2f2', borderColor: d.status === 'match' ? '#86efac' : '#fca5a5' }
                    : { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                  transition={{ duration: 0.4, delay: j * 0.08 }}
                  className="px-2 py-2 rounded-xl border text-center">
                  <div className="text-[9px] font-black font-mono" style={{ color: isMatched ? (d.status === 'match' ? '#16a34a' : '#dc2626') : '#64748b' }}>{id}</div>
                </motion.div>
              ))}
            </motion.div>
          )
        })}
      </div>

      <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex justify-between items-center mt-auto">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Total Reconciled</span>
        <span className="text-sm font-black text-emerald-600">$101,800</span>
      </div>
    </div>
  )
}

// 5. PREDICTIVE OPS — Cinematic 4-stage AI prediction video
const PredictiveSim = () => {
  const [step, setStep] = useState(0)
  const [text, setText] = useState('')
  const [progress, setProgress] = useState(0)
  const fullText = 'SKU-7741 · Industrial Bearings Q3'

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (step === 0) {
      let i = 0; setText('')
      const t = setInterval(() => {
        if (i < fullText.length) { setText(prev => prev + fullText[i]); i++ }
        else { clearInterval(t); timeout = setTimeout(() => setStep(1), 700) }
      }, 40)
      return () => clearInterval(t)
    }
    if (step === 1) {
      setProgress(0)
      const t = setInterval(() => setProgress(p => { if (p >= 100) { clearInterval(t); timeout = setTimeout(() => setStep(2), 400); return 100 } return p + 2 }), 30)
      return () => clearInterval(t)
    }
    if (step === 2) { timeout = setTimeout(() => setStep(3), 3800) }
    if (step === 3) { timeout = setTimeout(() => { setStep(0); setText('') }, 3500) }
    return () => clearTimeout(timeout)
  }, [step])

  const signals = [
    { label: 'Q3 Industrial PMI', value: '+8.4%', color: 'emerald' },
    { label: 'Automotive Orders', value: '+12.1%', color: 'emerald' },
    { label: 'Asia Factory Output', value: '-3.2%', color: 'red' },
    { label: 'Logistics Lead Time', value: '+6d', color: 'amber' },
  ]
  const curve = [28, 34, 30, 38, 42, 40, 48, 52, 58, 62, 74, 88]

  return (
    <div className="w-full h-full flex flex-col pt-6 font-sans bg-white">
      <div className="px-6 mb-5">
        <div className={`w-full bg-white border ${step >= 1 ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'border-slate-200'} p-4 rounded-xl flex items-center gap-3 transition-all duration-300`}>
          {step === 1 ? <Cpu size={16} className="text-emerald-500 animate-pulse shrink-0" /> : <TrendingUp size={16} className={step >= 2 ? 'text-emerald-500' : 'text-slate-400'} />}
          <span className="text-[13px] font-bold text-slate-700 tracking-wide flex-1">
            {text}
            {step === 0 && <motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 0.8 }}>|</motion.span>}
          </span>
          {step >= 1 && <span className="text-[10px] uppercase font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded shrink-0">Prediction Mode</span>}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="scanning" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 px-6 flex flex-col justify-center gap-4">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Scanning 12M+ Trade Signals</div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['PMI Indices', 'Order Books', 'Weather Data', 'Port Logs'].map((s, i) => (
                <motion.div key={s} animate={{ opacity: progress > i * 25 ? 1 : 0.25 }}
                  className="flex items-center gap-2 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <div className={`w-1.5 h-1.5 rounded-full ${progress > i * 25 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-600">{s}</span>
                  {progress > i * 25 + 20 && <span className="ml-auto text-[8px] font-black text-emerald-600">✓</span>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="spike" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 px-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div animate={{ scale: [1,1.4,1] }} transition={{ duration: 0.7, repeat: Infinity }} className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Demand Spike Detected</span>
              </div>
              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">+43% forecast</span>
            </div>
            <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 p-3 relative overflow-hidden min-h-[120px]">
              <svg className="w-full h-full" viewBox="0 0 120 60" preserveAspectRatio="none">
                {[15,30,45].map(y => <line key={y} x1="0" y1={y} x2="120" y2={y} stroke="#e2e8f0" strokeWidth="0.5" />)}
                <polyline points={curve.slice(0,8).map((v,i) => `${i*10+5},${60-v}`).join(' ')} fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <motion.polyline points={curve.slice(7).map((v,i) => `${(i+7)*10+5},${60-v}`).join(' ')} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" initial={{ strokeDashoffset: 200 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1.5, ease: 'easeOut' }} />
                <motion.circle cx="115" cy={60-88} r="3" fill="#10b981" initial={{ scale: 0 }} animate={{ scale: [0,1.5,1] }} transition={{ delay: 1.4, duration: 0.4 }} />
              </svg>
              <div className="absolute bottom-2 left-3 text-[7px] font-bold text-slate-400 uppercase tracking-widest">Historical ── Forecast ╌╌</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {signals.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-sm">
                  <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider truncate">{s.label}</div>
                  <div className={`text-[11px] font-black mt-0.5 ${s.color === 'emerald' ? 'text-emerald-600' : s.color === 'red' ? 'text-red-500' : 'text-amber-600'}`}>{s.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="po" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 px-6 flex flex-col justify-center gap-4">
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-400 shadow-lg relative overflow-hidden">
              <motion.div animate={{ x: ['-100%','100%'] }} transition={{ duration: 1.8, repeat: Infinity, ease:'linear' }} className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent" />
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 relative z-10">
                <Zap size={18} className="text-white fill-white" />
              </div>
              <div className="relative z-10 flex-1">
                <div className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">Auto-Replenishment Triggered</div>
                <div className="text-[9px] text-emerald-600 font-bold mt-0.5">PO-7921 · 8,000 units · Apex Global Ltd</div>
              </div>
              <div className="ml-auto relative z-10 text-right shrink-0">
                <div className="text-lg font-black text-emerald-700">$336K</div>
                <div className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">Executing</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[{v:'43%',l:'Demand Uplift'},{v:'6wk',l:'Lead Time'},{v:'94%',l:'Confidence'}].map(s => (
                <div key={s.l} className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                  <div className="text-base font-black text-slate-900">{s.v}</div>
                  <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">Supplier notified · ERP updated · Budget logged</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}



// 6. GOVERNANCE — Clean light vendor scorecard
const GovernanceSim = () => {
  const vendors = [
    { name: 'Apex Global', score: 97, trend: '+2', risk: 'low' as const, modules: ['QA', 'ESG', 'FIN', 'ISO'] },
    { name: 'Vantage Mfg', score: 81, trend: '-5', risk: 'medium' as const, modules: ['QA', 'FIN'] },
    { name: 'Solterra Inc', score: 62, trend: '+1', risk: 'high' as const, modules: ['QA'] },
    { name: 'Nord Freight', score: 94, trend: '+3', risk: 'low' as const, modules: ['QA', 'ESG', 'ISO'] },
  ]
  const rc = {
    low: { bar:'bg-emerald-500', text:'text-emerald-600', badge:'bg-emerald-100 text-emerald-700 border-emerald-200' },
    medium: { bar:'bg-amber-400', text:'text-amber-600', badge:'bg-amber-100 text-amber-700 border-amber-200' },
    high: { bar:'bg-red-400', text:'text-red-600', badge:'bg-red-100 text-red-700 border-red-200' }
  }

  return (
    <div className="w-full h-full bg-white flex flex-col p-5 gap-3 overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
          <Lock size={11} className="text-emerald-500" /> Supplier Scorecard · Live
        </span>
        <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">Q2 Audit</span>
      </div>

      {vendors.map((v, i) => {
        const c = rc[v.risk]
        return (
          <motion.div key={v.name} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.12 }}
            className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 text-[9px] font-black text-slate-700 flex items-center justify-center shadow-sm">{v.name[0]}</div>
                <span className="text-[11px] font-black text-slate-800">{v.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black ${v.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>{v.trend}</span>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${c.badge}`}>{v.risk.toUpperCase()}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                <motion.div className={`h-full rounded-full ${c.bar}`} initial={{ width:0 }} animate={{ width:`${v.score}%` }} transition={{ duration:0.9, delay:i*0.15 }} />
              </div>
              <span className={`text-[11px] font-black shrink-0 w-7 text-right ${c.text}`}>{v.score}</span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {['QA','ESG','FIN','ISO'].map(tag => (
                <span key={tag} className={`text-[7px] font-black px-1.5 py-0.5 rounded-full ${
                  v.modules.includes(tag) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-300'
                }`}>{tag}</span>
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ============================================================
// FEATURES DATA
// ============================================================
const FEATURES = [
  {
    id: 'procurement',
    icon: Search,
    label: 'Procurement',
    headline: 'Stop Chasing\nSuppliers',
    tagline: 'The AI finds the best vendor before your team finishes their coffee',
    description: "Your procurement team spends 3 days per sourcing cycle doing what Zo-flow does in 2 milliseconds. Our neural engine scans 180+ markets, scores every supplier on price, quality, and risk, and hands you the answer. You close the deal.",
    stats: [{ v: '180+', l: 'Live Markets' }, { v: '<2ms', l: 'Match Speed' }, { v: '31%', l: 'Cost Saved' }],
    bullets: ['Live supplier scoring updates every 60 seconds — no stale data.', 'Auto-generated RFQs sent to shortlisted vendors before you ask.', 'One-click PO issuance directly into your ERP stack.'],
    sim: ProcurementSim,
    accent: 'emerald'
  },
  {
    id: 'localization',
    icon: Box,
    label: 'Localization',
    headline: 'No More\nBlind Spots',
    tagline: 'Every pallet, every bin, every bay — tracked live',
    description: "If your warehouse team is still using clipboards or last-night's data, you're flying blind. Zo-flow gives you a live digital twin — bin-level inventory, AI-routed pick paths, and congestion heatmaps that update every 100ms.",
    stats: [{ v: '100%', l: 'Bin Coverage' }, { v: '40%', l: 'Faster Picks' }, { v: '100ms', l: 'Refresh Rate' }],
    bullets: ['Bin-level inventory accuracy updated in real-time, not batches.', 'AI pick-routing recalculates with every new order — zero manual planning.', 'Congestion detected and reslotting suggested before throughput drops.'],
    sim: LocalizationSim,
    accent: 'indigo'
  },
  {
    id: 'telemetry',
    icon: Truck,
    label: 'Telemetry HUD',
    headline: 'Know Before\nProblems Hit',
    tagline: 'Live freight intelligence from 200+ carriers in a single view',
    description: "Waiting for a carrier update email is not a tracking strategy. Zo-flow fuses live vessel AIS data, airline APIs, weather feeds, and port congestion reports into one predictive dashboard that tells you what's happening and what's about to.",
    stats: [{ v: '200+', l: 'Carriers' }, { v: 'Real-time', l: 'ETA Updates' }, { v: '98%', l: 'Visibility Rate' }],
    bullets: ['Live vessel and aircraft position on a unified global map.', 'Disruption alerts with automated alternate routing suggestions.', 'Container-level drill-down including customs pre-clearance status.'],
    sim: TelemetrySim,
    accent: 'indigo'
  },
  {
    id: 'reconciliation',
    icon: BarChart3,
    label: 'Reconciliation',
    headline: 'The Books\nClose Themselves',
    tagline: 'PO, receipt, invoice — matched in milliseconds, not weeks',
    description: "Your finance team shouldn't be spending days cross-referencing documents that an algorithm can reconcile in under a second. Zo-flow's Neural Ledger auto-matches every PO, GR, and invoice, flags discrepancies instantly, and builds a complete audit trail without anyone touching a spreadsheet.",
    stats: [{ v: '0.00%', l: 'Error Rate' }, { v: '$2M+', l: 'Recovered YoY' }, { v: '3-Way', l: 'Auto Match' }],
    bullets: ['PO, goods receipt, and invoice matched automatically at transaction speed.', 'Live exception alerts with root cause analysis built in.', 'Full cross-border tariff classification and FX adjustment on every line.'],
    sim: ReconciliationSim,
    accent: 'emerald'
  },
  {
    id: 'predictive',
    icon: TrendingUp,
    label: 'Predictive Ops',
    headline: 'See 90 Days\nAhead',
    tagline: 'Act on what\'s coming — not what already happened',
    description: "Your competitors are reacting. You should be anticipating. Zo-flow models demand spikes, supplier health, and factory capacity 90 days out — trained on over 12 million trade events. Your team gets clear signals before the market moves, not after.",
    stats: [{ v: '90-Day', l: 'Forward View' }, { v: '94%', l: 'Forecast Yield' }, { v: '-35%', l: 'Stockout Rate' }],
    bullets: ['Demand sensing that reads sales velocity, seasonality, and external signals.', 'Supplier health scores that flag failures 6 weeks before they cascade.', 'Auto-replenishment triggers with configurable spend guardrails.'],
    sim: PredictiveSim,
    accent: 'emerald'
  },
  {
    id: 'governance',
    icon: ShieldCheck,
    label: 'Governance',
    headline: 'Trust No One\nBlindly',
    tagline: 'Objective, real-time supplier scores across every vendor you rely on',
    description: "You can\'t manage what you don't measure — and manual vendor reviews are both too slow and too prone to bias. Zo-flow runs continuous, automated scorecards on every supplier: quality rates, compliance docs, ESG criteria, and financial health, all scored without human intervention.",
    stats: [{ v: '500+', l: 'Vendors Scored' }, { v: '9 KPIs', l: 'Per Vendor' }, { v: 'ISO 9001', l: 'Aligned' }],
    bullets: ['Continuous compliance scoring against QA, ESG, FIN, and ISO standards.', 'Auto-alerts on expiring certifications before audits catch you out.', 'Risk-tiered vendor ranking that automatically triggers review workflows.'],
    sim: GovernanceSim,
    accent: 'emerald'
  }
]

// ============================================================
// PAGE
// ============================================================
export default function FeaturesPage() {
  const [activeId, setActiveId] = useState('procurement')
  const active = FEATURES.find(f => f.id === activeId)!

  return (
    <div className="bg-[#fdfdfd] text-slate-950 font-sans selection:bg-emerald-500 selection:text-white min-h-screen">
      <Navbar />

      {/* HERO STRIP */}
      <section className="pt-40 pb-20 px-6 lg:px-16 xl:px-24 border-b border-slate-100 bg-white">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-end justify-between gap-8">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-emerald-500 text-[11px] font-black uppercase tracking-[1em] mb-6">
              Capability Ecosystem
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.2 }}
              className="text-[clamp(3rem,7vw,7rem)] font-black tracking-tighter leading-[0.88] uppercase italic">
              Move Fast.<br />Miss Nothing.
            </motion.h1>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-lg lg:text-xl text-slate-400 font-medium max-w-md leading-relaxed lg:text-right">
            Every bottleneck solved — from source to dock, in a single intelligent command layer.
          </motion.p>
        </div>
      </section>

      {/* MAIN DEMO INTERFACE */}
      <section className="px-6 lg:px-16 xl:px-24 py-12 max-w-[1400px] mx-auto">
        <div className="flex gap-6 items-start">

          {/* LEFT: Feature selector sidebar */}
          <aside className="hidden lg:flex flex-col gap-2 w-64 xl:w-72 shrink-0 sticky top-32 self-start">
            {FEATURES.map(f => {
              const isActive = f.id === activeId
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveId(f.id)}
                  className={`group flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 ${isActive
                    ? 'bg-slate-950 border-slate-950 shadow-2xl'
                    : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md'
                    }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-emerald-500'}`}>
                    <f.icon size={16} />
                  </div>
                  <div>
                    <div className={`text-[11px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-600'}`}>{f.label}</div>
                    {isActive && <div className="text-[9px] text-emerald-400 font-bold mt-0.5 uppercase tracking-wider">Active Module →</div>}
                  </div>
                </button>
              )
            })}

            {/* CTA in sidebar */}
            <div className="mt-4 p-4 bg-emerald-500 rounded-2xl text-white">
              <div className="text-[10px] font-black uppercase tracking-widest mb-2">Ready?</div>
              <Link href="/login" className="text-[10px] font-black uppercase tracking-wider flex items-center gap-2 hover:gap-3 transition-all">
                Activate All Modules. <ArrowRight size={12} />
              </Link>
            </div>
          </aside>

          {/* RIGHT: Content panel */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                className="w-full"
              >
                {/* Top: title + stats */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-8 lg:p-12 mb-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                      <active.icon size={18} />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">{active.label}</div>
                    <div className="ml-auto flex items-center gap-2 text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE SIM
                    </div>
                  </div>

                  <h2 className="text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic mb-4 whitespace-pre-line">
                    {active.headline}
                  </h2>
                  <p className="text-lg text-slate-500 font-medium italic mb-8">{active.tagline}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {active.stats.map(s => (
                      <div key={s.l} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                        <div className="text-2xl lg:text-3xl font-black text-emerald-500">{s.v}</div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{s.l}</div>
                      </div>
                    ))}
                  </div>

                  <p className="text-base text-slate-500 leading-relaxed font-medium mb-8">{active.description}</p>

                  <ul className="space-y-3 mb-8">
                    {active.bullets.map(b => (
                      <li key={b} className="flex items-start gap-3 text-sm font-semibold text-slate-600">
                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <Link href="/login"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-full font-black uppercase tracking-[0.3em] text-[11px] hover:bg-emerald-500 transition-all shadow-xl hover:scale-105 group">
                    Activate {active.label} <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>

                {/* SIMULATION PANEL */}
                <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm" style={{ height: '480px' }}>
                  <div className="border-b border-slate-100 px-6 py-3 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      {['bg-red-400', 'bg-yellow-400', 'bg-emerald-400'].map(c => <div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{active.label} · Live Module Simulation</span>
                    <div className="ml-auto flex items-center gap-1.5">
                      <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Running</span>
                    </div>
                  </div>
                  <div className="relative w-full h-[calc(100%-44px)]">
                    <active.sim />
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* Mobile tabs */}
            <div className="flex lg:hidden gap-2 flex-wrap mt-6">
              {FEATURES.map(f => (
                <button key={f.id} onClick={() => setActiveId(f.id)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${f.id === activeId ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-500 border-slate-200'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="py-48 px-6 lg:px-24 bg-slate-950 text-center relative overflow-hidden mt-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#10b98115_0%,_transparent_70%)]" />
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 80 }} className="relative z-10 max-w-4xl mx-auto">
          <div className="text-emerald-400 text-[11px] font-black uppercase tracking-[1em] mb-8">Plug In Today</div>
          <h2 className="text-6xl lg:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.85] mb-12">
            Zero Delays.<br />Zero Excuses.
          </h2>
          <p className="text-xl text-slate-400 font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
            Connect your first data source and have your full operational command center running today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/login" className="px-12 py-6 bg-white text-slate-950 font-black uppercase tracking-[0.4em] text-[11px] rounded-full hover:bg-emerald-400 transition-all shadow-2xl hover:scale-105">
              Start Command Center
            </Link>
            <Link href="/contact" className="px-12 py-6 border border-slate-800 text-slate-300 font-black uppercase tracking-[0.4em] text-[11px] rounded-full hover:border-emerald-500 hover:text-emerald-400 transition-all">
              Talk To Intelligence
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-48 px-12 xl:px-24 border-t border-slate-100 bg-white grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-24">
        <div className="xl:col-span-2 space-y-12">
          <Link href="/" className="flex items-center gap-6 group">
            <svg width="34" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-950 group-hover:rotate-180 transition-transform duration-500">
              <circle cx="6" cy="6" r="6" fill="currentColor" /><rect x="18" y="2" width="14" height="8" fill="currentColor" />
            </svg>
            <div className="text-3xl font-black uppercase tracking-[0.2em] text-slate-950 italic">Zo-flow</div>
          </Link>
          <p className="text-lg font-medium text-slate-400 max-w-sm leading-relaxed italic">
            The definitive logistics operating system for modern business, re-engineered for mission-critical clarity.
          </p>
        </div>
        {[
          { title: 'Intelligence', links: ['Search Agent', 'Inventory Localization', 'Pricing Audit', 'Governance'] },
          { title: 'Information Protocol', links: ['Privacy Policy', 'Terms of Access', 'Security Gate', 'Compliance'] }
        ].map(group => (
          <div key={group.title} className="space-y-12">
            <div className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-950">{group.title}</div>
            <div className="flex flex-col gap-8">
              {group.links.map(link => (
                <Link key={link} href={`/${link.toLowerCase().replace(' ', '-')}`} className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-all uppercase tracking-widest">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </footer>
    </div>
  )
}
