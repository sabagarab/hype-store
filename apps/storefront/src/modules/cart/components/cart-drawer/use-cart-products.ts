"use client"

import { HttpTypes } from "@medusajs/types"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { listProductsByIds } from "@lib/data/products"
import { isVariantAvailable } from "@lib/util/product-availability"

// The cart API doesn't return stock or brand for line items, so the cart's
// products are loaded separately (same cached, revalidated product data as the
// rest of the store). Gives each line's brand and whether it sold out since it
// was added, which blocks checkout until it's removed.
const useCartProducts = (cart: HttpTypes.StoreCart | null | undefined) => {
  const { countryCode } = useParams<{ countryCode: string }>()
  const items = useMemo(() => cart?.items ?? [], [cart?.items])

  const productIds = Array.from(
    new Set(items.flatMap((item) => (item.product_id ? [item.product_id] : [])))
  )
  // Re-check whenever the cart's contents change.
  const key = `${productIds.join(",")}|${cart?.updated_at ?? ""}`
  const [products, setProducts] = useState<HttpTypes.StoreProduct[] | null>(
    null
  )

  useEffect(() => {
    let cancelled = false
    const ids = key.split("|")[0]

    if (!ids) {
      setProducts([])
      return
    }

    listProductsByIds({ ids: ids.split(","), countryCode })
      .then((result) => {
        if (!cancelled) setProducts(result)
      })
      .catch(() => {
        // Without product data nothing is marked unavailable; Medusa still
        // refuses to complete an order for stock that isn't there.
        if (!cancelled) setProducts([])
      })

    return () => {
      cancelled = true
    }
  }, [key, countryCode])

  return useMemo(() => {
    const byId = new Map((products ?? []).map((p) => [p.id, p]))

    const lineInfo = (item: HttpTypes.StoreCartLineItem) => {
      const product = item.product_id ? byId.get(item.product_id) : undefined
      const variant = product?.variants?.find((v) => v.id === item.variant_id)

      return {
        brand: product?.type?.value ?? null,
        // Unknown until loaded, or the variant was removed from the catalog.
        unavailable: !!product && (!variant || !isVariantAvailable(variant)),
      }
    }

    const hasUnavailable = items.some((item) => lineInfo(item).unavailable)

    return { loaded: products !== null, lineInfo, hasUnavailable }
  }, [products, items])
}

export default useCartProducts
