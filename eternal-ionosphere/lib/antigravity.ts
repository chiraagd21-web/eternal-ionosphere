/**
 * Antigravity API Client
 * TypeScript client for the FastAPI backend running on localhost:8000
 */

const BASE_URL = process.env.ANTIGRAVITY_API_URL || 'http://localhost:8000'

export interface SupplierResult {
  id: string
  name: string
  country: string
  flag: string
  category: string
  score: number
  price: number
  leadTime: number
  rating: number
  verified: boolean
  shortlisted: boolean
}

export interface SearchPayload { query: string; category?: string; limit?: number }
export interface SearchResponse { suppliers: SupplierResult[]; total: number; source: string }

export interface RFQPayload {
  product: string; category: string; quantity: number
  targetPrice: string; deadline: string; requirements: string
  suppliers: string[]
  lineItems: Array<{ description: string; qty: number; unit: string; notes: string }>
}
export interface RFQResponse { rfq_text: string; reference: string }

export interface ScorePayload { suppliers: SupplierResult[]; weights: Record<string, number> }
export interface ScoreResponse { ranked: Array<SupplierResult & { weighted_score: number }> }

export interface EmailPayload { to: string[]; subject: string; rfq_text: string }
export interface EmailResponse { sent: number; failed: number; message_ids: string[] }

export interface LandedCostPayload {
  unit_price: number; quantity: number; origin_country: string
  destination_country: string; weight_kg: number; hs_code?: string
}
export interface LandedCostResponse {
  unit_price: number; subtotal: number; freight: number
  duties: number; insurance: number; total: number; landed_unit_cost: number
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`AG API error ${res.status}: ${err}`)
  }
  return res.json() as Promise<T>
}

export const antigravity = {
  /** POST /ag/supplier-search */
  async searchSuppliers(payload: SearchPayload): Promise<SearchResponse> {
    return request<SearchResponse>('/ag/supplier-search', {
      method: 'POST', body: JSON.stringify(payload),
    })
  },

  /** POST /ag/generate-rfq */
  async generateRFQ(payload: RFQPayload): Promise<RFQResponse> {
    return request<RFQResponse>('/ag/generate-rfq', {
      method: 'POST', body: JSON.stringify(payload),
    })
  },

  /** POST /ag/score */
  async scoreSuppliers(payload: ScorePayload): Promise<ScoreResponse> {
    return request<ScoreResponse>('/ag/score', {
      method: 'POST', body: JSON.stringify(payload),
    })
  },

  /** POST /ag/send-email */
  async sendEmail(payload: EmailPayload): Promise<EmailResponse> {
    return request<EmailResponse>('/ag/send-email', {
      method: 'POST', body: JSON.stringify(payload),
    })
  },

  /** POST /ag/calc-landed-cost */
  async calcLandedCost(payload: LandedCostPayload): Promise<LandedCostResponse> {
    return request<LandedCostResponse>('/ag/calc-landed-cost', {
      method: 'POST', body: JSON.stringify(payload),
    })
  },

  /** GET /health */
  async healthCheck(): Promise<{ status: string; version: string }> {
    return request('/health')
  },
}

export default antigravity
