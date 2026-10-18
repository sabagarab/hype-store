import { Text, clx } from "@modules/common/components/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({
  price,
  soldOut = false,
}: {
  price: VariantPrice
  soldOut?: boolean
}) {
  if (!price) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" && !soldOut && (
        <Text
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
      <Text
        className={clx(
          "font-medium",
          soldOut ? "text-ui-fg-muted line-through" : "text-ember"
        )}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
    </>
  )
}
