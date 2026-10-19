"use client"

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react"
import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { EASE_PREMIUM } from "@lib/motion"
import { clx } from "@modules/common/components/ui"

// Snap Carousel from 21st.dev (@ddoemonn/snap-carousel): a draggable rail
// with momentum flicks that settles on a slide. Adapted for a product rail:
// several slides visible at once (`slideWidth` as a fraction of the
// viewport), no scale/fade on side slides (all products stay equal), no
// arrow buttons or slide counter (swipe, keys and drag), shared timing, and
// a rail that fits on screen doesn't drag at all.

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n))

const SETTLE = { type: "spring", stiffness: 260, damping: 34, mass: 0.8 } as const

type SnapCarouselProps = {
  children: React.ReactNode
  label: string
  /** Slide width as a fraction of the viewport, per breakpoint. */
  slideWidth?: { base: number; small?: number }
  gap?: number
  className?: string
}

export function SnapCarousel({
  children,
  label,
  slideWidth = { base: 0.62, small: 0.25 },
  gap = 12,
  className,
}: SnapCarouselProps) {
  const slides = Children.toArray(children)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [isSmall, setIsSmall] = useState(false)
  const [index, setIndex] = useState(0)
  const x = useMotionValue(0)
  const reduced = useReducedMotion()

  const fraction = isSmall ? slideWidth.small ?? slideWidth.base : slideWidth.base
  const itemWidth = viewportWidth * fraction
  const step = itemWidth + gap
  const trackWidth = slides.length * itemWidth + (slides.length - 1) * gap
  const maxOffset = Math.max(0, trackWidth - viewportWidth)
  const draggable = maxOffset > 0
  const lastIndex = step > 0 ? Math.ceil(maxOffset / step) : 0

  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el) {
      return
    }
    const media = window.matchMedia("(min-width: 1024px)")
    const update = () => {
      setViewportWidth(el.clientWidth)
      setIsSmall(media.matches)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const goTo = useCallback(
    (next: number, velocity = 0) => {
      const to = clamp(Math.round(next), 0, lastIndex)
      setIndex(to)
      animate(
        x,
        -Math.min(to * step, maxOffset),
        reduced ? { duration: 0 } : { ...SETTLE, velocity }
      )
    },
    [lastIndex, maxOffset, reduced, step, x]
  )

  // Keep the current slide in place when the width changes.
  useEffect(() => {
    x.set(-Math.min(index * step, maxOffset))
  }, [step, maxOffset]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={clx("w-full", className)}>
      <div
        ref={viewportRef}
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={draggable ? 0 : undefined}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault()
            goTo(index + 1)
          } else if (event.key === "ArrowLeft") {
            event.preventDefault()
            goTo(index - 1)
          }
        }}
        className="overflow-hidden rounded-card outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
      >
        <motion.div
          drag={draggable ? "x" : false}
          dragDirectionLock
          dragMomentum={false}
          dragElastic={0.12}
          dragConstraints={{ left: -maxOffset, right: 0 }}
          onDragEnd={(_event, info) => {
            const projected = (-x.get() - info.velocity.x * 0.14) / step
            goTo(clamp(projected, index - 2, index + 2), info.velocity.x)
          }}
          style={{ x, gap, touchAction: "pan-y" }}
          className={clx("flex", draggable && "cursor-grab active:cursor-grabbing")}
          transition={{ ease: EASE_PREMIUM }}
        >
          {slides.map((slide, i) => (
            <div
              key={isValidElement(slide) && slide.key ? slide.key : i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              className="shrink-0"
              // Until measured, fall back to CSS widths so nothing jumps.
              style={{
                width: viewportWidth
                  ? itemWidth
                  : `calc(${slideWidth.base * 100}% - ${gap}px)`,
              }}
            >
              {slide}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default SnapCarousel
