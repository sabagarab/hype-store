"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import useCartProducts from "@modules/cart/components/cart-drawer/use-cart-products"
import FadeInImage from "@modules/common/components/fade-in-image"
import ImagePlaceholder from "@modules/common/components/image-placeholder"

/** A cart or order line, reduced to what the summary shows. */
export type SummaryItem = {
  id: string
  thumbnail?: string | null
  product_title?: string | null
  title: string
  variant_title?: string | null
  total?: number | null
  unit_price?: number | null
  created_at?: string | Date | null
  brand: string | null
}

/** Item rows of the checkout and order summaries: image, brand, title, size, price. */
export const SummaryItemList = ({
  items,
  currencyCode,
}: {
  items: SummaryItem[]
  currencyCode: string
}) => {
  // Newest first, like the cart drawer.
  const time = (item: SummaryItem) => new Date(item.created_at ?? 0).getTime()
  const sorted = [...items].sort((a, b) => time(b) - time(a))

  return (
    <ul className="flex flex-col gap-y-4" data-testid="items-table">
      {sorted.map((item) => {
        const title = item.product_title ?? item.title
        const brand = item.brand

        return (
          <li key={item.id} className="flex gap-x-4" data-testid="product-row">
            <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-card bg-ink">
              {item.thumbnail ? (
                <FadeInImage
                  src={item.thumbnail}
                  alt={title ?? ""}
                  fill
                  sizes="64px"
                  className="object-cover"
                  fallback={<ImagePlaceholder />}
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
            <div className="flex min-w-0 flex-1 items-start justify-between gap-x-4">
              <div className="min-w-0">
                {brand && (
                  <p className="truncate text-[11px] font-medium uppercase tracking-widest text-bone/55">
                    {brand}
                  </p>
                )}
                <p
                  className="line-clamp-2 text-sm font-medium text-bone"
                  data-testid="product-name"
                >
                  {title}
                </p>
                {item.variant_title && (
                  <p className="text-xs text-bone/55" data-testid="product-variant">
                    Size: {item.variant_title}
                  </p>
                )}
              </div>
              <p className="shrink-0 text-sm font-bold text-ember">
                {convertToLocale({
                  amount: item.total ?? item.unit_price ?? 0,
                  currency_code: currencyCode,
                })}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/** The cart's items, with brands loaded the same way as the cart drawer. */
const SummaryItems = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const { lineInfo } = useCartProducts(cart)

  return (
    <SummaryItemList
      items={(cart.items ?? []).map((item) => ({
        ...item,
        brand: lineInfo(item).brand,
      }))}
      currencyCode={cart.currency_code}
    />
  )
}

export default SummaryItems
