"use client"

import { convertToLocale } from "@lib/util/money"
import { TRUST_CONTENT } from "@modules/common/components/trust-line/content"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
    shipping_methods?: unknown[] | null
  }
  /**
   * Price of the "Delivery" option. Before a delivery method is on the cart,
   * the row shows this price and the total includes it, instead of $0.
   */
  deliveryAmount?: number | null
}

const CartTotals: React.FC<CartTotalsProps> = ({
  totals,
  deliveryAmount = null,
}) => {
  const {
    currency_code,
    total,
    tax_total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
    shipping_methods,
  } = totals

  const estimateDelivery =
    !shipping_methods?.length && deliveryAmount !== null
  const delivery = estimateDelivery ? deliveryAmount : shipping_subtotal ?? 0
  const shownTotal = (total ?? 0) + (estimateDelivery ? deliveryAmount : 0)

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span data-testid="cart-subtotal" data-value={item_subtotal || 0}>
            {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>{TRUST_CONTENT.deliveryLabel}</span>
          <span data-testid="cart-shipping" data-value={delivery}>
            {convertToLocale({ amount: delivery, currency_code })}
          </span>
        </div>
        {!!discount_subtotal && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={discount_subtotal || 0}
            >
              -{" "}
              {convertToLocale({
                amount: discount_subtotal ?? 0,
                currency_code,
              })}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center ">Taxes</span>
          <span data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
      </div>
      <div className="h-px w-full border-b border-ui-border-base my-4" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium ">
        <span>Total</span>
        <span
          className="txt-xlarge-plus"
          data-testid="cart-total"
          data-value={shownTotal}
        >
          {convertToLocale({ amount: shownTotal, currency_code })}
        </span>
      </div>
      <div className="h-px w-full border-b border-ui-border-base mt-4" />
    </div>
  )
}

export default CartTotals
