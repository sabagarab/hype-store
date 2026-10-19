"use client"

import { HttpTypes } from "@medusajs/types"
import { useEffect } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import Button, { buttonClass } from "@modules/common/components/button"
import { Drawer, DrawerContent } from "@modules/common/components/drawer"
import NumberTicker from "@modules/common/components/number-ticker"
import { TRUST_CONTENT } from "@modules/common/components/trust-line/content"
import { useCartDrawer } from "./context"
import DrawerItem from "./drawer-item"
import useCartProducts from "./use-cart-products"

type CartDrawerProps = {
  cart: HttpTypes.StoreCart | null
  /** Flat price of the region's "Delivery" shipping option, if it loaded. */
  deliveryAmount: number | null
}

const PENDING_OPEN_FALLBACK_MS = 2500

// Cart on the 21st Drawer: a bottom sheet with drag to close on phones, a
// glass side panel on desktop. Base UI provides the focus trap, Esc /
// click-outside to close, scroll lock and focus return. Totals and actions
// sit in the fixed footer.
const CartDrawer = ({ cart, deliveryAmount }: CartDrawerProps) => {
  const { isOpen, openCart, closeCart, pendingVariantId } = useCartDrawer()
  const items = cart?.items ?? []

  // Opened via openCartFor(): wait until the refreshed cart contains the
  // variant. The fallback opens it anyway if the refresh is slow.
  const hasPendingVariant =
    !!pendingVariantId &&
    items.some((item) => item.variant_id === pendingVariantId)

  useEffect(() => {
    if (!pendingVariantId) {
      return
    }
    if (hasPendingVariant) {
      openCart()
      return
    }
    const fallback = setTimeout(openCart, PENDING_OPEN_FALLBACK_MS)
    return () => clearTimeout(fallback)
  }, [pendingVariantId, hasPendingVariant, openCart])
  const currencyCode = cart?.currency_code ?? "usd"
  const { lineInfo, hasUnavailable } = useCartProducts(cart)
  const subtotal = cart?.item_subtotal ?? cart?.subtotal ?? 0

  const sortedItems = [...items].sort((a, b) =>
    (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
  )

  const totals = (
    <div className="flex flex-col gap-y-3">
      <dl className="flex flex-col gap-y-1.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-bone/70">Subtotal</dt>
          <dd className="text-bone">
            {convertToLocale({
              amount: subtotal,
              currency_code: currencyCode,
            })}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-bone/70">{TRUST_CONTENT.deliveryLabel}</dt>
          <dd className="text-bone">
            {deliveryAmount !== null
              ? convertToLocale({
                  amount: deliveryAmount,
                  currency_code: currencyCode,
                })
              : TRUST_CONTENT.deliveryPending}
          </dd>
        </div>
        <div className="mt-1.5 flex items-center justify-between border-t border-hairline pt-3 text-base">
          <dt className="font-bold text-bone">Total</dt>
          <dd>
            <NumberTicker
              value={subtotal + (deliveryAmount ?? 0)}
              currencyCode={currencyCode}
              className="font-bold text-bone"
            />
          </dd>
        </div>
      </dl>

      {hasUnavailable && (
        <p role="alert" className="text-sm font-medium text-ember">
          Remove unavailable items to continue.
        </p>
      )}

      {hasUnavailable ? (
        <Button
          variant="secondary"
          disabled
          className="w-full"
          data-testid="cart-drawer-checkout"
        >
          Checkout
        </Button>
      ) : (
        <LocalizedClientLink
          href="/checkout?step=address"
          onClick={closeCart}
          className={buttonClass({ className: "w-full" })}
          data-testid="cart-drawer-checkout"
        >
          Checkout
        </LocalizedClientLink>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={closeCart}
        className="mx-auto"
      >
        Continue shopping
      </Button>
    </div>
  )

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => (open ? openCart() : closeCart())}
      responsive
    >
      <DrawerContent
        title={`Cart${items.length > 0 ? ` (${items.length})` : ""}`}
        footer={items.length > 0 ? totals : undefined}
        closeLabel="Close cart"
        data-testid="cart-drawer"
      >
        {items.length === 0 ? (
          <div className="flex min-h-full flex-col items-center justify-center gap-y-6 py-16 text-center">
            <p className="text-xl font-bold text-bone">Your cart is empty</p>
            <LocalizedClientLink
              href="/store"
              onClick={closeCart}
              className={buttonClass({ className: "w-full max-w-xs" })}
            >
              Shop now
            </LocalizedClientLink>
          </div>
        ) : (
          <ul className="divide-y divide-hairline">
            {sortedItems.map((item) => {
              const info = lineInfo(item)
              return (
                <DrawerItem
                  key={item.id}
                  item={item}
                  currencyCode={currencyCode}
                  brand={info.brand}
                  unavailable={info.unavailable}
                  onNavigate={closeCart}
                />
              )
            })}
          </ul>
        )}
      </DrawerContent>
    </Drawer>
  )
}

export default CartDrawer
