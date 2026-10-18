import { HttpTypes } from "@medusajs/types"

type Variant = HttpTypes.StoreProductVariant

// A variant can be bought when Medusa doesn't track its stock, backorders are
// allowed, or there is stock left (inventory_quantity already subtracts
// reservations from placed orders).
export const isVariantAvailable = (variant: Variant) =>
  !variant.manage_inventory ||
  !!variant.allow_backorder ||
  (variant.inventory_quantity ?? 0) > 0

// Sold out = every variant is unavailable. Products without variants aren't
// buyable either, so they count as sold out.
export const isSoldOut = (product: HttpTypes.StoreProduct) =>
  !(product.variants ?? []).some(isVariantAvailable)

// The size of a one-variant product (typical for one-of-one items), read
// from its "Size" option. Null when there are several variants or no size.
export const singleSize = (product: HttpTypes.StoreProduct): string | null => {
  const variants = product.variants ?? []

  if (variants.length !== 1) {
    return null
  }

  const size = variants[0].options?.find(
    (o) => o.option?.title?.toLowerCase() === "size"
  )

  return size?.value ?? null
}
