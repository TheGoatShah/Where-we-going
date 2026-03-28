import type {
  NearbySearchResponse,
  GooglePlaceResult,
  Restaurant,
  AutocompleteResponse,
  AutocompletePrediction,
} from '../types'
import {
  PLACES_FIELD_MASK,
  NEARBY_MAX_RESULTS,
  CUISINE_TO_GOOGLE_TYPES,
  GOOGLE_PRICE_MAP,
} from '../constants'
import { milesToMeters, getDistanceMiles } from '../utils/distance'

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string
const BASE_URL = 'https://places.googleapis.com/v1'

// ─── Nearby Search ────────────────────────────────────────────────────────────

interface NearbySearchParams {
  lat: number
  lng: number
  radiusMiles: number
  cuisines?: string[] // app cuisine labels
}

export async function searchNearbyRestaurants(
  params: NearbySearchParams,
): Promise<Restaurant[]> {
  const { lat, lng, radiusMiles, cuisines = [] } = params

  // Build includedTypes from selected cuisines
  const includedTypes = cuisines.flatMap((c) => CUISINE_TO_GOOGLE_TYPES[c] ?? [])

  const body: Record<string, unknown> = {
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: milesToMeters(radiusMiles),
      },
    },
    maxResultCount: NEARBY_MAX_RESULTS,
    rankPreference: 'POPULARITY',
  }

  // Only add includedTypes if specific cuisines are selected
  // If 'Gluten Free' is the only selection (no direct type), skip and handle client-side
  if (includedTypes.length > 0) {
    // Filter out the generic 'restaurant' fallback to avoid overly broad results
    const specificTypes = includedTypes.filter((t) => t !== 'restaurant')
    if (specificTypes.length > 0) {
      body.includedTypes = specificTypes
    }
  }

  // If no specific types, use a broad restaurant type
  if (!body.includedTypes) {
    body.includedPrimaryTypes = ['restaurant']
  }

  const response = await fetch(`${BASE_URL}/places:searchNearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': PLACES_FIELD_MASK,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `Places API error: ${response.status}`)
  }

  const data: NearbySearchResponse = await response.json()
  return (data.places ?? []).map((p) => mapPlaceToRestaurant(p, lat, lng))
}

// ─── Photo URL ────────────────────────────────────────────────────────────────

export function getPhotoUrl(photoName: string, maxWidth = 800): string {
  return `${BASE_URL}/${photoName}/media?maxWidthPx=${maxWidth}&key=${API_KEY}`
}

// ─── Autocomplete ─────────────────────────────────────────────────────────────

export async function getAutocompleteSuggestions(
  input: string,
): Promise<AutocompletePrediction[]> {
  if (!input.trim()) return []

  const response = await fetch(`${BASE_URL}/places:autocomplete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
    },
    body: JSON.stringify({
      input,
      includedRegionCodes: ['us'],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    console.error('[Autocomplete] API error:', response.status, err?.error?.message ?? err)
    return []
  }

  const data: AutocompleteResponse = await response.json()
  console.log('[Autocomplete] raw response:', data)
  return (data.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter(Boolean)
    .slice(0, 5)
}

// ─── Geocoding ────────────────────────────────────────────────────────────────

type GeocodeResult = { lat: number; lng: number; formattedAddress: string } | null

async function parseGeocodeResponse(response: Response): Promise<GeocodeResult> {
  if (!response.ok) return null
  const data = await response.json()
  if (data.status !== 'OK' || !data.results?.[0]) return null
  const result = data.results[0]
  return {
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
    formattedAddress: result.formatted_address,
  }
}

export async function geocodeByPlaceId(placeId: string): Promise<GeocodeResult> {
  const params = new URLSearchParams({ place_id: placeId, key: API_KEY })
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`)
  return parseGeocodeResponse(response)
}

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const params = new URLSearchParams({ address, key: API_KEY })
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`)
  return parseGeocodeResponse(response)
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

function mapPlaceToRestaurant(
  place: GooglePlaceResult,
  originLat: number,
  originLng: number,
): Restaurant {
  const lat = place.location?.latitude ?? 0
  const lng = place.location?.longitude ?? 0

  const priceStr = place.priceLevel ?? ''
  const priceLevel = GOOGLE_PRICE_MAP[priceStr] ?? null

  const openingHours = place.currentOpeningHours ?? place.regularOpeningHours ?? null
  const isOpenNow = place.currentOpeningHours?.openNow ?? null

  const distance = getDistanceMiles(originLat, originLng, lat, lng)

  return {
    id: place.id,
    name: place.displayName?.text ?? 'Unknown Restaurant',
    address: place.formattedAddress ?? '',
    lat,
    lng,
    rating: place.rating ?? null,
    userRatingCount: place.userRatingCount,
    priceLevel,
    primaryType: place.primaryTypeDisplayName?.text ?? null,
    cuisineLabel: place.primaryTypeDisplayName?.text ?? null,
    photos: place.photos ?? [],
    openingHours,
    isOpenNow,
    phoneNumber: place.nationalPhoneNumber,
    website: place.websiteUri,
    distanceMiles: Math.round(distance * 10) / 10,
  }
}
