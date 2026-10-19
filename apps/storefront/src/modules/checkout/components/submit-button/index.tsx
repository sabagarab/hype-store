"use client"

import Button from "@modules/common/components/button"
import LoadingButton from "@modules/common/components/loading-button"
import { clx } from "@modules/common/components/ui"
import React from "react"
import { useFormStatus } from "react-dom"

// Form submit button. Primary uses the 21st Loading Button (pending while the
// form's server action runs), secondary the originui Button.
export function SubmitButton({
  children,
  variant = "primary",
  size = "medium",
  className,
  "data-testid": dataTestId,
}: {
  children: string
  variant?: "primary" | "secondary" | "transparent" | null
  size?: "small" | "medium" | "large"
  className?: string
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()

  if (variant === "secondary" || variant === "transparent") {
    return (
      <Button
        type="submit"
        variant={variant === "secondary" ? "secondary" : "ghost"}
        size={size === "small" ? "sm" : "md"}
        disabled={pending}
        aria-busy={pending || undefined}
        className={className}
        data-testid={dataTestId}
      >
        {children}
      </Button>
    )
  }

  return (
    <LoadingButton
      type="submit"
      pending={pending}
      size={size === "small" ? "sm" : "md"}
      className={clx(className)}
      data-testid={dataTestId}
    >
      {children}
    </LoadingButton>
  )
}
