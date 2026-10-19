"use client"

import Button, { buttonClass } from "@modules/common/components/button"
import { Heading } from "@modules/common/components/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart
  /** Some item sold out since it was added: checkout is blocked. */
  blocked?: boolean
  /** Price of the "Delivery" option, shown until a method is chosen. */
  deliveryAmount: number | null
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart, blocked = false, deliveryAmount }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} deliveryAmount={deliveryAmount} />
      {blocked ? (
        <>
          <p role="alert" className="text-sm font-medium text-error">
            Remove unavailable items to continue.
          </p>
          <Button
            variant="secondary"
            className="w-full"
            disabled
            data-testid="checkout-button"
          >
            Go to checkout
          </Button>
        </>
      ) : (
        <LocalizedClientLink
          href={"/checkout?step=" + step}
          className={buttonClass({ className: "w-full" })}
          data-testid="checkout-button"
        >
          Go to checkout
        </LocalizedClientLink>
      )}
    </div>
  )
}

export default Summary
