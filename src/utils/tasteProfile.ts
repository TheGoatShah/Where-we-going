import type { Restaurant } from '../types'

interface TasteProfile {
  topCuisines: string[]
  avgPrice: number
}

export function buildTasteProfile(favorites: Restaurant[]): TasteProfile | null {
  if (favorites.length < 3) return null

  // Count cuisine frequency
  const cuisineCounts: Record<string, number> = {}
  for (const r of favorites) {
    if (r.cuisineLabel) {
      cuisineCounts[r.cuisineLabel] = (cuisineCounts[r.cuisineLabel] ?? 0) + 1
    }
  }
  const topCuisines = Object.entries(cuisineCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cuisine]) => cuisine)

  // Average price level
  const pricedFavs = favorites.filter((r) => r.priceLevel !== null)
  const avgPrice =
    pricedFavs.length > 0
      ? pricedFavs.reduce((sum, r) => sum + (r.priceLevel ?? 0), 0) / pricedFavs.length
      : 2

  return { topCuisines, avgPrice }
}

export function scoreRestaurant(r: Restaurant, profile: TasteProfile): number {
  let score = 0

  // Cuisine match (+0.5)
  if (r.cuisineLabel && profile.topCuisines.includes(r.cuisineLabel)) {
    score += 0.5
  }

  // Price match — within 1 level of avg (+0.5)
  if (r.priceLevel !== null && Math.abs(r.priceLevel - profile.avgPrice) <= 1) {
    score += 0.5
  }

  return score
}
