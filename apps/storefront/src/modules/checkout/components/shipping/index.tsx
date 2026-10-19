"use client"
import { Radio, RadioGroup } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import LoadingButton from "@modules/common/components/loading-button"
import MedusaRadio from "@modules/common/components/radio"
import { RadioCard, radioRowClass } from "@modules/common/components/radio-card"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import {
  StepFade,
  StepHeader,
  SummaryBlock,
  SummaryText,
} from "../step-header"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

function formatAddress(address: HttpTypes.StoreCartAddress) {
  if (!address) {
    return ""
  }

  let ret = ""

  if (address.address_1) {
    ret += ` ${address.address_1}`
  }

  if (address.address_2) {
    ret += `, ${address.address_2}`
  }

  const cityLine = [address.postal_code, address.city].filter(Boolean).join(" ")
  if (cityLine) {
    ret += `, ${cityLine}`
  }

  if (address.country_code) {
    ret += `, ${address.country_code.toUpperCase()}`
  }

  return ret
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) => (sm as unknown as { service_zone?: { fulfillment_set?: { type?: string; location?: { address: HttpTypes.StoreCartAddress } } } }).service_zone?.fulfillment_set?.type !== "pickup"
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm) => (sm as unknown as { service_zone?: { fulfillment_set?: { type?: string; location?: { address: HttpTypes.StoreCartAddress } } } }).service_zone?.fulfillment_set?.type === "pickup"
  )

  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    setIsLoadingPrices(true)

    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => {
              if (p.value?.id) {
                pricesMap[p.value.id] = p.value.amount ?? 0
              }
            })

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null)

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)

        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const priceOf = (option: HttpTypes.StoreCartShippingOption) =>
    option.price_type === "flat" ? (
      convertToLocale({
        amount: option.amount!,
        currency_code: cart?.currency_code,
      })
    ) : calculatedPricesMap[option.id] ? (
      convertToLocale({
        amount: calculatedPricesMap[option.id],
        currency_code: cart?.currency_code,
      })
    ) : isLoadingPrices ? (
      <Loader />
    ) : (
      "-"
    )

  const hasMethod = (cart.shipping_methods?.length ?? 0) > 0

  return (
    <section className="py-6">
      <StepHeader
        title="Delivery"
        state={isOpen ? "open" : hasMethod ? "done" : "upcoming"}
        onEdit={
          cart?.shipping_address && cart?.billing_address && cart?.email
            ? handleEdit
            : undefined
        }
        editTestId="edit-delivery-button"
      />
      {isOpen ? (
        <StepFade className="flex flex-col gap-y-4 pt-2">
          <div data-testid="delivery-options-container">
            <div className="flex flex-col gap-y-3">
              {hasPickupOptions && (
                <RadioGroup
                  value={showPickupOptions}
                  onChange={(_value) => {
                    const id = _pickupMethods.find(
                      (option) => !option.insufficient_inventory
                    )?.id

                    if (id) {
                      handleSetShippingMethod(id, "pickup")
                    }
                  }}
                >
                  <RadioCard>
                    <Radio
                      value={PICKUP_OPTION_ON}
                      data-testid="delivery-option-radio"
                      className={radioRowClass()}
                    >
                      <div className="flex items-center gap-x-3">
                        <MedusaRadio
                          checked={showPickupOptions === PICKUP_OPTION_ON}
                        />
                        <span className="font-medium">Pick up your order</span>
                      </div>
                      <span className="text-bone/70">-</span>
                    </Radio>
                  </RadioCard>
                </RadioGroup>
              )}
              <RadioGroup
                value={shippingMethodId}
                onChange={(v) => {
                  if (v) {
                    return handleSetShippingMethod(v, "shipping")
                  }
                }}
              >
                <RadioCard>
                  {_shippingMethods?.map((option) => {
                    const isDisabled =
                      option.price_type === "calculated" &&
                      !isLoadingPrices &&
                      typeof calculatedPricesMap[option.id] !== "number"

                    return (
                      <Radio
                        key={option.id}
                        value={option.id}
                        data-testid="delivery-option-radio"
                        disabled={isDisabled}
                        className={radioRowClass({ disabled: isDisabled })}
                      >
                        <div className="flex items-center gap-x-3">
                          <MedusaRadio
                            checked={option.id === shippingMethodId}
                          />
                          <span className="font-medium">{option.name}</span>
                        </div>
                        <span className="text-bone">{priceOf(option)}</span>
                      </Radio>
                    )
                  })}
                </RadioCard>
              </RadioGroup>
            </div>
          </div>

          {showPickupOptions === PICKUP_OPTION_ON && (
            <div className="flex flex-col gap-y-3">
              <p className="text-sm text-bone/70">Choose a store near you</p>
              <div data-testid="delivery-options-container">
                <RadioGroup
                  value={shippingMethodId}
                  onChange={(v) => {
                    if (v) {
                      return handleSetShippingMethod(v, "pickup")
                    }
                  }}
                >
                  <RadioCard>
                    {_pickupMethods?.map((option) => {
                      return (
                        <Radio
                          key={option.id}
                          value={option.id}
                          disabled={option.insufficient_inventory}
                          data-testid="delivery-option-radio"
                          className={radioRowClass({
                            disabled: option.insufficient_inventory,
                          })}
                        >
                          <div className="flex items-start gap-x-3">
                            <MedusaRadio
                              checked={option.id === shippingMethodId}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {option.name}
                              </span>
                              <span className="text-bone/55">
                                {formatAddress(
                                  (option as unknown as { service_zone?: { fulfillment_set?: { location?: { address: HttpTypes.StoreCartAddress } } } }).service_zone?.fulfillment_set?.location
                                    ?.address as HttpTypes.StoreCartAddress
                                )}
                              </span>
                            </div>
                          </div>
                          <span className="text-bone">
                            {convertToLocale({
                              amount: option.amount!,
                              currency_code: cart?.currency_code,
                            })}
                          </span>
                        </Radio>
                      )
                    })}
                  </RadioCard>
                </RadioGroup>
              </div>
            </div>
          )}

          <div>
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />
            <LoadingButton
              className="mt-2 w-full"
              onAction={handleSubmit}
              pending={isLoading}
              disabled={!cart.shipping_methods?.[0]}
              data-testid="submit-delivery-option-button"
            >
              Continue to payment
            </LoadingButton>
          </div>
        </StepFade>
      ) : (
        <div className="pt-2">
          {cart && hasMethod && (
            <SummaryBlock label="Method">
              <SummaryText>
                {cart.shipping_methods!.at(-1)!.name}{" "}
                {convertToLocale({
                  amount: cart.shipping_methods!.at(-1)!.amount!,
                  currency_code: cart?.currency_code,
                })}
              </SummaryText>
            </SummaryBlock>
          )}
        </div>
      )}
    </section>
  )
}

export default Shipping
