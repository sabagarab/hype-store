"use client"

import React, { useId, useImperativeHandle } from "react"

import {
  FloatingLabel,
  fieldClass,
  useFloatingLabel,
} from "@modules/common/components/input"
import { clx } from "@modules/common/components/ui"

type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "placeholder"
> & {
  label: string
  name: string
}

// Multi-line counterpart of the Input component (21st Floating Label): same
// field surface and the same lifting label. Uses the card radius because a
// pill doesn't fit several lines.
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { name, label, required, rows = 3, id, onFocus, onBlur, ...props },
    ref
  ) => {
    const auto = useId()
    const fieldId = id ?? `${auto}-field`
    const floating = useFloatingLabel<HTMLTextAreaElement>({
      value: props.value,
      disabled: props.disabled,
    })

    useImperativeHandle(ref, () => floating.ref.current!)

    return (
      <div className="relative w-full pt-5">
        <div className={clx(fieldClass(floating.focused), "rounded-card")}>
          <textarea
            ref={floating.ref}
            id={fieldId}
            name={name}
            rows={rows}
            required={required}
            onFocus={(event) => {
              floating.onFocus()
              onFocus?.(event)
            }}
            onBlur={(event) => {
              floating.onBlur()
              onBlur?.(event)
            }}
            className="block w-full resize-y rounded-card bg-transparent px-4 py-3 text-base leading-6 text-bone outline-none focus-visible:outline-none"
            {...props}
          />
        </div>
        <FloatingLabel
          htmlFor={fieldId}
          label={label}
          required={required}
          raised={floating.raised}
          instant={floating.instant}
          restTop={36}
        />
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export default Textarea
