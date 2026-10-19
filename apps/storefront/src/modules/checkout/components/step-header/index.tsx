"use client"

import { motion, useReducedMotion } from "motion/react"
import React from "react"

import { DURATION, EASE_PREMIUM, INSTANT } from "@lib/motion"
import { clx } from "@modules/common/components/ui"

// Title row of one checkout step: plain type, with an Edit link once the step
// is done. Upcoming steps are dimmed.
export const StepHeader = ({
  title,
  state,
  onEdit,
  editTestId,
}: {
  title: string
  state: "open" | "done" | "upcoming"
  onEdit?: () => void
  editTestId?: string
}) => (
  <div className="flex min-h-control-sm items-center justify-between">
    <h2
      className={clx(
        "text-lg font-bold tracking-tight",
        state === "upcoming" ? "text-bone/55" : "text-bone"
      )}
    >
      {title}
    </h2>
    {state === "done" && onEdit && (
      <button
        type="button"
        onClick={onEdit}
        className="-mr-3 h-11 px-3 text-sm font-medium text-bone/70 underline underline-offset-4 transition-colors duration-fast hover:text-bone"
        data-testid={editTestId}
      >
        Edit
      </button>
    )}
  </div>
)

const HIDDEN = { opacity: 0, y: 4 }
const SHOWN = { opacity: 1, y: 0 }

/**
 * Fades a step's content in when it opens (150ms, instant for reduced
 * motion). Mounting content fades in on mount; content that stays mounted
 * while hidden passes `show` instead.
 */
export const StepFade = ({
  children,
  className,
  show,
}: {
  children: React.ReactNode
  className?: string
  show?: boolean
}) => {
  const reduced = useReducedMotion()
  const controlled = show !== undefined

  return (
    <motion.div
      initial={reduced || controlled ? false : HIDDEN}
      animate={!controlled || show ? SHOWN : HIDDEN}
      transition={
        reduced ? INSTANT : { duration: DURATION.fast, ease: EASE_PREMIUM }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Muted line of a completed step's summary. */
export const SummaryText = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={clx("text-sm text-bone/70", className)} {...props}>
    {children}
  </p>
)

/** One labelled block in a completed step's summary. */
export const SummaryBlock = ({
  label,
  children,
  ...props
}: {
  label: string
  children: React.ReactNode
  "data-testid"?: string
}) => (
  <div className="flex flex-col gap-y-0.5" {...props}>
    <p className="mb-1 text-xs font-medium uppercase tracking-widest text-bone/55">
      {label}
    </p>
    {children}
  </div>
)
