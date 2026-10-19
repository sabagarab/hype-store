"use client"

import {
  SelectHTMLAttributes,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import { clx } from "@modules/common/components/ui"

// Native Select from 21st.dev (@wensity/native-select). Keeps the browser's
// own picker, which is the best experience on phones. Adapted to the shared
// tokens: control radius and control-sm height, ink field with a hairline
// border, ember focus, shared timing. The label sits where the Floating Label
// inputs put a raised label, so selects line up with inputs in a form row.

export type NativeSelectProps = {
  placeholder?: string
  /** Shown above the field, like a raised floating label. */
  label?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
} & SelectHTMLAttributes<HTMLSelectElement>

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-4">
      <path
        d="m4.25 6.25 3.75 3.5 3.75-3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    {
      placeholder = "Select...",
      label,
      errors: _errors,
      touched: _touched,
      defaultValue,
      className,
      children,
      id,
      required,
      onChange,
      ...props
    },
    ref
  ) => {
    const auto = useId()
    const selectId = id ?? `${auto}-select`
    const innerRef = useRef<HTMLSelectElement>(null)
    const [isPlaceholder, setIsPlaceholder] = useState(false)

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    useEffect(() => {
      setIsPlaceholder(innerRef.current?.value === "")
    }, [props.value])

    return (
      <div className={clx("relative w-full", label && "pt-5", className)}>
        {label && (
          <label
            htmlFor={selectId}
            className="absolute left-4 top-0 text-xs leading-4 text-bone/70"
          >
            {label}
            {required && (
              <span aria-hidden className="ml-0.5 text-bone/55">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={innerRef}
            id={selectId}
            defaultValue={defaultValue}
            required={required}
            onChange={(event) => {
              setIsPlaceholder(event.currentTarget.value === "")
              onChange?.(event)
            }}
            {...props}
            className={clx(
              "h-control-sm w-full cursor-pointer appearance-none rounded-control border border-hairline bg-ink pl-4 pr-11 text-base outline-none",
              "transition-[border-color] duration-fast ease-premium hover:border-bone/25 focus:border-ember",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isPlaceholder ? "text-bone/55" : "text-bone"
            )}
          >
            <option disabled value="">
              {placeholder}
            </option>
            {children}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-bone/55">
            <ChevronDownIcon />
          </span>
        </div>
      </div>
    )
  }
)

NativeSelect.displayName = "NativeSelect"

export default NativeSelect
