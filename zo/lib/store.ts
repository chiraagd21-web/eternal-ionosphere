import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// RESTORING MASTER CATALOG FOR REFERENCE
export const PRE_DEFINED_CATALOG = [
  { name: 'Phone', id: 'ph11-746', category: 'Electronics', price: 999, safetyStock: 200, qtyOnHand: 0, utilizationRateMonth: 800, utilizationRateWeek: 200, growthRate: 10, growthPeriod: 'month' as 'month' | 'week' },
  { name: 'Laptop', id: 'lt11-562', category: 'Electronics', price: 1499, safetyStock: 100, qtyOnHand: 0, utilizationRateMonth: 800, utilizationRateWeek: 200, growthRate: 8, growthPeriod: 'month' as 'month' | 'week' },
]

export interface InventoryLocation {
  rack: string
  bin?: string
  qty: number
}

export interface DailyRecord {
  date: string
  qty: number
  sales?: number
  isManualQty?: boolean
}

export interface SKUData {
  id: string
  name: string
  category: string
  qtyOnHand: number
  safetyStock: number
  price: number 
  utilizationRateMonth: number
  utilizationRateWeek: number
  growthRate: number 
  growthPeriod?: 'month' | 'week'
  shipments: { name: string, date: string, qty: number }[]
  locations: InventoryLocation[]
  velocityCategory?: 'High' | 'Medium' | 'Low'
  dailyRecords: DailyRecord[]
}

export interface WarehouseZone {
  id: string
  label: string
  racks: number
  utilization: number
  color: string
}

export interface Shipment {
  id: string
  supplier: string
  items: Array<{ id: string, name: string, qty: number }>
  type: string
  origin: string
  destination: string
  shipDate: string
  eta: string
  tracking: string
  status: string
}

