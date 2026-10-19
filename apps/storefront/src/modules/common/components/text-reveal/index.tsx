"use client"

import { motion, useInView, useReducedMotion } from "motion/react"
import {
  type ElementType,
  type RefObject,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { DURATION, EASE_PREMIUM } from "@lib/motion"
import { clx } from "@modules/common/components/ui"

// Text Reveal (Mask) from 21st.dev (@soralabs/text-reveal-mask), "lines"
// mode: each rendered line slides up out of a mask. Adapted: shared motion
// timing (300ms per line), plain-string input only, and the unsplit text is
// rendered (invisibly) until lines are measured, so the heading reserves its
// final height and never shifts the page. Reduced motion renders plain text.

const WHITESPACE_RE = /\s+/
const STAGGER = 0.06

type LineGroup = number[]

function groupWordsByLine(measureNode: HTMLDivElement): LineGroup[] {
  const nodes = measureNode.querySelectorAll("[data-measure-word]")
  if (nodes.length === 0) {
    return [[0]]
  }

  const groups: LineGroup[] = []
  let current: LineGroup = []
  let lastTop = -1

  nodes.forEach((node, index) => {
    const top = (node as HTMLElement).offsetTop
    if (lastTop !== -1 && top > lastTop + 1) {
      groups.push(current)
      current = []
    }
    current.push(index)
    lastTop = top
  })

  if (current.length > 0) {
    groups.push(current)
  }

  return groups.length > 0 ? groups : [[0]]
}

function useLineGroups(
  words: string[],
  className: string | undefined,
  containerRef: RefObject<HTMLDivElement | null>
) {
  const measureRef = useRef<HTMLDivElement>(null)
  const [lineGroups, setLineGroups] = useState<LineGroup[] | null>(null)
  const key = `${className ?? ""}:${words.join(" ")}`

  useLayoutEffect(() => {
    const container = containerRef.current
    const measureNode = measureRef.current
    if (!(container && measureNode)) {
      return
    }

    let cancelled = false
    const measure = () => {
      if (cancelled) {
        return
      }
      if (container.clientWidth > 0) {
        measureNode.style.width = `${container.clientWidth}px`
      }
      setLineGroups(groupWordsByLine(measureNode))
    }

    measure()
    document.fonts.ready.then(measure)

    const observer = new ResizeObserver(measure)
    observer.observe(container)

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [containerRef, key])

  const measureLayer = (
    <div
      aria-hidden
      className={clx(
        "pointer-events-none invisible fixed left-[-9999px] top-0 block",
        className
      )}
      ref={measureRef}
    >
      {words.map((word, index) => (
        <span
          className={clx(
            "inline-block",
            index < words.length - 1 && "me-[0.25em]"
          )}
          data-measure-word
          key={index}
        >
          {word}
        </span>
      ))}
    </div>
  )

  return { lineGroups, measureLayer }
}

export type TextRevealProps = {
  text: string
  as?: ElementType
  id?: string
  className?: string
  /** Seconds before the first line starts. */
  delay?: number
}

const TextReveal = ({
  text,
  as: Tag = "p",
  id,
  className,
  delay = 0,
}: TextRevealProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(rootRef, { once: true, margin: "0px 0px -10% 0px" })
  const words = useMemo(() => text.split(WHITESPACE_RE).filter(Boolean), [text])
  const { lineGroups, measureLayer } = useLineGroups(words, className, rootRef)

  if (reduced) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    )
  }

  const ready = lineGroups !== null && lineGroups.length > 0
  const animate = inView && ready

  return (
    <div className="relative w-full" ref={rootRef}>
      {measureLayer}
      <Tag id={id} aria-label={text} className={clx("block", className)}>
        {ready ? (
          lineGroups.map((group, lineIndex) => (
            <span key={lineIndex} className="block overflow-hidden" aria-hidden>
              <motion.span
                className="block will-change-transform"
                initial={{ y: "110%" }}
                animate={{ y: animate ? "0%" : "110%" }}
                transition={{
                  duration: DURATION.slow,
                  delay: delay + lineIndex * STAGGER,
                  ease: EASE_PREMIUM,
                }}
              >
                {group.map((wordIndex) => (
                  <span
                    key={wordIndex}
                    className={clx(
                      "inline-block",
                      wordIndex < words.length - 1 && "me-[0.25em]"
                    )}
                  >
                    {words[wordIndex]}
                  </span>
                ))}
              </motion.span>
            </span>
          ))
        ) : (
          // Reserves the final height until lines are measured.
          <span className="invisible" aria-hidden>
            {text}
          </span>
        )}
      </Tag>
    </div>
  )
}

export default TextReveal
