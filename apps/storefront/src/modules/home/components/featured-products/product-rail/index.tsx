import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

import BlurFade from "@modules/common/components/blur-fade"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"
import {
  PRODUCT_GRID_CLASS,
  revealDelay,
} from "@modules/products/components/product-preview/grid"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    // Default fields include stock, options, images and Type, which the card
    // needs for SOLD, size, hover image and brand.
    queryParams: {
      collection_id: collection.id,
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between mb-8">
        <Text className="txt-xlarge">{collection.title}</Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      <ul className={PRODUCT_GRID_CLASS}>
        {pricedProducts &&
          pricedProducts.map((product, i) => (
            <li key={product.id}>
              <BlurFade delay={revealDelay(i)}>
                <ProductPreview product={product} region={region} />
              </BlurFade>
            </li>
          ))}
      </ul>
    </div>
  )
}
