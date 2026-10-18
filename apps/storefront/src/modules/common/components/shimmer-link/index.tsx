import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

type ShimmerLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
  "data-testid"?: string
}

// Ember call-to-action link with a periodic light sweep. The `shimmer`
// keyframes live in tailwind.config.js; the sweep is hidden with reduced motion.
const ShimmerLink = ({ href, children, className, ...props }: ShimmerLinkProps) => {
  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "relative isolate inline-flex h-12 min-w-[44px] items-center justify-center overflow-hidden rounded-full bg-ember px-8 text-base font-bold uppercase tracking-wide text-black transition-colors duration-200 hover:bg-ember-deep hover:text-bone",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 animate-shimmer bg-gradient-to-r from-transparent via-bone/40 to-transparent motion-reduce:hidden"
      />
      {children}
    </LocalizedClientLink>
  )
}

export default ShimmerLink
