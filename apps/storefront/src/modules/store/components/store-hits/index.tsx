"use client"

import { HttpTypes } from "@medusajs/types"
import type { Hit } from "instantsearch.js"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useHits, useInstantSearch } from "react-instantsearch"

import { listProductsByIds } from "@lib/data/products"
import useSearchSettled from "@lib/hooks/use-search-settled"
import BlurFade from "@modules/common/components/blur-fade"
import { Text } from "@modules/common/components/ui"
import ProductPreview from "@modules/products/components/product-preview"
import {
  PRODUCT_GRID_CLASS,
  revealDelay,
} from "@modules/products/components/product-preview/grid"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import SearchPagination from "./pagination"
import { HitPricing } from "./price"

type ProductHit = Hit<
  {
    title: string | null
    handle: string | null
    thumbnail: string | null
  } & HitPricing
>

type StoreHitsProps = {
  hitsPerPage: number
  currencyCode: string
}

// Search supplies the matching ids (and filters); the full products for the
// current page are then loaded so the store page shows the same card as
// every other listing (brand, hover image, live SOLD state, size).
const useFullProducts = (ids: string[]) => {
  const { countryCode } = useParams<{ countryCode: string }>()
  const idsKey = ids.join(",")
  const [loaded, setLoaded] = useState<{
    key: string
    products: HttpTypes.StoreProduct[]
  } | null>(null)
  const [failedKey, setFailedKey] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const pageIds = idsKey ? idsKey.split(",") : []

    listProductsByIds({ ids: pageIds, countryCode })
      .then((products) => {
        if (!cancelled) setLoaded({ key: idsKey, products })
      })
      .catch(() => {
        if (!cancelled) setFailedKey(idsKey)
      })

    return () => {
      cancelled = true
    }
  }, [idsKey, countryCode])

  return {
    products: loaded?.key === idsKey ? loaded.products : null,
    failed: failedKey === idsKey,
  }
}

// `currencyCode` was used to show search-index prices; cards now use the
// full products' calculated prices.
const StoreHits = ({ hitsPerPage }: StoreHitsProps) => {
  const { items } = useHits<ProductHit>()
  const productIds = items.filter((hit) => hit.handle).map((hit) => hit.objectID)
  const { products, failed } = useFullProducts(productIds)
  const { status, error, indexUiState } = useInstantSearch()
  const { isSearching, hasNoResultsYet } = useSearchSettled()

  const { page, ...refinements } = indexUiState
  const currentPage = page ?? 1
  const refinementKey = JSON.stringify(refinements)

  const settled = useRef({ page: currentPage, refinementKey })

  useEffect(() => {
    if (!isSearching) {
      settled.current = { page: currentPage, refinementKey }
    }
  }, [isSearching, currentPage, refinementKey])

  const isPagingOnly =
    refinementKey === settled.current.refinementKey &&
    currentPage !== settled.current.page

  const showSkeleton =
    hasNoResultsYet ||
    (isSearching && isPagingOnly) ||
    (items.length > 0 && !products)

  if (status === "error" || failed) {
    return (
      <Text
        className="py-16 text-center text-ember"
        data-testid="products-error"
      >
        Couldn&apos;t load products
        {error?.message ? `: ${error.message}` : "."}
      </Text>
    )
  }

  return (
    <>
      {showSkeleton ? (
        <SkeletonProductGrid numberOfProducts={hitsPerPage} />
      ) : !items.length ? (
        <Text
          className="py-16 text-center text-bone/70"
          data-testid="no-products"
        >
          No products matched these filters.
        </Text>
      ) : (
        <ul
          className={`${PRODUCT_GRID_CLASS} w-full`}
          data-testid="products-list"
        >
          {(products ?? []).map((product, i) => (
            <li key={product.id}>
              <BlurFade delay={revealDelay(i)}>
                <ProductPreview product={product} />
              </BlurFade>
            </li>
          ))}
        </ul>
      )}
      <SearchPagination />
    </>
  )
}

export default StoreHits
