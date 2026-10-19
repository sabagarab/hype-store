"use client"

import { usePathname } from "next/navigation"

// Presence Fade from 21st.dev (@corr/presence-fade), "fade" mode only: each
// new page fades in over 200ms. Adapted: keyed on the pathname so it replays
// on every page change (not on filter or sort changes), done as a CSS
// animation so the server-rendered page shows even before JavaScript runs,
// no exit (App Router pages can't animate out), no fade for reduced motion.
export default function PageFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="animate-page-fade motion-reduce:animate-none">
      {children}
    </div>
  )
}
