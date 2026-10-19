"use client"

import { Toaster as Sonner } from "sonner"

import useMediaQuery, { DESKTOP_QUERY } from "@lib/hooks/use-media-query"

// Sonner Toast from 21st.dev (@isaiahbjork/primitive-sonner): a quiet card
// toast, title over a muted description. Adapted to the shared tokens: ink
// surface, hairline border, card radius, glass shadow, bone text, ember icon;
// next-themes and the demo trigger are dropped. Placed so toasts never cover
// the cart drawer's actions: bottom-center on desktop (beside the side panel),
// top-center on phones (where the bottom sheet only leaves the top free).
const Toaster = () => {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)

  return (
    <Sonner
      position={isDesktop ? "bottom-center" : "top-center"}
      offset={{ bottom: 32 }}
      mobileOffset={{ top: 16 }}
      duration={2500}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center gap-x-3 rounded-card border border-hairline bg-ink px-4 py-4 text-sm font-medium text-bone shadow-glass",
          success: "[&_[data-icon]]:text-ember",
          error: "[&_[data-icon]]:text-ember",
          title: "text-sm font-medium text-bone",
          description: "text-sm leading-6 text-bone/70",
        },
      }}
    />
  )
}

export default Toaster
