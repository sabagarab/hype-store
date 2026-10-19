"use client"

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react"
import FadeInImage from "@modules/common/components/fade-in-image"
import { useCallback, useEffect, useRef, useState } from "react"

import { INSTANT, TRANSITION } from "@lib/motion"
import { buttonClass } from "@modules/common/components/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ScrollParallax from "@modules/common/components/scroll-parallax"
import { ScrollReveal } from "@modules/common/components/scroll-reveal"
import { clx } from "@modules/common/components/ui"

// Elegant Carousel from 21st.dev (@dev.yadhakim/elegant-carousel): an
// editorial split panel (title + action beside a large image) that advances
// on a timer, with labelled progress lines and swipe. Adapted: Tailwind
// instead of its stylesheet, brand colors (no per-slide accent washes, frame
// corners or image overlays), no Ken Burns zoom, a 300ms crossfade, autoplay
// only while on screen and never with reduced motion, and a single slide
// renders as a static panel. On scroll the image eases from a slight zoom to
// rest (scroll-linked) and the text rises in once just after it.

export type LookbookSlide = {
  id: string
  title: string
  image: string | null
  cta: { label: string; href: string }
}

const SLIDE_DURATION = 6000
const SWIPE_THRESHOLD = 60

const LookbookCarousel = ({
  slides,
  className,
}: {
  slides: LookbookSlide[]
  className?: string
}) => {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const touchStart = useRef(0)
  const inView = useInView(rootRef, { margin: "-20% 0px" })
  const reduced = useReducedMotion()

  const count = slides.length
  const autoplay = count > 1 && inView && !paused && !reduced

  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  )

  useEffect(() => {
    if (!autoplay) {
      return
    }
    const timer = setTimeout(() => goTo(index + 1), SLIDE_DURATION)
    return () => clearTimeout(timer)
  }, [autoplay, index, goTo])

  if (count === 0) {
    return null
  }

  const slide = slides[index]
  const fade = reduced ? INSTANT : TRANSITION

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Lookbook"
      className={clx(
        "grid gap-6 small:grid-cols-[2fr_3fr] small:items-center small:gap-12",
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX
      }}
      onTouchEnd={(event) => {
        const diff = touchStart.current - event.changedTouches[0].clientX
        if (count > 1 && Math.abs(diff) > SWIPE_THRESHOLD) {
          goTo(diff > 0 ? index + 1 : index - 1)
        }
      }}
    >
      <ScrollReveal
        delay={0.1}
        className="order-2 flex flex-col items-start gap-6 small:order-1"
      >
        {count > 1 && (
          <p className="text-xs font-medium tabular-nums tracking-widest text-bone/55">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </p>
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.h2
            key={slide.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={fade}
            className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-bone small:text-6xl"
          >
            {slide.title}
          </motion.h2>
        </AnimatePresence>
        <LocalizedClientLink
          href={slide.cta.href}
          className={buttonClass({ variant: "secondary" })}
        >
          {slide.cta.label}
        </LocalizedClientLink>
      </ScrollReveal>

      <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-card bg-ink small:order-2 small:aspect-[5/4]">
        <ScrollParallax
          phase="pass"
          scale={[1.08, 1]}
          className="absolute inset-0"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
            >
              {slide.image && (
                <FadeInImage
                  src={slide.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </ScrollParallax>
      </div>

      {count > 1 && (
        <div className="order-3 col-span-full grid grid-flow-col gap-3">
          {slides.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${item.title}`}
              aria-current={i === index ? "true" : undefined}
              className="flex min-h-control-sm flex-col justify-center gap-2 text-left"
            >
              <span className="block h-px w-full overflow-hidden bg-bone/20">
                <span
                  key={i === index ? `active-${index}` : `idle-${i}`}
                  className={clx(
                    "block h-full bg-bone",
                    i < index && "w-full",
                    i > index && "w-0",
                    i === index &&
                      (autoplay
                        ? "w-0 animate-[lookbook-progress_6s_linear_forwards]"
                        : "w-full")
                  )}
                />
              </span>
              <span
                className={clx(
                  "truncate text-xs uppercase tracking-widest transition-colors duration-base",
                  i === index ? "text-bone" : "text-bone/45"
                )}
              >
                {item.title}
              </span>
            </button>
          ))}
        </div>
      )}
      <style>{`@keyframes lookbook-progress { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  )
}

export default LookbookCarousel
