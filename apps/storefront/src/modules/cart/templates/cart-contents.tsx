"use client"

import { HttpTypes } from "@medusajs/types"

import useCartProducts from "@modules/cart/components/cart-drawer/use-cart-products"
import Divider from "@modules/common/components/divider"
import SignInPrompt from "../components/sign-in-prompt"
import ItemsTemplate from "./items"
import Summary from "./summary"

// Cart page items + summary. Checks the items' live stock (same check as the
// cart drawer) to mark sold-out pieces and block checkout until removed.
const CartContents = ({
  cart,
  customer,
  deliveryAmount,
}: {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  deliveryAmount: number | null
}) => {
  const { lineInfo, hasUnavailable } = useCartProducts(cart)

  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
      <div className="flex flex-col bg-ui-bg-base py-6 gap-y-6">
        {!customer && (
          <>
            <SignInPrompt />
            <Divider />
          </>
        )}
        <ItemsTemplate
          cart={cart}
          isUnavailable={(item) => lineInfo(item).unavailable}
        />
      </div>
      <div className="relative">
        <div className="flex flex-col gap-y-8 sticky top-12">
          {cart.region && (
            <div className="bg-ui-bg-base py-6">
              <Summary
                cart={cart}
                blocked={hasUnavailable}
                deliveryAmount={deliveryAmount}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartContents
