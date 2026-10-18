"use client"

import { motion, useInView } from "motion/react"
import { useRef } from "react"

import { clx } from "@modules/common/components/ui"

type BlurFadeProps = {
  children: React.ReactNode
  className?: string
  /** Seconds to wait after entering the viewport (use for staggering). */
  delay?: number
  /** Seconds; kept at or under 300ms per the design rules. */
  duration?: number
  /** Pixels the element rises while fading in. */
  offset?: number
  blur?: string
}

// Adapted from Magic UI's BlurFade (https://magicui.design, MIT): fades and
// un-blurs content up into place once it scrolls into view. With reduced
// motion the motion-reduce: overrides pin it to its final state (done in CSS
// so server and client markup match).
const BlurFade = ({
  children,
  className,
  delay = 0,
  duration = 0.3,
  offset = 8,
  blur = "6px",
}: BlurFadeProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ y: offset, opacity: 0, filter: `blur(${blur})` }}
      animate={
        isInView
          ? { y: 0, opacity: 1, filter: "blur(0px)" }
          : { y: offset, opacity: 0, filter: `blur(${blur})` }
      }
      transition={{ delay: 0.04 + delay, duration, ease: "easeOut" }}
      className={clx(
        "motion-reduce:!transform-none motion-reduce:!opacity-100 motion-reduce:![filter:none]",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

export default BlurFade
