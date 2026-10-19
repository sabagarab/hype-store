"use client"
import { RadioGroup } from "@headlessui/react"
import { isManual, isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripePaymentContainer,
} from "@modules/checkout/components/payment-container"
import LoadingButton from "@modules/common/components/loading-button"
import { RadioCard } from "@modules/common/components/radio-card"
import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import {
  StepFade,
  StepHeader,
  SummaryBlock,
  SummaryText,
} from "../step-header"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: HttpTypes.StoreCart
  availablePaymentMethods: { id: string }[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeLike(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards && ((cart as unknown as Record<string, unknown>)?.gift_cards as unknown[])?.length > 0 && cart?.total === 0
  )

  const paymentReady =
    (activeSession && (cart?.shipping_methods?.length ?? 0) !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputPaymentDetails =
        isStripeLike(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputPaymentDetails) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <section className="py-6">
      <StepHeader
        title="Payment"
        state={isOpen ? "open" : paymentReady ? "done" : "upcoming"}
        onEdit={handleEdit}
        editTestId="edit-payment-button"
      />
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          <StepFade show={isOpen} className="pt-2">
              {!paidByGiftcard && availablePaymentMethods?.length && (
                <RadioGroup
                  value={selectedPaymentMethod}
                  onChange={(value: string) => setPaymentMethod(value)}
                >
                  <RadioCard>
                    {availablePaymentMethods.map((paymentMethod) => (
                      <div key={paymentMethod.id}>
                        {isStripeLike(paymentMethod.id) ? (
                          <StripePaymentContainer
                            paymentProviderId={paymentMethod.id}
                            selectedPaymentOptionId={selectedPaymentMethod}
                            paymentInfoMap={paymentInfoMap}
                            setError={setError}
                            setPaymentComplete={setPaymentComplete}
                          />
                        ) : (
                          <PaymentContainer
                            paymentInfoMap={paymentInfoMap}
                            paymentProviderId={paymentMethod.id}
                            selectedPaymentOptionId={selectedPaymentMethod}
                          />
                        )}
                      </div>
                    ))}
                  </RadioCard>
                </RadioGroup>
              )}

              {paidByGiftcard && (
                <SummaryBlock label="Payment method">
                  <SummaryText data-testid="payment-method-summary">
                    Gift card
                  </SummaryText>
                </SummaryBlock>
              )}

              <ErrorMessage
                error={error}
                data-testid="payment-method-error-message"
              />

              <LoadingButton
                className="mt-4 w-full"
                onAction={handleSubmit}
                pending={isLoading}
                disabled={
                  (isStripeLike(selectedPaymentMethod) && !paymentComplete) ||
                  (!selectedPaymentMethod && !paidByGiftcard)
                }
                data-testid="submit-payment-button"
              >
                {!activeSession && isStripeLike(selectedPaymentMethod)
                  ? "Enter payment details"
                  : "Continue to review"}
              </LoadingButton>
          </StepFade>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="pt-2">
              <SummaryBlock label="Payment method">
                <SummaryText
                  className="text-bone"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </SummaryText>
                <SummaryText data-testid="payment-details-summary">
                  {isManual(activeSession?.provider_id)
                    ? "Pay in cash when your order arrives."
                    : "Another step will appear"}
                </SummaryText>
              </SummaryBlock>
            </div>
          ) : paidByGiftcard ? (
            <div className="pt-2">
              <SummaryBlock label="Payment method">
                <SummaryText data-testid="payment-method-summary">
                  Gift card
                </SummaryText>
              </SummaryBlock>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default Payment
