import { motion } from 'framer-motion'
import { BookmarkIcon, SunIcon, MoonIcon } from '../ui/icons'
import { useFavoritesStore } from '../../store/favoritesStore'
import { useTheme } from '../../hooks/useTheme'

export function Header() {
  const { favorites, toggleDrawer } = useFavoritesStore()
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.header
      className="relative z-20 flex items-center justify-between px-6 py-5 md:px-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <span className="text-2xl">🍽️</span>
        <div>
          <h1 className="text-xl font-bold t-primary leading-tight text-shadow">
            Where We Going?
          </h1>
          <p className="text-xs t-label font-medium tracking-wider uppercase">
            Restaurant Discovery
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <motion.button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200"
          style={{
            background: 'var(--item-bg)',
            borderColor: 'var(--item-border)',
            color: 'var(--text-secondary)',
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
        </motion.button>

        {/* Favorites button */}
        <motion.button
          onClick={toggleDrawer}
          className="relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200"
          style={{
            background: 'var(--item-bg)',
            borderColor: 'var(--item-border)',
            color: 'var(--text-primary)',
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Open saved favorites"
        >
          <BookmarkIcon className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:block">Saved</span>
          {favorites.length > 0 && (
            <motion.span
              key={favorites.length}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
              style={{ background: 'rgb(var(--color-primary-rgb))', color: '#fff' }}
            >
              {favorites.length > 9 ? '9+' : favorites.length}
            </motion.span>
          )}
        </motion.button>
      </div>
    </motion.header>
  )
}
