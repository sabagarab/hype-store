"use client"

import { useEffect, useState } from "react"
import { Toaster as Sonner } from "sonner"

// App-wide toasts (sonner), styled with the brand tokens: solid ink, bone
// text, ember accent. Placed so they never cover the cart drawer's actions:
// bottom-center on desktop (beside the drawer), top-center on phones (where
// the full-width drawer only has its header).
const Toaster = () => {
  const [isPhone, setIsPhone] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)")
    const update = () => setIsPhone(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return (
    <Sonner
      position={isPhone ? "top-center" : "bottom-center"}
      offset={{ bottom: 32 }}
      mobileOffset={{ top: 16 }}
      duration={2500}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center gap-x-3 rounded-large border border-bone/15 bg-ink px-4 py-3 text-sm font-medium text-bone shadow-lg",
          success: "[&_[data-icon]]:text-ember",
          error: "[&_[data-icon]]:text-ember",
          title: "text-bone",
          description: "text-bone/70",
        },
      }}
    />
  )
}

export default Toaster
