"use client"

import { motion, useMotionTemplate, useMotionValue } from "motion/react"
import { useCallback, useEffect } from "react"

import { clx } from "@modules/common/components/ui"

type MagicCardProps = {
  children?: React.ReactNode
  className?: string
  /** Diameter in px of the glow that follows the cursor. */
  gradientSize?: number
}

// Adapted from Magic UI's MagicCard (https://magicui.design, MIT), "gradient"
// mode only: an ember border highlight plus a faint ember glow that follow the
// cursor. Theme switching (next-themes) and the "orb" mode are dropped; colors
// come from the brand tokens. The glow only shows on devices with a real
// hover (not touch) and is hidden with reduced motion.
const MagicCard = ({
  children,
  className,
  gradientSize = 220,
}: MagicCardProps) => {
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)

  // Park the gradient outside the card so nothing glows.
  const reset = useCallback(() => {
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }, [mouseX, mouseY, gradientSize])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  // Clear the glow when the pointer leaves the window or the tab is hidden.
  useEffect(() => {
    const handleGlobalPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) reset()
    }
    const handleVisibility = () => {
      if (document.visibilityState !== "visible") reset()
    }

    window.addEventListener("pointerout", handleGlobalPointerOut)
    window.addEventListener("blur", reset)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      window.removeEventListener("pointerout", handleGlobalPointerOut)
      window.removeEventListener("blur", reset)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [reset])

  const borderBackground = useMotionTemplate`
    linear-gradient(rgb(var(--color-ink)) 0 0) padding-box,
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
      rgb(var(--color-ember)),
      rgb(var(--color-ember-deep) / 0.6),
      rgb(var(--color-bone) / 0.08) 100%
    ) border-box
  `
  const glowBackground = useMotionTemplate`
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
      rgb(var(--color-ember) / 0.18),
      transparent 100%
    )
  `

  return (
    <motion.div
      className={clx(
        "group/magic relative isolate overflow-hidden border border-transparent",
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{ background: borderBackground }}
    >
      <div className="relative z-10 h-full w-full">{children}</div>
      <motion.div
        aria-hidden="true"
        suppressHydrationWarning
        className="pointer-events-none absolute inset-0 z-20 hidden rounded-[inherit] opacity-0 transition-opacity duration-300 [@media(hover:hover)]:block [@media(hover:hover)]:group-hover/magic:opacity-100 motion-reduce:!hidden"
        style={{ background: glowBackground }}
      />
    </motion.div>
  )
}

export default MagicCard
