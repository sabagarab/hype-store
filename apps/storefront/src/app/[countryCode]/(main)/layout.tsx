import { Metadata } from "next"

import {
  getDeliveryAmount,
  listCartOptions,
  retrieveCart,
} from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartDrawer from "@modules/cart/components/cart-drawer"
import { CartDrawerProvider } from "@modules/cart/components/cart-drawer/context"
import AnnouncementBar from "@modules/layout/components/announcement-bar"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: {
  children: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions().catch(() => ({
      shipping_options: [] as StoreCartShippingOption[],
    }))

    shippingOptions = shipping_options
  }

  // The drawer's delivery note reads the price of the region's "Delivery"
  // option (set in Admin); null shows "Delivery added at checkout".
  const deliveryAmount = await getDeliveryAmount()

  return (
    <CartDrawerProvider>
      <AnnouncementBar />
      <Nav countryCode={countryCode} />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      {props.children}
      <Footer countryCode={countryCode} />
      <CartDrawer cart={cart} deliveryAmount={deliveryAmount} />
    </CartDrawerProvider>
  )
}
