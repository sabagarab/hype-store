import * as React from "react"

import { clx } from "@modules/common/components/ui"

// Badge from 21st.dev (@sean0205/badge-2, "with icon" demo). Adapted to the
// shared tokens: control radius, hairline border, brand colors only, ember
// icons. Trimmed to the variants we use (no cva / Radix Slot dependency).

const VARIANTS = {
  /** Frosted pill for reassurance and metadata. */
  glass: "border-hairline bg-bone/[0.04] text-bone/80 [&_svg]:text-ember",
  /** Solid accent, e.g. status labels. */
  ember: "border-transparent bg-ember text-black [&_svg]:text-black",
} as const

const SIZES = {
  md: "h-8 gap-1.5 px-3 text-xs [&_svg]:size-3.5",
  sm: "h-7 gap-1 px-2.5 text-[0.6875rem] [&_svg]:size-3",
} as const

export type BadgeProps = React.ComponentProps<"span"> & {
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
}

const Badge = ({
  className,
  variant = "glass",
  size = "md",
  ...props
}: BadgeProps) => (
  <span
    data-slot="badge"
    className={clx(
      "inline-flex items-center justify-center whitespace-nowrap rounded-control border font-medium [&_svg]:shrink-0",
      VARIANTS[variant],
      SIZES[size],
      className
    )}
    {...props}
  />
)

export default Badge
