/**
 * Controls component with action buttons
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/UI/Button'
import { Modal } from '@/components/UI/Modal'
import { ToastContainer } from '@/components/UI/Toast'
import { useEditorStore } from '@/store/editorStore'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { downloadImage } from '@/utils/downloadUtils'
import { generateId } from '@/utils/helpers'
import type { ToastMessage } from '@/types'

/**
 * Control bar with editing actions
 */
export default function Controls() {
  const navigate = useNavigate()
  
  const {
    currentImage,
    originalImage,
    history,
    historyIndex,
    undo,
    redo,
    reset,
    setCompareMode,
    clearEditor,
    addImageToGallery
  } = useEditorStore()

  const [showResetModal, setShowResetModal] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: undo,
    onRedo: redo,
    onReset: () => setShowResetModal(true),
    enabled: true
  })

  // Add toast notification
  const addToast = (type: ToastMessage['type'], message: string) => {
    const toast: ToastMessage = {
      id: generateId(),
      type,
      message,
      duration: 3000
    }
    setToasts(prev => [...prev, toast])
  }

  // Remove toast
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // Handle back
  const handleBack = () => {
    navigate('/')
  }

  // Handle reset
  const handleReset = () => {
    reset()
    setShowResetModal(false)
    addToast('success', 'Image reset to original')
  }

  // Handle upload new
  const handleUploadNew = () => {
    clearEditor()
    navigate('/')
  }

  // Handle download
  const handleDownload = async () => {
    if (!currentImage) {
      addToast('error', 'No image to download')
      return
    }

    setIsDownloading(true)

    try {
      await downloadImage(currentImage.dataUrl)
      
      // Add to gallery
      addImageToGallery({
        id: generateId(),
        dataUrl: currentImage.dataUrl,
        timestamp: Date.now(),
        type: 'image'
      })
      
      addToast('success', 'Image downloaded successfully (1350x1080px)')
    } catch (err) {
      addToast('error', 'Failed to download image')
      console.error(err)
    } finally {
      setIsDownloading(false)
    }
  }

  // Check if actions are available
  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1
  const canReset = currentImage?.id !== originalImage?.id

  return (
    <>
      <div className="h-16 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-6">
        {/* Left actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            }
          >
            Back
          </Button>

          <div className="w-px h-8 bg-gray-700 mx-2" />

          <Button
            onClick={undo}
            variant="ghost"
            size="sm"
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </Button>

          <Button
            onClick={redo}
            variant="ghost"
            size="sm"
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" />
            </svg>
          </Button>

          <div className="w-px h-8 bg-gray-700 mx-2" />

          <Button
            onClick={() => setShowResetModal(true)}
            variant="ghost"
            size="sm"
            disabled={!canReset}
            title="Reset (Ctrl+R)"
          >
            Reset
          </Button>
        </div>

        {/* Center - History indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>{historyIndex + 1} / {history.length}</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleUploadNew}
            variant="ghost"
            size="sm"
          >
            Upload New
          </Button>

          <div className="w-px h-8 bg-gray-700 mx-2" />

          <Button
            onClick={handleDownload}
            variant="primary"
            size="sm"
            loading={isDownloading}
            disabled={!currentImage || isDownloading}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
          >
            Download
          </Button>

          <Button
            onMouseDown={() => setCompareMode(true)}
            onMouseUp={() => setCompareMode(false)}
            onMouseLeave={() => setCompareMode(false)}
            variant="ghost"
            size="sm"
            disabled={!originalImage}
            title="Hold to compare with original"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Image"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to reset the image to its original state? All edits will be lost.
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setShowResetModal(false)}
              variant="ghost"
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={handleReset}
              variant="danger"
              fullWidth
            >
              Reset
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </>
  )
}
