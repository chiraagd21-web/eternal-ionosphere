import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SKUData = {
  sku: string
  name: string
  qtyOnHand: number
  reorderPoint: number
  uom: string
  price: number
  category: string
  lastSync: string
  // For Forecasting
  utilizationRateWeek: number
  utilizationRateMonth: number
  safetyStock: number
  growthRate: number
}

export type Recommendation = {
  id: string
  title: string
  description: string
  type: 'reorder' | 'optimize' | 'market' | 'risk'
  status: 'pending' | 'executed'
  confidence: number
}

export type SaleRecord = {
  id: string
  timestamp: string
  items: Array<{ name: string, qty: number, price: number }>
  total: number
}

export type Shipment = {
  id: string
  supplier: string
  origin: string
  destination: string
  status: string
  eta: string
  shipDate: string
  type: string
  tracking: string
  items: any[]
  originLat?: number
  originLon?: number
  destLat?: number
  destLon?: number
}

interface AppStore {
  // --- STATE ---
  inventory: SKUData[]
  recommendations: Recommendation[]
  sales: SaleRecord[]
  shipments: Shipment[]
  pendingPutAway: any[]
  isListening: boolean
  lastVoiceCommand: string | null
  aiStatus: 'idle' | 'analyzing' | 'executing'
  
  // --- ACTIONS ---
  setInventory: (data: SKUData[]) => void
  setShipments: (data: Shipment[]) => void
  addSale: (sale: SaleRecord) => void
  addInventoryCount: (sku: string, qty: number) => void
  updateLocation: (itemId: string, rackId: string) => void
  clearPutAway: (itemId: string) => void
  receiveShipment: (id: string) => void
  executeRecommendation: (id: string) => void
  addRecommendation: (rec: Recommendation) => void
  setIsListening: (val: boolean) => void
  processVoiceCommand: (cmd: string) => void
  setAIStatus: (status: 'idle' | 'analyzing' | 'executing') => void
  seedInitialData: () => void
  syncFromCloud: () => Promise<void>
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      inventory: [],
      recommendations: [],
      sales: [],
      shipments: [],
      pendingPutAway: [],
      isListening: false,
      lastVoiceCommand: null,
      aiStatus: 'idle',

      setInventory: (data) => set({ inventory: data }),
      setShipments: (data) => set({ shipments: data }),
      
      addInventoryCount: (sku, qty) => set((state) => ({
        inventory: state.inventory.map(item => 
          item.sku === sku ? { ...item, qtyOnHand: item.qtyOnHand + qty } : item
        )
      })),

      updateLocation: (itemId, rackId) => set((state) => {
         const item = (state.pendingPutAway || []).find(p => p.id === itemId)
         if (!item) return state

         const newInventory = state.inventory.map(inv => {
            if (inv.name === item.name || inv.sku === item.sku) {
               return { ...inv, qtyOnHand: inv.qtyOnHand + item.qty }
            }
            return inv
         })

         return { inventory: newInventory }
      }),

      clearPutAway: (itemId) => set((state) => ({
        pendingPutAway: (state.pendingPutAway || []).filter(p => p.id !== itemId)
      })),

      receiveShipment: (id) => set((state) => {
        const shp = (state.shipments || []).find(s => s.id === id)
        if (!shp) return state
        
        const newPutAway = [
          ...(state.pendingPutAway || []),
          ...shp.items.map(it => ({ ...it, id: `PA-${Math.random().toString(36).substr(2, 5)}` }))
        ]
        
        return {
          shipments: state.shipments.filter(s => s.id !== id),
          pendingPutAway: newPutAway
        }
      }),

