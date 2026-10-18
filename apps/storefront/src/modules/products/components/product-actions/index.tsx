"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import {
  isSoldOut,
  isVariantAvailable,
  singleSize,
} from "@lib/util/product-availability"
import { HttpTypes } from "@medusajs/types"
import { useCartDrawer } from "@modules/cart/components/cart-drawer/context"
import { Button, clx } from "@modules/common/components/ui"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt) => {
    if (varopt.option_id) acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const { openCart } = useCartDrawer()
  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  const soldOut = isSoldOut(product)
  const size = singleSize(product)
  const hasManyVariants = (product.variants?.length ?? 0) > 1

  // Option values that no in-stock variant has (crossed out in the pills).
  const soldOutValues = (optionId: string) =>
    (product.options ?? [])
      .find((o) => o.id === optionId)
      ?.values?.map((v) => v.value)
      .filter(
        (value) =>
          !(product.variants ?? []).some(
            (variant) =>
              isVariantAvailable(variant) &&
              variant.options?.some(
                (o) => o.option_id === optionId && o.value === value
              )
          )
      ) ?? []

  const selectLabel = `Select ${(
    product.options?.find((o) => !options[o.id])?.title ?? "option"
  ).toLowerCase()}`

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    try {
      const result = await addToCart({
        variantId: selectedVariant.id,
        countryCode,
      })
      openCart()
      if (result === "already_in_cart") {
        toast("Already in your cart")
      } else {
        toast.success("Added to cart")
      }
    } catch {
      toast.error("Couldn't add to cart. Please try again.")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-6" ref={actionsRef}>
        <ProductPrice
          product={product}
          variant={selectedVariant}
          soldOut={soldOut}
        />

        {size && !hasManyVariants && (
          <p className="text-sm font-medium text-bone/80" data-testid="product-size">
            Size {size}
          </p>
        )}

        {hasManyVariants && (
          <div className="flex flex-col gap-y-5">
            {(product.options || []).map((option) => (
              <OptionSelect
                key={option.id}
                option={option}
                current={options[option.id]}
                updateOption={setOptionValue}
                title={option.title ?? ""}
                soldOutValues={soldOutValues(option.id)}
                data-testid="product-options"
                disabled={!!disabled || isAdding || soldOut}
              />
            ))}
          </div>
        )}

        <Button
          onClick={handleAddToCart}
          disabled={
            soldOut ||
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className={clx(
            "h-[52px] w-full rounded-full text-base font-bold uppercase tracking-wide",
            soldOut &&
              "!bg-ink !text-bone/60 border border-ui-border-base !opacity-100"
          )}
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {soldOut
            ? "Sold"
            : !selectedVariant
            ? selectLabel
            : !inStock || !isValidVariant
            ? "Out of stock"
            : "Add to cart"}
        </Button>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          soldOut={soldOut}
          soldOutValues={soldOutValues}
          selectLabel={selectLabel}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
