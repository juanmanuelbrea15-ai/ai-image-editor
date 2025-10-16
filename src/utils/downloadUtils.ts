/**
 * Download utilities for saving images
 */

import { resizeImageToExact } from './imageUtils'

/**
 * Download image with exact dimensions (1350x1080px)
 */
export async function downloadImage(imageDataUrl: string, filename?: string): Promise<void> {
  try {
    // Resize image to exact dimensions
    const resizedDataUrl = await resizeImageToExact(imageDataUrl, 1350, 1080)
    
    // Create blob from data URL
    const response = await fetch(resizedDataUrl)
    const blob = await response.blob()
    
    // Generate filename with timestamp if not provided
    const finalFilename = filename || `ai-edited-image-${Date.now()}.png`
    
    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = finalFilename
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading image:', error)
    throw new Error('Failed to download image')
  }
}

/**
 * Download image in original size
 */
export function downloadImageOriginal(imageDataUrl: string, filename?: string): void {
  try {
    const finalFilename = filename || `ai-edited-image-${Date.now()}.png`
    
    const link = document.createElement('a')
    link.href = imageDataUrl
    link.download = finalFilename
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading image:', error)
    throw new Error('Failed to download image')
  }
}
