import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
  soldOut = false,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  soldOut?: boolean
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block h-8 w-28 animate-pulse rounded-control bg-ink" />
  }

  // "From" only when no variant is picked and the variants' prices differ.
  const prices = new Set(
    (product.variants ?? []).map((v) => v.calculated_price?.calculated_amount)
  )
  const showFrom = !variant && prices.size > 1

  return (
    <div className="flex items-baseline gap-x-3">
      <span
        className={
          soldOut
            ? "text-2xl font-bold text-bone/55 line-through"
            : "text-2xl font-bold text-ember"
        }
      >
        {showFrom && <span className="mr-1 text-base font-medium">From</span>}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && !soldOut && (
        <span
          className="text-sm text-bone/55 line-through"
          data-testid="original-product-price"
          data-value={selectedPrice.original_price_number}
        >
          {selectedPrice.original_price}
        </span>
      )}
    </div>
  )
}
