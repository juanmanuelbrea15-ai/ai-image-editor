/**
 * Custom hook for loading images with state management
 */

import { useState, useCallback } from 'react'
import { loadImage } from '@/utils/imageUtils'

interface UseImageLoaderResult {
  loading: boolean
  error: string | null
  loadImageAsync: (src: string) => Promise<HTMLImageElement | null>
}

/**
 * Hook for loading images with loading and error states
 */
export function useImageLoader(): UseImageLoaderResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadImageAsync = useCallback(async (src: string): Promise<HTMLImageElement | null> => {
    setLoading(true)
    setError(null)

    try {
      const img = await loadImage(src)
      setLoading(false)
      return img
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load image'
      setError(errorMessage)
      setLoading(false)
      return null
    }
  }, [])

  return {
    loading,
    error,
    loadImageAsync
  }
}
