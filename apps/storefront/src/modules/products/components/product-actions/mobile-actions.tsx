import { Dialog, Transition } from "@headlessui/react"
import { Button, clx } from "@modules/common/components/ui"
import React, { Fragment, useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import OptionSelect from "./option-select"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  soldOut: boolean
  soldOutValues: (optionId: string) => string[]
  selectLabel: string
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
}

// Sticky glass bar on phones/tablets, shown once the main Add to cart button
// scrolls out of view. Products with several variants open a sheet with the
// same size pills.
const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  soldOut,
  soldOutValues,
  selectLabel,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}) => {
  const { state, open, close } = useToggleState()

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const hasManyVariants = (product.variants?.length ?? 0) > 1
  // Without a variant picked, the main button opens the size sheet.
  const needsSelection = hasManyVariants && !variant && !soldOut

  return (
    <>
      <div
        className={clx("small:hidden inset-x-0 bottom-0 fixed z-50", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <div
            className="glass flex items-center gap-x-3 border-t border-bone/10 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
            data-testid="mobile-actions"
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <span
                className="truncate text-xs text-bone/70"
                data-testid="mobile-title"
              >
                {product.title}
                {variant && hasManyVariants && (
                  <> · {Object.values(options).join(" / ")}</>
                )}
              </span>
              {selectedPrice && (
                <span
                  className={clx(
                    "text-base font-bold",
                    soldOut ? "text-ui-fg-muted line-through" : "text-ember"
                  )}
                >
                  {selectedPrice.calculated_price}
                </span>
              )}
            </div>
            <Button
              onClick={needsSelection ? open : handleAddToCart}
              disabled={soldOut || (!needsSelection && (!inStock || !variant))}
              className={clx(
                "h-11 shrink-0 rounded-full px-6 text-sm font-bold uppercase tracking-wide",
                soldOut &&
                  "!bg-ink !text-bone/60 border border-ui-border-base !opacity-100"
              )}
              isLoading={isAdding}
              data-testid="mobile-cart-button"
            >
              {soldOut
                ? "Sold"
                : needsSelection
                ? selectLabel
                : !inStock
                ? "Out of stock"
                : "Add to cart"}
            </Button>
          </div>
        </Transition>
      </div>
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-x-0 bottom-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <Dialog.Panel
                className="glass rounded-t-large border-t border-bone/10 px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]"
                data-testid="mobile-actions-modal"
              >
                <div className="mb-4 flex items-center justify-between">
                  <Dialog.Title className="text-sm font-bold text-bone">
                    {product.title}
                  </Dialog.Title>
                  <button
                    onClick={close}
                    aria-label="Close"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-bone"
                    data-testid="close-modal-button"
                  >
                    <X />
                  </button>
                </div>
                <div className="flex flex-col gap-y-5">
                  {(product.options || []).map((option) => (
                    <OptionSelect
                      key={option.id}
                      option={option}
                      current={options[option.id]}
                      updateOption={updateOptions}
                      title={option.title ?? ""}
                      soldOutValues={soldOutValues(option.id)}
                      disabled={optionsDisabled}
                    />
                  ))}
                </div>
                <Button
                  onClick={() => {
                    handleAddToCart()
                    close()
                  }}
                  disabled={!variant || !inStock}
                  className="mt-6 h-[52px] w-full rounded-full text-base font-bold uppercase tracking-wide"
                  isLoading={isAdding}
                >
                  {!variant ? selectLabel : "Add to cart"}
                </Button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
