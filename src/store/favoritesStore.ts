import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Restaurant } from '../types'

interface FavoritesStore {
  favorites: Restaurant[]
  isOpen: boolean
  activeTab: 'saved' | 'recent'

  add: (restaurant: Restaurant) => void
  remove: (id: string) => void
  isFavorite: (id: string) => boolean
  toggleDrawer: () => void
  setDrawerOpen: (open: boolean) => void
  setActiveTab: (tab: 'saved' | 'recent') => void
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      isOpen: false,
      activeTab: 'saved',

      add: (restaurant) =>
        set((state) => ({
          favorites: state.favorites.some((f) => f.id === restaurant.id)
            ? state.favorites
            : [restaurant, ...state.favorites],
        })),

      remove: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),

      isFavorite: (id) => get().favorites.some((f) => f.id === id),

      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

      setDrawerOpen: (open) => set({ isOpen: open }),

      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'wwg-favorites',
      // Only persist favorites, not drawer UI state
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
)
