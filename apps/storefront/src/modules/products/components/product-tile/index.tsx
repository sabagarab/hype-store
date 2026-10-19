import { getProductPrice } from "@lib/util/get-product-price"
import { isSoldOut } from "@lib/util/product-availability"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  ProductCard,
  ProductCardContent,
  ProductCardHeader,
  ProductCardImage,
  ProductCardMetric,
  ProductCardSubtitle,
  ProductCardTitle,
} from "@modules/common/components/product-card"

// Wiring only: maps a Medusa product onto the 21st Product Card. Brand is the
// product's Type (with its optional short_name); a sold piece shows "Sold" in
// place of the price. Same hover photo as the listing card.
const ProductTile = ({
  product,
  sizes,
  priority = false,
}: {
  product: HttpTypes.StoreProduct
  /** next/image sizes for the photo in this layout. */
  sizes: string
  priority?: boolean
}) => {
  const { cheapestPrice } = getProductPrice({ product })
  const soldOut = isSoldOut(product)
  const shortName = product.type?.metadata?.short_name
  const brand =
    typeof shortName === "string" && shortName.trim()
      ? shortName
      : product.type?.value
  const primaryImage = product.thumbnail || product.images?.[0]?.url
  const hoverImage = product.images?.find(
    (image) => image.url && image.url !== primaryImage
  )?.url

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="block rounded-card"
      data-testid="product-tile"
    >
      <ProductCard>
        <ProductCardImage
          src={primaryImage}
          hoverSrc={hoverImage}
          alt={product.title}
          sizes={sizes}
          priority={priority}
          muted={soldOut}
        />
        <ProductCardContent>
          <ProductCardHeader>
            {brand && <ProductCardSubtitle>{brand}</ProductCardSubtitle>}
            <ProductCardTitle>{product.title}</ProductCardTitle>
          </ProductCardHeader>
          <ProductCardMetric muted={soldOut}>
            {soldOut ? "Sold" : cheapestPrice?.calculated_price}
          </ProductCardMetric>
        </ProductCardContent>
      </ProductCard>
    </LocalizedClientLink>
  )
}

export default ProductTile
