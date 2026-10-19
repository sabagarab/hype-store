"use client"

import { useToggleRefinement } from "react-instantsearch"

import { priceAttribute } from "@lib/search-client"
import CheckboxWithLabel from "@modules/common/components/checkbox"

/**
 * Narrows to products whose calculated price is below their original in the
 * region's currency. Hides itself when nothing is discounted, which is the
 * case until a price list applies to some product.
 */
const OnSaleToggle = ({ currencyCode }: { currencyCode: string }) => {
  const { value, refine, canRefine } = useToggleRefinement({
    attribute: priceAttribute("on_sale", currencyCode),
    on: true,
  })

  if (!canRefine) {
    return null
  }

  return (
    <div>
      <CheckboxWithLabel
        label="On sale only"
        checked={value.isRefined}
        onChange={() => refine(value)}
        data-testid="on-sale-toggle"
      />
    </div>
  )
}

export default OnSaleToggle
