import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LocationInput } from './LocationInput'
import { MoodPicker } from './MoodPicker'
import { CuisineFilter } from './CuisineFilter'
import { PriceFilter } from './PriceFilter'
import { DistanceSlider } from './DistanceSlider'
import { RatingFilter } from './RatingFilter'
import { OpenNowToggle } from './OpenNowToggle'
import { useFilterStore } from '../../store/filterStore'
import { ChevronRightIcon } from '../ui/icons'

interface SectionProps {
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function FilterSection({ label, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b last:border-0" style={{ borderColor: 'var(--item-border-subtle)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="text-xs font-semibold t-label uppercase tracking-widest">
          {label}
        </span>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRightIcon className="w-3.5 h-3.5 t-muted" style={{ color: 'var(--text-muted)' }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FilterPanel() {
  const { resetFilters, cuisines, priceRange, openNow, minRating, location, mood } = useFilterStore()

  const hasActiveFilters =
    mood !== null || cuisines.length > 0 || priceRange.length > 0 || openNow || minRating > 0

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto rounded-2xl px-5 py-4 border"
      style={{
        background: 'var(--surface-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'var(--surface-border)',
        boxShadow: 'var(--surface-shadow)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Location — always visible */}
      <div className="mb-4">
        <p className="text-xs font-semibold t-label uppercase tracking-widest mb-2">
          Location
        </p>
        <LocationInput />
      </div>

      {/* Collapsible filter sections */}
      <FilterSection label="Vibe" defaultOpen={true}>
        <MoodPicker />
      </FilterSection>

      <FilterSection label={mood ? 'Customize Cuisine' : 'Cuisine'} defaultOpen={!mood}>
        <CuisineFilter />
      </FilterSection>

      <FilterSection label="Price Range">
        <PriceFilter />
      </FilterSection>

      <FilterSection label="Distance">
        <DistanceSlider />
      </FilterSection>

      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-xs font-semibold t-label uppercase tracking-widest mb-2">
            Min Rating
          </p>
          <RatingFilter />
        </div>
        <div>
          <p className="text-xs font-semibold t-label uppercase tracking-widest mb-2 text-right">
            Hours
          </p>
          <OpenNowToggle />
        </div>
      </div>

      {/* Reset */}
      <AnimatePresence>
        {(hasActiveFilters || location) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-3 border-t mt-1"
            style={{ borderColor: 'var(--item-border-subtle)' }}
          >
            <button
              onClick={resetFilters}
              className="text-xs t-muted hover:t-secondary transition-colors duration-200 underline underline-offset-2"
              style={{ color: 'var(--text-muted)' }}
            >
              Reset all filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
