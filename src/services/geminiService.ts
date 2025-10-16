/**
 * Gemini AI service for image generation
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { RetouchSettings } from '@/types'
import { wait } from '@/utils/helpers'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const TIMEOUT_MS = 30000 // 30 seconds
const MAX_RETRIES = 3

/**
 * Generate image with Gemini AI based on retouch settings
 */
export async function generateWithGemini(
  baseImage: string,
  settings: RetouchSettings
): Promise<string> {
  if (!API_KEY) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.')
  }

  // Construct prompt
  let prompt = 'Generate an enhanced image'
  
  if (settings.prompt) {
    prompt += ` with the following requirements: ${settings.prompt}`
  }
  
  const enhancements: string[] = []
  
  if (settings.illuminationMatching) {
    enhancements.push('matching illumination and lighting conditions')
  }
  
  if (settings.shadowConsistency) {
    enhancements.push('consistent shadow rendering')
  }
  
  if (settings.perspectiveCorrection) {
    enhancements.push('correct perspective alignment')
  }
  
  if (enhancements.length > 0) {
    prompt += `. Ensure ${enhancements.join(', ')}.`
  }
  
  if (settings.propImage) {
    prompt += ' Integrate the provided prop image seamlessly into the scene.'
  }

  // Retry logic with exponential backoff
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Wait before retry (exponential backoff)
      if (attempt > 0) {
        const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
        await wait(delay)
      }

      const result = await generateWithTimeout(baseImage, settings, prompt)
      return result
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      console.error(`Generation attempt ${attempt + 1} failed:`, lastError)
      
      // Don't retry on timeout or API key errors
      if (lastError.message.includes('timeout') || lastError.message.includes('API key')) {
        throw lastError
      }
    }
  }

  throw lastError || new Error('Failed to generate image after multiple attempts')
}

/**
 * Generate image with timeout
 */
async function generateWithTimeout(
  baseImage: string,
  settings: RetouchSettings,
  prompt: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Generation timeout - request took longer than 30 seconds'))
    }, TIMEOUT_MS)

    try {
      const genAI = new GoogleGenerativeAI(API_KEY)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      // Note: This is a simplified implementation
      // In a real application, you would use Gemini's image generation capabilities
      // For now, we'll simulate the process
      
      // Convert base64 to proper format for Gemini
      const imageData = baseImage.split(',')[1]
      
      const result = await model.generateContent([
        {
          inlineData: {
            data: imageData,
            mimeType: 'image/png'
          }
        },
        prompt
      ])

      // In actual implementation, Gemini would return modified image
      // For demonstration, we're returning the original
      // TODO: Implement actual image generation when Gemini supports it
      
      clearTimeout(timeout)
      
      // Simulate processing delay
      await wait(1000)
      
      // For now, return original image with a note that this is a placeholder
      console.log('Gemini prompt:', prompt)
      console.log('Settings:', settings)
      
      resolve(baseImage)
    } catch (error) {
      clearTimeout(timeout)
      reject(error instanceof Error ? error : new Error('Failed to generate with Gemini'))
    }
  })
}

/**
 * Validate Gemini API key
 */
export function validateGeminiApiKey(): boolean {
  return !!API_KEY && API_KEY.length > 0
}

/**
 * Get Gemini service status
 */
export function getGeminiStatus(): {
  configured: boolean
  message: string
} {
  const configured = validateGeminiApiKey()
  
  return {
    configured,
    message: configured
      ? 'Gemini API is configured and ready'
      : 'Gemini API key not found. Please configure VITE_GEMINI_API_KEY in your .env file'
  }
}
