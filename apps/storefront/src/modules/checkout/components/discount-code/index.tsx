"use client"

import Input from "@modules/common/components/input"
import React from "react"

import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const { promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code !== undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")

    const code = formData.get("code")
    if (!code) {
      return
    }
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => p.code !== undefined)
      .map((p) => p.code!)
    codes.push(code.toString())

    try {
      await applyPromotions(codes)
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : String(e))
    }

    if (input) {
      input.value = ""
    }
  }

  return (
    <div className="flex w-full flex-col gap-y-3 text-sm">
      <form action={(a) => addPromotionCode(a)} className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          aria-expanded={isOpen}
          className="-ml-1 h-11 px-1 text-sm font-medium text-bone/70 underline underline-offset-4 transition-colors duration-fast hover:text-bone"
          data-testid="add-discount-button"
        >
          Add promo code
        </button>

        {isOpen && (
          <>
            <div className="flex w-full items-end gap-x-2">
              <Input
                label="Promo code"
                id="promotion-input"
                name="code"
                type="text"
                autoFocus={false}
                data-testid="discount-input"
              />
              <SubmitButton
                variant="secondary"
                size="small"
                data-testid="discount-apply-button"
              >
                Apply
              </SubmitButton>
            </div>

            <ErrorMessage
              error={errorMessage}
              data-testid="discount-error-message"
            />
          </>
        )}
      </form>

      {promotions.length > 0 && (
        <div className="flex w-full flex-col">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-bone/55">
            Applied
          </p>

          {promotions.map((promotion) => {
            return (
              <div
                key={promotion.id}
                className="flex min-h-control-sm w-full items-center justify-between"
                data-testid="discount-row"
              >
                <p className="min-w-0 truncate text-bone">
                  <span data-testid="discount-code">
                    <span className="font-bold uppercase tracking-wide">
                      {promotion.code}
                    </span>{" "}
                    <span className="text-bone/70">
                      (
                      {promotion.application_method?.value !== undefined &&
                        promotion.application_method.currency_code !==
                          undefined && (
                          <>
                            {promotion.application_method.type ===
                            "percentage"
                              ? `${promotion.application_method.value}%`
                              : convertToLocale({
                                  amount: +promotion.application_method.value,
                                  currency_code:
                                    promotion.application_method.currency_code,
                                })}
                          </>
                        )}
                      )
                    </span>
                  </span>
                </p>
                {!promotion.is_automatic && (
                  <button
                    className="-mr-3 flex h-11 w-11 items-center justify-center text-bone/60 transition-colors duration-fast hover:text-ember"
                    onClick={() => {
                      if (!promotion.code) {
                        return
                      }

                      removePromotionCode(promotion.code)
                    }}
                    data-testid="remove-discount-button"
                  >
                    <Trash size={14} />
                    <span className="sr-only">
                      Remove discount code from order
                    </span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DiscountCode
