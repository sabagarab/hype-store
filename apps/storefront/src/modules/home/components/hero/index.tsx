import BlurInText from "@modules/common/components/blur-in-text"
import FadeInImage from "@modules/common/components/fade-in-image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Marquee from "@modules/common/components/marquee"
import ShimmerLink from "@modules/common/components/shimmer-link"
import { clx } from "@modules/common/components/ui"
import HeroParallax, {
  HeroProduct,
} from "@modules/home/components/hero-parallax"
import { HERO_CONTENT } from "./content"

// Fewer products than this and the desktop parallax looks empty; the hero
// falls back to text only.
const PARALLAX_MIN_PRODUCTS = 5
const PARALLAX_SLOTS = 15
const ROW_MIN_PRODUCTS = 3

// Repeat the products in order until all parallax slots are filled.
const fillSlots = (products: HeroProduct[]) =>
  Array.from(
    { length: PARALLAX_SLOTS },
    (_, i) => products[i % products.length]
  )

const Hero = ({ products }: { products: HeroProduct[] }) => {
  const hasParallax = products.length >= PARALLAX_MIN_PRODUCTS
  const hasRow = products.length >= ROW_MIN_PRODUCTS

  return (
    <HeroParallax products={hasParallax ? fillSlots(products) : []}>
      {/* z-10 keeps the text above the desktop parallax rows, which slide out
          from underneath it on scroll. */}
      <section className="relative isolate z-10 flex w-full flex-col overflow-hidden border-b border-bone/10 bg-black">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_20%,rgb(var(--color-ember)/0.28),transparent_60%)]"
        />
        <div
          className={clx(
            "content-container flex flex-col items-start justify-end gap-6 pt-24",
            hasRow ? "min-h-[50svh] pb-10" : "min-h-[70svh] pb-12",
            "small:min-h-[80vh] small:pb-20"
          )}
        >
          <h1 className="max-w-[14ch] text-balance text-5xl font-black uppercase leading-[0.9] tracking-tighter text-bone xsmall:text-6xl small:text-8xl large:text-9xl">
            <BlurInText text={HERO_CONTENT.headline} />
          </h1>
          <p className="text-lg font-light text-bone/75 small:text-2xl">
            {HERO_CONTENT.subline}
          </p>
          <ShimmerLink href={HERO_CONTENT.cta.href} data-testid="hero-cta">
            {HERO_CONTENT.cta.label}
          </ShimmerLink>
        </div>

        {hasRow && (
          // Phones get one drifting row; desktop shows it only when the
          // parallax is off (too few products, or reduced motion).
          <div
            className={clx(
              "pb-10",
              hasParallax && "small:hidden small:motion-reduce:block"
            )}
          >
            <Marquee
              pauseOnHover
              role="region"
              aria-label="Featured products"
              duration="45s"
              gap="0.75rem"
            >
              {products.map((product) => (
                <LocalizedClientLink
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className="relative block aspect-[3/4] w-36 overflow-hidden rounded-large bg-ink small:w-48"
                >
                  <FadeInImage
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1024px) 192px, 144px"
                    className="object-cover"
                  />
                </LocalizedClientLink>
              ))}
            </Marquee>
          </div>
        )}
      </section>
    </HeroParallax>
  )
}

export default Hero
