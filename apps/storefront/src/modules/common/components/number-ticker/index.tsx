"use client"

import { useMotionValue, useReducedMotion, useSpring } from "motion/react"
import { useEffect, useRef } from "react"

import { convertToLocale } from "@lib/util/money"
import { clx } from "@modules/common/components/ui"

type NumberTickerProps = {
  value: number
  currencyCode: string
  className?: string
}

// Adapted from Magic UI's NumberTicker (https://magicui.design, MIT). Changes:
// starts at the current value and only animates when the value changes (no
// count-up from 0 on mount), formats as currency, and jumps straight to the
// new value with reduced motion. The first render is the plain formatted
// value, so server and client markup match.
const NumberTicker = ({ value, currencyCode, className }: NumberTickerProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const motionValue = useMotionValue(value)
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 400 })

  useEffect(() => {
    if (reduceMotion) {
      springValue.jump(value)
      motionValue.jump(value)
    } else {
      motionValue.set(value)
    }
  }, [value, reduceMotion, motionValue, springValue])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = convertToLocale({
            amount: Math.round(latest * 100) / 100,
            currency_code: currencyCode,
          })
        }
      }),
    [springValue, currencyCode]
  )

  return (
    <span ref={ref} className={clx("inline-block tabular-nums", className)}>
      {convertToLocale({ amount: value, currency_code: currencyCode })}
    </span>
  )
}

export default NumberTicker
