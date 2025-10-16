/**
 * Image adjustment utilities for color correction and effects
 */

import type { AdjustmentValues } from '@/types'
import { clamp } from './helpers'

/**
 * Convert RGB to HSL color space
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min
  
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min)
    
    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / diff + 2) / 6
        break
      case b:
        h = ((r - g) / diff + 4) / 6
        break
    }
  }
  
  return [h * 360, s * 100, l * 100]
}

/**
 * Convert HSL to RGB color space
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360
  s /= 100
  l /= 100
  
  let r, g, b
  
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

/**
 * Apply temperature adjustment to RGB values
 */
function applyTemperature(r: number, g: number, b: number, temperature: number): [number, number, number] {
  const factor = temperature / 100
  
  if (factor > 0) {
    // Warm
    r = clamp(r + factor * 50, 0, 255)
    b = clamp(b - factor * 25, 0, 255)
  } else {
    // Cool
    r = clamp(r + factor * 25, 0, 255)
    b = clamp(b - factor * 50, 0, 255)
  }
  
  return [r, g, b]
}

/**
 * Apply tint adjustment to RGB values
 */
function applyTint(r: number, g: number, b: number, tint: number): [number, number, number] {
  const factor = tint / 100
  
  if (factor > 0) {
    // Green tint
    g = clamp(g + factor * 30, 0, 255)
  } else {
    // Magenta tint
    r = clamp(r - factor * 15, 0, 255)
    b = clamp(b - factor * 15, 0, 255)
  }
  
  return [r, g, b]
}

/**
 * Apply exposure adjustment
 */
function applyExposure(r: number, g: number, b: number, exposure: number): [number, number, number] {
  const factor = Math.pow(2, exposure / 100)
  
  r = clamp(r * factor, 0, 255)
  g = clamp(g * factor, 0, 255)
  b = clamp(b * factor, 0, 255)
  
  return [r, g, b]
}

/**
 * Apply contrast adjustment
 */
function applyContrast(r: number, g: number, b: number, contrast: number): [number, number, number] {
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
  
  r = clamp(factor * (r - 128) + 128, 0, 255)
  g = clamp(factor * (g - 128) + 128, 0, 255)
  b = clamp(factor * (b - 128) + 128, 0, 255)
  
  return [r, g, b]
}

/**
 * Apply highlights adjustment
 */
function applyHighlights(r: number, g: number, b: number, highlights: number): [number, number, number] {
  const factor = highlights / 100
  const threshold = 180
  
  if (r > threshold) r = clamp(r + (r - threshold) * factor, 0, 255)
  if (g > threshold) g = clamp(g + (g - threshold) * factor, 0, 255)
  if (b > threshold) b = clamp(b + (b - threshold) * factor, 0, 255)
  
  return [r, g, b]
}

/**
 * Apply shadows adjustment
 */
function applyShadows(r: number, g: number, b: number, shadows: number): [number, number, number] {
  const factor = shadows / 100
  const threshold = 75
  
  if (r < threshold) r = clamp(r + (threshold - r) * factor, 0, 255)
  if (g < threshold) g = clamp(g + (threshold - g) * factor, 0, 255)
  if (b < threshold) b = clamp(b + (threshold - b) * factor, 0, 255)
  
  return [r, g, b]
}

/**
 * Apply whites adjustment
 */
function applyWhites(r: number, g: number, b: number, whites: number): [number, number, number] {
  const factor = whites / 100
  const threshold = 200
  
  if (r > threshold) r = clamp(r + factor * 20, 0, 255)
  if (g > threshold) g = clamp(g + factor * 20, 0, 255)
  if (b > threshold) b = clamp(b + factor * 20, 0, 255)
  
  return [r, g, b]
}

/**
 * Apply blacks adjustment
 */
function applyBlacks(r: number, g: number, b: number, blacks: number): [number, number, number] {
  const factor = blacks / 100
  const threshold = 50
  
  if (r < threshold) r = clamp(r + factor * 15, 0, 255)
  if (g < threshold) g = clamp(g + factor * 15, 0, 255)
  if (b < threshold) b = clamp(b + factor * 15, 0, 255)
  
  return [r, g, b]
}

/**
 * Apply clarity adjustment (sharpness/softness)
 */
function applyClarity(imageData: ImageData, clarity: number): void {
  // Simplified clarity - in production, use unsharp mask
  const factor = clarity / 100
  
  if (Math.abs(factor) < 0.01) return
  
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  
  // Create a copy of the data
  const original = new Uint8ClampedArray(data)
  
  // Apply edge enhancement
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4
      
      for (let c = 0; c < 3; c++) {
        const center = original[idx + c]
        const avg = (
          original[((y - 1) * width + x) * 4 + c] +
          original[((y + 1) * width + x) * 4 + c] +
          original[(y * width + (x - 1)) * 4 + c] +
          original[(y * width + (x + 1)) * 4 + c]
        ) / 4
        
        const diff = center - avg
        data[idx + c] = clamp(center + diff * factor, 0, 255)
      }
    }
  }
}

/**
 * Apply dehaze adjustment
 */
function applyDehaze(r: number, g: number, b: number, dehaze: number): [number, number, number] {
  const factor = dehaze / 100
  
  // Increase contrast and saturation for dehaze effect
  const contrastFactor = 1 + factor * 0.5
  
  r = clamp((r - 128) * contrastFactor + 128, 0, 255)
  g = clamp((g - 128) * contrastFactor + 128, 0, 255)
  b = clamp((b - 128) * contrastFactor + 128, 0, 255)
  
  return [r, g, b]
}

