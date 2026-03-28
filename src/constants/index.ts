// ─── Cuisine Options ──────────────────────────────────────────────────────────

export const CUISINES = [
  'Italian',
  'Japanese',
  'Mexican',
  'Indian',
  'Chinese',
  'American',
  'Thai',
  'Mediterranean',
  'Korean',
  'French',
  'Middle Eastern',
  'Vegetarian/Vegan',
  'Gluten Free',
] as const

export type CuisineLabel = (typeof CUISINES)[number]

// Maps app cuisine labels to Google Places API type strings
export const CUISINE_TO_GOOGLE_TYPES: Record<string, string[]> = {
  Italian: ['italian_restaurant'],
  Japanese: ['japanese_restaurant', 'sushi_restaurant', 'ramen_restaurant'],
  Mexican: ['mexican_restaurant'],
  Indian: ['indian_restaurant'],
  Chinese: ['chinese_restaurant'],
  American: ['american_restaurant', 'hamburger_restaurant', 'barbecue_restaurant'],
  Thai: ['thai_restaurant'],
  Mediterranean: ['mediterranean_restaurant', 'greek_restaurant', 'turkish_restaurant'],
  Korean: ['korean_restaurant'],
  French: ['french_restaurant'],
  'Middle Eastern': ['middle_eastern_restaurant', 'lebanese_restaurant', 'persian_restaurant'],
  'Vegetarian/Vegan': ['vegetarian_restaurant', 'vegan_restaurant'],
  'Gluten Free': ['restaurant'], // no direct type; will use text search as fallback
}

// ─── Price Levels ─────────────────────────────────────────────────────────────

export const PRICE_LABELS: Record<number, string> = {
  1: '$',
  2: '$$',
  3: '$$$',
  4: '$$$$',
}

export const PRICE_LABEL_TO_LEVEL: Record<string, number> = {
  $: 1,
  '$$': 2,
  $$$: 3,
  $$$$: 4,
}

// Google's priceLevel string → numeric mapping
export const GOOGLE_PRICE_MAP: Record<string, number> = {
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
}

// ─── Distance ────────────────────────────────────────────────────────────────

export const DISTANCE_MIN = 0.5
export const DISTANCE_MAX = 15
export const DISTANCE_DEFAULT = 5

// ─── Nearby Search ───────────────────────────────────────────────────────────

export const NEARBY_MAX_RESULTS = 20

// Field mask for cost optimization — only request what we display
export const PLACES_FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.userRatingCount',
  'places.priceLevel',
  'places.primaryTypeDisplayName',
  'places.location',
  'places.photos',
  'places.regularOpeningHours',
  'places.currentOpeningHours',
  'places.nationalPhoneNumber',
  'places.websiteUri',
].join(',')

// ─── Moods ────────────────────────────────────────────────────────────────────

export interface MoodConfig {
  emoji: string
  label: string
  cuisines: string[]
  priceRange?: number[] // optional price hint
}

export const MOODS: string[] = [
  'Date Night',
  'Quick Bite',
  'Comfort Food',
  'Something Healthy',
  'Treat Yourself',
  'Adventure',
]

export const MOOD_CONFIG: Record<string, MoodConfig> = {
  'Date Night': {
    emoji: '🕯️',
    label: 'Date Night',
    cuisines: ['Italian', 'French', 'Mediterranean'],
    priceRange: [3, 4],
  },
  'Quick Bite': {
    emoji: '⚡',
    label: 'Quick Bite',
    cuisines: ['American', 'Mexican', 'Chinese'],
    priceRange: [1, 2],
  },
  'Comfort Food': {
    emoji: '🍲',
    label: 'Comfort Food',
    cuisines: ['American', 'Korean', 'Indian'],
  },
  'Something Healthy': {
    emoji: '🥗',
    label: 'Something Healthy',
    cuisines: ['Vegetarian/Vegan', 'Mediterranean'],
  },
  'Treat Yourself': {
    emoji: '🥩',
    label: 'Treat Yourself',
    cuisines: ['American', 'French', 'Japanese'],
    priceRange: [3, 4],
  },
  Adventure: {
    emoji: '🌍',
    label: 'Adventure',
    cuisines: ['Thai', 'Indian', 'Middle Eastern', 'Korean'],
  },
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export const RECENTLY_VIEWED_LIMIT = 5
export const AUTOCOMPLETE_DEBOUNCE_MS = 300
