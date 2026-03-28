import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Restaurant } from '../../types'
import { PRICE_LABELS } from '../../constants'
import { getPhotoUrl } from '../../services/placesApi'
import { shareRestaurant, getMapsUrl } from '../../utils/share'
import { useFavoritesStore } from '../../store/favoritesStore'
import { useRestaurantStore } from '../../store/restaurantStore'
import {
  StarIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
  DirectionsIcon,
  ShareIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  GlobeIcon,
} from '../ui/icons'

interface RestaurantCardProps {
  restaurant: Restaurant
  index?: number
}

export function RestaurantCard({ restaurant, index = 0 }: RestaurantCardProps) {
  const { add, remove, isFavorite } = useFavoritesStore()
  const { addToRecentlyViewed } = useRestaurantStore()
  const [shareFeedback, setShareFeedback] = useState(false)
  const [imgError, setImgError] = useState(false)

  const favorited = isFavorite(restaurant.id)
  const photoUrl =
    !imgError && restaurant.photos[0]
      ? getPhotoUrl(restaurant.photos[0].name)
      : null

  const handleFavorite = () => {
    if (favorited) {
      remove(restaurant.id)
    } else {
      add(restaurant)
      addToRecentlyViewed(restaurant)
    }
  }

  const handleShare = async () => {
    const ok = await shareRestaurant(restaurant)
    if (ok) {
      setShareFeedback(true)
      setTimeout(() => setShareFeedback(false), 2000)
    }
  }

  const priceStr = restaurant.priceLevel ? PRICE_LABELS[restaurant.priceLevel] : null
  const isOpen = restaurant.isOpenNow
  const ratingCount = restaurant.userRatingCount
    ? restaurant.userRatingCount > 1000
      ? `${(restaurant.userRatingCount / 1000).toFixed(1)}k`
      : String(restaurant.userRatingCount)
    : null

  return (
    <motion.article
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 25, delay: index * 0.1 }}
      className="rounded-2xl overflow-hidden flex flex-col border"
      style={{
        background: 'var(--surface-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'var(--surface-border)',
        boxShadow: 'var(--surface-shadow)',
      }}
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: 'var(--item-bg)' }}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-30">🍽️</span>
          </div>
        )}

        {/* Open/closed badge */}
        {isOpen !== null && (
          <div
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
              isOpen ? 'bg-emerald-500/90 text-white' : 'bg-black/70 text-white/70'
            }`}
          >
            {isOpen ? '● Open' : '● Closed'}
          </div>
        )}

        {/* Favorite button */}
        <motion.button
          onClick={handleFavorite}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors duration-200"
          whileTap={{ scale: 0.85 }}
          aria-label={favorited ? 'Remove from saved' : 'Save restaurant'}
        >
          {favorited ? (
            <BookmarkFilledIcon className="w-4 h-4 text-primary" />
          ) : (
            <BookmarkIcon className="w-4 h-4 text-white" />
          )}
        </motion.button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Name + cuisine */}
        <div>
          <h3 className="font-bold text-lg leading-tight line-clamp-2 t-primary">
            {restaurant.name}
          </h3>
          {restaurant.cuisineLabel && (
            <p className="text-sm t-secondary mt-0.5">{restaurant.cuisineLabel}</p>
          )}
        </div>

        {/* Rating · Price · Distance */}
        <div className="flex items-center gap-3 flex-wrap">
          {restaurant.rating !== null && (
            <div className="flex items-center gap-1">
              <StarIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm font-semibold t-primary">
                {restaurant.rating.toFixed(1)}
              </span>
              {ratingCount && (
                <span className="text-xs t-muted">({ratingCount})</span>
              )}
            </div>
          )}

          {priceStr && (
            <span className="text-sm font-semibold text-primary">{priceStr}</span>
          )}

          {restaurant.distanceMiles !== undefined && (
            <div className="flex items-center gap-1">
              <MapPinIcon className="w-3 h-3 t-muted" style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs t-secondary">{restaurant.distanceMiles} mi</span>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5">
          <MapPinIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
          <p className="text-xs t-secondary leading-relaxed line-clamp-2">
            {restaurant.address}
          </p>
        </div>

        {/* Hours preview */}
        {restaurant.openingHours?.weekdayDescriptions?.[0] && (
          <div className="flex items-start gap-1.5">
            <ClockIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
            <p className="text-xs t-muted line-clamp-1">
              {restaurant.openingHours.weekdayDescriptions[
                new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
              ] ?? restaurant.openingHours.weekdayDescriptions[0]}
            </p>
          </div>
        )}

        {/* Phone */}
        {restaurant.phoneNumber && (
          <div className="flex items-center gap-1.5">
            <PhoneIcon className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
            <a
              href={`tel:${restaurant.phoneNumber}`}
              className="text-xs t-secondary hover:text-primary transition-colors duration-200"
              style={{ color: 'var(--text-secondary)' }}
            >
              {restaurant.phoneNumber}
            </a>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto pt-1">
          <motion.a
            href={getMapsUrl(restaurant)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => addToRecentlyViewed(restaurant)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors duration-200"
            style={{
              background: 'rgb(var(--color-primary-rgb))',
              color: '#fff',
              boxShadow: '0 0 16px var(--color-primary-glow)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <DirectionsIcon className="w-3.5 h-3.5" />
            Directions
          </motion.a>

          {restaurant.website && (
            <motion.a
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors duration-200"
              style={{
                background: 'var(--item-bg)',
                borderColor: 'var(--item-border)',
                color: 'var(--text-primary)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <GlobeIcon className="w-3.5 h-3.5" />
              Website & Menu
            </motion.a>
          )}

          <motion.button
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200"
            style={{
              background: shareFeedback ? 'rgba(16,185,129,0.15)' : 'var(--item-bg)',
              borderColor: shareFeedback ? 'rgba(16,185,129,0.4)' : 'var(--item-border)',
              color: shareFeedback ? 'rgb(52,211,153)' : 'var(--text-secondary)',
            }}
            whileTap={{ scale: 0.9 }}
            aria-label="Share restaurant"
          >
            <ShareIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
