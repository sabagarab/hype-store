"use client"

import { useEffect, useState } from "react"

/** Desktop layout breakpoint (Tailwind `small`). */
export const DESKTOP_QUERY = "(min-width: 1024px)"

// Tracks a CSS media query. False on the server and the first client render,
// so markup matches; updates after mount and on every change.
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const list = window.matchMedia(query)
    const update = () => setMatches(list.matches)
    update()
    list.addEventListener("change", update)
    return () => list.removeEventListener("change", update)
  }, [query])

  return matches
}

export default useMediaQuery
