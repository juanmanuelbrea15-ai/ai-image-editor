/**
 * Zustand store for editor state management
 */

import { create } from 'zustand'
import type {
  EditorState,
  ImageData,
  TabType,
  GalleryItem,
  ProcessedImageItem,
  RetouchSettings,
  AdjustmentValues,
  RestoreSettings
} from '@/types'

// Default adjustment values
const defaultAdjustments: AdjustmentValues = {
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
}

// Default retouch settings
const defaultRetouchSettings: RetouchSettings = {
  propImage: null,
  removeBackground: false,
  illuminationMatching: false,
  shadowConsistency: false,
  perspectiveCorrection: false,
  prompt: ''
}

// Default restore settings
const defaultRestoreSettings: RestoreSettings = {
  brushSize: 50,
  brushOpacity: 100,
  strokes: []
}

/**
 * Editor store with Zustand
 */
export const useEditorStore = create<EditorState>((set, get) => ({
  // Image states
  originalImage: null,
  currentImage: null,

  // History management
  history: [],
  historyIndex: -1,

  // Tab state
  activeTab: 'retouch',

  // Settings per tab
  retouchSettings: defaultRetouchSettings,
  adjustmentValues: defaultAdjustments,
  restoreSettings: defaultRestoreSettings,

  // Gallery
  propsGallery: [],
  imagesGallery: [],

  // UI state
  isLoading: false,
  error: null,
  compareMode: false,

  // Actions
  setOriginalImage: (image: ImageData) => {
    set({
      originalImage: image,
      currentImage: image,
      history: [image],
      historyIndex: 0
    })
  },

  setCurrentImage: (image: ImageData) => {
    const { history, historyIndex } = get()
    
    // Remove any forward history when adding new image
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(image)
    
    set({
      currentImage: image,
      history: newHistory,
      historyIndex: newHistory.length - 1
    })
  },

  addToHistory: (image: ImageData) => {
    const { history, historyIndex } = get()
    
    // Remove any forward history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(image)
    
    set({
      currentImage: image,
      history: newHistory,
      historyIndex: newHistory.length - 1
    })
  },

  undo: () => {
    const { history, historyIndex } = get()
    
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      set({
        currentImage: history[newIndex],
        historyIndex: newIndex
      })
    }
  },

  redo: () => {
    const { history, historyIndex } = get()
    
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      set({
        currentImage: history[newIndex],
        historyIndex: newIndex
      })
    }
  },

  reset: () => {
    const { originalImage } = get()
    
    if (originalImage) {
      set({
        currentImage: originalImage,
        history: [originalImage],
        historyIndex: 0,
        retouchSettings: defaultRetouchSettings,
        adjustmentValues: defaultAdjustments,
        restoreSettings: defaultRestoreSettings
      })
    }
  },

  setActiveTab: (tab: TabType) => {
    set({ activeTab: tab })
  },

  updateRetouchSettings: (settings: Partial<RetouchSettings>) => {
    set((state) => ({
      retouchSettings: {
        ...state.retouchSettings,
        ...settings
      }
    }))
  },

  updateAdjustmentValues: (values: Partial<AdjustmentValues>) => {
    set((state) => ({
      adjustmentValues: {
        ...state.adjustmentValues,
        ...values
      }
    }))
  },

  updateRestoreSettings: (settings: Partial<RestoreSettings>) => {
    set((state) => ({
      restoreSettings: {
        ...state.restoreSettings,
        ...settings
      }
    }))
  },

  addPropToGallery: (prop: GalleryItem) => {
    set((state) => ({
      propsGallery: [...state.propsGallery, prop]
    }))
  },

  addImageToGallery: (image: ProcessedImageItem) => {
    set((state) => ({
      imagesGallery: [...state.imagesGallery, image]
    }))
  },

  removePropFromGallery: (id: string) => {
    set((state) => ({
      propsGallery: state.propsGallery.filter((prop) => prop.id !== id)
    }))
  },

  removeImageFromGallery: (id: string) => {
    set((state) => ({
      imagesGallery: state.imagesGallery.filter((image) => image.id !== id)
    }))
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  setCompareMode: (enabled: boolean) => {
    set({ compareMode: enabled })
  },

  clearEditor: () => {
    set({
      originalImage: null,
      currentImage: null,
      history: [],
      historyIndex: -1,
      activeTab: 'retouch',
      retouchSettings: defaultRetouchSettings,
      adjustmentValues: defaultAdjustments,
      restoreSettings: defaultRestoreSettings,
      isLoading: false,
      error: null,
      compareMode: false
    })
  }
}))
