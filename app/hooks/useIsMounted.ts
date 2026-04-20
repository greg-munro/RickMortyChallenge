/**
 * Avoids setting state on an unmounted component.
 * Returns a function that can be called to check if the component is still mounted.
 */
import { useEffect, useRef } from "react"

export function useIsMounted() {
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  return () => isMounted.current
}
