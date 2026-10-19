"use client"

import { motion, useInView, useReducedMotion } from "motion/react"
import { useRef } from "react"

import { DURATION, EASE_PREMIUM } from "@lib/motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

// Flip Links from 21st.dev (@vaib215/flip-links): huge type links whose
// letters roll up to a second copy on hover. Pure CSS. Adapted: Satoshi
// Black, bone with an ember second copy, shared timing, the roll only on
// devices that hover (taps just navigate), and each word is its own clipped
// box so long brand names can wrap on phones. Each word also rises out of
// its box once when the list scrolls into view (the Text Reveal mask
// pattern), which is the movement phones get. Reduced motion keeps
// everything still.

const LETTER =
  "inline-block transition-transform duration-slow ease-premium motion-reduce:transition-none"

const FlipWord = ({
  word,
  offset,
  revealed,
  revealDelay,
  instant,
}: {
  word: string
  offset: number
  revealed: boolean
  revealDelay: number
  instant: boolean
}) => (
  <span className="relative inline-block overflow-hidden align-top">
    <motion.span
      className="block"
      initial={{ y: "110%" }}
      animate={{ y: revealed ? "0%" : "110%" }}
      transition={
        instant
          ? { duration: 0 }
          : { duration: DURATION.slow, ease: EASE_PREMIUM, delay: revealDelay }
      }
    >
      <span className="block">
        {word.split("").map((letter, i) => (
          <span
            key={i}
            className={clx(
              LETTER,
              "[@media(hover:hover)]:group-hover/flip:-translate-y-[110%] motion-reduce:!translate-y-0"
            )}
            style={{ transitionDelay: `${(offset + i) * 15}ms` }}
          >
            {letter}
          </span>
        ))}
      </span>
      <span className="absolute inset-0 block text-ember motion-reduce:hidden">
        {word.split("").map((letter, i) => (
          <span
            key={i}
            className={clx(
              LETTER,
              "translate-y-[110%] [@media(hover:hover)]:group-hover/flip:translate-y-0"
            )}
            style={{ transitionDelay: `${(offset + i) * 15}ms` }}
          >
            {letter}
          </span>
        ))}
      </span>
    </motion.span>
  </span>
)

// Seconds between words in the scroll reveal.
const WORD_STAGGER = 0.05

const FlipLink = ({
  children,
  href,
  revealed,
  startIndex,
  instant,
}: {
  children: string
  href: string
  revealed: boolean
  instant: boolean
  /** Words before this link, for a continuous stagger down the list. */
  startIndex: number
}) => {
  const words = children.split(" ")
  let offset = 0

  return (
    <LocalizedClientLink
      href={href}
      aria-label={children}
      className="group/flip block text-[12vw] font-black uppercase leading-[0.9] tracking-tight text-bone small:text-8xl"
    >
      <span aria-hidden className="flex flex-wrap gap-x-[0.25em]">
        {words.map((word, i) => {
          const start = offset
          offset += word.length
          return (
            <FlipWord
              key={i}
              word={word}
              offset={start}
              revealed={revealed}
              revealDelay={(startIndex + i) * WORD_STAGGER}
              instant={instant}
            />
          )
        })}
      </span>
    </LocalizedClientLink>
  )
}

const FlipLinks = ({
  links,
  className,
}: {
  links: { label: string; href: string }[]
  className?: string
}) => {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" })
  const reduced = useReducedMotion()
  const revealed = inView || !!reduced
  let words = 0

  return (
    <nav
      ref={ref}
      className={clx("flex flex-col gap-y-4 small:gap-y-6", className)}
    >
      {links.map((link) => {
        const startIndex = words
        words += link.label.split(" ").length
        return (
          <FlipLink
            key={link.href}
            href={link.href}
            revealed={revealed}
            startIndex={startIndex}
            instant={!!reduced}
          >
            {link.label}
          </FlipLink>
        )
      })}
    </nav>
  )
}

export default FlipLinks
