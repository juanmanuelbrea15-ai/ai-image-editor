/**
 * Background removal service
 */

import axios from 'axios'

const REMBG_API_URL = import.meta.env.VITE_REMBG_API_URL

/**
 * Remove background from image using background removal service
 */
export async function removeBackground(imageDataUrl: string): Promise<string> {
  if (!REMBG_API_URL) {
    throw new Error('Background removal service not configured. Please add VITE_REMBG_API_URL to your .env file.')
  }

  try {
    // Convert data URL to blob
    const response = await fetch(imageDataUrl)
    const blob = await response.blob()

    // Create form data
    const formData = new FormData()
    formData.append('image', blob, 'image.png')

    // Call background removal API
    const result = await axios.post(REMBG_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'blob',
      timeout: 30000 // 30 second timeout
    })

    // Convert blob response back to data URL
    const processedBlob = result.data
    const reader = new FileReader()

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string)
        } else {
          reject(new Error('Failed to read processed image'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read processed image'))
      reader.readAsDataURL(processedBlob)
    })
  } catch (error) {
    console.error('Background removal error:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Background removal timeout - request took too long')
      }
      if (error.response?.status === 413) {
        throw new Error('Image file too large for background removal')
      }
      if (error.response?.status && error.response.status >= 500) {
        throw new Error('Background removal service temporarily unavailable')
      }
    }
    
    throw new Error('Failed to remove background. Please try again.')
  }
}

/**
 * Check if background removal service is configured
 */
export function isBackgroundRemovalConfigured(): boolean {
  return !!REMBG_API_URL && REMBG_API_URL.length > 0
}

/**
 * Get background removal service status
 */
export function getBackgroundRemovalStatus(): {
  configured: boolean
  message: string
} {
  const configured = isBackgroundRemovalConfigured()
  
  return {
    configured,
    message: configured
      ? 'Background removal service is configured'
      : 'Background removal service not configured. Please add VITE_REMBG_API_URL to your .env file'
  }
}
