"use client"

import { HttpTypes } from "@medusajs/types"

import DiscountCode from "@modules/checkout/components/discount-code"
import SummaryItems from "@modules/checkout/components/summary-items"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@modules/common/components/accordion"
import CartTotals, {
  getShownTotals,
} from "@modules/common/components/cart-totals"
import { convertToLocale } from "@lib/util/money"

type CheckoutSummaryProps = {
  cart: HttpTypes.StoreCart
  /** Price of the "Delivery" option, shown until a method is chosen. */
  deliveryAmount: number | null
}

const SummaryBody = ({ cart, deliveryAmount }: CheckoutSummaryProps) => (
  <div className="flex flex-col gap-y-6">
    <SummaryItems cart={cart} />
    <DiscountCode cart={cart} />
    <CartTotals totals={cart} deliveryAmount={deliveryAmount} />
  </div>
)

/** Phones: collapsed above the form, showing the total. */
export const CheckoutSummaryMobile = (props: CheckoutSummaryProps) => {
  const { total } = getShownTotals(props.cart, props.deliveryAmount)

  return (
    <Accordion className="small:hidden">
      <AccordionItem value="summary">
        <AccordionTrigger className="min-h-control">
          <span className="flex flex-1 items-center justify-between gap-x-4">
            <span>Order summary</span>
            <span className="normal-case tracking-normal text-bone">
              {convertToLocale({
                amount: total,
                currency_code: props.cart.currency_code,
              })}
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-6 pt-2">
          <SummaryBody {...props} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

/** Desktop: sticky sidebar next to the form. */
const CheckoutSummary = (props: CheckoutSummaryProps) => (
  <aside
    className="hidden small:block small:sticky small:top-8 self-start"
    aria-label="Order summary"
  >
    <div className="rounded-card border border-hairline bg-ink p-6">
      <h2 className="mb-6 text-lg font-bold tracking-tight text-bone">
        Order summary
      </h2>
      <SummaryBody {...props} />
    </div>
  </aside>
)

export default CheckoutSummary
