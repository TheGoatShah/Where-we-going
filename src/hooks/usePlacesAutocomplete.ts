import { useState, useCallback, useRef } from 'react'
import type { AutocompletePrediction } from '../types'
import { getAutocompleteSuggestions } from '../services/placesApi'
import { AUTOCOMPLETE_DEBOUNCE_MS } from '../constants'

export function usePlacesAutocomplete() {
  const [suggestions, setSuggestions] = useState<AutocompletePrediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchSuggestions = useCallback((input: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (!input.trim()) {
      setSuggestions([])
      return
    }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const results = await getAutocompleteSuggestions(input)
        setSuggestions(results)
      } catch (err) {
        console.error('[Autocomplete] fetch error:', err)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, AUTOCOMPLETE_DEBOUNCE_MS)
  }, [])

  const clearSuggestions = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    setSuggestions([])
  }, [])

  return { suggestions, isLoading, fetchSuggestions, clearSuggestions }
}
