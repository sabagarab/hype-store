import "server-only"

import { Brand, listBrands } from "@lib/data/brands"
import { getCollectionByHandle } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import { HERO_CONTENT } from "@modules/home/components/hero/content"

export type LandingData = {
  region: HttpTypes.StoreRegion
  /** "hero" collection products that have a photo. */
  heroProducts: HttpTypes.StoreProduct[]
  /** Newest products first. */
  latest: HttpTypes.StoreProduct[]
  brands: Brand[]
}

const LATEST_LIMIT = 8

const hasPhoto = (product: HttpTypes.StoreProduct) =>
  !!(product.thumbnail || product.images?.[0]?.url)

// Hero collection products; any failure returns none so the page still
// renders without them.
async function getHeroProducts(countryCode: string) {
  try {
    const collection = await getCollectionByHandle(HERO_CONTENT.collectionHandle)
    if (!collection) {
      return []
    }
    const {
      response: { products },
    } = await listProducts({
      countryCode,
      queryParams: { collection_id: [collection.id], limit: 12 },
    })
    return products.filter(hasPhoto)
  } catch {
    return []
  }
}

/**
 * A photo of one of the brand's products that isn't in `used`, so an
 * editorial image never repeats a photo already shown on the page. Looks at
 * every image of the given products (second shots included); null when the
 * brand has no unused photo.
 */
export function unusedBrandImage(
  brand: Brand,
  products: HttpTypes.StoreProduct[],
  used: Set<string>
): string | null {
  for (const product of products) {
    if (product.type?.id !== brand.id) {
      continue
    }
    const urls = [product.thumbnail, ...(product.images ?? []).map((i) => i.url)]
    const free = urls.find((url): url is string => !!url && !used.has(url))
    if (free) {
      return free
    }
  }
  return null
}

/** Everything the landing page shows, fetched in parallel. */
export async function getLandingData(
  countryCode: string
): Promise<LandingData | null> {
  const region = await getRegion(countryCode)
  if (!region) {
    return null
  }

  const [heroProducts, latest, brands] = await Promise.all([
    getHeroProducts(countryCode),
    listProducts({
      countryCode,
      queryParams: { limit: LATEST_LIMIT, order: "-created_at" },
    })
      .then(({ response }) => response.products)
      .catch(() => []),
    listBrands(countryCode).catch(() => []),
  ])

  return { region, heroProducts, latest, brands }
}
