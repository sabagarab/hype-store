"use client"

import Radio from "@modules/common/components/radio"
import { clx } from "@modules/common/components/ui"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: string
  handleChange: (value: string) => void
  "data-testid"?: string
}

// Single-choice list (sort order) as quiet rows with the shared radio dot.
const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-y-1">
      <p
        id={`${dataTestId ?? "filter"}-title`}
        className="mb-1 text-xs font-medium uppercase tracking-widest text-bone/55"
      >
        {title}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={`${dataTestId ?? "filter"}-title`}
        data-testid={dataTestId}
      >
        {items?.map((item) => {
          const checked = item.value === value

          return (
            <button
              key={item.value}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => handleChange(item.value)}
              className={clx(
                "flex min-h-control-sm w-full items-center gap-x-3 text-left text-sm transition-colors duration-fast",
                checked ? "text-bone" : "text-bone/70 hover:text-bone"
              )}
              data-testid="radio-label"
              data-active={checked}
            >
              <Radio checked={checked} />
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default FilterRadioGroup
