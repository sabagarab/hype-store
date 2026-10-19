"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { INSTANT, TRANSITION } from "@lib/motion"
import { clx } from "@modules/common/components/ui"

// Skeleton Swap from 21st.dev (@ddoemonn/skeleton-swap): holds a reserved
// box and crossfades a skeleton into the real content once it's ready, with
// no layout shift. Adapted for image wells: the box is the (relatively
// positioned) parent, filled edge to edge, instead of a fixed line height;
// the skeleton is one flat ink-toned block instead of text bars. The spring
// and blur are replaced by the shared TRANSITION (opacity only). The delay /
// minimum-visible timing is kept, so cached images never flash a skeleton.

const SHOW_DELAY_MS = 120
const MIN_VISIBLE_MS = 300

export function useSkeletonSwap({
  ready,
  delay = SHOW_DELAY_MS,
  minVisible = MIN_VISIBLE_MS,
}: {
  ready: boolean
  delay?: number
  minVisible?: number
}) {
  const [visible, setVisible] = useState(false)
  const shownAt = useRef(0)

  useEffect(() => {
    if (!ready) {
      if (visible) return
      const t = setTimeout(() => {
        shownAt.current = performance.now()
        setVisible(true)
      }, delay)
      return () => clearTimeout(t)
    }

    if (!visible) return
    const rest = Math.max(0, minVisible - (performance.now() - shownAt.current))
    const t = setTimeout(() => setVisible(false), rest)
    return () => clearTimeout(t)
  }, [ready, visible, delay, minVisible])

  return { showSkeleton: visible }
}

type SkeletonSwapProps = {
  ready: boolean
  children: React.ReactNode
  className?: string
}

export function SkeletonSwap({ ready, children, className }: SkeletonSwapProps) {
  const { showSkeleton } = useSkeletonSwap({ ready })
  const reduced = useReducedMotion()
  const transition = reduced ? INSTANT : TRANSITION

  return (
    <div aria-busy={!ready} className={clx("absolute inset-0", className)}>
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: showSkeleton ? 0 : 1 }}
        transition={transition}
      >
        {children}
      </motion.div>
      <AnimatePresence initial={false}>
        {showSkeleton && (
          <motion.div
            key="skeleton"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-bone/[0.04]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default SkeletonSwap
