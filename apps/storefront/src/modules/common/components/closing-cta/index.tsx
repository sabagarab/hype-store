import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { buttonClass } from "@modules/common/components/button"
import { clx } from "@modules/common/components/ui"

// Worth Keeping CTA from 21st.dev (@ziegfiroyt/cta69): a closing statement
// over a giant, barely visible scrolling phrase. Adapted: brand colors,
// Satoshi Black, the shared Button, the `marquee-half` keyframes in
// tailwind.config.js (paused by the global reduced-motion rule), and no
// badge / note / footnote.

// Copies of the phrase per half, so one half is always wider than the screen
// and the loop never shows a gap.
const REPEATS = 6

const ClosingCta = ({
  heading,
  phrase,
  cta,
  className,
}: {
  heading: string
  /** Scrolls behind the heading. */
  phrase: string
  cta: { label: string; href: string }
  className?: string
}) => {
  const line = `${phrase} · `.repeat(REPEATS)

  return (
    <section
      className={clx(
        "relative w-full overflow-hidden bg-black py-24 small:py-36",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center overflow-hidden"
      >
        <div className="flex w-max shrink-0 animate-marquee-half whitespace-nowrap text-bone/[0.05]">
          {[0, 1].map((copy) => (
            <span
              key={copy}
              className="text-[22vw] font-black uppercase leading-none tracking-tighter small:text-[14vw]"
            >
              {line}
            </span>
          ))}
        </div>
      </div>

      <div className="content-container relative flex flex-col items-center text-center">
        <h2 className="text-balance text-4xl font-black uppercase leading-[0.95] tracking-tight text-bone small:text-7xl">
          {heading}
        </h2>
        <LocalizedClientLink
          href={cta.href}
          className={buttonClass({ className: "mt-10" })}
        >
          {cta.label}
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default ClosingCta
