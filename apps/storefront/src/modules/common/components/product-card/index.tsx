import FadeInImage from "@modules/common/components/fade-in-image"
import * as React from "react"

import { clx } from "@modules/common/components/ui"

// Product Card from 21st.dev (@deltacomponents/product-card). Compound parts:
// image well, then a title/subtitle/metric row below. Adapted to the shared
// tokens: card radius, text stacked under the photo (title up to two lines,
// price below, as on StockX), 4:5 well filled edge to edge (our photos carry their
// own studio background), FadeInImage (load retry), a quiet zoom on hover / press instead
// of the lift, brand colors. The wishlist badge is dropped.

type ProductCardProps = React.ComponentProps<"div">

export function ProductCard({ className, ...props }: ProductCardProps) {
  return (
    <div
      data-slot="product-card"
      className={clx("group/card w-full text-sm", className)}
      {...props}
    />
  )
}

type ProductCardImageProps = {
  src: string | null | undefined
  alt: string
  sizes: string
  priority?: boolean
  /** Dims the photo, e.g. for a sold piece. */
  muted?: boolean
  className?: string
  children?: React.ReactNode
}

export function ProductCardImage({
  src,
  alt,
  sizes,
  priority = false,
  muted = false,
  className,
  children,
}: ProductCardImageProps) {
  return (
    <div
      data-slot="product-card-image"
      className={clx(
        "relative aspect-[4/5] w-full overflow-hidden rounded-card bg-ink",
        className
      )}
    >
      {src && (
        // Zoom and dimming live on this wrapper; the image itself only fades
        // in (FadeInImage owns its opacity transition).
        <div
          className={clx(
            "absolute inset-0 transition-transform duration-slow ease-premium",
            "[@media(hover:hover)]:group-hover/card:scale-[1.03] group-active/card:scale-[1.02] motion-reduce:transform-none",
            muted && "opacity-50 grayscale"
          )}
        >
          <FadeInImage
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
        </div>
      )}
      {children}
    </div>
  )
}

export function ProductCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="product-card-content"
      className={clx("flex flex-col gap-1 px-0.5 pt-3", className)}
      {...props}
    />
  )
}

export function ProductCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="product-card-header"
      className={clx("min-w-0 flex-1", className)}
      {...props}
    />
  )
}

export function ProductCardSubtitle({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="product-card-subtitle"
      className={clx(
        "truncate text-[0.6875rem] font-medium uppercase tracking-widest text-bone/55",
        className
      )}
      {...props}
    />
  )
}

export function ProductCardTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="product-card-title"
      className={clx("line-clamp-2 font-medium leading-snug text-bone", className)}
      {...props}
    />
  )
}

export function ProductCardMetric({
  className,
  muted = false,
  ...props
}: React.ComponentProps<"span"> & { muted?: boolean }) {
  return (
    <span
      data-slot="product-card-metric"
      className={clx(
        "shrink-0 font-medium",
        muted ? "text-bone/55" : "text-ember",
        className
      )}
      {...props}
    />
  )
}
