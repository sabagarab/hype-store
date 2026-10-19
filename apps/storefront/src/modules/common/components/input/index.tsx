"use client"

import { motion, useReducedMotion } from "motion/react"
import React, {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { INSTANT, SPRING } from "@lib/motion"
import { clx } from "@modules/common/components/ui"
import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

// Floating Label from 21st.dev (@ddoemonn/floating-label). The label rests in
// the field and lifts into a reserved slot above it on focus or when filled,
// so it never covers the value. Adapted to the shared tokens: control radius
// and control-sm height, ink field with a hairline border, ember focus, shared
// spring, Satoshi. Keeps the starter Input's props (label, name, required,
// password toggle, any native input attribute), so every form uses it as is.
// The hint row only renders when there is a hint.

const RAISE = -34
const SHRINK = 0.86

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

type FieldElement = HTMLInputElement | HTMLTextAreaElement

// Chrome can show an autofilled value before the page may read it.
const isAutofilled = (el: Element) => {
  try {
    return el.matches(":autofill")
  } catch {
    // Browsers without :autofill throw on the selector.
    return false
  }
}

/**
 * Tracks whether the label should be raised. Works for controlled and
 * uncontrolled fields and for browser autofill (see the autofill animation
 * in globals.css), which changes the value without a React event.
 */
export function useFloatingLabel<T extends FieldElement>({
  value,
  disabled = false,
}: {
  value?: React.InputHTMLAttributes<T>["value"]
  disabled?: boolean
}) {
  const ref = useRef<T | null>(null)
  const mounted = useRef(false)
  const [focused, setFocused] = useState(false)
  const [fill, setFill] = useState({ filled: false, instant: true })

  const settle = useCallback((filled: boolean, instant: boolean) => {
    setFill((prev) =>
      prev.filled === filled && prev.instant === instant
        ? prev
        : { filled, instant }
    )
  }, [])

  const read = useCallback(
    (instant: boolean) => {
      const el = ref.current
      settle(!!el && (el.value.length > 0 || isAutofilled(el)), instant)
    },
    [settle]
  )

  // Initial value (and controlled updates) never animate on first paint.
  useIsomorphicLayoutEffect(() => {
    read(!mounted.current)
    mounted.current = true
  }, [value, read])

  // Uncontrolled fields only: a controlled field updates through `value`
  // above. Setting state from a native input event on a controlled field
  // re-renders before React's onChange runs, which resets the typed value.
  const controlled = value !== undefined
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onInput = () => read(false)
    const events = controlled
      ? ["animationstart"]
      : ["input", "change", "animationstart"]
    events.forEach((type) => el.addEventListener(type, onInput))
    return () => {
      events.forEach((type) => el.removeEventListener(type, onInput))
    }
  }, [read, controlled])

  useEffect(() => {
    if (disabled) setFocused(false)
  }, [disabled])

  return {
    ref,
    focused,
    raised: focused || fill.filled,
    instant: fill.instant && !focused,
    onFocus: () => setFocused(true),
    onBlur: () => {
      setFocused(false)
      read(false)
    },
  }
}

/** Field surface shared by Input and Textarea. */
export const fieldClass = (focused: boolean) =>
  clx(
    "relative border bg-ink transition-[border-color,background-color] duration-fast ease-premium",
    focused ? "border-ember" : "border-hairline hover:border-bone/25"
  )

/** The lifting label shared by Input and Textarea. */
export function FloatingLabel({
  htmlFor,
  label,
  required,
  raised,
  instant,
  restTop,
}: {
  htmlFor: string
  label: string
  required?: boolean
  raised: boolean
  instant: boolean
  /** Resting position from the top of the reserved slot, in px. */
  restTop: number
}) {
  const reduced = useReducedMotion()

  return (
    <motion.label
      htmlFor={htmlFor}
      initial={false}
      animate={{ y: raised ? RAISE : 0, scale: raised ? SHRINK : 1 }}
      transition={reduced || instant ? INSTANT : SPRING}
      style={{ originX: 0, originY: 0, top: restTop }}
      className={clx(
        "pointer-events-none absolute left-4 block select-none text-sm leading-4",
        raised ? "text-bone/70" : "text-bone/55"
      )}
    >
      {label}
      {required && (
        <span aria-hidden className="ml-0.5 text-bone/55">
          *
        </span>
      )}
    </motion.label>
  )
}

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
  hint?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      name,
      label,
      errors: _errors,
      touched: _touched,
      topLabel: _topLabel,
      hint,
      required,
      id,
      disabled,
      onFocus,
      onBlur,
      className,
      ...props
    },
    ref
  ) => {
    const auto = useId()
    const fieldId = id ?? `${auto}-field`
    const hintId = `${auto}-hint`
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === "password"

    const floating = useFloatingLabel<HTMLInputElement>({
      value: props.value,
      disabled,
    })

    useImperativeHandle(ref, () => floating.ref.current!)

    return (
      <div className={clx("w-full", className)}>
        <div className="relative pt-5">
          <div
            className={clx(
              fieldClass(floating.focused),
              "h-control-sm rounded-control",
              disabled && "opacity-50"
            )}
          >
            <input
              ref={floating.ref}
              id={fieldId}
              name={name}
              type={isPassword && showPassword ? "text" : type}
              required={required}
              disabled={disabled}
              aria-describedby={hint ? hintId : undefined}
              onFocus={(event) => {
                floating.onFocus()
                onFocus?.(event)
              }}
              onBlur={(event) => {
                floating.onBlur()
                onBlur?.(event)
              }}
              className={clx(
                "absolute inset-0 h-full w-full rounded-control bg-transparent px-4 text-base text-bone outline-none focus-visible:outline-none disabled:cursor-not-allowed",
                isPassword && "pr-12"
              )}
              {...props}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-control text-bone/55 transition-colors duration-fast hover:text-bone"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            )}
          </div>
          <FloatingLabel
            htmlFor={fieldId}
            label={label}
            required={required}
            raised={floating.raised}
            instant={floating.instant}
            restTop={34}
          />
        </div>
        {hint && (
          <p id={hintId} className="mt-1.5 px-4 text-xs text-bone/55">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
