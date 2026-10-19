import React from "react"

import { clx } from "@modules/common/components/ui"

// Radio Group in Card with Separators from 21st.dev (@sean0205/c-radio-group-8).
// Each choice is a full-width row inside one card, rows split by hairlines.
// Adapted to the shared tokens: card radius, hairline border and dividers, ink
// surface, control-height rows. The rows themselves are Headless UI Radio
// options (selection logic stays in the checkout steps); style them with
// `radioRowClass`.

export const RadioCard = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div
    className={clx(
      "overflow-hidden rounded-card border border-hairline bg-ink divide-y divide-hairline",
      className
    )}
  >
    {children}
  </div>
)

export const radioRowClass = ({ disabled = false } = {}) =>
  clx(
    "flex min-h-control w-full items-center justify-between gap-x-4 px-4 py-3 text-sm text-bone outline-none",
    "transition-colors duration-fast ease-premium",
    "data-[focus]:bg-bone/[0.04] data-[focus]:outline data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-ember",
    disabled
      ? "cursor-not-allowed opacity-50"
      : "cursor-pointer hover:bg-bone/[0.03]"
  )
