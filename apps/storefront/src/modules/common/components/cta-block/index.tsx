import { buttonClass } from "@modules/common/components/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

// Call to action from 21st.dev (@tommyjepsen/call-to-action): a contained
// block with a heading and actions. Adapted: one solid ember panel with card
// radius, Satoshi Black heading in black, a single action using the shared
// Button (inverted for contrast on ember), no badge, body copy or icons.
const CtaBlock = ({
  heading,
  cta,
  className,
}: {
  heading: string
  cta: { label: string; href: string }
  className?: string
}) => (
  <section className={clx("content-container py-16 small:py-24", className)}>
    <div className="flex flex-col items-start gap-8 rounded-card bg-ember px-6 py-12 small:flex-row small:items-end small:justify-between small:p-16">
      <h2 className="max-w-[12ch] text-balance text-5xl font-black uppercase leading-[0.9] tracking-tight text-black small:text-7xl">
        {heading}
      </h2>
      <LocalizedClientLink
        href={cta.href}
        className={buttonClass({ variant: "inverted" })}
      >
        {cta.label}
      </LocalizedClientLink>
    </div>
  </section>
)

export default CtaBlock
