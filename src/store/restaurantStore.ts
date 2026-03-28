import { create } from 'zustand'
import type { Restaurant, ActionMode, FetchStatus } from '../types'
import { RECENTLY_VIEWED_LIMIT } from '../constants'

interface RestaurantStore {
  pool: Restaurant[]
  displayed: Restaurant[]
  status: FetchStatus
  error: string | null
  mode: ActionMode | null
  recentlyViewed: Restaurant[]
  isSpinning: boolean

  setPool: (pool: Restaurant[]) => void
  setDisplayed: (restaurants: Restaurant[]) => void
  setStatus: (status: FetchStatus) => void
  setError: (error: string | null) => void
  setMode: (mode: ActionMode | null) => void
  setSpinning: (value: boolean) => void
  addToRecentlyViewed: (restaurant: Restaurant) => void
  reset: () => void
}

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  pool: [],
  displayed: [],
  status: 'idle',
  error: null,
  mode: null,
  recentlyViewed: [],
  isSpinning: false,

  setPool: (pool) => set({ pool }),

  setDisplayed: (restaurants) => set({ displayed: restaurants }),

  setStatus: (status) => set({ status }),

  setError: (error) => set({ error }),

  setMode: (mode) => set({ mode }),

  setSpinning: (value) => set({ isSpinning: value }),

  addToRecentlyViewed: (restaurant) =>
    set((state) => {
      const filtered = state.recentlyViewed.filter((r) => r.id !== restaurant.id)
      return {
        recentlyViewed: [restaurant, ...filtered].slice(0, RECENTLY_VIEWED_LIMIT),
      }
    }),

  reset: () =>
    set({ pool: [], displayed: [], status: 'idle', error: null, mode: null }),
}))
