import { Brand } from "@lib/data/brands"
import FadeInImage from "@modules/common/components/fade-in-image"
import ImagePlaceholder from "@modules/common/components/image-placeholder"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

// One brand: its newest product photo, the brand name on top. Links to the
// brand's page. On desktop hover the photo zooms slightly and "Shop →" fades in.
const BrandCard = ({
  brand,
  className,
  sizes,
}: {
  brand: Brand
  className?: string
  sizes: string
}) => {
  return (
    <LocalizedClientLink
      href={`/brands/${brand.handle}`}
      className={clx(
        "group/brand relative block aspect-[4/5] overflow-hidden rounded-large bg-ink",
        className
      )}
      data-testid="brand-card"
    >
      {brand.image ? (
        <FadeInImage
          src={brand.image}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover/brand:scale-105 motion-reduce:transition-none motion-reduce:[@media(hover:hover)]:group-hover/brand:scale-100"
          fallback={<ImagePlaceholder />}
        />
      ) : (
        <ImagePlaceholder />
      )}
      {/* Keeps the name readable on light photos. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/70 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 top-0 p-5 small:p-6">
        <h3 className="text-2xl font-black uppercase leading-none tracking-tight text-bone transition-colors duration-200 [@media(hover:hover)]:group-hover/brand:text-ember small:text-3xl">
          {brand.shortName ? (
            <>
              <span className="sm:hidden">{brand.shortName}</span>
              <span className="hidden sm:inline">{brand.name}</span>
            </>
          ) : (
            brand.name
          )}
        </h3>
        <p
          aria-hidden="true"
          className="mt-2 hidden text-sm font-medium text-bone opacity-0 transition-opacity duration-200 [@media(hover:hover)]:block [@media(hover:hover)]:group-hover/brand:opacity-100 motion-reduce:transition-none"
        >
          Shop →
        </p>
      </div>
    </LocalizedClientLink>
  )
}

export default BrandCard
