"use client"

import { useEffect, useState } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === "undefined") return

    // Initial check
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on mount
    checkIsMobile()

    // Add resize listener
    window.addEventListener("resize", checkIsMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  return isMobile
} 