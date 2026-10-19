import { Metadata } from "next"

import { STORE_NAME } from "@lib/constants"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { HERO_CONTENT } from "@modules/home/components/hero/content"
import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { listBrands } from "@lib/data/brands"
import BrandsSection from "@modules/home/components/brands-carousel"
import { HeroProduct } from "@modules/home/components/hero-parallax"
import { getRegion } from "@lib/data/regions"
import { getDeliveryAmount } from "@lib/data/cart"

export const metadata: Metadata = {
  title: STORE_NAME,
  description: HERO_CONTENT.subline,
}

// Products from the Admin "hero" collection that have a photo. Any failure
// returns none so the hero falls back to text instead of breaking the page.
async function getHeroProducts(countryCode: string): Promise<HeroProduct[]> {
  try {
    const collection = await getCollectionByHandle(
      HERO_CONTENT.collectionHandle
    )
    if (!collection) {
      return []
    }

    const {
      response: { products },
    } = await listProducts({
      countryCode,
      queryParams: { collection_id: [collection.id], limit: 15 },
    })

    return products.flatMap((p) =>
      p.thumbnail
        ? [{ id: p.id, title: p.title, handle: p.handle, thumbnail: p.thumbnail }]
        : []
    )
  } catch {
    return []
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const [{ collections }, heroProducts, brands, deliveryAmount] =
    await Promise.all([
      listCollections({
        fields: "id, handle, title",
      }),
      getHeroProducts(countryCode),
      // A failure hides the brands section instead of breaking the page.
      listBrands(countryCode).catch(() => []),
      getDeliveryAmount(),
    ])

  if (!collections || !region) {
    return null
  }

  // The "hero" collection only feeds the hero photos; it never gets a rail.
  const railCollections = collections.filter(
    (collection) => collection.handle !== HERO_CONTENT.collectionHandle
  )

  return (
    <>
      <Hero
        products={heroProducts}
        deliveryAmount={deliveryAmount}
        currencyCode={region.currency_code}
      />
      <BrandsSection brands={brands} />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={railCollections} region={region} />
        </ul>
      </div>
    </>
  )
}
