"use client"

import { useState, useEffect } from "react"

export const MOBILE_BREAKPOINT = 768

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Use matchMedia for more reliable detection
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const checkIfMobile = () => {
      setIsMobile(mql.matches)
    }

    // Initial check
    checkIfMobile()

    // Add event listener to mql
    mql.addEventListener('change', checkIfMobile)

    // Clean up
    return () => {
      mql.removeEventListener('change', checkIfMobile)
    }
  }, [])

  return isMobile
}
