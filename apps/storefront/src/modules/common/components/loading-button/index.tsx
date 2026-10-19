"use client"

import { motion, useReducedMotion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

import { INSTANT, SPRING, TRANSITION } from "@lib/motion"
import { clx } from "@modules/common/components/ui"

// Loading Button from 21st.dev (@ddoemonn/loading-button). Its labels stack
// in one grid cell and crossfade, so idle / pending / success / error never
// change the button's size (no layout shift). Adapted to the shared tokens:
// control radius and heights, ember fill, brand colors for every state,
// shared motion timing, no blur filter. Pass `pending` to drive the state
// from the caller (form submits, steps that track their own loading), which
// shows idle / pending only; `type="submit"` lets it submit a form.

export type AsyncActionStatus = "idle" | "pending" | "success" | "error"

type UseAsyncActionOptions = {
  action: () => unknown
  resetAfter?: number
  onError?: (error: unknown) => void
}

export function useAsyncAction({
  action,
  resetAfter = 1400,
  onError,
}: UseAsyncActionOptions) {
  const [status, setStatus] = useState<AsyncActionStatus>("idle")

  const phase = useRef<AsyncActionStatus>("idle")
  const runId = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const alive = useRef(true)

  const act = useRef(action)
  const fail = useRef(onError)

  useEffect(() => {
    act.current = action
    fail.current = onError
  })

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const run = useCallback(() => {
    if (phase.current === "pending") return

    clear()
    const id = ++runId.current
    phase.current = "pending"
    setStatus("pending")

    const settle = (next: "success" | "error") => {
      if (!alive.current || id !== runId.current) return
      clear()
      phase.current = next
      setStatus(next)
      timer.current = setTimeout(() => {
        if (!alive.current || id !== runId.current) return
        phase.current = "idle"
        setStatus("idle")
      }, resetAfter)
    }

    Promise.resolve()
      .then(() => act.current())
      .then(
        () => settle("success"),
        (error: unknown) => {
          fail.current?.(error)
          settle("error")
        }
      )
  }, [clear, resetAfter])

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      clear()
    }
  }, [clear])

  return { status, run, pending: status === "pending" }
}

function Spinner({ still }: { still: boolean }) {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
      animate={still ? undefined : { rotate: 360 }}
      transition={
        still ? undefined : { duration: 0.85, repeat: Infinity, ease: "linear" }
      }
    >
      <circle
        cx="6"
        cy="6"
        r="4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.22"
      />
      <path
        d="M10.5 6A4.5 4.5 0 0 0 6 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </motion.svg>
  )
}

function CheckMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M2.6 6.3 4.9 8.6 9.4 3.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const SIZES = {
  md: "h-control px-6 text-base",
  sm: "h-control-sm px-5 text-sm",
} as const

export type LoadingButtonProps = {
  onAction?: () => unknown
  /** Controlled pending state; when set, the button never shows success/error. */
  pending?: boolean
  type?: "button" | "submit"
  children: string
  pendingLabel?: string
  successLabel?: string
  errorLabel?: string
  resetAfter?: number
  disabled?: boolean
  onError?: (error: unknown) => void
  size?: keyof typeof SIZES
  className?: string
  "data-testid"?: string
}

export function LoadingButton({
  onAction,
  pending: pendingProp,
  type = "button",
  children,
  pendingLabel = children,
  successLabel = "Done",
  errorLabel = "Try again",
  resetAfter = 1400,
  disabled = false,
  onError,
  size = "md",
  className,
  "data-testid": testId,
}: LoadingButtonProps) {
  const reduced = useReducedMotion()

  const internal = useAsyncAction({
    action: () => onAction?.(),
    resetAfter,
    onError,
  })

  const controlled = pendingProp !== undefined
  const status: AsyncActionStatus = controlled
    ? pendingProp
      ? "pending"
      : "idle"
    : internal.status
  const pending = status === "pending"

  const fade = reduced ? INSTANT : TRANSITION

  const label =
    status === "pending"
      ? pendingLabel
      : status === "success"
      ? successLabel
      : status === "error"
      ? errorLabel
      : children

  const faces = [
    { key: "idle", text: children, icon: null },
    {
      key: "pending",
      text: pendingLabel,
      icon: <Spinner still={reduced === true || status !== "pending"} />,
    },
    { key: "success", text: successLabel, icon: <CheckMark /> },
    { key: "error", text: errorLabel, icon: null },
  ]

  return (
    <>
      <motion.button
        type={type}
        disabled={disabled}
        aria-label={label}
        aria-busy={pending || undefined}
        aria-disabled={pending || undefined}
        whileTap={disabled || pending || reduced ? undefined : { scale: 0.98 }}
        transition={SPRING}
        onClick={(event) => {
          if (pending) {
            event.preventDefault()
            return
          }
          if (controlled) {
            onAction?.()
            return
          }
          internal.run()
        }}
        data-testid={testId}
        data-status={status}
        className={clx(
          "relative inline-flex select-none items-center justify-center rounded-control border border-transparent font-bold uppercase tracking-wide",
          "bg-ember text-black transition-colors duration-base ease-premium hover:bg-ember-deep hover:text-bone",
          "data-[status=error]:bg-error data-[status=error]:text-black",
          "disabled:cursor-not-allowed disabled:border-hairline disabled:bg-ink disabled:text-bone/50",
          SIZES[size],
          className
        )}
        style={{ touchAction: "manipulation" }}
      >
        <span aria-hidden className="relative grid place-items-center">
          {faces.map((face) => (
            <motion.span
              key={face.key}
              initial={false}
              animate={
                face.key === status
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 4 }
              }
              transition={fade}
              className="col-start-1 row-start-1 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {face.icon}
              {face.text}
            </motion.span>
          ))}
        </span>
      </motion.button>

      <span role="status" aria-live="polite" className="sr-only">
        {status === "success"
          ? successLabel
          : status === "error"
          ? errorLabel
          : ""}
      </span>
    </>
  )
}

export default LoadingButton
