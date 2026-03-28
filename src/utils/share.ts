import type { Restaurant } from '../types'
import { PRICE_LABELS } from '../constants'

export async function shareRestaurant(restaurant: Restaurant): Promise<boolean> {
  const price = restaurant.priceLevel ? PRICE_LABELS[restaurant.priceLevel] : ''
  const rating = restaurant.rating ? `${restaurant.rating} stars` : ''
  const details = [restaurant.cuisineLabel, price, rating].filter(Boolean).join(' · ')

  const text = `${restaurant.name}\n${details}\n${restaurant.address}\n\nFound on Where We Going? 🍽️`

  try {
    if (navigator.share) {
      await navigator.share({ title: restaurant.name, text })
      return true
    }
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function getMapsUrl(restaurant: Restaurant): string {
  const query = encodeURIComponent(`${restaurant.name} ${restaurant.address}`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}