      addSale: (sale) => set((state) => {
        const newInventory = state.inventory.map(item => {
          const soldItem = sale.items.find(si => si.name === item.name)
          if (soldItem) {
            return { ...item, qtyOnHand: Math.max(0, item.qtyOnHand - soldItem.qty) }
          }
          return item
        })

        const newRecommendations = [...state.recommendations]
        newInventory.forEach(item => {
          if (item.qtyOnHand < item.reorderPoint) {
            const alreadyRecommended = newRecommendations.some(r => r.title.includes(item.name) && r.status === 'pending')
            if (!alreadyRecommended) {
              newRecommendations.unshift({
                id: `REC-${Math.random().toString(36).substr(2, 5)}`,
                title: `Auto-Replenish: ${item.name}`,
                description: `Stock level (${item.qtyOnHand}${item.uom}) fell below reorder point (${item.reorderPoint}${item.uom}). Protocol initiated.`,
                type: 'reorder',
                status: 'pending',
                confidence: 0.98
              })
            }
          }
        })

        return { 
          sales: [sale, ...state.sales], 
          inventory: newInventory,
          recommendations: newRecommendations.slice(0, 10)
        }
      }),

      executeRecommendation: (id) => set((state) => {
        const rec = state.recommendations.find(r => r.id === id)
        if (!rec || rec.status === 'executed') return state

        const newShipments = [...(state.shipments || [])]
        if (rec.type === 'reorder') {
          const itemName = rec.title.replace('Auto-Replenish: ', '').replace('Voice Reorder: ', '')
          newShipments.unshift({
            id: `ASN-${Math.random().toString(36).substr(2, 5)}`,
            supplier: 'Regional Distributor',
            origin: 'NJ Distribution Hub',
            destination: 'LES Hub, NYC',
            status: 'Processing',
            eta: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            shipDate: new Date().toISOString().split('T')[0],
            type: 'land',
            tracking: 'PENDING',
            items: [{ name: itemName, qty: 50 }],
            originLat: 40.7306, originLon: -74.0060, destLat: 40.7183, destLon: -73.9889
          })
        }

        return { 
          recommendations: state.recommendations.map(r => r.id === id ? { ...r, status: 'executed' } : r),
          shipments: newShipments
        }
      }),

      addRecommendation: (rec) => set((state) => ({
        recommendations: [rec, ...(state.recommendations || [])].slice(0, 10)
      })),

      setIsListening: (val) => set({ isListening: val }),

      setAIStatus: (status) => set({ aiStatus: status }),

      syncFromCloud: async () => {
        console.log("Cloud sync initialized...")
      },

      processVoiceCommand: (cmd) => {
        const normalized = cmd.toLowerCase()
        set({ lastVoiceCommand: cmd, aiStatus: 'analyzing' })
        
        setTimeout(() => {
          if (normalized.includes('reorder') || normalized.includes('buy')) {
             const lowStock = get().inventory.find(i => i.qtyOnHand < i.reorderPoint)
             if (lowStock) {
                get().addRecommendation({
                  id: Math.random().toString(36).substr(2, 9),
                  title: `Voice Reorder: ${lowStock.name}`,
                  description: `Procuring NYC stock as requested via voice.`,
                  type: 'reorder',
                  status: 'pending',
                  confidence: 0.99
                })
             }
          }
          if (normalized.includes('clear')) set({ recommendations: [] })
          set({ aiStatus: 'idle' })
        }, 1500)
      },

