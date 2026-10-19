"use client"

import { LayoutGroup, MotionConfig, motion } from "motion/react"
import { useEffect, useState } from "react"

import { TRANSITION } from "@lib/motion"
import { clx } from "@modules/common/components/ui"

// Resizable Navbar from 21st.dev (@manuarora700, Aceternity UI): the bar
// shrinks into a floating, rounded glass pill once the page scrolls, and the
// links share a sliding hover highlight. Adapted to the shared tokens: glass
// surface, hairline border, control radius, float shadow, slow/premium CSS
// transitions instead of springs on width (none with reduced motion), the
// highlight on the shared TRANSITION. State only flips when crossing the
// threshold. The original's mobile dropdown is replaced by the full-screen
// menu (see layout/components/side-menu); logo/button parts are dropped.

/** True once the window has scrolled past `threshold` px. */
export function useNavbarScrolled(threshold: number) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > threshold)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [threshold])

  return scrolled
}

/** Sticky wrapper plus the bar that becomes the pill. */
export function Navbar({
  scrolled,
  children,
}: {
  scrolled: boolean
  children: React.ReactNode
}) {
  return (
    // Transparent outer strip lets clicks through around the pill. The pill's
    // gap from the top is padding here: a margin on the header would collapse
    // through this sticky wrapper and disappear.
    <div
      className={clx(
        "pointer-events-none sticky inset-x-0 top-0 z-50 transition-[padding] duration-slow ease-premium motion-reduce:transition-none",
        scrolled && "pt-[calc(env(safe-area-inset-top)+0.75rem)]"
      )}
    >
      <header
        className={clx(
          "glass pointer-events-auto mx-auto transition-[max-width,border-radius,box-shadow,padding] duration-slow ease-premium motion-reduce:transition-none",
          scrolled
            ? "max-w-[calc(100%-1.5rem)] rounded-control border border-hairline shadow-float small:max-w-[880px]"
            : "max-w-full rounded-none border-b border-hairline pt-[env(safe-area-inset-top)]"
        )}
        data-scrolled={scrolled || undefined}
      >
        {children}
      </header>
    </div>
  )
}

/** The three-column row inside the bar (left, centre, right). */
export function NavBody({
  scrolled,
  children,
}: {
  scrolled: boolean
  children: React.ReactNode
}) {
  return (
    <nav
      aria-label="Main"
      className={clx(
        "grid w-full grid-cols-[1fr_auto_1fr] items-center text-sm font-medium text-bone/80 transition-[height] duration-slow ease-premium motion-reduce:transition-none",
        scrolled ? "h-control px-3 small:px-5" : "h-14 px-6 small:h-16",
        !scrolled && "mx-auto max-w-[1440px]"
      )}
    >
      {children}
    </nav>
  )
}

export const NAV_ITEM_CLASS =
  "relative flex h-control-sm items-center px-4 text-sm font-medium transition-colors duration-base ease-premium"

/**
 * Desktop links with the shared sliding highlight. `renderItem` draws each
 * link (or button) and receives the highlight and the hover handlers.
 */
export function NavItems<T>({
  items,
  renderItem,
  className,
}: {
  items: T[]
  renderItem: (
    item: T,
    props: {
      highlight: React.ReactNode
      onMouseEnter: () => void
      onFocus: () => void
    }
  ) => React.ReactNode
  className?: string
}) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id="nav-links">
        <ul
          className={clx("items-center", className)}
          onMouseLeave={() => setHovered(null)}
        >
          {items.map((item, index) => (
            <li key={index} className="relative isolate">
              {renderItem(item, {
                highlight: hovered === index && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 -z-10 rounded-control bg-ink"
                    transition={TRANSITION}
                  />
                ),
                onMouseEnter: () => setHovered(index),
                onFocus: () => setHovered(index),
              })}
            </li>
          ))}
        </ul>
      </LayoutGroup>
    </MotionConfig>
  )
}
