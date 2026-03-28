import { motion } from 'framer-motion'

interface PillProps {
  label: string
  active: boolean
  onClick: () => void
  className?: string
}

export function Pill({ label, active, onClick, className = '' }: PillProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`pill-base border font-medium text-sm ${active ? 'bg-primary text-white border-primary' : ''} ${className}`}
      style={
        active
          ? { boxShadow: '0 0 16px var(--color-primary-glow)' }
          : { background: 'var(--item-bg)', borderColor: 'var(--item-border)', color: 'var(--text-secondary)' }
      }
      whileTap={{ scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {label}
    </motion.button>
  )
}
