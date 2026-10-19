"use client"

import { motion, useInView } from "motion/react"
import { useRef } from "react"

import { TRANSITION } from "@lib/motion"
import { clx } from "@modules/common/components/ui"

type BlurFadeProps = {
  children: React.ReactNode
  className?: string
  /** Seconds to wait after entering the viewport (use for staggering). */
  delay?: number
  /** Pixels the element rises while fading in. */
  offset?: number
}

// Adapted from Magic UI's BlurFade (https://magicui.design, MIT): fades
// content up into place once it scrolls into view. Adapted: no blur (opacity
// and a small rise only) and the shared TRANSITION instead of its own
// duration/easing. With reduced motion the motion-reduce: overrides pin it to
// its final state (done in CSS so server and client markup match).
const BlurFade = ({
  children,
  className,
  delay = 0,
  offset = 8,
}: BlurFadeProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ y: offset, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: offset, opacity: 0 }}
      transition={{ ...TRANSITION, delay }}
      className={clx(
        "motion-reduce:!transform-none motion-reduce:!opacity-100",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

export default BlurFade
