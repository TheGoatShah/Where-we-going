import { motion } from 'framer-motion'

export function HeroBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient — dark: deep warm dark, light: warm ivory cream */}
      <motion.div
        className="absolute inset-0 hero-gradient"
        style={{ backgroundSize: '400% 400%' }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
      />

      {/* Theme-aware overlay */}
      <div className="absolute inset-0 hero-overlay-layer" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Glow orbs — subtle in light mode via CSS */}
      <motion.div
        className="hero-orb absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="hero-orb-2 absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
