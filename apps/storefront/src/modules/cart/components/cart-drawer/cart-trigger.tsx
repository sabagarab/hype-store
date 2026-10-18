"use client"

import { useCartDrawer } from "./context"

// "Cart (n)" in the nav; opens the cart drawer.
const CartTrigger = ({ count }: { count: number }) => {
  const { openCart } = useCartDrawer()

  return (
    <button
      type="button"
      onClick={openCart}
      aria-haspopup="dialog"
      className="flex h-11 items-center transition-colors duration-200 hover:text-ember"
      data-testid="nav-cart-link"
    >
      Cart ({count})
    </button>
  )
}

export default CartTrigger
