"use client"

import { HttpTypes } from "@medusajs/types"
import { useState } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselPagination,
  CarouselSlide,
} from "@modules/common/components/carousel"
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
        className="block aspect-[4/5] w-full overflow-hidden rounded-card bg-ink"
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

  if (!items.length) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card">
        <ImagePlaceholder />
      </div>
    )
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
                "relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-card bg-ink transition-opacity duration-base ease-premium",
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

      {/* Mobile: the 21st Carousel, full-width swipeable images with dots. */}
      <Carousel
        label={`${title} images`}
        slideCount={items.length}
        slideNoun="image"
        className="-mx-6 small:hidden"
      >
        <CarouselContent>
          {items.map((item, i) => (
            <CarouselSlide key={item.id} index={i} total={items.length}>
              <div className="px-6">
                <ZoomableImage
                  images={items}
                  index={i}
                  title={title}
                  priority={i === 0}
                />
              </div>
            </CarouselSlide>
          ))}
        </CarouselContent>
        <CarouselPagination className="mt-1 justify-center" />
      </Carousel>
    </div>
  )
}

export default ImageGallery
