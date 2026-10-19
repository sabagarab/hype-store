"use client"

import { motion } from "motion/react"

import { DURATION, EASE_PREMIUM } from "@lib/motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Footer with Minimal Outline from 21st.dev (@scrollxui): link columns, the
// copyright line and a large outlined watermark of the brand name. Adapted:
// brand tokens, Satoshi Black, the watermark is an SVG text stretched to the
// full width so any STORE_NAME fits, and it fades in whole (no stroke drawing)
// on the shared slow duration. The link columns stay put (visible before
// JavaScript loads); the original's column stagger is dropped. With reduced
// motion the watermark is simply shown. Links are 44px tap targets on
// phones; external links open in a new tab.

export type FooterLink = { label: string; href: string; external?: boolean }
export type FooterColumn = { heading: string; links: FooterLink[] }

const VIEW_W = 1000
const VIEW_H = 200

const LINK_CLASS =
  "inline-flex min-h-control-sm items-center text-sm text-bone/70 transition-colors duration-base ease-premium hover:text-ember small:min-h-0 small:py-1"

export default function FooterMinimalOutline({
  brandName,
  columns,
  copyright,
}: {
  brandName: string
  columns: FooterColumn[]
  copyright: string
}) {
  const transition = { duration: DURATION.slow, ease: EASE_PREMIUM }

  return (
    <footer className="relative w-full overflow-hidden border-t border-hairline">
      <div className="content-container flex flex-col">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 small:grid-cols-4 small:py-16"
        >
          {columns.map((column) => (
            <div
              key={column.heading}
              className="flex flex-col gap-y-1 small:gap-y-2"
            >
              <h2 className="mb-1 text-xs font-medium uppercase tracking-widest text-bone/55">
                {column.heading}
              </h2>
              <ul className="flex flex-col">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <LocalizedClientLink
                        href={link.href}
                        className={LINK_CLASS}
                      >
                        {link.label}
                      </LocalizedClientLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Watermark: outlined brand name, fades in whole. */}
        <motion.svg
          aria-hidden="true"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full select-none motion-reduce:!opacity-100"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={transition}
        >
          <text
            x="50%"
            y="54%"
            textAnchor="middle"
            dominantBaseline="middle"
            textLength={VIEW_W - 20}
            lengthAdjust="spacingAndGlyphs"
            fontSize={190}
            fontWeight={900}
            // Stroke first, then fill with the page background: Satoshi's
            // variable glyphs have overlapping contours, and the fill hides
            // those inner lines so only the letters' outer edge shows.
            fill="rgb(var(--color-black))"
            stroke="rgb(var(--color-bone) / 0.4)"
            strokeWidth={2.4}
            paintOrder="stroke"
            className="uppercase"
            style={{ fontFamily: "var(--font-satoshi), sans-serif" }}
          >
            {brandName}
          </text>
        </motion.svg>

        <p className="py-8 text-xs text-bone/55">{copyright}</p>
      </div>
    </footer>
  )
}
