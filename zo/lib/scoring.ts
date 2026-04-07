/**
 * Weighted scoring engine for supplier ranking
 */

export interface Supplier {
  id: string
  name: string
  price: number
  leadTime: number
  quality: number
  reliability: number
  sustainability: number
  [key: string]: unknown
}

export interface Weights {
  price: number         // 0–100
  leadTime: number      // 0–100
  quality: number       // 0–100
  reliability: number   // 0–100
  sustainability: number // 0–100
}

export const DEFAULT_WEIGHTS: Weights = {
  price: 30,
  leadTime: 25,
  quality: 25,
  reliability: 15,
  sustainability: 5,
}

/**
 * Normalise a raw metric value to a 0–100 score.
 * For "lower is better" metrics (price, leadTime), we invert.
 */
function normalise(value: number, min: number, max: number, higherIsBetter: boolean): number {
  if (max === min) return 100
  const raw = (value - min) / (max - min)
  return Math.round((higherIsBetter ? raw : 1 - raw) * 100)
}

/**
 * Score a list of suppliers given weights.
 * Returns a sorted array (highest score first) with a `score` property.
 */
export function scoreSuppliers<T extends Supplier>(
  suppliers: T[],
  weights: Weights = DEFAULT_WEIGHTS,
): Array<T & { score: number }> {
  if (!suppliers.length) return []

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 100

  const prices      = suppliers.map(s => s.price)
  const leads       = suppliers.map(s => s.leadTime)

  const minPrice = Math.min(...prices), maxPrice = Math.max(...prices)
  const minLead  = Math.min(...leads),  maxLead  = Math.max(...leads)

  const scored = suppliers.map(s => {
    const priceScore   = normalise(s.price,        minPrice, maxPrice, false)
    const leadScore    = normalise(s.leadTime,      minLead,  maxLead,  false)
    const qualScore    = s.quality        // already 0–100
    const relScore     = s.reliability   // already 0–100
    const susScore     = s.sustainability // already 0–100

    const weighted =
      priceScore * (weights.price / totalWeight) +
      leadScore  * (weights.leadTime / totalWeight) +
      qualScore  * (weights.quality / totalWeight) +
      relScore   * (weights.reliability / totalWeight) +
      susScore   * (weights.sustainability / totalWeight)

    return { ...s, score: Math.round(weighted) }
  })

  return scored.sort((a, b) => b.score - a.score)
}

/**
 * Get a colour class name based on score value.
 */
export function scoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-400'
  if (score >= 75) return 'text-indigo-400'
  if (score >= 60) return 'text-amber-400'
  return 'text-red-400'
}

export function scoreBgColor(score: number): string {
  if (score >= 90) return 'rgba(16,185,129,0.15)'
  if (score >= 75) return 'rgba(99,102,241,0.15)'
  if (score >= 60) return 'rgba(245,158,11,0.15)'
  return 'rgba(239,68,68,0.15)'
}
