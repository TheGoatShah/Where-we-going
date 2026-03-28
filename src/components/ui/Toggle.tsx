import { motion } from 'framer-motion'

interface ToggleProps {
  checked: boolean
  onChange: (value: boolean) => void
  label?: string
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        style={
          checked
            ? { background: 'rgb(var(--color-primary-rgb))', boxShadow: '0 0 12px var(--color-primary-glow)' }
            : { background: 'var(--item-bg)', border: '1px solid var(--item-border)' }
        }
      >
        <motion.span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      {label && <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>}
    </label>
  )
}
