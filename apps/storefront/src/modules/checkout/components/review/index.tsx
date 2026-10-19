"use client"

import PaymentButton from "../payment-button"
import { StepFade } from "../step-header"
import { useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

// Shown under the Place order button. There is no return policy.
const CHECKOUT_FINAL_SALE_NOTE =
  "All sales are final. Check measurements before ordering."

const Review = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards && ((cart as unknown as Record<string, unknown>)?.gift_cards as unknown[])?.length > 0 && cart?.total === 0
  )

  const previousStepsCompleted =
    cart.shipping_address &&
    (cart.shipping_methods?.length ?? 0) > 0 &&
    (cart.payment_collection || paidByGiftcard)

  // Review is the end of the Payment step: just the button and the note.
  if (!isOpen || !previousStepsCompleted) {
    return null
  }

  return (
    <StepFade className="py-6">
      <PaymentButton cart={cart} data-testid="submit-order-button" />
      <p
        className="mt-3 text-center text-sm text-bone/70"
        data-testid="final-sale-note"
      >
        {CHECKOUT_FINAL_SALE_NOTE}
      </p>
    </StepFade>
  )
}

export default Review
