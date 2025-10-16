/**
 * Upload component for initial image upload
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DragDropZone } from '@/components/UI/DragDropZone'
import { useEditorStore } from '@/store/editorStore'
import { validateImageFile, readImageAsDataURL, getImageDimensions } from '@/utils/imageUtils'
import { generateId } from '@/utils/helpers'

/**
 * Upload page component with drag-and-drop functionality
 */
export default function Upload() {
  const navigate = useNavigate()
  const setOriginalImage = useEditorStore((state) => state.setOriginalImage)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = async (file: File) => {
    setError(null)
    setIsUploading(true)
    setProgress(0)

    try {
      // Validate file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setError(validation.error || 'Invalid file')
        setIsUploading(false)
        return
      }

      setProgress(25)

      // Read file as data URL
      const dataUrl = await readImageAsDataURL(file)
      setProgress(50)

      // Get image dimensions
      const dimensions = await getImageDimensions(dataUrl)
      setProgress(75)

      // Create image data object
      const imageData = {
        id: generateId(),
        dataUrl,
        width: dimensions.width,
        height: dimensions.height,
        timestamp: Date.now(),
        fileName: file.name
      }

      // Store in editor state
      setOriginalImage(imageData)
      setProgress(100)

      // Navigate to editor after short delay
      setTimeout(() => {
        navigate('/editor')
      }, 300)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload image')
      setIsUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Image Editor
          </h1>
          <p className="text-gray-400 text-lg">
            Upload an image to start editing with AI-powered tools
          </p>
        </div>

        {/* Upload zone */}
        <DragDropZone
          onFileSelect={handleFileSelect}
          accept="image/jpeg,image/png,image/webp,image/heic"
          maxSize={20 * 1024 * 1024} // 20MB
          disabled={isUploading}
          label={
            isUploading
              ? 'Uploading...'
              : 'Drop image here or click to browse'
          }
        />

        {/* Progress bar */}
        {isUploading && (
          <div className="mt-6">
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-gray-400 text-sm mt-2">
              Processing image... {progress}%
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-gray-500 text-sm">
            Supported formats: JPEG, PNG, WebP, HEIC
          </p>
          <p className="text-gray-500 text-sm">
            Maximum file size: 20MB
          </p>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-white font-medium mb-1">Retouch</h3>
            <p className="text-gray-500 text-sm">AI-powered image enhancement</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-white font-medium mb-1">Adjust</h3>
            <p className="text-gray-500 text-sm">Professional color adjustments</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 className="text-white font-medium mb-1">Restore</h3>
            <p className="text-gray-500 text-sm">Intelligent restoration tools</p>
          </div>
        </div>
      </div>
    </div>
  )
}
