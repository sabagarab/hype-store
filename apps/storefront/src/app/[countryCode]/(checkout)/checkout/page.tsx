import { getDeliveryAmount, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getRegion } from "@lib/data/regions"
import CartRegionSync from "@modules/cart/components/cart-region-sync"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutSteps from "@modules/checkout/components/checkout-steps"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary, {
  CheckoutSummaryMobile,
} from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const [customer, region, deliveryAmount] = await Promise.all([
    retrieveCustomer(),
    getRegion(countryCode),
    getDeliveryAmount(),
  ])

  // A cart from another region (e.g. an old Europe cart) is moved first.
  if (region && cart.region_id !== region.id) {
    return <CartRegionSync countryCode={countryCode} />
  }

  return (
    <div className="content-container grid grid-cols-1 gap-x-16 pb-16 small:grid-cols-[minmax(0,1fr)_400px] small:py-12 large:gap-x-24">
      <div className="flex min-w-0 flex-col">
        <CheckoutSummaryMobile cart={cart} deliveryAmount={deliveryAmount} />
        <div className="py-6 small:pt-0">
          <CheckoutSteps />
        </div>
        <PaymentWrapper cart={cart}>
          <CheckoutForm cart={cart} customer={customer} />
        </PaymentWrapper>
      </div>
      <CheckoutSummary cart={cart} deliveryAmount={deliveryAmount} />
    </div>
  )
}
