import { motion } from 'framer-motion'
import { useFilterStore } from '../store/filterStore'

export function EmptyState() {
  const { resetFilters } = useFilterStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto text-center py-10"
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-6xl mb-5"
      >
        🍽️
      </motion.div>

      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No restaurants found</h3>
      <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
        We couldn't find any restaurants matching your filters. Try widening your search —
        increase the distance, remove some cuisine filters, or turn off "Open now".
      </p>

      <motion.button
        onClick={resetFilters}
        className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors duration-200"
        style={{ boxShadow: '0 0 20px var(--color-primary-glow)' }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        Reset Filters
      </motion.button>
    </motion.div>
  )
}
