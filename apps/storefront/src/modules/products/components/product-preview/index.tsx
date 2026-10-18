import { getProductPrice } from "@lib/util/get-product-price"
import { isSoldOut, singleSize } from "@lib/util/product-availability"
import { HttpTypes } from "@medusajs/types"
import FadeInImage from "@modules/common/components/fade-in-image"
import ImagePlaceholder from "@modules/common/components/image-placeholder"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MagicCard from "@modules/common/components/magic-card"
import { clx } from "@modules/common/components/ui"
import PreviewPrice from "./price"

const IMAGE_SIZES = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"

// Plain (non-async) component so client listings, such as the store page's
// search results, can render the same card.
export default function ProductPreview({
  product,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  region?: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const soldOut = isSoldOut(product)
  const size = singleSize(product)
  // Brand is the product's Type in Admin (Type = brand, Categories = kind).
  // An optional short_name in the Type's metadata is used below 640px.
  const brand = product.type?.value
  const shortName = product.type?.metadata?.short_name
  const brandShort =
    typeof shortName === "string" && shortName.trim() ? shortName : brand

  const primaryImage = product.thumbnail || product.images?.[0]?.url
  const hoverImage = product.images?.find(
    (image) => image.url && image.url !== primaryImage
  )?.url

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group/card block rounded-large"
      data-testid="product-wrapper"
    >
      <MagicCard className="aspect-[4/5] rounded-large">
        <div
          className={clx(
            "relative h-full w-full bg-ink",
            soldOut && "opacity-60 grayscale"
          )}
        >
          {primaryImage ? (
            <FadeInImage
              src={primaryImage}
              alt={product.title}
              fill
              sizes={IMAGE_SIZES}
              className="object-cover"
              fallback={<ImagePlaceholder />}
            />
          ) : (
            <ImagePlaceholder />
          )}
          {/* Second image crossfades in on hover; not rendered (or loaded)
              on touch devices. */}
          {hoverImage && (
            <div className="absolute inset-0 hidden opacity-0 transition-opacity duration-200 [@media(hover:hover)]:block [@media(hover:hover)]:group-hover/card:opacity-100 motion-reduce:transition-none">
              <FadeInImage
                src={hoverImage}
                alt=""
                fill
                sizes={IMAGE_SIZES}
                className="object-cover"
              />
            </div>
          )}
        </div>
        {soldOut && (
          <span className="absolute left-3 top-3 z-30 rounded-full bg-ember-deep px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-bone">
            Sold
          </span>
        )}
      </MagicCard>

      <div className="mt-3 flex flex-col gap-y-0.5 px-0.5">
        {brand && (
          <p className="truncate text-[11px] font-medium uppercase tracking-widest text-bone/55">
            <span className="sm:hidden">{brandShort}</span>
            <span className="hidden sm:inline">{brand}</span>
          </p>
        )}
        <h3
          className="line-clamp-2 text-sm font-medium text-bone"
          data-testid="product-title"
        >
          {product.title}
        </h3>
        <div className="flex items-center gap-x-2 text-sm">
          {cheapestPrice && (
            <PreviewPrice price={cheapestPrice} soldOut={soldOut} />
          )}
          {size && <span className="text-bone/55">Size {size}</span>}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
