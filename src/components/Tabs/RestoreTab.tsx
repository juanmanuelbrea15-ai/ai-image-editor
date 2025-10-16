/**
 * Restore tab component for image restoration with brush tool
 */

import React from 'react'
import { Slider } from '@/components/UI/Slider'
import { Button } from '@/components/UI/Button'
import { useEditorStore } from '@/store/editorStore'

/**
 * Restore tab with brush controls
 */
export default function RestoreTab() {
  const {
    restoreSettings,
    updateRestoreSettings
  } = useEditorStore()

  const handleResetBrush = () => {
    updateRestoreSettings({
      brushSize: 50,
      brushOpacity: 100
    })
  }

  const handleClearStrokes = () => {
    updateRestoreSettings({
      strokes: []
    })
  }

  return (
    <div className="space-y-6">
      {/* Brush Settings */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Brush Settings
        </h3>
        <div className="space-y-4">
          <Slider
            label="Brush Size"
            value={restoreSettings.brushSize}
            min={1}
            max={500}
            step={1}
            defaultValue={50}
            onChange={(value) => updateRestoreSettings({ brushSize: value })}
            onReset={() => updateRestoreSettings({ brushSize: 50 })}
            showValue
          />
          <Slider
            label="Brush Opacity"
            value={restoreSettings.brushOpacity}
            min={0}
            max={100}
            step={1}
            defaultValue={100}
            onChange={(value) => updateRestoreSettings({ brushOpacity: value })}
            onReset={() => updateRestoreSettings({ brushOpacity: 100 })}
            showValue
          />
        </div>
      </div>

      {/* Reset Brush Button */}
      <Button
        onClick={handleResetBrush}
        variant="ghost"
        fullWidth
      >
        Reset Brush Settings
      </Button>

      {/* Instructions */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-300 mb-2">
          How to Use Restore Tool
        </h4>
        <ul className="text-sm text-blue-200 space-y-2">
          <li className="flex items-start">
            <span className="mr-2">1.</span>
            <span>Adjust brush size and opacity to your preference</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">2.</span>
            <span>Paint over areas you want to restore</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">3.</span>
            <span>The AI will intelligently restore the painted areas</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">4.</span>
            <span>Use undo/redo to refine your restoration</span>
          </li>
        </ul>
      </div>

      {/* Brush Preview */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Brush Preview
        </h3>
        <div className="bg-gray-800 rounded-lg p-8 flex items-center justify-center checkerboard">
          <div
            className="rounded-full bg-blue-500 transition-all duration-200"
            style={{
              width: `${Math.min(restoreSettings.brushSize, 100)}px`,
              height: `${Math.min(restoreSettings.brushSize, 100)}px`,
              opacity: restoreSettings.brushOpacity / 100
            }}
          />
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          Preview shows relative brush size (limited to 100px for display)
        </p>
      </div>

      {/* Stroke Information */}
      {restoreSettings.strokes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">
              Strokes Applied
            </h3>
            <span className="text-sm text-gray-500">
              {restoreSettings.strokes.length}
            </span>
          </div>
          <Button
            onClick={handleClearStrokes}
            variant="danger"
            size="sm"
            fullWidth
          >
            Clear All Strokes
          </Button>
        </div>
      )}

      {/* Keyboard Shortcuts */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">
          Keyboard Shortcuts
        </h4>
        <div className="space-y-1 text-xs text-gray-400">
          <div className="flex items-center justify-between">
            <span>Increase brush size</span>
            <code className="bg-gray-700 px-2 py-1 rounded">]</code>
          </div>
          <div className="flex items-center justify-between">
            <span>Decrease brush size</span>
            <code className="bg-gray-700 px-2 py-1 rounded">[</code>
          </div>
          <div className="flex items-center justify-between">
            <span>Undo</span>
            <code className="bg-gray-700 px-2 py-1 rounded">Ctrl+Z</code>
          </div>
          <div className="flex items-center justify-between">
            <span>Redo</span>
            <code className="bg-gray-700 px-2 py-1 rounded">Ctrl+Shift+Z</code>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-gray-500">
        <p className="mb-2"><strong>Tips:</strong></p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Use lower opacity for subtle restorations</li>
          <li>Start with a larger brush for general areas</li>
          <li>Use a smaller brush for detailed work</li>
          <li>Multiple light strokes work better than heavy ones</li>
        </ul>
      </div>
    </div>
  )
}
