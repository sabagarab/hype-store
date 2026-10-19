import FadeInImage from "@modules/common/components/fade-in-image"
import ImagePlaceholder from "@modules/common/components/image-placeholder"
import * as React from "react"

import { clx } from "@modules/common/components/ui"

// Product Card from 21st.dev (@deltacomponents/product-card). Compound parts:
// image well, then a title/subtitle/metric row below. Adapted to the shared
// tokens: card radius, text stacked under the photo (title up to two lines,
// price below, as on StockX), 4:5 well filled edge to edge (our photos carry their
// own studio background), FadeInImage (load retry + Skeleton Swap), a quiet
// zoom on hover instead of the lift, a tactile press (scale .98, 120ms),
// brand colors. The wishlist badge is dropped. Desktop only (real hover): an
// optional second photo crossfades in; it is never rendered or loaded on
// touch. No cursor glow (quiet, per the no-AI-look rule).

type ProductCardProps = React.ComponentProps<"div">

export function ProductCard({ className, ...props }: ProductCardProps) {
  return (
    <div
      data-slot="product-card"
      className={clx(
        "group/card w-full text-sm transition-transform duration-press ease-premium active:scale-[0.98] motion-reduce:active:scale-100",
        className
      )}
      {...props}
    />
  )
}

type ProductCardImageProps = {
  src: string | null | undefined
  /** Second photo shown on hover (desktop only). */
  hoverSrc?: string | null
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
  hoverSrc,
  alt,
  sizes,
  priority = false,
  muted = false,
  className,
  children,
}: ProductCardImageProps) {
  const well = (
    <>
      {/* Zoom and dimming live on this wrapper; the images themselves only
          fade in (FadeInImage owns their opacity transition). */}
      <div
        className={clx(
          "absolute inset-0 transition-transform duration-slow ease-premium",
          "[@media(hover:hover)]:group-hover/card:scale-[1.03] motion-reduce:transform-none",
          muted && "opacity-50 grayscale"
        )}
      >
        {src ? (
          <FadeInImage
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
            fallback={<ImagePlaceholder />}
          />
        ) : (
          <ImagePlaceholder />
        )}
        {hoverSrc && (
          <div className="absolute inset-0 hidden opacity-0 transition-opacity duration-base ease-premium [@media(hover:hover)]:block [@media(hover:hover)]:group-hover/card:opacity-100 motion-reduce:transition-none">
            <FadeInImage
              src={hoverSrc}
              alt=""
              fill
              sizes={sizes}
              className="object-cover"
            />
          </div>
        )}
      </div>
      {children}
    </>
  )

  const wellClass = clx(
    "relative aspect-[4/5] w-full overflow-hidden rounded-card bg-ink",
    className
  )

  return (
    <div data-slot="product-card-image" className={wellClass}>
      {well}
    </div>
  )
}

/** Small label on the photo, e.g. "Sold". */
export function ProductCardBadge({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="product-card-badge"
      className={clx(
        "absolute left-3 top-3 z-30 rounded-control bg-ember-deep px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-bone",
        className
      )}
      {...props}
    />
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
      className={clx("flex min-w-0 flex-1 flex-col gap-y-0.5", className)}
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
