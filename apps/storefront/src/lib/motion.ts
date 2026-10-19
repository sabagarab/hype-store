// Shared motion tokens for motion/react. Mirrors the Tailwind tokens
// (duration-fast/base/slow, ease-premium) so CSS and JS animations match.
// Every 21st component is adapted to use these instead of its own springs.

export const DURATION = {
  fast: 0.15,
  base: 0.2,
  slow: 0.3,
} as const

export const EASE_PREMIUM: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Default UI transition: short, decelerating, no bounce. */
export const TRANSITION = {
  duration: DURATION.base,
  ease: EASE_PREMIUM,
} as const

/** Snappy spring for presses and small state changes. */
export const SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.5,
} as const

/** Use instead of any transition when the user prefers reduced motion. */
export const INSTANT = { duration: 0 } as const
