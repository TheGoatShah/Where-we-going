import { motion } from 'framer-motion'
import { StarIcon } from './icons'

interface StarRatingProps {
  value: number // 0 = any
  onChange: (rating: number) => void
  max?: number
}

export function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {/* "Any" option */}
      <motion.button
        onClick={() => onChange(0)}
        className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors duration-200 ${
          value === 0 ? 'bg-primary text-white border-primary' : ''
        }`}
        style={value !== 0 ? { color: 'var(--text-secondary)', borderColor: 'var(--item-border)' } : {}}
        whileTap={{ scale: 0.92 }}
      >
        Any
      </motion.button>

      {/* Star buttons */}
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <motion.button
          key={star}
          onClick={() => onChange(star)}
          className="transition-colors duration-150"
          style={{ color: star <= value ? 'rgb(251,191,36)' : 'var(--text-muted)' }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Minimum ${star} star${star > 1 ? 's' : ''}`}
        >
          <StarIcon className="w-5 h-5" />
        </motion.button>
      ))}

      {value > 0 && (
        <span className="text-xs ml-1" style={{ color: 'var(--text-secondary)' }}>+</span>
      )}
    </div>
  )
}
