import { motion } from 'framer-motion'
import { useRestaurants } from '../hooks/useRestaurants'
import { useRestaurantStore } from '../store/restaurantStore'
import { useFilterStore } from '../store/filterStore'
import { SparkleIcon, DiceIcon, RefreshIcon, LoaderIcon } from './ui/icons'

interface ActionButtonProps {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  icon: React.ReactNode
  label: string
  sublabel?: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

function ActionButton({
  onClick,
  disabled,
  loading,
  icon,
  label,
  sublabel,
  variant = 'secondary',
}: ActionButtonProps) {
  const base =
    'flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'rgb(var(--color-primary-rgb))',
      borderColor: 'rgb(var(--color-primary-rgb))',
      color: '#fff',
    },
    secondary: {
      background: 'var(--item-bg)',
      borderColor: 'var(--item-border)',
      color: 'var(--text-primary)',
    },
    ghost: {
      color: 'var(--text-secondary)',
    },
  }

  const variantClass: Record<string, string> = {
    primary: 'border',
    secondary: 'border hover:opacity-80',
    ghost: 'hover:opacity-80',
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variantClass[variant]}`}
      style={{
        ...(variant === 'primary' ? { boxShadow: '0 0 28px var(--color-primary-glow)' } : {}),
        ...variantStyles[variant],
      }}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {loading ? (
        <LoaderIcon className="w-4 h-4 animate-spin" />
      ) : (
        <span className="flex-shrink-0">{icon}</span>
      )}
      <div className="text-left">
        <div>{label}</div>
        {sublabel && (
          <div className="text-xs font-normal opacity-60 mt-0.5">{sublabel}</div>
        )}
      </div>
    </motion.button>
  )
}

export function ActionButtons() {
  const { surpriseMe, giveMeOptions, feelingLucky, tryAgain, needFoodNow } = useRestaurants()
  const { status, pool } = useRestaurantStore()
  const { location } = useFilterStore()

  const isLoading = status === 'loading'
  const noLocation = !location
  const hasPool = pool.length > 0

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {noLocation && (
        <p className="text-center t-muted text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Enter a location above to get started
        </p>
      )}

      {/* Need Food NOW — full width, stands apart */}
      <motion.button
        onClick={needFoodNow}
        disabled={noLocation || isLoading}
        className="w-full flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl font-bold text-sm mb-3 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 bg-gradient-to-r from-orange-500 to-red-500 text-white"
        style={{ boxShadow: '0 0 40px rgba(239,68,68,0.4)' }}
        whileHover={{ scale: noLocation ? 1 : 1.02 }}
        whileTap={{ scale: noLocation ? 1 : 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {isLoading ? (
          <LoaderIcon className="w-4 h-4 animate-spin" />
        ) : (
          <span className="text-lg leading-none">🔥</span>
        )}
        <div className="text-left">
          <div>Need Food RIGHT NOW</div>
          <div className="text-xs font-normal opacity-70 mt-0.5">Best open spot within 1 mile</div>
        </div>
      </motion.button>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ActionButton
          onClick={surpriseMe}
          disabled={noLocation}
          loading={isLoading}
          icon={<SparkleIcon className="w-4 h-4" />}
          label="Surprise Me!"
          sublabel="1 random pick"
          variant="primary"
        />
        <ActionButton
          onClick={giveMeOptions}
          disabled={noLocation}
          loading={isLoading}
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          }
          label="Give Me Options"
          sublabel="3 choices"
        />
        <ActionButton
          onClick={feelingLucky}
          disabled={noLocation}
          loading={isLoading}
          icon={<DiceIcon className="w-4 h-4" />}
          label="I'm Feeling Lucky"
          sublabel="Ignore all filters"
        />
        <ActionButton
          onClick={tryAgain}
          disabled={noLocation || !hasPool}
          loading={false}
          icon={<RefreshIcon className="w-4 h-4" />}
          label="Try Again"
          sublabel="Reshuffle pool"
          variant="ghost"
        />
      </div>
    </motion.div>
  )
}
