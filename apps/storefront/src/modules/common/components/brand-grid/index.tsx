import FadeInImage from "@modules/common/components/fade-in-image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

// Shop by Category Grid from 21st.dev (@ziegfiroyt/ecommerce4). Image tiles
// with the name over a bottom scrim, laid out by count. Adapted: card radius,
// FadeInImage (load retry), brand colors, no badges / descriptions / product counts, a
// quiet zoom on hover only, and a single item becomes one wide tile so the
// section never looks half empty.

export type BrandTile = {
  id: string
  name: string
  href: string
  image: string | null
}

const BrandGrid = ({
  items,
  className,
}: {
  items: BrandTile[]
  className?: string
}) => {
  if (items.length === 0) {
    return null
  }

  const count = items.length
  const single = count === 1
  const gridCols =
    count >= 5
      ? "small:grid-cols-3"
      : count % 4 === 0
      ? "small:grid-cols-4"
      : count % 3 === 0
      ? "small:grid-cols-3"
      : "small:grid-cols-2"

  return (
    <div
      className={clx(
        "grid gap-4",
        !single && "xsmall:grid-cols-2",
        !single && gridCols,
        className
      )}
    >
      {items.map((item) => (
        <LocalizedClientLink
          key={item.id}
          href={item.href}
          className="group/tile relative block overflow-hidden rounded-card bg-ink"
        >
          <div
            className={clx(
              "relative w-full",
              single ? "aspect-[4/5] xsmall:aspect-[16/9]" : "aspect-[4/5]"
            )}
          >
            {item.image && (
              <div className="absolute inset-0 transition-transform duration-slow ease-premium [@media(hover:hover)]:group-hover/tile:scale-[1.03] motion-reduce:transform-none">
                <FadeInImage
                  src={item.image}
                  alt=""
                  fill
                  sizes={single ? "100vw" : "(min-width: 1024px) 33vw, (min-width: 512px) 50vw, 100vw"}
                  className="object-cover"
                />
              </div>
            )}
            {/* Legibility scrim for the name, not decoration. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 small:p-6">
            <h3 className="text-2xl font-black uppercase leading-none tracking-tight text-bone small:text-3xl">
              {item.name}
            </h3>
            <span
              aria-hidden
              className="text-xl text-bone transition-transform duration-base ease-premium [@media(hover:hover)]:group-hover/tile:translate-x-1"
            >
              →
            </span>
          </div>
        </LocalizedClientLink>
      ))}
    </div>
  )
}

export default BrandGrid
