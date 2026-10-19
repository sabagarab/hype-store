import { getProductPrice } from "@lib/util/get-product-price"
import { isSoldOut, singleSize } from "@lib/util/product-availability"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  ProductCard,
  ProductCardBadge,
  ProductCardContent,
  ProductCardHeader,
  ProductCardImage,
  ProductCardSubtitle,
  ProductCardTitle,
} from "@modules/common/components/product-card"
import PreviewPrice from "./price"

const IMAGE_SIZES = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"

// Plain (non-async) component so client listings, such as the store page's
// search results, can render the same card. Wiring only: maps a Medusa
// product onto the 21st Product Card.
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
      className="block rounded-card"
      data-testid="product-wrapper"
    >
      <ProductCard>
        <ProductCardImage
          src={primaryImage}
          hoverSrc={hoverImage}
          glow
          alt={product.title}
          sizes={IMAGE_SIZES}
          muted={soldOut}
        >
          {soldOut && <ProductCardBadge>Sold</ProductCardBadge>}
        </ProductCardImage>
        <ProductCardContent>
          <ProductCardHeader>
            {brand && (
              <ProductCardSubtitle>
                <span className="sm:hidden">{brandShort}</span>
                <span className="hidden sm:inline">{brand}</span>
              </ProductCardSubtitle>
            )}
            <ProductCardTitle data-testid="product-title">
              {product.title}
            </ProductCardTitle>
          </ProductCardHeader>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && (
              <PreviewPrice price={cheapestPrice} soldOut={soldOut} />
            )}
            {size && <span className="text-bone/55">Size {size}</span>}
          </div>
        </ProductCardContent>
      </ProductCard>
    </LocalizedClientLink>
  )
}
