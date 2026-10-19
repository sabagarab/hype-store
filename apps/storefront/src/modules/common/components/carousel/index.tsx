"use client"

import useEmblaCarousel from "embla-carousel-react"
import * as React from "react"

import { clx } from "@modules/common/components/ui"

// Carousel from 21st.dev (@appica-dev/carousel), trimmed to what the store
// uses: Carousel, CarouselContent, CarouselSlide and CarouselPagination.
// Adapted: Embla 8 (stable) instead of the v9 release candidate, no
// autoplay/fade/wheel plugins or arrow buttons (swipe and dots only), brand
// colors and the shared timing on the dots. A single slide renders without
// dots and can't be dragged.

type CarouselApi = ReturnType<typeof useEmblaCarousel>[1]

type CarouselContextValue = {
  api: CarouselApi
  viewportRef: ReturnType<typeof useEmblaCarousel>[0]
  selectedIndex: number
  snapCount: number
  scrollTo: (index: number) => void
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

const useCarousel = () => {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("Carousel parts must be rendered inside <Carousel>")
  }
  return context
}

type CarouselProps = React.ComponentPropsWithoutRef<"div"> & {
  /** Accessible name for the region, e.g. "Featured products". */
  label: string
  align?: "start" | "center" | "end"
  loop?: boolean
  slideCount: number
}

export function Carousel({
  label,
  align = "start",
  loop = false,
  slideCount,
  className,
  children,
  ...rest
}: CarouselProps) {
  const [viewportRef, api] = useEmblaCarousel({
    align,
    loop,
    containScroll: "trimSnaps",
    active: slideCount > 1,
  })
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [snapCount, setSnapCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }
    const sync = () => {
      setSelectedIndex(api.selectedScrollSnap())
      setSnapCount(api.scrollSnapList().length)
    }
    sync()
    api.on("select", sync)
    api.on("reInit", sync)
    return () => {
      api.off("select", sync)
      api.off("reInit", sync)
    }
  }, [api])

  const scrollTo = React.useCallback((index: number) => api?.scrollTo(index), [api])

  const value = React.useMemo(
    () => ({ api, viewportRef, selectedIndex, snapCount, scrollTo }),
    [api, viewportRef, selectedIndex, snapCount, scrollTo]
  )

  return (
    <CarouselContext.Provider value={value}>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        className={clx("relative", className)}
        {...rest}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

export function CarouselContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const { viewportRef } = useCarousel()
  return (
    <div ref={viewportRef} className="overflow-hidden">
      <div className={clx("-ms-3 flex touch-pan-y touch-pinch-zoom", className)}>
        {children}
      </div>
    </div>
  )
}

export function CarouselSlide({
  className,
  index,
  total,
  ...rest
}: React.ComponentPropsWithoutRef<"div"> & { index: number; total: number }) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}`}
      className={clx("min-w-0 shrink-0 grow-0 basis-full ps-3", className)}
      {...rest}
    />
  )
}

export function CarouselPagination({ className }: { className?: string }) {
  const { snapCount, selectedIndex, scrollTo } = useCarousel()

  if (snapCount <= 1) {
    return null
  }

  return (
    <div
      role="group"
      aria-label="Choose slide to display"
      className={clx("flex items-center gap-1", className)}
    >
      {Array.from({ length: snapCount }, (_, index) => {
        const active = index === selectedIndex
        return (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={active ? "true" : undefined}
            onClick={() => scrollTo(index)}
            // 44px tall tap target around a small dot.
            className="flex h-11 items-center px-1"
          >
            <span
              className={clx(
                "block h-1 rounded-control transition-[width,background-color] duration-base ease-premium",
                active ? "w-6 bg-bone" : "w-1.5 bg-bone/30"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
