/**
 * Viewport component with Fabric.js canvas integration
 */

import { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { useEditorStore } from '@/store/editorStore'
import type { CanvasTool } from '@/types'

/**
 * Canvas viewport with zoom, pan, and tool controls
 */
export default function Viewport() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { currentImage, originalImage, activeTab, compareMode } = useEditorStore()
  
  const [zoom, setZoom] = useState(100)
  const [activeTool, setActiveTool] = useState<CanvasTool>('pan')
  const [showGrid, setShowGrid] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#1f2937',
      selection: false
    })

    fabricCanvasRef.current = canvas

    // Set canvas size
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const container = containerRef.current
        canvas.setWidth(container.clientWidth)
        canvas.setHeight(container.clientHeight)
        canvas.renderAll()
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      canvas.dispose()
    }
  }, [])

  // Load image into canvas
  useEffect(() => {
    if (!fabricCanvasRef.current) return
    
    const imageToDisplay = compareMode ? originalImage : currentImage
    if (!imageToDisplay) return

    const canvas = fabricCanvasRef.current

    fabric.Image.fromURL(imageToDisplay.dataUrl, (img: fabric.Image) => {
      canvas.clear()
      
      // Scale image to fit canvas
      const canvasWidth = canvas.getWidth()
      const canvasHeight = canvas.getHeight()
      const imgWidth = img.width || 1
      const imgHeight = img.height || 1
      
      const scale = Math.min(
        (canvasWidth * 0.9) / imgWidth,
        (canvasHeight * 0.9) / imgHeight
      )
      
      img.scale(scale)
      img.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        selectable: false
      })
      
      canvas.add(img)
      canvas.renderAll()
    })
  }, [currentImage, originalImage, compareMode])

  // Handle zoom
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 10))
  }

  const handleZoomFit = () => {
    setZoom(100)
  }

  // Apply zoom to canvas
  useEffect(() => {
    if (!fabricCanvasRef.current) return
    
    const canvas = fabricCanvasRef.current
    const zoomLevel = zoom / 100
    
    canvas.setZoom(zoomLevel)
    canvas.renderAll()
  }, [zoom])

  // Handle tool changes based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'retouch':
        setActiveTool('select')
        break
      case 'adjust':
        setActiveTool('pan')
        break
      case 'restore':
        setActiveTool('brush')
        break
    }
  }, [activeTab])

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gray-900">
      {/* Canvas */}
      <canvas ref={canvasRef} />

      {/* Grid overlay */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      )}

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-2 flex items-center gap-2">
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Zoom Out"
        >
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        
        <button
          onClick={handleZoomFit}
          className="px-3 py-1 hover:bg-gray-700 rounded transition-colors text-gray-300 text-sm font-medium min-w-[60px]"
          title="Fit to Screen"
        >
          {zoom}%
        </button>
        
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Zoom In"
        >
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Tool Controls */}
      <div className="absolute top-4 right-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-2 flex flex-col gap-2">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-2 rounded transition-colors ${
            showGrid ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
          }`}
          title="Toggle Grid"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        </button>
        
        <button
          onClick={toggleFullscreen}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isFullscreen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            )}
          </svg>
        </button>
      </div>

      {/* Active Tool Indicator */}
      <div className="absolute top-4 left-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            activeTool === 'select' ? 'bg-blue-500' :
            activeTool === 'brush' ? 'bg-green-500' :
            'bg-gray-500'
          }`} />
          <span className="text-sm text-gray-300 capitalize">
            {activeTool === 'select' ? 'Selection Tool' :
             activeTool === 'brush' ? 'Brush Tool' :
             'Pan & Zoom'}
          </span>
        </div>
      </div>

      {/* Loading indicator */}
      {!currentImage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">No image loaded</p>
        </div>
      )}

      {/* Compare mode indicator */}
      {compareMode && (
        <div className="absolute bottom-4 left-4 bg-blue-600 rounded-lg shadow-lg px-4 py-2">
          <p className="text-white text-sm font-medium">
            Comparing with Original
          </p>
        </div>
      )}
    </div>
  )
}
