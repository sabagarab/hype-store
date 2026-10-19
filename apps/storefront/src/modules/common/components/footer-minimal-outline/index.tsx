"use client"

import { motion } from "motion/react"

import { DURATION, EASE_PREMIUM } from "@lib/motion"
import BrandMark from "@modules/common/components/brand-mark"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Footer with Minimal Outline from 21st.dev (@scrollxui): link columns, the
// copyright line and a large watermark. Adapted: brand tokens, the watermark
// is the 1OF1 mark (faint bone) with the name small beneath it instead of the
// outlined text, and it fades in whole on the shared slow duration. The link
// columns stay put (visible before JavaScript loads); the original's column
// stagger is dropped. With reduced
// motion the watermark is simply shown. Links are 44px tap targets on
// phones; external links open in a new tab.

export type FooterLink = { label: string; href: string; external?: boolean }
export type FooterColumn = { heading: string; links: FooterLink[] }

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

        {/* Watermark: the brand mark, large, fading in whole, with the
            name small beneath it. */}
        <motion.div
          aria-hidden="true"
          className="flex select-none flex-col items-center gap-y-4 py-6 motion-reduce:!opacity-100"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={transition}
        >
          <BrandMark className="h-auto w-[min(60vw,22rem)] text-bone/20" />
          <span className="text-sm font-black uppercase tracking-[0.3em] text-bone/55">
            {brandName}
          </span>
        </motion.div>

        <p className="py-8 text-xs text-bone/55">{copyright}</p>
      </div>
    </footer>
  )
}
