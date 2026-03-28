import { useState, useCallback } from 'react'
import type { LatLng } from '../types'

type GeolocationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; coords: LatLng }
  | { status: 'error'; message: string }

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({ status: 'idle' })

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ status: 'error', message: 'Geolocation is not supported by your browser.' })
      return
    }

    setState({ status: 'loading' })

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: 'success',
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        })
      },
      (error) => {
        const messages: Record<number, string> = {
          1: 'Location permission denied. Please allow access and try again.',
          2: 'Unable to determine your location. Please try again.',
          3: 'Location request timed out. Please try again.',
        }
        setState({
          status: 'error',
          message: messages[error.code] ?? 'Unable to get your location.',
        })
      },
      { timeout: 10000, maximumAge: 60000 },
    )
  }, [])

  return { ...state, requestLocation }
}
