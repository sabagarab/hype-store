"use client"

import { motion, useInView, useReducedMotion } from "motion/react"
import { type ReactNode, useRef } from "react"

import { DURATION, EASE_PREMIUM } from "@lib/motion"

// Scroll Reveal from 21st.dev (@cnippet-dev/scroll-reveal): content animates
// in when it enters the viewport. Adapted to the shared motion tokens: one
// "rise" preset (fade + 16px rise, 300ms, ease-premium, no blur), always once
// per page load, and reduced motion shows the final state with no movement.
// `ScrollRevealGroup` + `ScrollRevealItem` stagger children off a single
// trigger (the group entering the screen), so items inside a scroller that
// are still off to the side reveal together with the rest.

const RISE = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

const transitionFor = (reduced: boolean | null, delay = 0) =>
  reduced
    ? { duration: 0 }
    : { duration: DURATION.slow, ease: EASE_PREMIUM, delay }

// Starts a little before the element is fully on screen.
const VIEW = { once: true, margin: "0px 0px -15% 0px" } as const

export function ScrollReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  /** Seconds after entering the screen. */
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, VIEW)
  const reduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={RISE}
      initial="hidden"
      animate={inView || reduced ? "visible" : "hidden"}
      transition={transitionFor(reduced, delay)}
    >
      {children}
    </motion.div>
  )
}

export function ScrollRevealGroup({
  children,
  stagger = 0.05,
  className,
}: {
  children: ReactNode
  /** Seconds between items. */
  stagger?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, VIEW)
  const reduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView || reduced ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduced ? 0 : stagger } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function ScrollRevealItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={RISE}
      transition={transitionFor(reduced)}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
