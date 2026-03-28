import { create } from 'zustand'
import type { FilterState, Location } from '../types'
import { DISTANCE_DEFAULT, MOOD_CONFIG } from '../constants'

interface FilterStore extends FilterState {
  setLocation: (location: Location | null) => void
  setMood: (mood: string | null) => void
  toggleCuisine: (cuisine: string) => void
  setCuisines: (cuisines: string[]) => void
  togglePrice: (level: number) => void
  setPriceRange: (levels: number[]) => void
  setMaxDistance: (miles: number) => void
  setMinRating: (rating: number) => void
  setOpenNow: (value: boolean) => void
  resetFilters: () => void
}

const defaultState: FilterState = {
  location: null,
  mood: null,
  cuisines: [],
  priceRange: [],
  maxDistance: DISTANCE_DEFAULT,
  minRating: 0,
  openNow: false,
}

export const useFilterStore = create<FilterStore>((set) => ({
  ...defaultState,

  setLocation: (location) => set({ location }),

  setMood: (mood) =>
    set(() => {
      if (!mood) return { mood: null, cuisines: [], priceRange: [] }
      const config = MOOD_CONFIG[mood]
      return {
        mood,
        cuisines: config?.cuisines ?? [],
        priceRange: config?.priceRange ?? [],
      }
    }),

  toggleCuisine: (cuisine) =>
    set((state) => ({
      mood: null, // clear mood when manually tweaking cuisines
      cuisines: state.cuisines.includes(cuisine)
        ? state.cuisines.filter((c) => c !== cuisine)
        : [...state.cuisines, cuisine],
    })),

  setCuisines: (cuisines) => set({ cuisines }),

  togglePrice: (level) =>
    set((state) => ({
      priceRange: state.priceRange.includes(level)
        ? state.priceRange.filter((p) => p !== level)
        : [...state.priceRange, level],
    })),

  setPriceRange: (levels) => set({ priceRange: levels }),

  setMaxDistance: (miles) => set({ maxDistance: miles }),

  setMinRating: (rating) => set({ minRating: rating }),

  setOpenNow: (value) => set({ openNow: value }),

  resetFilters: () => set(defaultState),
}))
