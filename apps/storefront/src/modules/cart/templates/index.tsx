import EmptyCartMessage from "../components/empty-cart-message"
import CartContents from "./cart-contents"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
  deliveryAmount,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  deliveryAmount: number | null
}) => {
  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <CartContents
            cart={cart}
            customer={customer}
            deliveryAmount={deliveryAmount}
          />
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
