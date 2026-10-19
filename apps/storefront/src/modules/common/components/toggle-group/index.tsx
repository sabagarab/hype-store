"use client"

import { clx } from "@modules/common/components/ui"

// Toggle Group from 21st.dev (@klyv-ui/toggle-group): a row of pill buttons,
// each a real button with aria-pressed. Adapted: icons dropped (text only),
// 44px controls on the shared control radius inside an ink track with the
// hairline border, items wrap onto more lines, the pressed state is a bone
// fill (ember stays for CTAs and prices), shared timing. Added: `unavailable`
// items (crossed out, not selectable, e.g. a sold-out size), a group-wide
// `disabled`, and per-item accessible labels and test ids. Inside a
// <fieldset> leave out `label`: the legend already names the set.

export type ToggleGroupItem<T extends string = string> = {
  value: T
  label: string
  /** Accessible name when it should differ from the label. */
  ariaLabel?: string
  /** Shown crossed out and not selectable. */
  unavailable?: boolean
}

type ToggleGroupProps<T extends string = string> = {
  items: ToggleGroupItem<T>[]
  /** The values currently pressed. */
  value: T[]
  /** Called with the full set of pressed values after each press. */
  onValueChange: (value: T[]) => void
  /** `single` allows at most one; pressing it again turns it off. */
  type?: "single" | "multiple"
  /** Accessible name for the set (omit inside a labelled fieldset). */
  label?: string
  disabled?: boolean
  className?: string
  "data-testid"?: string
  itemTestId?: string
}

export function ToggleGroup<T extends string = string>({
  items,
  value,
  onValueChange,
  type = "multiple",
  label,
  disabled = false,
  className,
  "data-testid": dataTestId,
  itemTestId,
}: ToggleGroupProps<T>) {
  const toggle = (item: T) => {
    const pressed = value.includes(item)
    if (type === "single") onValueChange(pressed ? [] : [item])
    else
      onValueChange(
        pressed ? value.filter((entry) => entry !== item) : [...value, item]
      )
  }

  return (
    <div
      role={label ? "group" : undefined}
      aria-label={label}
      data-testid={dataTestId}
      className={clx(
        "inline-flex flex-wrap items-center gap-1 rounded-card border border-hairline bg-ink p-1",
        className
      )}
    >
      {items.map((item) => {
        const pressed = value.includes(item.value)

        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={pressed}
            aria-label={item.ariaLabel}
            disabled={disabled || item.unavailable}
            onClick={() => toggle(item.value)}
            data-testid={itemTestId}
            className={clx(
              "inline-flex h-control-sm min-w-[56px] shrink-0 items-center justify-center rounded-control px-4 text-sm font-medium leading-none transition-colors duration-base ease-premium",
              item.unavailable
                ? "cursor-not-allowed text-bone/35 line-through"
                : pressed
                ? "bg-bone text-black"
                : "text-bone/80 [@media(hover:hover)]:hover:bg-bone/10 [@media(hover:hover)]:hover:text-bone",
              disabled && !item.unavailable && "cursor-not-allowed"
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default ToggleGroup
