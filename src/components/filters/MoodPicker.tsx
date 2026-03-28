import { motion } from 'framer-motion'
import { MOODS, MOOD_CONFIG } from '../../constants'
import { useFilterStore } from '../../store/filterStore'

export function MoodPicker() {
  const { mood, setMood } = useFilterStore()

  return (
    <div className="grid grid-cols-3 gap-2">
      {MOODS.map((m) => {
        const config = MOOD_CONFIG[m]
        const active = mood === m
        return (
          <motion.button
            key={m}
            onClick={() => setMood(active ? null : m)}
            className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl border text-center transition-all duration-200"
            style={active ? {
              background: 'rgb(var(--color-primary-rgb) / 0.15)',
              borderColor: 'rgb(var(--color-primary-rgb) / 0.5)',
              color: 'var(--text-primary)',
            } : {
              background: 'var(--item-bg)',
              borderColor: 'var(--item-border)',
              color: 'var(--text-secondary)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl leading-none">{config.emoji}</span>
            <span className="text-xs font-medium leading-tight">{config.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
