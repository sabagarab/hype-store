import { HttpTypes } from "@medusajs/types"
import ToggleGroup from "@modules/common/components/toggle-group"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  /** Values with no variant left in stock: shown crossed out, not selectable. */
  soldOutValues?: string[]
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
  soldOutValues = [],
}) => {
  const values = (option.values ?? []).map((v) => v.value)

  return (
    <fieldset className="flex flex-col gap-y-3">
      <legend className="mb-3 text-xs font-medium uppercase tracking-widest text-bone/55">
        {title}
      </legend>
      <ToggleGroup
        type="single"
        value={current ? [current] : []}
        // Pressing the selected size again only re-selects it.
        onValueChange={(next) => next[0] && updateOption(option.id, next[0])}
        disabled={disabled}
        items={values.map((v) => {
          const soldOut = soldOutValues.includes(v)
          return {
            value: v,
            label: v,
            ariaLabel: soldOut ? `${v} (sold out)` : undefined,
            unavailable: soldOut,
          }
        })}
        className="self-start"
        data-testid={dataTestId}
        itemTestId="option-button"
      />
    </fieldset>
  )
}

export default OptionSelect
