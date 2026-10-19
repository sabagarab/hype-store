"use client"

import { ChevronLeftMini, ChevronRightMini } from "@medusajs/icons"
import { useCallback, useEffect, useState } from "react"

import FadeInImage from "@modules/common/components/fade-in-image"
import ImagePlaceholder from "@modules/common/components/image-placeholder"
import { MorphingDialogClose } from "@modules/common/components/morphing-dialog"
import { clx } from "@modules/common/components/ui"
import { GalleryImage } from "./types"

const ZOOM = 2

// Fullscreen image view inside the morphing dialog: arrows (and arrow keys)
// move between images; click/tap toggles 2x zoom at that point, and on
// desktop the zoomed image follows the pointer. Pinch-zoom on phones is left
// to the browser.
const ZoomViewer = ({
  images,
  startIndex,
  title,
}: {
  images: GalleryImage[]
  startIndex: number
  title: string
}) => {
  const [index, setIndex] = useState(startIndex)
  const [zoomed, setZoomed] = useState(false)
  const [origin, setOrigin] = useState("50% 50%")
  const count = images.length
  const image = images[index]

  const go = useCallback(
    (step: number) => {
      setZoomed(false)
      setIndex((i) => (i + step + count) % count)
    },
    [count]
  )

  useEffect(() => {
    if (count < 2) {
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [count, go])

  const originFrom = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    return `${x}% ${y}%`
  }

  return (
    <div className="relative flex h-[100dvh] w-screen items-center justify-center bg-black">
      <button
        type="button"
        aria-label={zoomed ? "Zoom out" : "Zoom in"}
        className={clx(
          "relative h-full w-full overflow-hidden",
          zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        )}
        onPointerUp={(e) => {
          if (!zoomed) setOrigin(originFrom(e))
          setZoomed((z) => !z)
        }}
        onPointerMove={(e) => {
          if (zoomed && e.pointerType === "mouse") setOrigin(originFrom(e))
        }}
      >
        <div
          className="absolute inset-0 transition-transform duration-slow ease-premium motion-reduce:transition-none"
          style={{
            transform: `scale(${zoomed ? ZOOM : 1})`,
            transformOrigin: origin,
          }}
        >
          <FadeInImage
            key={image.id}
            src={image.url}
            alt={`${title}, image ${index + 1} of ${count}`}
            fill
            sizes="100vw"
            className="object-contain"
            fallback={<ImagePlaceholder />}
          />
        </div>
      </button>

      <MorphingDialogClose className="absolute right-4 top-[calc(env(safe-area-inset-top)+1rem)] z-10" />

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(-1)}
            className="glass absolute left-4 top-1/2 z-10 flex h-control-sm w-11 -translate-y-1/2 items-center justify-center rounded-control text-bone transition-colors duration-base ease-premium hover:text-ember"
          >
            <ChevronLeftMini />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            className="glass absolute right-4 top-1/2 z-10 flex h-control-sm w-11 -translate-y-1/2 items-center justify-center rounded-control text-bone transition-colors duration-base ease-premium hover:text-ember"
          >
            <ChevronRightMini />
          </button>
          <p
            aria-live="polite"
            className="glass absolute bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-1/2 z-10 -translate-x-1/2 rounded-control px-3 py-1 text-xs font-medium text-bone"
          >
            {index + 1} / {count}
          </p>
        </>
      )}
    </div>
  )
}

export default ZoomViewer
