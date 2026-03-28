import { useCallback } from 'react'
import { useFilterStore } from '../store/filterStore'
import { useRestaurantStore } from '../store/restaurantStore'
import { useFavoritesStore } from '../store/favoritesStore'
import { searchNearbyRestaurants } from '../services/placesApi'
import { shuffle } from '../utils/shuffle'
import { buildTasteProfile, scoreRestaurant } from '../utils/tasteProfile'
import type { ActionMode, Restaurant } from '../types'

export function useRestaurants() {
  const filters = useFilterStore()
  const store = useRestaurantStore()
  const { favorites } = useFavoritesStore()

  // ─── Apply client-side filters ────────────────────────────────────────────

  const applyFilters = useCallback(
    (restaurants: Restaurant[]): Restaurant[] => {
      return restaurants.filter((r) => {
        // Rating filter
        if (filters.minRating > 0 && (r.rating ?? 0) < filters.minRating) return false

        // Price filter
        if (filters.priceRange.length > 0) {
          if (r.priceLevel === null) return false
          if (!filters.priceRange.includes(r.priceLevel)) return false
        }

        // Open now filter
        if (filters.openNow && r.isOpenNow === false) return false

        // Distance filter (precise haversine — API radius is approximate)
        if (r.distanceMiles !== undefined && r.distanceMiles > filters.maxDistance) return false

        return true
      })
    },
    [filters.minRating, filters.priceRange, filters.openNow, filters.maxDistance],
  )

  // ─── Pick results from pool ───────────────────────────────────────────────

  const pickFromPool = useCallback(
    (pool: Restaurant[], mode: ActionMode): Restaurant[] => {
      const shuffled = shuffle(pool)
      return mode === 'options' ? shuffled.slice(0, 3) : shuffled.slice(0, 1)
    },
    [],
  )

  // ─── Fetch + set pool ─────────────────────────────────────────────────────

  const fetchAndSet = useCallback(
    async (mode: ActionMode, ignoreFilers = false) => {
      if (!filters.location) return

      store.setStatus('loading')
      store.setMode(mode)
      store.setError(null)

      try {
        const raw = await searchNearbyRestaurants({
          lat: filters.location.lat,
          lng: filters.location.lng,
          radiusMiles: ignoreFilers ? 15 : filters.maxDistance,
          cuisines: ignoreFilers ? [] : filters.cuisines,
        })

        let pool = ignoreFilers ? raw : applyFilters(raw)

        // Apply taste profile weighting if user has 3+ favorites
        const profile = buildTasteProfile(favorites)
        if (profile && pool.length > 0) {
          pool = [...pool].sort(
            (a, b) => scoreRestaurant(b, profile) - scoreRestaurant(a, profile),
          )
        }

        store.setPool(pool)

        if (pool.length === 0) {
          store.setDisplayed([])
          store.setStatus('success')
          return
        }

        const displayed = pickFromPool(pool, mode)
        store.setDisplayed(displayed)
        store.setStatus('success')
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong. Please try again.'
        store.setError(message)
        store.setStatus('error')
      }
    },
    [filters, store, applyFilters, pickFromPool],
  )

  // ─── Action handlers ──────────────────────────────────────────────────────

  const surpriseMe = useCallback(() => {
    store.setSpinning(true)
    return fetchAndSet('surprise')
  }, [fetchAndSet, store])

  const giveMeOptions = useCallback(() => fetchAndSet('options'), [fetchAndSet])

  const feelingLucky = useCallback(
    () => fetchAndSet('lucky', true),
    [fetchAndSet],
  )

  const tryAgain = useCallback(() => {
    const { pool, mode } = store
    if (pool.length === 0 || !mode) return

    // Re-pick from existing pool without a new API call
    const displayed = pickFromPool(pool, mode === 'lucky' || mode === 'now' ? 'surprise' : mode)
    store.setDisplayed(displayed)
  }, [store, pickFromPool])

  const needFoodNow = useCallback(async () => {
    if (!filters.location) return

    store.setStatus('loading')
    store.setMode('now')
    store.setError(null)

    try {
      const raw = await searchNearbyRestaurants({
        lat: filters.location.lat,
        lng: filters.location.lng,
        radiusMiles: 1,
        cuisines: [],
      })

      // Only open places, sorted by rating desc, taste profile boost
      const open = raw.filter((r) => r.isOpenNow !== false)
      const profile = buildTasteProfile(favorites)
      const sorted = [...open].sort((a, b) => {
        const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0)
        const tasteDiff = profile
          ? scoreRestaurant(b, profile) - scoreRestaurant(a, profile)
          : 0
        return tasteDiff !== 0 ? tasteDiff : ratingDiff
      })

      store.setPool(sorted)

      if (sorted.length === 0) {
        store.setDisplayed([])
        store.setStatus('success')
        return
      }

      store.setDisplayed([sorted[0]])
      store.setStatus('success')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      store.setError(message)
      store.setStatus('error')
    }
  }, [filters.location, store])

  return { surpriseMe, giveMeOptions, feelingLucky, tryAgain, needFoodNow }
}
