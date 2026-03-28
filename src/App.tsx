import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { HeroBackground } from './components/layout/HeroBackground'
import { Header } from './components/layout/Header'
import { FilterPanel } from './components/filters/FilterPanel'
import { ActionButtons } from './components/ActionButtons'
import { RestaurantGrid } from './components/restaurant/RestaurantGrid'
import { FavoritesDrawer } from './components/drawers/FavoritesDrawer'
import { EmptyState } from './components/EmptyState'
import { ErrorBanner } from './components/ErrorBanner'
import { useRestaurantStore } from './store/restaurantStore'

function App() {
  const { status, displayed, pool, error } = useRestaurantStore()
  const resultsRef = useRef<HTMLDivElement>(null)

  const showEmpty = status === 'success' && pool.length === 0

  // Scroll to results when they arrive
  useEffect(() => {
    if (status === 'success' && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [status, displayed])

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      {/* Animated gradient background */}
      <HeroBackground />

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="relative z-10 px-4 pb-16 md:px-6 max-w-4xl mx-auto">
        {/* Hero headline */}
        <div className="text-center mb-8 mt-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold t-primary text-shadow leading-tight">
            Stop debating. Start eating.
          </h2>
          <p className="t-secondary mt-2 text-sm sm:text-base">
            We'll find the spot. You just show up.
          </p>
        </div>

        {/* Filter panel */}
        <div className="mb-5">
          <FilterPanel />
        </div>

        {/* Action buttons */}
        <div className="mb-8">
          <ActionButtons />
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <div className="mb-6">
              <ErrorBanner />
            </div>
          )}
        </AnimatePresence>

        {/* Results anchor */}
        <div ref={resultsRef} className="scroll-mt-8">
          {/* Empty state */}
          <AnimatePresence mode="wait">
            {showEmpty && <EmptyState />}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence mode="wait">
            {displayed.length > 0 && <RestaurantGrid />}
          </AnimatePresence>
        </div>
      </main>

      {/* Favorites drawer */}
      <FavoritesDrawer />
    </div>
  )
}

export default App
