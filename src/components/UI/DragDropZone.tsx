/**
 * Drag and drop file upload zone component
 */

import React, { useState, useRef } from 'react'

interface DragDropZoneProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  disabled?: boolean
  compact?: boolean
  label?: string
}

/**
 * Drag and drop zone for file uploads
 */
export function DragDropZone({
  onFileSelect,
  accept = 'image/*',
  maxSize,
  disabled = false,
  compact = false,
  label = 'Drop image here or click to browse'
}: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check file size if maxSize is specified
    if (maxSize && file.size > maxSize) {
      console.error(`File size exceeds maximum of ${maxSize} bytes`)
      return
    }

    onFileSelect(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
        ${isDragging
          ? 'border-blue-500 bg-blue-500/10'
          : disabled
          ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed'
          : 'border-gray-600 bg-gray-800/30 hover:border-blue-500 hover:bg-gray-800/50'
        }
        ${compact ? 'p-4' : 'p-8'}
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center justify-center text-center">
        {!compact && (
          <svg
            className={`w-12 h-12 mb-4 ${
              isDragging ? 'text-blue-500' : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        )}

        <p
          className={`${
            compact ? 'text-sm' : 'text-base'
          } font-medium ${
            disabled ? 'text-gray-600' : 'text-gray-300'
          }`}
        >
          {label}
        </p>

        {!compact && (
          <p className="text-sm text-gray-500 mt-2">
            Supported: JPEG, PNG, WebP, HEIC
            {maxSize && ` (Max ${(maxSize / 1024 / 1024).toFixed(0)}MB)`}
          </p>
        )}
      </div>
    </div>
  )
}
