import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HERO_CONTENT } from "./content"

const Hero = () => {
  return (
    <section className="relative isolate flex min-h-[70svh] small:min-h-[80vh] w-full items-end overflow-hidden border-b border-bone/10 bg-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_20%,rgb(var(--color-ember)/0.28),transparent_60%)]"
      />
      <div className="content-container flex flex-col items-start gap-6 pb-12 pt-24 small:pb-20">
        <h1 className="max-w-[14ch] text-balance text-5xl font-black uppercase leading-[0.9] tracking-tighter text-bone xsmall:text-6xl small:text-8xl large:text-9xl">
          {HERO_CONTENT.headline}
        </h1>
        <p className="text-lg font-light text-bone/75 small:text-2xl">
          {HERO_CONTENT.subline}
        </p>
        <LocalizedClientLink
          href={HERO_CONTENT.cta.href}
          className="inline-flex h-12 min-w-[44px] items-center justify-center rounded-full bg-ember px-8 text-base font-bold uppercase tracking-wide text-black transition-colors duration-200 hover:bg-ember-deep hover:text-bone"
          data-testid="hero-cta"
        >
          {HERO_CONTENT.cta.label}
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default Hero
