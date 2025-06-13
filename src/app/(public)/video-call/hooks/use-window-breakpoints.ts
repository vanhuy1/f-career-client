"use client"

import { useState, useEffect } from "react"
import { getWindowDimensions } from "@/utils/functions"
import type { TBreakpoint } from "@/utils/types"

export function useWindowBreakpoints(): TBreakpoint {
  const [breakpoint, setBreakpoint] = useState<TBreakpoint>("md")

  useEffect(() => {
    const handleResize = () => {
      const { width } = getWindowDimensions()

      if (width < 576) {
        setBreakpoint("xsm")
      } else if (width >= 576 && width < 768) {
        setBreakpoint("sm")
      } else if (width >= 768 && width < 992) {
        setBreakpoint("md")
      } else if (width >= 992 && width < 1200) {
        setBreakpoint("lg")
      } else if (width >= 1200 && width < 1400) {
        setBreakpoint("xl")
      } else {
        setBreakpoint("xxl")
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return breakpoint
}

export default useWindowBreakpoints
