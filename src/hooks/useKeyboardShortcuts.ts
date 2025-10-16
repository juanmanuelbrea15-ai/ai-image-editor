/**
 * Custom hook for keyboard shortcuts
 */

import { useEffect } from 'react'

interface KeyboardShortcuts {
  onUndo?: () => void
  onRedo?: () => void
  onReset?: () => void
  enabled?: boolean
}

/**
 * Hook for handling keyboard shortcuts
 * - Ctrl/Cmd + Z: Undo
 * - Ctrl/Cmd + Shift + Z: Redo
 * - Ctrl/Cmd + R: Reset
 */
export function useKeyboardShortcuts({
  onUndo,
  onRedo,
  onReset,
  enabled = true
}: KeyboardShortcuts): void {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey

      if (!cmdOrCtrl) return

      // Ctrl/Cmd + Shift + Z: Redo
      if (event.shiftKey && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        onRedo?.()
        return
      }

      // Ctrl/Cmd + Z: Undo
      if (event.key.toLowerCase() === 'z') {
        event.preventDefault()
        onUndo?.()
        return
      }

      // Ctrl/Cmd + R: Reset
      if (event.key.toLowerCase() === 'r') {
        event.preventDefault()
        onReset?.()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onUndo, onRedo, onReset, enabled])
}
