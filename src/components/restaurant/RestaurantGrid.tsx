import { motion } from 'framer-motion'
import { RestaurantCard } from './RestaurantCard'
import { RestaurantCardSkeleton } from './RestaurantCardSkeleton'
import { SurpriseReveal } from './SurpriseReveal'
import { SpinWheel } from './SpinWheel'
import { useRestaurantStore } from '../../store/restaurantStore'

export function RestaurantGrid() {
  const { displayed, status, mode, isSpinning, setSpinning } = useRestaurantStore()

  // Show spin wheel for surprise mode while spinning
  if (mode === 'surprise' && isSpinning) {
    return <SpinWheel onDone={() => setSpinning(false)} />
  }

  if (status === 'loading') {
    const count = mode === 'options' ? 3 : 1
    return (
      <motion.div
        className={`w-full grid gap-4 ${
          count === 1 ? 'max-w-sm mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <RestaurantCardSkeleton key={i} />
        ))}
      </motion.div>
    )
  }

  if (!displayed.length) return null

  // Single card (surprise / lucky / now) — dramatic reveal
  if (displayed.length === 1) {
    return <SurpriseReveal restaurant={displayed[0]} />
  }

  // Multiple cards (options) — staggered grid
  return (
    <motion.div
      className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {displayed.map((r, i) => (
        <RestaurantCard key={r.id} restaurant={r} index={i} />
      ))}
    </motion.div>
  )
}
