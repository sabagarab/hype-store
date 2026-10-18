"use client"

import { motion, useInView } from "motion/react"
import { useId, useRef, useState } from "react"

// Adapted from Aceternity UI's Text Hover Effect (https://ui.aceternity.com,
// MIT). Changes: ember gradient instead of the rainbow, Satoshi Black, the
// text stretches to the full width (fits any STORE_NAME), unique SVG ids, and
// the outline draws in once (~1.5s, the footer's "wow" exception to the 300ms
// rule) when the footer scrolls into view instead of on page load. With
// reduced motion the outline is shown complete (CSS override, so server and
// client markup match). Devices without hover get plain big solid text.
const VIEW_W = 1000
const VIEW_H = 200

const FooterWordmark = ({ text }: { text: string }) => {
  const id = useId().replace(/:/g, "")
  const svgRef = useRef<SVGSVGElement>(null)
  const inView = useInView(svgRef, { once: true, margin: "-80px" })
  const [hovered, setHovered] = useState(false)
  const [mask, setMask] = useState({ cx: "50%", cy: "50%" })

  const textProps = {
    x: "50%",
    y: "54%",
    textAnchor: "middle" as const,
    dominantBaseline: "middle" as const,
    textLength: VIEW_W - 20,
    lengthAdjust: "spacingAndGlyphs" as const,
    fontSize: 190,
    fontWeight: 900,
    // Stroke first, then fill with the page background: Satoshi's variable
    // glyphs have overlapping contours, and the fill hides those inner lines
    // so only the letters' outer edge shows (hence the doubled stroke widths).
    fill: "rgb(var(--color-black))",
    paintOrder: "stroke" as const,
    style: { fontFamily: "var(--font-satoshi), sans-serif" },
    className: "uppercase",
  }

  return (
    <div aria-hidden="true" className="select-none">
      {/* Touch / no-hover devices: big solid text, no effect. */}
      <p className="text-center text-[22vw] font-black uppercase leading-none tracking-tight text-bone [@media(hover:hover)]:hidden">
        {text}
      </p>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="hidden w-full [@media(hover:hover)]:block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          setMask({
            cx: `${((e.clientX - rect.left) / rect.width) * 100}%`,
            cy: `${((e.clientY - rect.top) / rect.height) * 100}%`,
          })
        }}
      >
        <defs>
          <linearGradient id={`${id}-ember`} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgb(var(--color-ember))" />
            <stop offset="70%" stopColor="rgb(var(--color-ember))" />
            <stop offset="100%" stopColor="rgb(var(--color-ember-deep))" />
          </linearGradient>
          <radialGradient
            id={`${id}-reveal`}
            gradientUnits="userSpaceOnUse"
            r="22%"
            cx={mask.cx}
            cy={mask.cy}
          >
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>
          <mask id={`${id}-mask`}>
            <rect x="0" y="0" width="100%" height="100%" fill={`url(#${id}-reveal)`} />
          </mask>
        </defs>

        {/* Brighter outline while hovered. */}
        <text
          {...textProps}
          stroke="rgb(var(--color-bone))"
          strokeWidth={1.2}
          style={{
            ...textProps.style,
            opacity: hovered ? 0.35 : 0,
            transition: "opacity 200ms",
          }}
        >
          {text}
        </text>

        {/* Base outline: draws in once when the footer comes into view. */}
        <motion.text
          {...textProps}
          stroke="rgb(var(--color-bone) / 0.5)"
          strokeWidth={1.2}
          initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
          animate={inView ? { strokeDashoffset: 0 } : undefined}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="uppercase motion-reduce:![stroke-dashoffset:0]"
        >
          {text}
        </motion.text>

        {/* Ember glow around the cursor. */}
        <text
          {...textProps}
          stroke={`url(#${id}-ember)`}
          strokeWidth={3}
          mask={`url(#${id}-mask)`}
          style={{
            ...textProps.style,
            opacity: hovered ? 1 : 0,
            transition: "opacity 200ms",
          }}
        >
          {text}
        </text>
      </svg>
    </div>
  )
}

export default FooterWordmark
