"use client"

import { convertToLocale } from "@lib/util/money"
import { TRUST_CONTENT } from "@modules/common/components/trust-line/content"
import React from "react"

type Totals = {
  total?: number | null
  subtotal?: number | null
  tax_total?: number | null
  currency_code: string
  item_subtotal?: number | null
  shipping_subtotal?: number | null
  discount_subtotal?: number | null
  shipping_methods?: unknown[] | null
}

type CartTotalsProps = {
  totals: Totals
  /**
   * Price of the "Delivery" option. Before a delivery method is on the cart,
   * the row shows this price and the total includes it, instead of $0.
   */
  deliveryAmount?: number | null
}

/** Delivery and total as shown, with the estimated delivery when none is set. */
export const getShownTotals = (
  { total, shipping_subtotal, shipping_methods }: Totals,
  deliveryAmount: number | null = null
) => {
  const estimateDelivery = !shipping_methods?.length && deliveryAmount !== null
  return {
    delivery: estimateDelivery ? deliveryAmount : shipping_subtotal ?? 0,
    total: (total ?? 0) + (estimateDelivery ? deliveryAmount : 0),
  }
}

// Summary rows, the same as the cart drawer: Subtotal, Delivery, Total, plus
// Discount and Taxes only when they aren't zero.
const CartTotals: React.FC<CartTotalsProps> = ({
  totals,
  deliveryAmount = null,
}) => {
  const { currency_code, tax_total, item_subtotal, discount_subtotal } = totals
  const shown = getShownTotals(totals, deliveryAmount)
  const money = (amount: number) => convertToLocale({ amount, currency_code })

  return (
    <dl className="flex flex-col gap-y-1.5 text-sm">
      <div className="flex items-center justify-between">
        <dt className="text-bone/70">Subtotal</dt>
        <dd
          className="text-bone"
          data-testid="cart-subtotal"
          data-value={item_subtotal || 0}
        >
          {money(item_subtotal ?? 0)}
        </dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-bone/70">{TRUST_CONTENT.deliveryLabel}</dt>
        <dd
          className="text-bone"
          data-testid="cart-shipping"
          data-value={shown.delivery}
        >
          {money(shown.delivery)}
        </dd>
      </div>
      {!!discount_subtotal && (
        <div className="flex items-center justify-between">
          <dt className="text-bone/70">Discount</dt>
          <dd
            className="text-ember"
            data-testid="cart-discount"
            data-value={discount_subtotal}
          >
            − {money(discount_subtotal)}
          </dd>
        </div>
      )}
      {!!tax_total && (
        <div className="flex items-center justify-between">
          <dt className="text-bone/70">Taxes</dt>
          <dd
            className="text-bone"
            data-testid="cart-taxes"
            data-value={tax_total}
          >
            {money(tax_total)}
          </dd>
        </div>
      )}
      <div className="mt-1.5 flex items-center justify-between border-t border-hairline pt-3 text-base">
        <dt className="font-bold text-bone">Total</dt>
        <dd
          className="font-bold text-bone"
          data-testid="cart-total"
          data-value={shown.total}
        >
          {money(shown.total)}
        </dd>
      </div>
    </dl>
  )
}

export default CartTotals