/**
 * Apply vibrance adjustment (smart saturation)
 */
function applyVibrance(r: number, g: number, b: number, vibrance: number): [number, number, number] {
  const [h, s, l] = rgbToHsl(r, g, b)
  
  // Vibrance affects less saturated colors more
  const factor = vibrance / 100
  const saturationFactor = 1 - s / 100
  const newS = clamp(s + factor * 30 * saturationFactor, 0, 100)
  
  return hslToRgb(h, newS, l)
}

/**
 * Apply saturation adjustment
 */
function applySaturation(r: number, g: number, b: number, saturation: number): [number, number, number] {
  const [h, s, l] = rgbToHsl(r, g, b)
  const newS = clamp(s + saturation, 0, 100)
  
  return hslToRgb(h, newS, l)
}

/**
 * Apply all adjustments to an image
 */
export async function applyAdjustments(
  imageDataUrl: string,
  adjustments: AdjustmentValues
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }
      
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      // Apply pixel-by-pixel adjustments
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i]
        let g = data[i + 1]
        let b = data[i + 2]
        
        // Apply adjustments in order
        if (adjustments.temperature !== 0) {
          [r, g, b] = applyTemperature(r, g, b, adjustments.temperature)
        }
        
        if (adjustments.tint !== 0) {
          [r, g, b] = applyTint(r, g, b, adjustments.tint)
        }
        
        if (adjustments.exposure !== 0) {
          [r, g, b] = applyExposure(r, g, b, adjustments.exposure)
        }
        
        if (adjustments.contrast !== 0) {
          [r, g, b] = applyContrast(r, g, b, adjustments.contrast)
        }
        
        if (adjustments.highlights !== 0) {
          [r, g, b] = applyHighlights(r, g, b, adjustments.highlights)
        }
        
        if (adjustments.shadows !== 0) {
          [r, g, b] = applyShadows(r, g, b, adjustments.shadows)
        }
        
        if (adjustments.whites !== 0) {
          [r, g, b] = applyWhites(r, g, b, adjustments.whites)
        }
        
        if (adjustments.blacks !== 0) {
          [r, g, b] = applyBlacks(r, g, b, adjustments.blacks)
        }
        
        if (adjustments.dehaze !== 0) {
          [r, g, b] = applyDehaze(r, g, b, adjustments.dehaze)
        }
        
        if (adjustments.vibrance !== 0) {
          [r, g, b] = applyVibrance(r, g, b, adjustments.vibrance)
        }
        
        if (adjustments.saturation !== 0) {
          [r, g, b] = applySaturation(r, g, b, adjustments.saturation)
        }
        
        data[i] = r
        data[i + 1] = g
        data[i + 2] = b
      }
      
      // Apply clarity (needs full image context)
      if (adjustments.clarity !== 0) {
        applyClarity(imageData, adjustments.clarity)
      }
      
      ctx.putImageData(imageData, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageDataUrl
  })
}

/**
 * Get preset adjustment values
 */
export function getPresetValues(presetName: string): Partial<AdjustmentValues> {
  const presets: Record<string, Partial<AdjustmentValues>> = {
    Natural: {
      temperature: 0,
      tint: 0,
      exposure: 0,
      contrast: 5,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      clarity: 10,
      dehaze: 0,
      vibrance: 5,
      saturation: 0
    },
    Vivid: {
      temperature: 0,
      tint: 0,
      exposure: 5,
      contrast: 20,
      highlights: -10,
      shadows: 10,
      whites: 0,
      blacks: 0,
      clarity: 20,
      dehaze: 15,
      vibrance: 30,
      saturation: 15
    },
    Warm: {
      temperature: 30,
      tint: 5,
      exposure: 5,
      contrast: 10,
      highlights: -5,
      shadows: 5,
      whites: 0,
      blacks: 0,
      clarity: 10,
      dehaze: 0,
      vibrance: 10,
      saturation: 5
    },
    Cool: {
      temperature: -30,
      tint: -5,
      exposure: 0,
      contrast: 10,
      highlights: 0,
      shadows: 0,
      whites: 5,
      blacks: -5,
      clarity: 10,
      dehaze: 5,
      vibrance: 10,
      saturation: 0
    },
    Dramatic: {
      temperature: 0,
      tint: 0,
      exposure: -5,
      contrast: 40,
      highlights: -20,
      shadows: -15,
      whites: 10,
      blacks: -20,
      clarity: 30,
      dehaze: 25,
      vibrance: 20,
      saturation: 10
    },
    Soft: {
      temperature: 10,
      tint: 5,
      exposure: 10,
      contrast: -10,
      highlights: 10,
      shadows: 15,
      whites: 0,
      blacks: 10,
      clarity: -20,
      dehaze: 0,
      vibrance: 0,
      saturation: -5
    },
    Bright: {
      temperature: 5,
      tint: 0,
      exposure: 20,
      contrast: 10,
      highlights: 10,
      shadows: 20,
      whites: 15,
      blacks: 10,
      clarity: 15,
      dehaze: 10,
      vibrance: 15,
      saturation: 5
    }
  }
  
  return presets[presetName] || {}
}
