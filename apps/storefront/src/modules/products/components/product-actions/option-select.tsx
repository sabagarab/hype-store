import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
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
      <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
        {values.map((v) => {
          const soldOut = soldOutValues.includes(v)
          const selected = v === current

          return (
            <button
              type="button"
              onClick={() => updateOption(option.id, v)}
              key={v}
              aria-pressed={selected}
              aria-label={soldOut ? `${v} (sold out)` : v}
              disabled={disabled || soldOut}
              className={clx(
                "h-11 min-w-[56px] rounded-full border px-4 text-sm font-medium transition-colors duration-200",
                soldOut
                  ? "cursor-not-allowed border-ui-border-base text-bone/35 line-through"
                  : selected
                  ? "border-bone bg-bone/10 text-bone"
                  : "border-ui-border-strong text-bone/80 hover:border-bone/60 hover:text-bone"
              )}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default OptionSelect
