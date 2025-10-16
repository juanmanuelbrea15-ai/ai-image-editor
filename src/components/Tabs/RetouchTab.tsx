/**
 * Retouch tab component for AI-powered image enhancement
 */

import React, { useState } from 'react'
import { Button } from '@/components/UI/Button'
import { Checkbox } from '@/components/UI/Checkbox'
import { DragDropZone } from '@/components/UI/DragDropZone'
import { useEditorStore } from '@/store/editorStore'
import { validateImageFile, readImageAsDataURL, getImageDimensions } from '@/utils/imageUtils'
import { generateId } from '@/utils/helpers'
import { generateWithGemini } from '@/services/geminiService'
import { removeBackground } from '@/services/backgroundRemovalService'

const MAX_PROMPT_LENGTH = 500

/**
 * Retouch tab with prop upload and AI generation
 */
export default function RetouchTab() {
  const {
    retouchSettings,
    updateRetouchSettings,
    currentImage,
    addToHistory,
    addPropToGallery,
    setLoading,
    setError
  } = useEditorStore()

  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadingProp, setUploadingProp] = useState(false)

  // Handle prop image upload
  const handlePropUpload = async (file: File) => {
    setUploadingProp(true)
    setError(null)

    try {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setError(validation.error || 'Invalid file')
        setUploadingProp(false)
        return
      }

      const dataUrl = await readImageAsDataURL(file)
      const dimensions = await getImageDimensions(dataUrl)

      const propImage = {
        id: generateId(),
        dataUrl,
        width: dimensions.width,
        height: dimensions.height,
        timestamp: Date.now(),
        fileName: file.name
      }

      updateRetouchSettings({ propImage })
      
      // Add to gallery
      addPropToGallery({
        id: propImage.id,
        dataUrl: propImage.dataUrl,
        timestamp: propImage.timestamp,
        type: 'prop'
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload prop')
    } finally {
      setUploadingProp(false)
    }
  }

  // Handle remove background
  const handleRemoveBackground = async () => {
    if (!retouchSettings.propImage) return

    setIsProcessing(true)
    setError(null)

    try {
      const processedDataUrl = await removeBackground(retouchSettings.propImage.dataUrl)
      
      const dimensions = await getImageDimensions(processedDataUrl)
      
      const processedProp = {
        ...retouchSettings.propImage,
        dataUrl: processedDataUrl,
        width: dimensions.width,
        height: dimensions.height
      }

      updateRetouchSettings({ propImage: processedProp })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove background')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle generate image
  const handleGenerateImage = async () => {
    if (!currentImage) return

    setIsProcessing(true)
    setLoading(true)
    setError(null)

    try {
      const generatedDataUrl = await generateWithGemini(currentImage.dataUrl, retouchSettings)
      
      const dimensions = await getImageDimensions(generatedDataUrl)
      
      const newImage = {
        id: generateId(),
        dataUrl: generatedDataUrl,
        width: dimensions.width,
        height: dimensions.height,
        timestamp: Date.now()
      }

      addToHistory(newImage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image')
    } finally {
      setIsProcessing(false)
      setLoading(false)
    }
  }

  // Check if generate button should be enabled
  const canGenerate = !!(
    retouchSettings.propImage ||
    retouchSettings.prompt.trim() ||
    retouchSettings.illuminationMatching ||
    retouchSettings.shadowConsistency ||
    retouchSettings.perspectiveCorrection
  )

  return (
    <div className="space-y-6">
      {/* Prop Upload Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Upload Prop Image
        </h3>
        
        {retouchSettings.propImage ? (
          <div className="relative">
            <img
              src={retouchSettings.propImage.dataUrl}
              alt="Prop"
              className="w-full h-40 object-cover rounded-lg"
            />
            <button
              onClick={() => updateRetouchSettings({ propImage: null })}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <DragDropZone
            onFileSelect={handlePropUpload}
            accept="image/*"
            maxSize={20 * 1024 * 1024}
            disabled={uploadingProp}
            compact
            label={uploadingProp ? 'Uploading...' : 'Upload prop image'}
          />
        )}
      </div>

      {/* Remove Background Button */}
      {retouchSettings.propImage && (
        <Button
          onClick={handleRemoveBackground}
          loading={isProcessing}
          disabled={isProcessing}
          fullWidth
        >
          Remove Background
        </Button>
      )}

      {/* Selection Tool Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-sm text-blue-300">
          <strong>Tip:</strong> Use the selection tool in the viewport to mark areas for enhancement
        </p>
      </div>

      {/* Enhancement Options */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Enhancement Options
        </h3>
        <div className="space-y-3">
          <Checkbox
            label="Illumination Matching"
            checked={retouchSettings.illuminationMatching}
            onChange={(checked) => updateRetouchSettings({ illuminationMatching: checked })}
            description="Match lighting conditions across the image"
          />
          <Checkbox
            label="Shadow Consistency"
            checked={retouchSettings.shadowConsistency}
            onChange={(checked) => updateRetouchSettings({ shadowConsistency: checked })}
            description="Ensure consistent shadow rendering"
          />
          <Checkbox
            label="Perspective Correction"
            checked={retouchSettings.perspectiveCorrection}
            onChange={(checked) => updateRetouchSettings({ perspectiveCorrection: checked })}
            description="Align perspective automatically"
          />
        </div>
      </div>

      {/* Prompt Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-300">
            AI Prompt
          </h3>
          <span className="text-xs text-gray-500">
            {retouchSettings.prompt.length}/{MAX_PROMPT_LENGTH}
          </span>
        </div>
        <textarea
          value={retouchSettings.prompt}
          onChange={(e) => {
            const value = e.target.value.slice(0, MAX_PROMPT_LENGTH)
            updateRetouchSettings({ prompt: value })
          }}
          placeholder="Describe the changes you want to make..."
          className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isProcessing}
        />
        <p className="text-xs text-gray-500 mt-2">
          Be specific about the changes you want. Example: "Add warm sunset lighting, enhance colors"
        </p>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerateImage}
        loading={isProcessing}
        disabled={!canGenerate || isProcessing}
        fullWidth
        variant="primary"
      >
        Generate Image
      </Button>

      {/* Info */}
      <div className="text-xs text-gray-500 text-center">
        Generation may take 10-30 seconds
      </div>
    </div>
  )
}
