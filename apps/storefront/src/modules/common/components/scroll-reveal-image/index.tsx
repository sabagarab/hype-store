"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import FadeInImage from "@modules/common/components/fade-in-image"
import { useRef } from "react"

import { clx } from "@modules/common/components/ui"

// Scroll Reveal Image from 21st.dev (@unlumen/scroll-reveal-image): as it
// scrolls into view the image opens up to full width while the photo inside
// zooms out. Adapted for phones: the opening is a clip-path inset instead of
// an animated width (no layout work per frame), the zoom is a transform, the
// end radius is the card token, and reduced motion shows the final frame.
const ScrollRevealImage = ({
  src,
  alt,
  sizes = "100vw",
  className,
}: {
  src: string
  alt: string
  sizes?: string
  /** Size the box here (e.g. aspect ratio); the image fills it. */
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  })

  const spring = { stiffness: 120, damping: 40, mass: 0.6 }
  const inset = useSpring(useTransform(scrollYProgress, [0, 0.8], [14, 0]), spring)
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.8], [1.25, 1]), spring)
  const clipPath = useTransform(inset, (v) => `inset(0% ${v}% round 16px)`)

  return (
    <motion.div
      ref={ref}
      className={clx("relative w-full overflow-hidden rounded-card", className)}
      style={reduced ? undefined : { clipPath }}
    >
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { scale }}
      >
        <FadeInImage src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </motion.div>
    </motion.div>
  )
}

export default ScrollRevealImage
