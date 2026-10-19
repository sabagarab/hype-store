"use client"
import { setAddresses } from "@lib/data/cart"
import useToggleState from "@lib/hooks/use-toggle-state"
import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import {
  StepFade,
  StepHeader,
  SummaryBlock,
  SummaryText,
} from "../step-header"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <section className="py-6">
      <StepHeader
        title="Address"
        state={isOpen ? "open" : cart?.shipping_address ? "done" : "upcoming"}
        onEdit={handleEdit}
        editTestId="edit-address-button"
      />
      {isOpen ? (
        <StepFade>
          <form action={formAction} className="pt-2">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div className="pt-6">
                <h3 className="text-base font-bold text-bone">
                  Billing address
                </h3>
                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton
              className="mt-6 w-full"
              data-testid="submit-address-button"
            >
              Continue to delivery
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </form>
        </StepFade>
      ) : (
        <div className="pt-2">
          {cart && cart.shipping_address ? (
            <div className="grid grid-cols-1 gap-y-5 xsmall:grid-cols-3 xsmall:gap-x-6">
              <SummaryBlock
                label="Delivery address"
                data-testid="shipping-address-summary"
              >
                <SummaryText>
                  {cart.shipping_address.first_name}{" "}
                  {cart.shipping_address.last_name}
                </SummaryText>
                <SummaryText>
                  {[
                    cart.shipping_address.address_1,
                    cart.shipping_address.address_2,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </SummaryText>
                <SummaryText>
                  {[
                    cart.shipping_address.postal_code,
                    cart.shipping_address.city,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </SummaryText>
                <SummaryText>
                  {cart.shipping_address.country_code?.toUpperCase()}
                </SummaryText>
                {typeof cart.metadata?.delivery_notes === "string" &&
                  cart.metadata.delivery_notes && (
                    <SummaryText className="mt-2">
                      Notes: {cart.metadata.delivery_notes}
                    </SummaryText>
                  )}
              </SummaryBlock>

              <SummaryBlock
                label="Contact"
                data-testid="shipping-contact-summary"
              >
                <SummaryText>{cart.shipping_address.phone}</SummaryText>
                <SummaryText className="break-all">{cart.email}</SummaryText>
              </SummaryBlock>

              <SummaryBlock
                label="Billing address"
                data-testid="billing-address-summary"
              >
                {sameAsBilling ? (
                  <SummaryText>Billing and delivery address are the same.</SummaryText>
                ) : (
                  <>
                    <SummaryText>
                      {cart.billing_address?.first_name}{" "}
                      {cart.billing_address?.last_name}
                    </SummaryText>
                    <SummaryText>
                      {[
                        cart.billing_address?.address_1,
                        cart.billing_address?.address_2,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </SummaryText>
                    <SummaryText>
                      {[
                        cart.billing_address?.postal_code,
                        cart.billing_address?.city,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </SummaryText>
                    <SummaryText>
                      {cart.billing_address?.country_code?.toUpperCase()}
                    </SummaryText>
                  </>
                )}
              </SummaryBlock>
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      )}
    </section>
  )
}

export default Addresses
