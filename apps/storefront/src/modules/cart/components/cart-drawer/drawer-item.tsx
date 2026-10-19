"use client"

import { deleteLineItem } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import FadeInImage from "@modules/common/components/fade-in-image"
import ImagePlaceholder from "@modules/common/components/image-placeholder"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import Spinner from "@modules/common/icons/spinner"
import Trash from "@modules/common/icons/trash"
import { useState } from "react"
import { toast } from "sonner"

type DrawerItemProps = {
  item: HttpTypes.StoreCartLineItem
  currencyCode: string
  brand: string | null
  unavailable: boolean
  onNavigate: () => void
}

// One cart line: image, brand, title, size, price, remove. No quantity:
// every piece is one-of-one.
const DrawerItem = ({
  item,
  currencyCode,
  brand,
  unavailable,
  onNavigate,
}: DrawerItemProps) => {
  const [removing, setRemoving] = useState(false)
  const title = item.product_title ?? item.title
  const href = item.product_handle ? `/products/${item.product_handle}` : null

  const remove = async () => {
    setRemoving(true)
    try {
      await deleteLineItem(item.id)
    } catch {
      toast.error("Couldn't remove the item. Please try again.")
      setRemoving(false)
    }
  }

  const image = (
    <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-card bg-ink">
      {/* Dimmed on a wrapper: FadeInImage owns the image's own opacity. */}
      <div
        className={clx("absolute inset-0", unavailable && "opacity-50 grayscale")}
      >
        {item.thumbnail ? (
          <FadeInImage
            src={item.thumbnail}
            alt={title}
            fill
            sizes="80px"
            className="object-cover"
            fallback={<ImagePlaceholder />}
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
    </div>
  )

  return (
    <li
      className={clx(
        "flex gap-x-4 py-4 transition-opacity duration-base ease-premium",
        removing && "opacity-50"
      )}
      data-testid="cart-drawer-item"
    >
      {href ? (
        <LocalizedClientLink href={href} onClick={onNavigate} tabIndex={-1}>
          {image}
        </LocalizedClientLink>
      ) : (
        image
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {brand && (
          <p className="truncate text-[11px] font-medium uppercase tracking-widest text-bone/55">
            {brand}
          </p>
        )}
        {href ? (
          <LocalizedClientLink
            href={href}
            onClick={onNavigate}
            className="line-clamp-2 text-sm font-medium text-bone hover:text-ember"
          >
            {title}
          </LocalizedClientLink>
        ) : (
          <p className="line-clamp-2 text-sm font-medium text-bone">{title}</p>
        )}
        {item.variant_title && (
          <p className="text-xs text-bone/55">Size {item.variant_title}</p>
        )}
        {unavailable && (
          <p className="mt-1 text-xs font-medium text-ember">
            No longer available
          </p>
        )}
        <p
          className={clx(
            "mt-auto pt-2 text-sm font-bold",
            unavailable ? "text-bone/55 line-through" : "text-ember"
          )}
        >
          {convertToLocale({
            amount: item.total ?? item.unit_price ?? 0,
            currency_code: currencyCode,
          })}
        </p>
      </div>

      <button
        type="button"
        onClick={remove}
        disabled={removing}
        aria-label={`Remove ${title}`}
        className="flex h-control-sm w-11 shrink-0 items-center justify-center rounded-control text-bone/60 transition-colors duration-base ease-premium hover:text-ember disabled:cursor-wait"
        data-testid="cart-drawer-remove"
      >
        {removing ? <Spinner /> : <Trash />}
      </button>
    </li>
  )
}

export default DrawerItem
