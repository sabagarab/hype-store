"use client"

import { motion } from "motion/react"

type BlurInTextProps = {
  text: string
  className?: string
  /** Seconds between words. */
  stagger?: number
}

// Word-by-word blur-in reveal, 300ms per word. With reduced motion the
// motion-reduce: overrides pin every word to its final state (done in CSS so
// server and client markup match).
const BlurInText = ({ text, className, stagger = 0.06 }: BlurInTextProps) => {
  const words = text.split(" ")

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block motion-reduce:!transform-none motion-reduce:!opacity-100 motion-reduce:![filter:none]"
          initial={{ opacity: 0, filter: "blur(10px)", y: 8 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: i * stagger }}
        >
          {word}
          {i < words.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </span>
  )
}

export default BlurInText
