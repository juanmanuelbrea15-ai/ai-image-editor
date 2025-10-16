/**
 * Slider component for numeric adjustments
 */

import React, { useState, useCallback } from 'react'
import { debounce } from '@/utils/helpers'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  defaultValue?: number
  onChange: (value: number) => void
  onReset?: () => void
  debounceMs?: number
  showValue?: boolean
  disabled?: boolean
}

/**
 * Slider component with label, value display, and reset button
 */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  defaultValue = 0,
  onChange,
  onReset,
  debounceMs = 100,
  showValue = true,
  disabled = false
}: SliderProps) {
  const [localValue, setLocalValue] = useState(value)

  // Debounced onChange handler
  const debouncedOnChange = useCallback(
    debounce((newValue: number) => {
      onChange(newValue)
    }, debounceMs),
    [onChange, debounceMs]
  )

  // Handle slider change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    setLocalValue(newValue)
    debouncedOnChange(newValue)
  }

  // Sync local value with prop value
  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Handle reset
  const handleReset = () => {
    setLocalValue(defaultValue)
    onChange(defaultValue)
    onReset?.()
  }

  // Calculate percentage for gradient background
  const percentage = ((localValue - min) / (max - min)) * 100

  return (
    <div className="space-y-2">
      {/* Label and value row */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {showValue && (
            <span className="text-sm text-gray-400 min-w-[40px] text-right">
              {localValue > 0 ? '+' : ''}{localValue}
            </span>
          )}
          {onReset && localValue !== defaultValue && (
            <button
              onClick={handleReset}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              disabled={disabled}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #374151 ${percentage}%, #374151 100%)`
          }}
        />
      </div>
    </div>
  )
}
