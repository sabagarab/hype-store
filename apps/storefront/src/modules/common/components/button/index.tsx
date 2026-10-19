import * as React from "react"

import { clx } from "@modules/common/components/ui"

// Button from 21st.dev (@originui/button, shadcn-based). Adapted to the
// shared tokens: control radius and heights, brand colors, shared timing, no
// shadows. `buttonClass()` gives links the same look (the original's asChild
// / cva dependencies are replaced by this plain function). Note: `clx` does
// not merge conflicting classes, so pick a variant rather than overriding
// colors through className.

const VARIANTS = {
  primary: "bg-ember text-black hover:bg-ember-deep hover:text-bone",
  secondary:
    "border border-hairline bg-transparent text-bone hover:border-bone/40",
  ghost: "text-bone/70 hover:text-bone",
  /** For use on an ember surface. */
  inverted: "bg-black text-bone hover:bg-ink",
} as const

const SIZES = {
  md: "h-control px-7 text-sm",
  sm: "h-control-sm px-5 text-xs",
} as const

export type ButtonVariant = keyof typeof VARIANTS
export type ButtonSize = keyof typeof SIZES

export const buttonClass = ({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}) =>
  clx(
    "inline-flex select-none items-center justify-center whitespace-nowrap rounded-control font-bold uppercase tracking-wide",
    "transition-[color,background-color,border-color,transform] duration-press ease-premium active:scale-[0.98] motion-reduce:active:scale-100",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className
  )

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonClass({ variant, size, className })}
      {...props}
    />
  )
)
Button.displayName = "Button"

export default Button
