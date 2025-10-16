/**
 * Core type definitions for the AI Image Editor application
 */

// Image data structure
export interface ImageData {
  id: string
  dataUrl: string
  width: number
  height: number
  timestamp: number
  fileName?: string
}

// Geometry types
export interface Point {
  x: number
  y: number
}

export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

// Brush stroke for restore tab
export interface BrushStroke {
  id: string
  points: Point[]
  width: number
  opacity: number
}

// Tab types
export type TabType = 'retouch' | 'adjust' | 'restore'

// Preset names for adjust tab
export type PresetName = 'Natural' | 'Vivid' | 'Warm' | 'Cool' | 'Dramatic' | 'Soft' | 'Bright'

// Gallery item types
export interface GalleryItem {
  id: string
  dataUrl: string
  thumbnail?: string
  timestamp: number
  type: 'prop' | 'image'
}

export interface ProcessedImageItem extends GalleryItem {
  type: 'image'
  originalId?: string
}

// Adjustment values
export interface AdjustmentValues {
  temperature: number
  tint: number
  exposure: number
  contrast: number
  highlights: number
  shadows: number
  whites: number
  blacks: number
  clarity: number
  dehaze: number
  vibrance: number
  saturation: number
}

// Preset configurations
export interface PresetConfig {
  name: PresetName
  values: Partial<AdjustmentValues>
}

// Retouch settings
export interface RetouchSettings {
  propImage: ImageData | null
  removeBackground: boolean
  illuminationMatching: boolean
  shadowConsistency: boolean
  perspectiveCorrection: boolean
  prompt: string
}

// Restore settings
export interface RestoreSettings {
  brushSize: number
  brushOpacity: number
  strokes: BrushStroke[]
}

// Editor state
export interface EditorState {
  // Image states
  originalImage: ImageData | null
  currentImage: ImageData | null
  
  // History management
  history: ImageData[]
  historyIndex: number
  
  // Tab state
  activeTab: TabType
  
  // Settings per tab
  retouchSettings: RetouchSettings
  adjustmentValues: AdjustmentValues
  restoreSettings: RestoreSettings
  
  // Gallery
  propsGallery: GalleryItem[]
  imagesGallery: ProcessedImageItem[]
  
  // UI state
  isLoading: boolean
  error: string | null
  compareMode: boolean
  
  // Actions
  setOriginalImage: (image: ImageData) => void
  setCurrentImage: (image: ImageData) => void
  addToHistory: (image: ImageData) => void
  undo: () => void
  redo: () => void
  reset: () => void
  setActiveTab: (tab: TabType) => void
  updateRetouchSettings: (settings: Partial<RetouchSettings>) => void
  updateAdjustmentValues: (values: Partial<AdjustmentValues>) => void
  updateRestoreSettings: (settings: Partial<RestoreSettings>) => void
  addPropToGallery: (prop: GalleryItem) => void
  addImageToGallery: (image: ProcessedImageItem) => void
  removePropFromGallery: (id: string) => void
  removeImageFromGallery: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCompareMode: (enabled: boolean) => void
  clearEditor: () => void
}

// Toast notification
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  duration?: number
}

// Canvas tool types
export type CanvasTool = 'select' | 'brush' | 'pan' | 'zoom'

// File validation result
export interface FileValidationResult {
  valid: boolean
  error?: string
  file?: File
}
