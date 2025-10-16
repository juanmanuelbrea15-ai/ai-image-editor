/**
 * Gallery component for props and processed images
 */

import React, { useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { Modal } from '@/components/UI/Modal'
import { Button } from '@/components/UI/Button'

/**
 * Gallery with props and images sections
 */
export default function Gallery() {
  const {
    propsGallery,
    imagesGallery,
    removePropFromGallery,
    removeImageFromGallery,
    updateRetouchSettings,
    setCurrentImage
  } = useEditorStore()

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'prop' | 'image'
    id: string
  } | null>(null)

  // Handle prop click - load into retouch tab
  const handlePropClick = (propId: string) => {
    const prop = propsGallery.find(p => p.id === propId)
    if (!prop) return

    updateRetouchSettings({
      propImage: {
        id: prop.id,
        dataUrl: prop.dataUrl,
        width: 0, // Will be calculated on load
        height: 0,
        timestamp: prop.timestamp
      }
    })
  }

  // Handle image click - load as current image
  const handleImageClick = (imageId: string) => {
    const image = imagesGallery.find(img => img.id === imageId)
    if (!image) return

    setCurrentImage({
      id: image.id,
      dataUrl: image.dataUrl,
      width: 0, // Will be calculated
      height: 0,
      timestamp: image.timestamp
    })
  }

  // Handle delete
  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return

    if (deleteConfirm.type === 'prop') {
      removePropFromGallery(deleteConfirm.id)
    } else {
      removeImageFromGallery(deleteConfirm.id)
    }

    setDeleteConfirm(null)
  }

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="h-full flex bg-gray-900 border-t border-gray-700">
      {/* Props Gallery */}
      <div className="flex-1 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-medium text-gray-300">
            Props ({propsGallery.length})
          </h3>
        </div>
        
        <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
          {propsGallery.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">No props uploaded</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {propsGallery.map((prop) => (
                <div
                  key={prop.id}
                  className="relative group cursor-pointer"
                  onClick={() => handlePropClick(prop.id)}
                >
                  <div className="aspect-square bg-gray-800 rounded overflow-hidden">
                    <img
                      src={prop.dataUrl}
                      alt="Prop"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                    />
                  </div>
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteConfirm({ type: 'prop', id: prop.id })
                    }}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {/* Timestamp */}
                  <div className="mt-1">
                    <p className="text-xs text-gray-500 truncate">
                      {formatDate(prop.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Images Gallery */}
      <div className="flex-1">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-medium text-gray-300">
            Edited Images ({imagesGallery.length})
          </h3>
        </div>
        
        <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
          {imagesGallery.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">No edited images saved</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {imagesGallery.map((image) => (
                <div
                  key={image.id}
                  className="relative group cursor-pointer"
                  onClick={() => handleImageClick(image.id)}
                >
                  <div className="aspect-square bg-gray-800 rounded overflow-hidden">
                    <img
                      src={image.dataUrl}
                      alt="Edited"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                    />
                  </div>
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteConfirm({ type: 'image', id: image.id })
                    }}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {/* Timestamp */}
                  <div className="mt-1">
                    <p className="text-xs text-gray-500 truncate">
                      {formatDate(image.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this {deleteConfirm?.type}? This action cannot be undone.
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setDeleteConfirm(null)}
              variant="ghost"
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="danger"
              fullWidth
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
