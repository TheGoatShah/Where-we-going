// ─── Core Domain Types ────────────────────────────────────────────────────────

export interface LatLng {
  lat: number
  lng: number
}

export interface Location {
  address: string
  lat: number
  lng: number
}

export interface RestaurantPhoto {
  name: string // Google photo resource name
  widthPx: number
  heightPx: number
}

export interface OpeningHours {
  openNow?: boolean
  periods?: {
    open: { day: number; hour: number; minute: number }
    close?: { day: number; hour: number; minute: number }
  }[]
  weekdayDescriptions?: string[]
}

export interface Restaurant {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  rating: number | null
  userRatingCount?: number
  priceLevel: number | null // 1–4 (Google's PRICE_LEVEL_INEXPENSIVE through PRICE_LEVEL_VERY_EXPENSIVE)
  primaryType: string | null
  cuisineLabel: string | null
  photos: RestaurantPhoto[]
  openingHours: OpeningHours | null
  isOpenNow: boolean | null
  phoneNumber?: string
  website?: string
  distanceMiles?: number // computed client-side
}

// ─── Filter State ─────────────────────────────────────────────────────────────

export interface FilterState {
  location: Location | null
  mood: string | null
  cuisines: string[] // app cuisine labels
  priceRange: number[] // [1,2,3,4]
  maxDistance: number // miles
  minRating: number // 0 = any
  openNow: boolean
}

// ─── App State ────────────────────────────────────────────────────────────────

export type ActionMode = 'surprise' | 'options' | 'lucky' | 'now'
export type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

export interface RestaurantState {
  pool: Restaurant[]
  displayed: Restaurant[]
  status: FetchStatus
  error: string | null
  mode: ActionMode | null
  recentlyViewed: Restaurant[]
}

export interface FavoritesState {
  favorites: Restaurant[]
  isOpen: boolean
  activeTab: 'saved' | 'recent'
}

// ─── Google Places API Types ──────────────────────────────────────────────────

export interface GooglePlaceResult {
  id: string
  displayName?: { text: string; languageCode: string }
  formattedAddress?: string
  location?: { latitude: number; longitude: number }
  rating?: number
  userRatingCount?: number
  priceLevel?: string // e.g. "PRICE_LEVEL_MODERATE"
  primaryTypeDisplayName?: { text: string; languageCode: string }
  photos?: { name: string; widthPx: number; heightPx: number }[]
  regularOpeningHours?: OpeningHours
  currentOpeningHours?: OpeningHours & { openNow: boolean }
  nationalPhoneNumber?: string
  websiteUri?: string
}

export interface NearbySearchResponse {
  places: GooglePlaceResult[]
}

export interface AutocompletePrediction {
  placeId: string
  text: { text: string; matches: { endOffset: number }[] }
  structuredFormat?: {
    mainText: { text: string }
    secondaryText: { text: string }
  }
}

export interface AutocompleteResponse {
  suggestions: { placePrediction: AutocompletePrediction }[]
}

export interface GeocodeResponse {
  results: {
    geometry: { location: { lat: number; lng: number } }
    formatted_address: string
  }[]
  status: string
}
