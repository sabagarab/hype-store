"use client"

import { AnimatePresence, motion, useReducedMotion, useSpring } from "motion/react"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { DURATION, EASE_PREMIUM, INSTANT } from "@lib/motion"

// Loading progress bar from 21st.dev (@motiondotdev, Motion for React): a
// bar whose scaleX trickles forward on a spring. Adapted for route changes:
// it starts when an internal link is clicked, creeps towards 90% while the
// next page loads, then fills and fades out once the URL changes. A thin
// ember line at the very top (above the safe area), no track. With reduced
// motion it holds still at 90% and disappears without animating. A safety
// timeout finishes it if a navigation never lands; clicks that end a drag
// (e.g. on a carousel) don't start it. Navigations without a link click
// (back/forward, router.push) show no bar.

const TRICKLE_MS = 400
const CAP = 0.9
const GIVE_UP_MS = 10000

// Pointer travel (px) after which a click is treated as the end of a drag
// (carousels cancel those clicks, so no navigation follows).
const DRAG_PX = 10

const isNavigationClick = (event: MouseEvent, dragged: boolean) => {
  if (
    dragged ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return false
  }
  const anchor = (event.target as Element | null)?.closest?.("a[href]")
  if (!(anchor instanceof HTMLAnchorElement)) return false
  if (anchor.target && anchor.target !== "_self") return false
  if (anchor.hasAttribute("download")) return false
  const url = new URL(anchor.href, window.location.href)
  if (url.origin !== window.location.origin) return false
  // Same page (or only the hash changes): nothing to load.
  return (
    url.pathname !== window.location.pathname ||
    url.search !== window.location.search
  )
}

export default function RouteProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const reduced = useReducedMotion()
  const [active, setActive] = useState(false)
  const progress = useSpring(0, { stiffness: 120, damping: 24 })
  const trickle = useRef<number | undefined>(undefined)
  const giveUp = useRef<number | undefined>(undefined)

  const stopTimers = () => {
    window.clearInterval(trickle.current)
    window.clearTimeout(giveUp.current)
  }

  // Start on internal link clicks (not on clicks that end a drag).
  useEffect(() => {
    let down = { x: 0, y: 0 }
    const onPointerDown = (event: PointerEvent) => {
      down = { x: event.clientX, y: event.clientY }
    }
    const onClick = (event: MouseEvent) => {
      const dragged =
        Math.hypot(event.clientX - down.x, event.clientY - down.y) > DRAG_PX
      if (!isNavigationClick(event, dragged)) return
      stopTimers()
      progress.jump(0.08)
      setActive(true)
      if (reduced) {
        progress.jump(CAP)
      } else {
        trickle.current = window.setInterval(() => {
          const next = progress.get() + (CAP - progress.get()) * 0.25
          progress.set(Math.min(next, CAP))
        }, TRICKLE_MS)
      }
      giveUp.current = window.setTimeout(() => {
        stopTimers()
        setActive(false)
      }, GIVE_UP_MS)
    }
    document.addEventListener("pointerdown", onPointerDown, true)
    document.addEventListener("click", onClick, true)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true)
      document.removeEventListener("click", onClick, true)
    }
  }, [progress, reduced])

  // Finish when the URL changes.
  const url = `${pathname}?${searchParams.toString()}`
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    stopTimers()
    progress.set(1)
    const done = window.setTimeout(
      () => setActive(false),
      reduced ? 0 : DURATION.base * 1000
    )
    return () => window.clearTimeout(done)
  }, [url, progress, reduced])

  useEffect(() => stopTimers, [])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="route-progress"
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 origin-left bg-ember"
          style={{ scaleX: progress }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: reduced
              ? INSTANT
              : { duration: DURATION.base, ease: EASE_PREMIUM },
          }}
        />
      )}
    </AnimatePresence>
  )
}
