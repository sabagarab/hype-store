import { retrieveCart } from "@lib/data/cart"
import CartTrigger from "@modules/cart/components/cart-drawer/cart-trigger"

export default async function CartButton() {
  const cart = await retrieveCart().catch(() => null)
  const count = cart?.items?.length ?? 0

  return <CartTrigger count={count} />
}
