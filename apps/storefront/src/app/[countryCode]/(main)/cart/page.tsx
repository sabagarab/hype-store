import { getDeliveryAmount, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getRegion } from "@lib/data/regions"
import CartRegionSync from "@modules/cart/components/cart-region-sync"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export default async function Cart(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const cart = await retrieveCart().catch((error) => {
    console.error(error)
    return notFound()
  })

  const [customer, region, deliveryAmount] = await Promise.all([
    retrieveCustomer(),
    getRegion(countryCode),
    getDeliveryAmount(),
  ])

  // A cart from another region (e.g. an old Europe cart) is moved first.
  if (cart && region && cart.region_id !== region.id) {
    return <CartRegionSync countryCode={countryCode} />
  }

  return (
    <CartTemplate
      cart={cart}
      customer={customer}
      deliveryAmount={deliveryAmount}
    />
  )
}