interface AppState {
  inventory: SKUData[]
  shipments: Shipment[]
  zones: WarehouseZone[]
  activeWarehouse: string
  setActiveWarehouse: (id: string) => void
  hoveredSKUId: string | null 
  setHoveredSKUId: (id: string | null) => void
  pendingPutAway: Array<{ id: string, name: string, qty: number }>
  setInventory: (items: SKUData[]) => void
  setShipments: (shipments: Shipment[]) => void
  updateShipment: (id: string, patch: Partial<Shipment>) => void
  setZones: (zones: WarehouseZone[]) => void
  rackPositions: Record<string, [number, number, number]>
  updateRackPosition: (rackId: string, pos: [number, number, number]) => void
  receiveShipment: (shipmentId: string) => void
  updateLocation: (skuId: string, rack: string, bin?: string, qty?: number) => void
  addInventoryCount: (skuId: string, addedQty: number) => void
  updateSKU: (skuId: string, patch: Partial<SKUData>) => void
  addSKU: (sku: SKUData) => void
  deleteSKU: (skuId: string) => void
  addDailyRecord: (skuId: string, date: string, qty?: number, sales?: number) => void
  clearPutAway: (itemId: string) => void
  deductFromLocation: (skuId: string, rack: string, qty: number) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      inventory: [], 
      shipments: [],
      zones: [
        { id: 'ALL', label: 'GLOBAL GRID CORE', racks: 41, utilization: 72, color: 'indigo' },
        { id: 'A', label: 'NEURAL CORE ALPHA', racks: 12, utilization: 84, color: 'indigo' },
        { id: 'B', label: 'OPTIMIZED LOGISTIX', racks: 8, utilization: 62, color: 'emerald' },
        { id: 'C', label: 'RAW DATA STORAGE', racks: 15, utilization: 91, color: 'amber' },
        { id: 'D', label: 'EXPERIMENTAL TECH', racks: 6, utilization: 45, color: 'purple' },
      ],
      activeWarehouse: 'ALL',
      setActiveWarehouse: (id) => set({ activeWarehouse: id }),
      hoveredSKUId: null,
      setHoveredSKUId: (id) => set({ hoveredSKUId: id }),
      pendingPutAway: [],
      rackPositions: {},
      setInventory: (items) => set({ inventory: items }),
      setShipments: (shipments) => set({ shipments }),
      setZones: (zones) => set({ zones }),
      updateShipment: (id, patch) => set((state) => ({ shipments: state.shipments.map(s => s.id === id ? { ...s, ...patch } : s) })),
      updateRackPosition: (rackId, pos) => set((state) => ({
         rackPositions: { ...state.rackPositions, [rackId]: pos }
      })),
      receiveShipment: (shipmentId) => set((state) => {
         const shipment = state.shipments.find(s => s.id === shipmentId)
         if (!shipment) return state
         const newInventory = state.inventory.map(sku => {
            const shipItem = shipment.items.find(si => si.name === sku.name)
            if (shipItem) {
               return { 
                 ...sku, 
                 qtyOnHand: sku.qtyOnHand + shipItem.qty,
                 shipments: [...sku.shipments, { name: shipment.id, date: new Date().toISOString().split('T')[0], qty: shipItem.qty }]
               }
            }
            return sku
         })
         const newShipments = state.shipments.filter(s => s.id !== shipmentId)
         return { inventory: newInventory, shipments: newShipments, pendingPutAway: [...state.pendingPutAway, ...shipment.items] }
      }),
      clearPutAway: (itemId) => set((state) => ({ pendingPutAway: state.pendingPutAway.filter(item => item.id !== itemId) })),
      updateLocation: (skuId, rack, bin, qty) => set((state) => ({
         inventory: state.inventory.map(sku => {
           if (sku.id.toLowerCase() === skuId.toLowerCase()) {
             const locations = [...(sku.locations || [])]
             const existingIdx = locations.findIndex(l => l.rack === rack && l.bin === bin)
             if (existingIdx !== -1) {
                locations[existingIdx] = { ...locations[existingIdx], qty: qty !== undefined ? qty : locations[existingIdx].qty }
             } else {
                locations.push({ rack, bin, qty: qty || 0 })
             }
             const newTotal = locations.reduce((sum, l) => sum + l.qty, 0)
             return { ...sku, locations, qtyOnHand: newTotal }
           }
           return sku
         })
      })),
      deductFromLocation: (skuId, rack, qty) => set((state) => ({
         inventory: state.inventory.map(sku => {
           if (sku.id.toLowerCase() === skuId.toLowerCase()) {
             const locations = (sku.locations || []).map(l => {
                if (l.rack === rack) return { ...l, qty: Math.max(0, l.qty - qty) }
                return l
             }).filter(l => l.qty > 0)
             const newTotal = locations.reduce((sum, l) => sum + l.qty, 0)
             return { ...sku, locations, qtyOnHand: newTotal }
           }
           return sku
         })
      })),
      addInventoryCount: (skuId, addedQty) => set((state) => ({
         inventory: state.inventory.map(sku => sku.id.toLowerCase() === skuId.toLowerCase() ? { ...sku, qtyOnHand: sku.qtyOnHand + addedQty } : sku)
      })),
      updateSKU: (skuId, patch) => set((state) => ({
        inventory: state.inventory.map(item => item.id.toLowerCase() === skuId.toLowerCase() ? { ...item, ...patch } : item)
      })),
      addSKU: (sku) => set((state) => ({ inventory: [...state.inventory, sku] })),
      deleteSKU: (skuId) => set((state) => ({ inventory: state.inventory.filter(item => item.id.toLowerCase() !== skuId.toLowerCase()) })),
      addDailyRecord: (skuId: string, date: string, qty?: number, sales?: number) => set((state) => ({
        inventory: state.inventory.map(item => {
          if (item.id.toLowerCase() === skuId.toLowerCase()) {
            let currentRecords = [...(item.dailyRecords || [])]
            
            if (qty === null) {
               currentRecords = currentRecords.filter(r => r.date !== date)
            } else {
               const existingIdx = currentRecords.findIndex(r => r.date === date)
               if (existingIdx !== -1) {
                 const current = currentRecords[existingIdx]
                 currentRecords[existingIdx] = { 
                   ...current, 
                   qty: qty !== undefined ? qty : current.qty, 
                   sales: sales !== undefined ? sales : (current.sales || 0),
                   isManualQty: qty !== undefined ? true : current.isManualQty
                 }
               } else {
                 currentRecords.push({ date, qty: qty !== undefined ? qty : item.qtyOnHand, sales: sales || 0, isManualQty: qty !== undefined })
               }
            }

            const sorted = currentRecords.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            let runningBalance = item.qtyOnHand

            const processed = sorted.map((record) => {
               if (record.isManualQty) runningBalance = record.qty
               const openingBalanceToday = runningBalance
               const closingBalanceToday = Math.max(0, openingBalanceToday - (record.sales || 0))
               runningBalance = closingBalanceToday
               return { ...record, qty: openingBalanceToday }
            })

            const finalClosingBalance = processed.length > 0 
              ? processed[processed.length - 1].qty - (processed[processed.length - 1].sales || 0)
              : item.qtyOnHand

            return {
              ...item,
              qtyOnHand: finalClosingBalance,
              dailyRecords: processed
            }
          }
          return item
        })
      })),
    }),
    {
      name: 'ag-unified-v17-deductions',
      storage: createJSONStorage(() => localStorage),
      version: 17,
    }
  )
)