      seedInitialData: () => {
        const nycInventory: SKUData[] = [
          { sku: 'NYC-BKN-01', name: 'Brooklyn Roasting Beans', qtyOnHand: 18, reorderPoint: 25, uom: 'kg', price: 22.50, category: 'Coffee', lastSync: new Date().toISOString(), utilizationRateWeek: 5.2, utilizationRateMonth: 22.5, safetyStock: 10, growthRate: 1.2 },
          { sku: 'NYC-OAT-01', name: 'Oatly Barista Edition', qtyOnHand: 42, reorderPoint: 50, uom: 'L', price: 3.80, category: 'Dairy', lastSync: new Date().toISOString(), utilizationRateWeek: 12.0, utilizationRateMonth: 50.0, safetyStock: 20, growthRate: 2.5 },
          { sku: 'NYC-BAL-01', name: 'Balthazar Croissants', qtyOnHand: 15, reorderPoint: 20, uom: 'units', price: 4.50, category: 'Pastries', lastSync: new Date().toISOString(), utilizationRateWeek: 85.0, utilizationRateMonth: 340.0, safetyStock: 10, growthRate: 0.5 },
          { sku: 'NYC-CUP-12', name: 'Recycled 12oz Cups', qtyOnHand: 850, reorderPoint: 500, uom: 'units', price: 0.22, category: 'Packaging', lastSync: new Date().toISOString(), utilizationRateWeek: 200, utilizationRateMonth: 850, safetyStock: 100, growthRate: 0.2 },
          { sku: 'NYC-TEE-01', name: 'LES Limited Edition Tee', qtyOnHand: 12, reorderPoint: 10, uom: 'units', price: 55.00, category: 'Retail', lastSync: new Date().toISOString(), utilizationRateWeek: 1.5, utilizationRateMonth: 6.0, safetyStock: 5, growthRate: 15.0 },
        ]

        const nycRecs: Recommendation[] = [
          { id: 'nyc-1', title: 'Replenish: Brooklyn Roasting', description: 'Stock at 18kg. LES branch depletion rate is up 12% today.', type: 'reorder', status: 'pending', confidence: 0.99 },
          { id: 'nyc-2', title: 'Delay Alert: Balthazar', description: 'Holland Tunnel congestion. Arrival expected +45 mins.', type: 'risk', status: 'pending', confidence: 0.94 },
        ]

        const nycShipments: Shipment[] = [
          { 
            id: 'ASN-NYC-01', supplier: 'Brooklyn Roastery', origin: 'Brooklyn, NY', destination: 'LES Hub, NYC', 
            status: 'In Transit', eta: new Date(Date.now() + 7200000).toISOString(), shipDate: new Date().toISOString(), 
            type: 'land', tracking: 'BKN-SPR-99', items: [{ name: 'Brooklyn Roasting Beans', qty: 24 }],
            originLat: 40.7013, originLon: -73.9875, destLat: 40.7183, destLon: -73.9889
          },
          { 
            id: 'ASN-NYC-02', supplier: 'Balthazar Bakery', origin: 'SoHo, NY', destination: 'LES Hub, NYC', 
            status: 'Delayed', eta: new Date(Date.now() + 14400000).toISOString(), shipDate: new Date().toISOString(), 
            type: 'land', tracking: 'BAL-VAN-01', items: [{ name: 'Balthazar Croissants', qty: 40 }],
            originLat: 40.7226, originLon: -73.9983, destLat: 40.7183, destLon: -73.9889
          },
        ]

        set({ 
          inventory: nycInventory, 
          recommendations: nycRecs, 
          shipments: nycShipments,
          pendingPutAway: [
            { id: 'PA-NYC-1', name: 'Oatly Barista Edition', qty: 12, sku: 'NYC-OAT-01' }
          ]
        })
      }
    }),
    { name: 'zo-flow-production-v1' }
  )
)

export const PRE_DEFINED_CATALOG = [
  { id: 'latte', name: 'Brooklyn Roasting Beans', category: 'Coffee', uom: 'kg', price: 22.50, reorderPoint: 25, utilizationRateWeek: 5.2, utilizationRateMonth: 22.5, safetyStock: 10, growthRate: 1.2 },
  { id: 'milk', name: 'Oatly Barista Edition', category: 'Dairy', uom: 'L', price: 3.80, reorderPoint: 50, utilizationRateWeek: 12.0, utilizationRateMonth: 50.0, safetyStock: 20, growthRate: 2.5 },
  { id: 'croissant', name: 'Balthazar Croissants', category: 'Pastries', uom: 'units', price: 4.50, reorderPoint: 20, utilizationRateWeek: 85.0, utilizationRateMonth: 340.0, safetyStock: 10, growthRate: 0.5 }
]