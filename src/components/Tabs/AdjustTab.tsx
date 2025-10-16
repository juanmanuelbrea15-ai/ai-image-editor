/**
 * Adjust tab component for color and tone adjustments
 */

import { useEffect } from 'react'
import { Button } from '@/components/UI/Button'
import { Slider } from '@/components/UI/Slider'
import { useEditorStore } from '@/store/editorStore'
import { useDebounce } from '@/hooks/useDebounce'
import { applyAdjustments, getPresetValues } from '@/utils/imageAdjustments'
import { generateId } from '@/utils/helpers'
import type { PresetName } from '@/types'

/**
 * Adjust tab with presets and manual sliders
 */
export default function AdjustTab() {
  const {
    adjustmentValues,
    updateAdjustmentValues,
    originalImage,
    addToHistory,
    setLoading
  } = useEditorStore()

  // Debounce adjustment values for performance
  const debouncedValues = useDebounce(adjustmentValues, 300)

  // Apply adjustments when values change
  useEffect(() => {
    if (!originalImage) return

    // Check if any adjustment is non-zero
    const hasAdjustments = Object.values(debouncedValues).some(v => v !== 0)
    if (!hasAdjustments) return

    const applyChanges = async () => {
      setLoading(true)
      try {
        const adjustedDataUrl = await applyAdjustments(originalImage.dataUrl, debouncedValues)
        
        const newImage = {
          id: generateId(),
          dataUrl: adjustedDataUrl,
          width: originalImage.width,
          height: originalImage.height,
          timestamp: Date.now()
        }

        addToHistory(newImage)
      } catch (err) {
        console.error('Failed to apply adjustments:', err)
      } finally {
        setLoading(false)
      }
    }

    applyChanges()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValues])

  // Preset buttons
  const presets: PresetName[] = ['Natural', 'Vivid', 'Warm', 'Cool', 'Dramatic', 'Soft', 'Bright']

  const handlePresetClick = (presetName: PresetName) => {
    const presetValues = getPresetValues(presetName)
    updateAdjustmentValues(presetValues)
  }

  const handleResetAll = () => {
    updateAdjustmentValues({
      temperature: 0,
      tint: 0,
      exposure: 0,
      contrast: 0,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      clarity: 0,
      dehaze: 0,
      vibrance: 0,
      saturation: 0
    })
  }

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Presets
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {presets.map((preset) => (
            <Button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              {preset}
            </Button>
          ))}
        </div>
      </div>

      {/* Color Temperature & Tint */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Color
        </h3>
        <div className="space-y-4">
          <Slider
            label="Temperature"
            value={adjustmentValues.temperature}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
            onChange={(value) => updateAdjustmentValues({ temperature: value })}
            onReset={() => updateAdjustmentValues({ temperature: 0 })}
          />
          <Slider
            label="Tint"
            value={adjustmentValues.tint}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
            onChange={(value) => updateAdjustmentValues({ tint: value })}
            onReset={() => updateAdjustmentValues({ tint: 0 })}
          />
        </div>
      </div>

      {/* Light */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Light
        </h3>
        <div className="space-y-4">
          <Slider
            label="Exposure"
            value={adjustmentValues.exposure}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
            onChange={(value) => updateAdjustmentValues({ exposure: value })}
            onReset={() => updateAdjustmentValues({ exposure: 0 })}
          />
          <Slider
            label="Contrast"
            value={adjustmentValues.contrast}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
            onChange={(value) => updateAdjustmentValues({ contrast: value })}
            onReset={() => updateAdjustmentValues({ contrast: 0 })}
          />
        </div>
      </div>

      {/* Tone */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Tone
        </h3>
        <div className="space-y-4">
          <Slider
            label="Highlights"
            value={adjustmentValues.highlights}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
            onChange={(value) => updateAdjustmentValues({ highlights: value })}
            onReset={() => updateAdjustmentValues({ highlights: 0 })}
          />
          <Slider
            label="Shadows"
            value={adjustmentValues.shadows}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
            onChange={(value) => updateAdjustmentValues({ shadows: value })}
            onReset={() => updateAdjustmentValues({ shadows: 0 })}
          />
          <Slider
            label="Whites"
            value={adjustmentValues.whites}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
            onChange={(value) => updateAdjustmentValues({ whites: value })}
            onReset={() => updateAdjustmentValues({ whites: 0 })}
          />
          <Slider
            label="Blacks"
            value={adjustmentValues.blacks}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
            onChange={(value) => updateAdjustmentValues({ blacks: value })}
            onReset={() => updateAdjustmentValues({ blacks: 0 })}
          />
        </div>
      </div>

      {/* Effects */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Effects
        </h3>
        <div className="space-y-4">
          <Slider
            label="Clarity"
            value={adjustmentValues.clarity}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
            onChange={(value) => updateAdjustmentValues({ clarity: value })}
            onReset={() => updateAdjustmentValues({ clarity: 0 })}
          />
          <Slider
            label="Dehaze"
            value={adjustmentValues.dehaze}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
            onChange={(value) => updateAdjustmentValues({ dehaze: value })}
            onReset={() => updateAdjustmentValues({ dehaze: 0 })}
          />
          <Slider
            label="Vibrance"
            value={adjustmentValues.vibrance}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
            onChange={(value) => updateAdjustmentValues({ vibrance: value })}
            onReset={() => updateAdjustmentValues({ vibrance: 0 })}
          />
          <Slider
            label="Saturation"
            value={adjustmentValues.saturation}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
            onChange={(value) => updateAdjustmentValues({ saturation: value })}
            onReset={() => updateAdjustmentValues({ saturation: 0 })}
          />
        </div>
      </div>

      {/* Reset All Button */}
      <Button
        onClick={handleResetAll}
        variant="ghost"
        fullWidth
      >
        Reset All Adjustments
      </Button>

      {/* Info */}
      <div className="text-xs text-gray-500 text-center">
        Adjustments are applied in real-time with a slight delay for performance
      </div>
    </div>
  )
}
