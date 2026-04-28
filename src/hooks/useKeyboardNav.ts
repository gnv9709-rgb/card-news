import { useEffect } from 'react'

interface UseKeyboardNavOptions {
  onPrev: () => void
  onNext: () => void
}

export function useKeyboardNav({ onPrev, onNext }: UseKeyboardNavOptions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onPrev, onNext])
}
