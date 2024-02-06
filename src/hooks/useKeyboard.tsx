import { useEffect } from 'react'

export const useKeyboard = (fn: (e: KeyboardEvent) => void) => {
  useEffect(() => {
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [fn])
}
