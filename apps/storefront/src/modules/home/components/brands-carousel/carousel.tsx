"use client"

import { ArrowLeft, ArrowRight } from "@medusajs/icons"
import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { Brand } from "@lib/data/brands"
import { clx } from "@modules/common/components/ui"
import BrandCard from "./brand-card"

// Adapted from Aceternity UI's Apple Cards Carousel
// (https://ui.aceternity.com, MIT): a horizontally scrolling track with
// arrows and a staggered fade-in. Changes: cards are links (the original's
// expanding modal, outside-click hook and @tabler icons are dropped), brand
// tokens, scroll snapping, arrows only on desktop (44px), and the fade-in is
// 300ms per card and skipped with reduced motion (CSS overrides, so server and
// client markup match).
const BrandsCarousel = ({ brands }: { brands: Brand[] }) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollability = () => {
    const track = trackRef.current
    if (!track) return
    const { scrollLeft, scrollWidth, clientWidth } = track
    // A few px of slack: scroll positions are fractional on zoomed or
    // high-DPI screens, so the end is rarely hit exactly.
    setCanScrollLeft(scrollLeft > 2)
    setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 2)
  }

  useEffect(() => {
    checkScrollability()
    window.addEventListener("resize", checkScrollability)
    return () => window.removeEventListener("resize", checkScrollability)
  }, [])

  // Scroll by about one card.
  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    const card = track?.querySelector<HTMLElement>("[data-testid=brand-card]")
    track?.scrollBy({
      left: direction * ((card?.offsetWidth ?? 300) + 16),
      behavior: "smooth",
    })
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={checkScrollability}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 motion-reduce:scroll-auto"
      >
        {brands.map((brand, index) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 * index, ease: "easeOut" }}
            className="w-56 shrink-0 snap-start small:w-80 motion-reduce:!transform-none motion-reduce:!opacity-100"
          >
            <BrandCard brand={brand} sizes="(min-width: 1024px) 320px, 224px" />
          </motion.div>
        ))}
      </div>

      {/* Arrows only when there is something to scroll to. */}
      <div
        className={clx(
          "mt-4 hidden justify-end gap-2",
          (canScrollLeft || canScrollRight) && "small:flex"
        )}
      >
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={!canScrollLeft}
          aria-label="Previous brands"
          className="glass flex h-11 w-11 items-center justify-center rounded-full text-bone transition-colors duration-200 hover:text-ember disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-bone"
        >
          <ArrowLeft />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canScrollRight}
          aria-label="Next brands"
          className="glass flex h-11 w-11 items-center justify-center rounded-full text-bone transition-colors duration-200 hover:text-ember disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-bone"
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  )
}

export default BrandsCarousel
