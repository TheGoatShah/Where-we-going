import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFilterStore } from '../../store/filterStore'
import { useGeolocation } from '../../hooks/useGeolocation'
import { usePlacesAutocomplete } from '../../hooks/usePlacesAutocomplete'
import { geocodeAddress } from '../../services/placesApi'
import { LocationIcon, GpsIcon, LoaderIcon } from '../ui/icons'

export function LocationInput() {
  const { location, setLocation } = useFilterStore()
  const [inputValue, setInputValue] = useState(location?.address ?? '')
  const [showDropdown, setShowDropdown] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const geo = useGeolocation()
  const { suggestions, isLoading, fetchSuggestions, clearSuggestions } = usePlacesAutocomplete()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // When GPS succeeds, reverse-geocode to address
  useEffect(() => {
    if (geo.status !== 'success') return
    const { lat, lng } = geo.coords
    setIsGeocoding(true)
    geocodeAddress(`${lat},${lng}`)
      .then((result) => {
        if (result) {
          const shortAddress = result.formattedAddress
            .split(',')
            .slice(-3)
            .join(',')
            .trim()
          setInputValue(shortAddress)
          setLocation({ address: shortAddress, lat, lng })
        }
      })
      .finally(() => setIsGeocoding(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.status])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    fetchSuggestions(val)
    setShowDropdown(true)
    if (!val) setLocation(null)
  }

  const handleSelectSuggestion = async (text: string) => {
    setInputValue(text)
    setShowDropdown(false)
    clearSuggestions()
    setIsGeocoding(true)
    try {
      const result = await geocodeAddress(text)
      if (result) {
        setLocation({ address: text, lat: result.lat, lng: result.lng })
      }
    } finally {
      setIsGeocoding(false)
    }
  }

  const handleGpsClick = () => {
    geo.requestLocation()
  }

  const isProcessing = geo.status === 'loading' || isGeocoding
  const hasValue = !!location

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200"
        style={{
          background: hasValue ? 'rgb(var(--color-primary-rgb) / 0.08)' : 'var(--item-bg)',
          borderColor: hasValue ? 'rgb(var(--color-primary-rgb) / 0.5)' : 'var(--item-border)',
        }}
      >
        <LocationIcon
          className="w-4 h-4 flex-shrink-0"
          style={{ color: hasValue ? 'var(--color-primary-hex)' : 'var(--text-muted)' }}
        />

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder="City, State..."
          className="flex-1 bg-transparent text-sm focus:outline-none min-w-0"
          style={{ color: 'var(--text-primary)', caretColor: 'var(--color-primary-hex)' }}
          aria-label="Enter location"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />

        {/* GPS button */}
        <motion.button
          onClick={handleGpsClick}
          disabled={isProcessing}
          className="flex-shrink-0 p-1 rounded-lg transition-colors duration-200"
          style={{ color: isProcessing ? 'var(--text-muted)' : 'var(--text-secondary)' }}
          whileTap={{ scale: 0.9 }}
          title="Use my location"
          aria-label="Use current location"
        >
          {isProcessing ? (
            <LoaderIcon className="w-4 h-4 animate-spin" />
          ) : (
            <GpsIcon className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* Error message */}
      {geo.status === 'error' && (
        <p className="mt-1.5 text-xs text-red-400">{geo.message}</p>
      )}

      {/* Autocomplete dropdown */}
      <AnimatePresence>
        {showDropdown && (suggestions.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50 shadow-glass"
            style={{
              background: 'var(--dropdown-bg)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--dropdown-border)',
            }}
            role="listbox"
          >
            {isLoading ? (
              <div className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Searching...</div>
            ) : (
              suggestions.map((s, idx) => {
                const mainText = s.structuredFormat?.mainText?.text ?? s.text?.text ?? ''
                const secondaryText = s.structuredFormat?.secondaryText?.text ?? ''
                const fullText = [mainText, secondaryText].filter(Boolean).join(', ')
                return (
                  <button
                    key={s.placeId ?? idx}
                    role="option"
                    className="w-full text-left px-4 py-3 transition-colors duration-150 border-b last:border-0"
                    style={{ borderColor: 'var(--item-border-subtle)' }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSelectSuggestion(fullText)
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--dropdown-hover)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '' }}
                  >
                    <div className="flex items-start gap-2.5">
                      <LocationIcon className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{mainText}</p>
                        {secondaryText && (
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{secondaryText}</p>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
