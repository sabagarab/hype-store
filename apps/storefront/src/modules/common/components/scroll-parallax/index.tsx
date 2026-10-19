"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { type ReactNode, useRef } from "react"

import { clx } from "@modules/common/components/ui"

// Zoom Parallax from 21st.dev (@efferd/zoom-parallax), reduced to its core:
// a scroll-linked scale driven by the element's own scroll progress. Adapted
// for a single element and calm values: scale, a small vertical shift and an
// optional fade, all transforms/opacity (no layout work), following the
// scroll exactly. The original's sticky 300vh stage and multi-image layout
// are dropped. Reduced motion renders the element still.

type Phase = "exit" | "pass"

// exit: from "top of element at top of screen" until it has scrolled away
// (for things already on screen, like the hero). pass: from entering at the
// bottom until leaving at the top.
const OFFSETS = {
  exit: ["start start", "end start"],
  pass: ["start end", "end start"],
} as const

const ScrollParallax = ({
  children,
  phase = "exit",
  scale = [1, 0.95],
  y = [0, 0],
  opacity = [1, 1],
  className,
}: {
  children: ReactNode
  phase?: Phase
  /** [start, end] values across the scroll range. */
  scale?: [number, number]
  /** Pixels, [start, end]. */
  y?: [number, number]
  opacity?: [number, number]
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: [...OFFSETS[phase]] })

  const scaleValue = useTransform(scrollYProgress, [0, 1], scale)
  const yValue = useTransform(scrollYProgress, [0, 1], y)
  const opacityValue = useTransform(scrollYProgress, [0, 1], opacity)

  return (
    <motion.div
      ref={ref}
      className={clx("will-change-transform", className)}
      style={
        reduced
          ? undefined
          : { scale: scaleValue, y: yValue, opacity: opacityValue }
      }
    >
      {children}
    </motion.div>
  )
}

export default ScrollParallax
