/**
 * Main Editor component with layout
 */

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEditorStore } from '@/store/editorStore'
import TabPanel from '@/components/Tabs/TabPanel'
import Viewport from '@/components/Viewport/Viewport'
import Gallery from '@/components/Gallery/Gallery'
import Controls from '@/components/Controls/Controls'

/**
 * Editor layout with two-column design
 */
export default function Editor() {
  const navigate = useNavigate()
  const { originalImage, isLoading, error } = useEditorStore()

  // Redirect to upload if no image is loaded
  useEffect(() => {
    if (!originalImage) {
      navigate('/')
    }
  }, [originalImage, navigate])

  if (!originalImage) {
    return null
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - Controls (400px fixed width) */}
        <div className="w-[400px] bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <TabPanel />
          </div>
        </div>

        {/* Right panel - Viewport */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <Viewport />
            
            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="bg-gray-800 rounded-lg p-6 flex items-center gap-4">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="text-white font-medium">Processing...</span>
                </div>
              </div>
            )}

            {/* Error overlay */}
            {error && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 max-w-md">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-red-400 text-sm font-medium">{error}</p>
                    </div>
                    <button
                      onClick={() => useEditorStore.getState().setError(null)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gallery at bottom (200px fixed height) */}
          <div className="h-[200px]">
            <Gallery />
          </div>
        </div>
      </div>

      {/* Controls bar at bottom */}
      <Controls />
    </div>
  )
}
