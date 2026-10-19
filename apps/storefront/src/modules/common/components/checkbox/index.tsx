"use client"

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import React, { useId } from "react"

import { clx } from "@modules/common/components/ui"

// Checkbox from 21st.dev (@shadcn/checkbox, Radix). Adapted to the shared
// tokens: hairline border, ember fill when checked, ember focus ring, shared
// timing; lucide's check replaced by an inline SVG. Inside a form Radix adds
// a hidden native input, so `name` submits "on" like a plain checkbox. The
// whole row is the label, keeping the tap target at 44px.

type CheckboxProps = {
  checked?: boolean
  onChange?: () => void
  label: string
  name?: string
  "data-testid"?: string
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  label,
  name,
  "data-testid": dataTestId,
}) => {
  const id = useId()

  return (
    <label
      htmlFor={id}
      className="flex min-h-control-sm cursor-pointer items-center gap-x-3 text-sm text-bone"
    >
      <CheckboxPrimitive.Root
        id={id}
        name={name}
        checked={checked}
        onCheckedChange={() => onChange?.()}
        data-testid={dataTestId}
        className={clx(
          "peer flex h-5 w-5 shrink-0 items-center justify-center rounded-base border border-bone/40 bg-transparent",
          "transition-colors duration-fast ease-premium",
          "data-[state=checked]:border-ember data-[state=checked]:bg-ember data-[state=checked]:text-black",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <svg
            aria-hidden="true"
            viewBox="0 0 12 12"
            fill="none"
            className="h-3.5 w-3.5"
          >
            <path
              d="M2.6 6.3 4.9 8.6 9.4 3.6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label}
    </label>
  )
}

export default CheckboxWithLabel
