/**
 * Image processing and manipulation utilities
 */

import type { FileValidationResult } from '@/types'

// Supported image formats
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

/**
 * Validate image file format and size
 */
export function validateImageFile(file: File): FileValidationResult {
  // Check file type
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file format. Supported: JPEG, PNG, WebP, HEIC'
    }
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 20MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)`
    }
  }
  
  return {
    valid: true,
    file
  }
}

/**
 * Read image file as data URL
 */
export function readImageAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Load image from URL or data URL
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image'))
    
    img.src = src
  })
}

/**
 * Create a canvas element with specified dimensions
 */
export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

/**
 * Resize image to fit within specified dimensions while maintaining aspect ratio
 */
export async function resizeImage(
  imageUrl: string,
  maxWidth: number,
  maxHeight: number
): Promise<string> {
  const img = await loadImage(imageUrl)
  
  let width = img.width
  let height = img.height
  
  // Calculate new dimensions maintaining aspect ratio
  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height
    
    if (width > height) {
      width = maxWidth
      height = width / aspectRatio
    } else {
      height = maxHeight
      width = height * aspectRatio
    }
  }
  
  // Create canvas and draw resized image
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }
  
  ctx.drawImage(img, 0, 0, width, height)
  
  return canvas.toDataURL('image/png')
}

/**
 * Resize image to exact dimensions (for download)
 */
export async function resizeImageToExact(
  imageUrl: string,
  targetWidth: number,
  targetHeight: number
): Promise<string> {
  const img = await loadImage(imageUrl)
  
  const canvas = createCanvas(targetWidth, targetHeight)
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }
  
  // Calculate scaling to cover the target area while maintaining aspect ratio
  const sourceAspect = img.width / img.height
  const targetAspect = targetWidth / targetHeight
  
  let drawWidth = targetWidth
  let drawHeight = targetHeight
  let offsetX = 0
  let offsetY = 0
  
  if (sourceAspect > targetAspect) {
    // Image is wider - fit by height
    drawHeight = targetHeight
    drawWidth = drawHeight * sourceAspect
    offsetX = (targetWidth - drawWidth) / 2
  } else {
    // Image is taller - fit by width
    drawWidth = targetWidth
    drawHeight = drawWidth / sourceAspect
    offsetY = (targetHeight - drawHeight) / 2
  }
  
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, targetWidth, targetHeight)
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
  
  return canvas.toDataURL('image/png')
}

/**
 * Convert canvas to blob
 */
export function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/png', quality = 0.95): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to convert canvas to blob'))
        }
      },
      type,
      quality
    )
  })
}

/**
 * Get image dimensions from data URL
 */
export async function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  const img = await loadImage(dataUrl)
  return {
    width: img.width,
    height: img.height
  }
}

/**
 * Create thumbnail from image
 */
export async function createThumbnail(imageUrl: string, size = 100): Promise<string> {
  return resizeImage(imageUrl, size, size)
}
