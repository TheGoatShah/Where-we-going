import { motion } from 'framer-motion'
import { useRestaurantStore } from '../store/restaurantStore'

export function ErrorBanner() {
  const { error, reset } = useRestaurantStore()

  if (!error) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-2xl mx-auto px-4 py-3 rounded-xl text-sm text-center"
      style={{
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.3)',
        color: 'rgba(252,165,165,1)',
      }}
    >
      <span className="mr-2">⚠️</span>
      {error}
      <button
        onClick={reset}
        className="ml-3 underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity duration-200"
      >
        Dismiss
      </button>
    </motion.div>
  )
}
