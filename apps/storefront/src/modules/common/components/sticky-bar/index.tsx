"use client"

import { motion, useReducedMotion } from "motion/react"

import { INSTANT, TRANSITION } from "@lib/motion"
import { clx } from "@modules/common/components/ui"

// Sliding bar from 21st.dev (@ddoemonn/hide-on-scroll, its bar). 21st has no
// dedicated sticky buy bar; this keeps Hide On Scroll's slide-away bar and
// pins it to the bottom of the viewport. Visibility is driven by the caller
// (`show`) instead of scroll direction. Adapted to the shared tokens: glass,
// hairline top border, glass shadow, safe-area padding, shared motion timing.
const StickyBar = ({
  show,
  children,
  className,
  "data-testid": testId,
}: {
  show: boolean
  children: React.ReactNode
  className?: string
  "data-testid"?: string
}) => {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={false}
      animate={{ y: show ? 0 : "110%" }}
      transition={reduced ? INSTANT : TRANSITION}
      aria-hidden={!show || undefined}
      inert={!show || undefined}
      className={clx(
        "glass fixed inset-x-0 bottom-0 z-50 flex items-center gap-x-3 border-t border-hairline px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-glass",
        className
      )}
      data-testid={testId}
    >
      {children}
    </motion.div>
  )
}

export default StickyBar
