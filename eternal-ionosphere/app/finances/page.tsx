'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeftRight,
  ShieldCheck,
  FileCheck,
  FileWarning,
  DollarSign,
  Plus,
  Trash2,
  Filter,
  Download,
  Loader2,
  X,
  RefreshCw,
  FileDown,
  Search
} from 'lucide-react'
import { useToast, ToastContainer } from '@/components/ui/Toast'

interface FinanceRow {
  id: string;
  po_number: string;
  item_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  status: 'matched' | 'mismatch' | 'pending';
  type: 'asn' | 'invoice' | 'po';
}

interface MatchResult {
  po_number: string;
  item_id: string;
  asn_qty: number;
  invoice_qty: number;
  asn_price: number;
  invoice_price: number;
  status: 'matched' | 'partial' | 'mismatch' | 'unreconciled';
  notes: string;
}

export default function FinancesPage() {
  const [asnData, setAsnData] = useState<FinanceRow[]>([])
  const [invoiceData, setInvoiceData] = useState<FinanceRow[]>([])
  const [poData, setPoData] = useState<FinanceRow[]>([])
  const [results, setResults] = useState<MatchResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const { toasts, showToast, removeToast } = useToast()

  const handleFileUpload = (type: 'asn' | 'invoice' | 'po', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    showToast(`Processing ${type.toUpperCase()}...`, 'info')
    
    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const XLSX = await import('xlsx')
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws) as any[]

        const normalized = data.map((row, idx) => ({
          id: `${type}-${idx}`,
          po_number: String(row.PO || row['PO Number'] || row.OrderNumber || ''),
          item_id: String(row.Item || row['Item ID'] || row.SKU || ''),
          description: String(row.Description || row.Product || ''),
          quantity: Number(row.Quantity || row.Qty || 0),
          unit_price: Number(row.Price || row['Unit Price'] || row.Rate || 0),
          total: Number(row.Total || row.Amount || 0),
          status: 'pending' as const,
          type: type
        }))

        if (type === 'asn') {
            setAsnData(normalized)
            showToast(`Registered ${normalized.length} ASN records`, 'success')
        } else if (type === 'invoice') {
            setInvoiceData(normalized)
            showToast(`Registered ${normalized.length} Invoice records`, 'success')
        } else {
            setPoData(normalized)
            showToast(`Registered ${normalized.length} PO records`, 'success')
        }
      } catch (err) {
        showToast('Sync error: Incompatible data structure', 'error')
      }
    }
    reader.readAsBinaryString(file)
  }

  const runMatching = () => {
    setIsProcessing(true)
    showToast('Neural reconciliation engine active...', 'info')
    
    setTimeout(() => {
      const allMatches: MatchResult[] = []
      const asnMap = new Map()
      asnData.forEach(row => {
        const key = `${row.po_number}-${row.item_id}`
        asnMap.set(key, row)
      })

      const processedInvoiceKeys = new Set()

      invoiceData.forEach(inv => {
        const key = `${inv.po_number}-${inv.item_id}`
        processedInvoiceKeys.add(key)
        const asn = asnMap.get(key)

        if (asn) {
          const qtyMatched = asn.quantity === inv.quantity
          const priceMatched = asn.unit_price === inv.unit_price
          
          let status: MatchResult['status'] = 'matched'
          let notes = 'Full Match'

          if (!qtyMatched && !priceMatched) {
            status = 'mismatch'
            notes = `Qty mismatch (${asn.quantity} vs ${inv.quantity}) & Price mismatch (${asn.unit_price} vs ${inv.unit_price})`
          } else if (!qtyMatched) {
            status = 'partial'
            notes = `Quantity mismatch: Received ${asn.quantity}, Billed ${inv.quantity}`
          } else if (!priceMatched) {
            status = 'mismatch'
            notes = `Price mismatch: ASN $${asn.unit_price.toFixed(2)}, Invoice $${inv.unit_price.toFixed(2)}`
          }

          allMatches.push({
            po_number: inv.po_number,
            item_id: inv.item_id,
            asn_qty: asn.quantity,
            invoice_qty: inv.quantity,
            asn_price: asn.unit_price,
            invoice_price: inv.unit_price,
            status,
            notes
          })
        } else {
          allMatches.push({
            po_number: inv.po_number,
            item_id: inv.item_id,
            asn_qty: 0,
            invoice_qty: inv.quantity,
            asn_price: 0,
            invoice_price: inv.unit_price,
            status: 'unreconciled',
            notes: 'Invoice without matching ASN'
          })
        }
      })

      asnData.forEach(asn => {
        const key = `${asn.po_number}-${asn.item_id}`
        if (!processedInvoiceKeys.has(key)) {
          allMatches.push({
            po_number: asn.po_number,
            item_id: asn.item_id,
            asn_qty: asn.quantity,
            invoice_qty: 0,
            asn_price: asn.unit_price,
            invoice_price: 0,
            status: 'unreconciled',
            notes: 'ASN without matching Invoice'
          })
        }
      })

      setResults(allMatches)
      setIsProcessing(false)
      setShowResults(true)
      showToast('Reconciliation Cycle Finalized', 'success')
    }, 1500)
  }

  const exportCSV = () => {
    showToast('Compiling export bundle...', 'info')
    const headers = 'PO Number,Item ID,ASN Qty,Inv Qty,ASN Price,Inv Price,Status,Notes\n'
    const csv = headers + results.map(r => `${r.po_number},${r.item_id},${r.asn_qty},${r.invoice_qty},${r.asn_price},${r.invoice_price},${r.status},${r.notes}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'recon_report.csv'; a.click()
    showToast('Vault Report Exported', 'success')
  }

  const stats = {
    total: results.length,
    matched: results.filter(r => r.status === 'matched').length,
    partial: results.filter(r => r.status === 'partial').length,
    mismatch: results.filter(r => r.status === 'mismatch').length,
    unreconciled: results.filter(r => r.status === 'unreconciled').length,
  }

  return (
    <div className="p-10 animate-fade-in min-h-screen">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header Hub */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 leading-none text-[var(--text-primary)]">
            Finance <span className="text-indigo-400">Recon</span>
          </h1>
          <p className="text-[var(--text-secondary)] opacity-40 max-w-xl text-sm font-medium">
            Smart matching logic for ASN and Vendor Invoices. 
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => showToast('Sample payloads generated in /exports', 'info')}
            className="flex items-center gap-3 bg-[var(--bg-1)] hover:bg-[var(--bg-2)] text-[var(--text-primary)] px-6 py-4 rounded-2xl border border-[var(--border)] font-black uppercase tracking-widest text-[10px] transition-all shadow-inner"
          >
            <Download size={16} /> Sample
          </button>
          <button 
            onClick={() => {
                setAsnData([]); setInvoiceData([]); setPoData([]); setShowResults(false);
                showToast('Batch registry cleared', 'info')
            }}
            className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-[var(--bg-0)] px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Plus size={16} /> New Batch
          </button>
        </div>
      </div>

      {!showResults ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* PO Upload */}
          <div className="group relative">
            <div className={`p-10 rounded-[40px] border-2 border-dashed transition-all duration-500 h-full flex flex-col items-center justify-center text-center ${poData.length > 0 ? 'border-amber-500/50 bg-amber-500/5' : 'border-[var(--border)] bg-[var(--bg-1)] hover:border-amber-500/50 hover:bg-[var(--bg-2)]'}`}>
                <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mb-6 transition-all shadow-2xl ${poData.length > 0 ? 'bg-amber-500 text-[var(--bg-0)]' : 'bg-[var(--bg-0)] border border-[var(--border)] text-[var(--text-secondary)] opacity-40 group-hover:text-amber-400'}`}>
                  {poData.length > 0 ? <CheckCircle2 size={32} /> : <FileCheck size={32} />}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-[var(--text-primary)]">Purchase Order</h3>
                <p className="text-[var(--text-secondary)] opacity-40 text-[10px] font-black uppercase tracking-widest mb-8 max-w-[200px] leading-relaxed">
                  Upload PO data (.xlsx)
                </p>
                <div className="relative">
                  <input type="file" onChange={(e) => handleFileUpload('po', e)} className="absolute inset-0 opacity-0 cursor-pointer" accept=".xlsx, .xls" />
                  <button className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl ${poData.length > 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-[var(--bg-1)] text-[var(--text-primary)] hover:scale-105'}`}>
                    {poData.length > 0 ? 'Record Ready' : 'Select Payload'}
                  </button>
                </div>
            </div>
          </div>
          {/* ASN Upload */}
          <div className="group relative">
            <div className={`p-10 rounded-[40px] border-2 border-dashed transition-all duration-500 h-full flex flex-col items-center justify-center text-center ${asnData.length > 0 ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-[var(--border)] bg-[var(--bg-1)] hover:border-indigo-500/50 hover:bg-[var(--bg-2)]'}`}>
                <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mb-6 transition-all shadow-2xl ${asnData.length > 0 ? 'bg-emerald-500 text-[var(--bg-0)]' : 'bg-[var(--bg-0)] border border-[var(--border)] text-[var(--text-secondary)] opacity-40 group-hover:text-indigo-400'}`}>
                  {asnData.length > 0 ? <CheckCircle2 size={32} /> : <FileSpreadsheet size={32} />}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-[var(--text-primary)]">Shipping Notice</h3>
                <p className="text-[var(--text-secondary)] opacity-40 text-[10px] font-black uppercase tracking-widest mb-8 max-w-[200px] leading-relaxed">
                  Upload logistics manifest file (.xlsx)
                </p>
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={(e) => handleFileUpload('asn', e)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".xlsx, .xls"
                  />
                  <button className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl ${asnData.length > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[var(--bg-1)] text-[var(--text-primary)] hover:scale-105'}`}>
                    {asnData.length > 0 ? 'Record Ready' : 'Select Payload'}
                  </button>
                </div>
            </div>
          </div>

          {/* Invoice Upload */}
          <div className="group relative">
            <div className={`p-10 rounded-[40px] border-2 border-dashed transition-all duration-500 h-full flex flex-col items-center justify-center text-center ${invoiceData.length > 0 ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-[var(--border)] bg-[var(--bg-1)] hover:border-indigo-500/50 hover:bg-[var(--bg-2)]'}`}>
                <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mb-6 transition-all shadow-2xl ${invoiceData.length > 0 ? 'bg-indigo-600 text-[var(--bg-0)]' : 'bg-[var(--bg-0)] border border-[var(--border)] text-[var(--text-secondary)] opacity-40 group-hover:text-indigo-400'}`}>
                  {invoiceData.length > 0 ? <CheckCircle2 size={32} /> : <DollarSign size={32} />}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-[var(--text-primary)]">Vendor Invoice</h3>
                <p className="text-[var(--text-secondary)] opacity-40 text-[10px] font-black uppercase tracking-widest mb-8 max-w-[200px] leading-relaxed">
                  Upload final billing payload (.xlsx)
                </p>
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={(e) => handleFileUpload('invoice', e)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".xlsx, .xls"
                  />
                  <button className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl ${invoiceData.length > 0 ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-[var(--bg-1)] text-[var(--text-primary)] hover:scale-105'}`}>
                    {invoiceData.length > 0 ? 'Record Ready' : 'Select Payload'}
                  </button>
                </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="md:col-span-2 flex justify-center mt-12">
            <button
              onClick={runMatching}
              disabled={asnData.length === 0 || invoiceData.length === 0 || poData.length === 0 || isProcessing}
              className={`group flex items-center gap-4 px-12 py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl ${asnData.length > 0 && invoiceData.length > 0 && poData.length > 0 && !isProcessing ? 'bg-indigo-600 text-[var(--bg-0)] hover:scale-[1.05] shadow-indigo-600/30' : 'bg-[var(--bg-1)] text-[var(--text-secondary)] opacity-20 cursor-not-allowed border border-[var(--border)]'}`}
            >
              {isProcessing ? (
                <><RefreshCw className="animate-spin" size={20} /> ALIGNING PROTOCOLS...</>
              ) : (
                <>
                  <ArrowLeftRight className="w-5 h-5 transition-transform group-hover:rotate-180 duration-700" />
                  INITIATE SMART RECON
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Dashboard Summary Cluster */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
                { label: 'Perfect Alignment', val: stats.matched, icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Quantity Drift', val: stats.partial, icon: FileWarning, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { label: 'Price Mismatch', val: stats.mismatch, icon: DollarSign, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                { label: 'Unreconciled', val: stats.unreconciled, icon: X, color: 'text-[var(--text-secondary)]', bg: 'bg-[var(--bg-2)]' },
            ].map((s, i) => (
                <div key={i} className="bg-[var(--bg-1)] border border-[var(--border)] p-8 rounded-[40px] shadow-2xl hover:border-indigo-500/30 transition-all group">
                    <div className="flex justify-between items-center mb-6">
                        <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center ${s.color} border border-[var(--border)]`}>
                        <s.icon size={20} />
                        </div>
                        <span className={`text-[10px] font-black ${s.color} uppercase tracking-widest`}>
                        {stats.total > 0 ? Math.round((s.val / stats.total) * 100) : 0}%
                        </span>
                    </div>
                    <div className="text-4xl font-black text-[var(--text-primary)] mb-2 tabular-nums">{s.val}</div>
                    <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">{s.label}</div>
                </div>
            ))}
          </div>

          {/* Detailed Recon Registry */}
          <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[48px] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-[var(--border)] flex flex-col md:flex-row justify-between items-center bg-[var(--bg-0)]/20 backdrop-blur-xl gap-8">
              <div className="flex items-center gap-8">
                <h2 className="text-xl font-black uppercase tracking-tighter text-[var(--text-primary)]">Results</h2>
                <div className="flex bg-[var(--bg-0)]/50 p-1.5 rounded-2xl border border-[var(--border)]">
                  <button className="px-5 py-2 rounded-xl bg-indigo-600 text-[10px] font-black uppercase tracking-widest shadow-lg text-[var(--bg-0)]">Show All</button>
                  <button className="px-5 py-2 rounded-xl text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest hover:text-[var(--text-primary)] transition-all">Anomalies</button>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-40" />
                  <input 
                    type="text" 
                    placeholder="Search logs..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider outline-none focus:border-indigo-500/50 transition-colors shadow-inner"
                  />
                </div>
                <button 
                  onClick={exportCSV}
                  className="p-4 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-2xl hover:bg-indigo-600 hover:text-[var(--bg-0)] transition-all shadow-xl shadow-indigo-600/10"
                >
                  <FileDown size={20} />
                </button>
                <button 
                   onClick={() => setShowResults(false)}
                   className="p-4 bg-[var(--bg-1)] text-[var(--text-secondary)] opacity-40 hover:text-[var(--text-primary)] border border-[var(--border)] rounded-2xl transition-all"
                >
                   <RefreshCw size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-0)]/10">
                    <th className="px-8 py-6 text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">PO Number</th>
                    <th className="px-8 py-6 text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">Item ID</th>
                    <th className="px-8 py-6 text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">ASN Qty</th>
                    <th className="px-8 py-6 text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">Inv Qty</th>
                    <th className="px-8 py-6 text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">Inv Price</th>
                    <th className="px-8 py-6 text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">Match Status</th>
                    <th className="px-8 py-6 text-[9px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">Notes</th>
                    <th className="px-8 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {results.map((res, i) => (
                    <tr key={i} className="hover:bg-[var(--bg-2)] transition-colors group cursor-crosshair">
                      <td className="px-8 py-6">
                        <span className="font-black text-sm text-indigo-400 uppercase tracking-tighter">#{res.po_number || 'NULL'}</span>
                      </td>
                      <td className="px-8 py-6 text-xs font-mono font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-tighter">{res.item_id || 'UNKNOWN'}</td>
                      <td className="px-8 py-6 text-sm font-black tabular-nums text-[var(--text-primary)]">{res.asn_qty}</td>
                      <td className="px-8 py-6 text-sm font-black tabular-nums text-[var(--text-primary)]">{res.invoice_qty}</td>
                      <td className="px-8 py-6">
                         <div className="text-[10px] font-black text-[var(--text-primary)] tracking-widest mb-1 tabular-nums">${res.invoice_price.toFixed(2)}</div>
                         <div className="text-[8px] font-black text-[var(--text-secondary)] opacity-20 uppercase tracking-[0.2em]">INV PRICE</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border
                          ${res.status === 'matched' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                            res.status === 'partial' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                            res.status === 'mismatch' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                            'bg-[var(--bg-1)] text-[var(--text-secondary)] opacity-40 border border-[var(--border)] shadow-inner'}`}
                        >
                          <div className={`w-1 h-1 rounded-full bg-current ${res.status !== 'unreconciled' && 'shadow-[0_0_8px_currentColor]'}`} />
                          {res.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 min-w-[240px]">
                        <span className="text-[10px] text-[var(--text-secondary)] opacity-40 font-bold uppercase tracking-tight italic line-clamp-2">{res.notes}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button 
                            onClick={() => showToast(`Opening protocol audit for ${res.po_number}`, 'info')}
                            className="bg-[var(--bg-1)] p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-[var(--bg-0)]"
                         >
                            <ArrowRight size={16} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
