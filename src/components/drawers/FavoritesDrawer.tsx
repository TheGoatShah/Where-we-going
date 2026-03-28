import { motion, AnimatePresence } from 'framer-motion'
import { useFavoritesStore } from '../../store/favoritesStore'
import { useRestaurantStore } from '../../store/restaurantStore'
import { PRICE_LABELS } from '../../constants'
import { getMapsUrl } from '../../utils/share'
import {
  XIcon,
  StarIcon,
  DirectionsIcon,
  BookmarkFilledIcon,
  MapPinIcon,
} from '../ui/icons'
import type { Restaurant } from '../../types'

function RestaurantRow({
  restaurant,
  onRemove,
}: {
  restaurant: Restaurant
  onRemove?: (id: string) => void
}) {
  const price = restaurant.priceLevel ? PRICE_LABELS[restaurant.priceLevel] : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-start gap-3 py-3 border-b last:border-0"
      style={{ borderColor: 'var(--item-border-subtle)' }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
          {restaurant.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {restaurant.cuisineLabel && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{restaurant.cuisineLabel}</span>
          )}
          {price && (
            <span className="text-xs font-semibold text-primary">{price}</span>
          )}
          {restaurant.rating !== null && (
            <span className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <StarIcon className="w-3 h-3 text-amber-400" />
              {restaurant.rating.toFixed(1)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <MapPinIcon className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{restaurant.address}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <a
          href={getMapsUrl(restaurant)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors duration-200"
          aria-label="Get directions"
        >
          <DirectionsIcon className="w-3.5 h-3.5" />
        </a>
        {onRemove && (
          <button
            onClick={() => onRemove(restaurant.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border transition-colors duration-200"
            style={{
              background: 'var(--item-bg)',
              borderColor: 'var(--item-border)',
              color: 'var(--text-muted)',
            }}
            aria-label="Remove from saved"
          >
            <XIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

export function FavoritesDrawer() {
  const { favorites, isOpen, activeTab, setDrawerOpen, setActiveTab, remove } = useFavoritesStore()
  const { recentlyViewed } = useRestaurantStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm flex flex-col border-l"
            style={{
              background: 'var(--drawer-bg)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderColor: 'var(--drawer-border)',
              boxShadow: '-8px 0 40px rgba(0,0,0,0.25)',
            }}
          >
            <div className="flex items-center justify-between px-5 py-5 border-b" style={{ borderColor: 'var(--item-border-subtle)' }}>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>My Restaurants</h2>
              <motion.button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border transition-colors duration-200"
                style={{ background: 'var(--item-bg)', borderColor: 'var(--item-border)', color: 'var(--text-secondary)' }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close drawer"
              >
                <XIcon className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="flex px-5 pt-4 gap-1">
              {(['saved', 'recent'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                    activeTab === tab ? 'bg-primary text-white' : ''
                  }`}
                  style={activeTab !== tab ? { color: 'var(--text-muted)' } : {}}
                >
                  {tab === 'saved' ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <BookmarkFilledIcon className="w-3.5 h-3.5" />
                      Saved{favorites.length > 0 && ` (${favorites.length})`}
                    </span>
                  ) : (
                    <span>Recent{recentlyViewed.length > 0 && ` (${recentlyViewed.length})`}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-5 pt-3 pb-6 scrollbar-hide">
              {activeTab === 'saved' && (
                <AnimatePresence mode="popLayout">
                  {favorites.length === 0 ? (
                    <motion.div key="empty-saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center">
                      <span className="text-5xl mb-4">🔖</span>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No saved restaurants yet.</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Tap the bookmark on any card to save it.</p>
                    </motion.div>
                  ) : (
                    favorites.map((r) => <RestaurantRow key={r.id} restaurant={r} onRemove={remove} />)
                  )}
                </AnimatePresence>
              )}
              {activeTab === 'recent' && (
                <AnimatePresence mode="popLayout">
                  {recentlyViewed.length === 0 ? (
                    <motion.div key="empty-recent" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center">
                      <span className="text-5xl mb-4">🕐</span>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No recently viewed restaurants.</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Restaurants you interact with will appear here.</p>
                    </motion.div>
                  ) : (
                    recentlyViewed.map((r) => <RestaurantRow key={r.id} restaurant={r} />)
                  )}
                </AnimatePresence>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
