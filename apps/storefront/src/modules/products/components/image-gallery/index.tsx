"use client"

import { HttpTypes } from "@medusajs/types"
import { useRef, useState } from "react"

import FadeInImage from "@modules/common/components/fade-in-image"
import ImagePlaceholder from "@modules/common/components/image-placeholder"
import {
  MorphingDialog,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTrigger,
} from "@modules/common/components/morphing-dialog"
import { clx } from "@modules/common/components/ui"
import { GalleryImage, GalleryItem } from "./types"
import ZoomViewer from "./zoom-viewer"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  title: string
}

const MAIN_SIZES = "(min-width: 1024px) 55vw, 100vw"

// One image that grows into the fullscreen zoom view when clicked or tapped.
const ZoomableImage = ({
  images,
  index,
  title,
  priority,
}: {
  images: GalleryImage[]
  index: number
  title: string
  priority?: boolean
}) => {
  const image = images[index]

  return (
    <MorphingDialog>
      <MorphingDialogTrigger
        aria-label={`Open image ${index + 1} of ${images.length} fullscreen`}
        className="block aspect-[4/5] w-full overflow-hidden rounded-large bg-ink"
      >
        <FadeInImage
          src={image.url}
          alt={`${title}, image ${index + 1} of ${images.length}`}
          fill
          priority={priority}
          sizes={MAIN_SIZES}
          className="object-cover"
          fallback={<ImagePlaceholder />}
        />
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent aria-label={`${title} images`}>
          <ZoomViewer images={images} startIndex={index} title={title} />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const items: GalleryItem[] = images.flatMap((image) =>
    image.url ? [{ kind: "image" as const, id: image.id, url: image.url }] : []
  )
  const [active, setActive] = useState(0)
  const [slide, setSlide] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  if (!items.length) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-large">
        <ImagePlaceholder />
      </div>
    )
  }

  const goToSlide = (index: number) => {
    const track = trackRef.current
    track?.scrollTo({ left: index * track.clientWidth, behavior: "smooth" })
  }

  return (
    <div data-testid="product-gallery">
      {/* Desktop: vertical thumbnail strip + main image. */}
      <div className="hidden small:grid small:grid-cols-[72px_1fr] small:gap-4">
        <div className="flex max-h-[80vh] flex-col gap-3 overflow-y-auto no-scrollbar">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${items.length}`}
              aria-current={i === active}
              className={clx(
                "relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-rounded bg-ink transition-opacity duration-200",
                i === active
                  ? "ring-2 ring-ember ring-offset-2 ring-offset-black"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <FadeInImage
                src={item.url}
                alt=""
                fill
                sizes="72px"
                className="object-cover"
                fallback={<ImagePlaceholder />}
              />
            </button>
          ))}
        </div>
        <ZoomableImage
          key={items[active].id}
          images={items}
          index={active}
          title={title}
          priority
        />
      </div>

      {/* Mobile: full-width swipeable images with dot indicators. */}
      <div className="-mx-6 small:hidden">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory overflow-x-auto no-scrollbar motion-reduce:scroll-auto"
          onScroll={(e) => {
            const track = e.currentTarget
            setSlide(Math.round(track.scrollLeft / track.clientWidth))
          }}
        >
          {items.map((item, i) => (
            <div key={item.id} className="w-full shrink-0 snap-center px-6">
              <ZoomableImage
                images={items}
                index={i}
                title={title}
                priority={i === 0}
              />
            </div>
          ))}
        </div>
        {items.length > 1 && (
          <div className="mt-3 flex justify-center gap-1">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSlide(i)}
                aria-label={`Go to image ${i + 1} of ${items.length}`}
                aria-current={i === slide}
                className="flex h-11 w-6 items-center justify-center"
              >
                <span
                  className={clx(
                    "block h-1.5 rounded-full transition-all duration-200 motion-reduce:transition-none",
                    i === slide ? "w-4 bg-ember" : "w-1.5 bg-bone/30"
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageGallery
