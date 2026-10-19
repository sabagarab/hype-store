import { Drawer, DrawerContent } from "@modules/common/components/drawer"
import LoadingButton from "@modules/common/components/loading-button"
import StickyBar from "@modules/common/components/sticky-bar"
import { clx } from "@modules/common/components/ui"
import React, { useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"

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
  handleAddToCart: () => Promise<void>
  /** Label the add buttons show after a successful add. */
  successLabel: string
  show: boolean
  optionsDisabled: boolean
}

// Sticky glass bar on phones/tablets, shown once the main Add to cart button
// scrolls out of view. Products with several variants open the 21st Drawer
// (bottom sheet, drag to close) with the same size pills.
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
  successLabel,
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
      <StickyBar
        show={show}
        className="small:hidden"
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
                soldOut ? "text-bone/50 line-through" : "text-ember"
              )}
            >
              {selectedPrice.calculated_price}
            </span>
          )}
        </div>
        {needsSelection ? (
          // Opening the size sheet is instant, so this press resets at once;
          // it uses the same button for one look across the bar.
          <LoadingButton
            onAction={open}
            size="sm"
            resetAfter={0}
            className="shrink-0"
            data-testid="mobile-cart-button"
          >
            {selectLabel}
          </LoadingButton>
        ) : (
          <LoadingButton
            onAction={handleAddToCart}
            disabled={soldOut || !inStock || !variant}
            size="sm"
            pendingLabel="Adding"
            successLabel={successLabel}
            className="shrink-0"
            data-testid="mobile-cart-button"
          >
            {soldOut ? "Sold" : !inStock ? "Out of stock" : "Add to cart"}
          </LoadingButton>
        )}
      </StickyBar>
      <Drawer open={state} onOpenChange={(next) => (next ? open() : close())}>
        <DrawerContent
          title={product.title}
          data-testid="mobile-actions-modal"
          footer={
            <LoadingButton
              onAction={async () => {
                await handleAddToCart()
                close()
              }}
              disabled={!variant || !inStock}
              pendingLabel="Adding"
              successLabel={successLabel}
              className="w-full"
            >
              {!variant ? selectLabel : "Add to cart"}
            </LoadingButton>
          }
        >
          <div className="flex flex-col gap-y-5 py-5">
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
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default MobileActions
