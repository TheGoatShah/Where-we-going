import { motion } from 'framer-motion'
import type { Restaurant } from '../../types'
import { RestaurantCard } from './RestaurantCard'

interface SurpriseRevealProps {
  restaurant: Restaurant
}

export function SurpriseReveal({ restaurant }: SurpriseRevealProps) {
  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Dramatic entrance: scale up from nothing with a bounce */}
      <motion.div
        key={restaurant.id}
        initial={{ opacity: 0, scale: 0.5, rotateY: -15 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 18,
          duration: 0.6,
        }}
        style={{ transformPerspective: 800 }}
      >
        {/* Glow pulse behind card */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-primary/20 blur-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.1, 1] }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <div className="relative">
          <RestaurantCard restaurant={restaurant} index={0} />
        </div>
      </motion.div>
    </div>
  )
}
