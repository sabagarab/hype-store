import FadeInImage from "@modules/common/components/fade-in-image"

import { buttonClass } from "@modules/common/components/button"
import {
  Carousel,
  CarouselContent,
  CarouselPagination,
  CarouselSlide,
} from "@modules/common/components/carousel"
import CtaBlock from "@modules/common/components/cta-block"
import FlipLinks from "@modules/common/components/flip-links"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import LookbookCarousel from "@modules/common/components/lookbook-carousel"
import ScrollParallax from "@modules/common/components/scroll-parallax"
import {
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from "@modules/common/components/scroll-reveal"
import SnapCarousel from "@modules/common/components/snap-carousel"
import TextReveal from "@modules/common/components/text-reveal"
import { HERO_CONTENT } from "@modules/home/components/hero/content"
import ProductTile from "@modules/products/components/product-tile"
import { LANDING_CONTENT as COPY } from "./content"
import { LandingData, unusedBrandImage } from "./get-landing-data"
import SectionHeading from "./section-heading"

// Homepage ("Lookbook"): the hero is a swipeable run of the "hero"
// collection photos (Kith / Aime Leon Dore), products follow in a swipe
// rail, brands are set as huge type, then a lookbook panel and a closing
// block. Motion: the headline and section titles unmask once, the hero
// photos ease back as you scroll past, everything else rises in once.
const Landing = ({ data }: { data: LandingData }) => {
  const { heroProducts, latest, brands } = data

  // Lookbook photos must differ from the ones already on the page (hero
  // swipe + product rail).
  const used = new Set(
    [...heroProducts, ...latest]
      .map((product) => product.thumbnail)
      .filter((url): url is string => !!url)
  )
  const lookbook = brands.flatMap((brand) => {
    const image = unusedBrandImage(brand, [...heroProducts, ...latest], used)
    return image ? [{ brand, image }] : []
  })

  return (
    <>
      <section className="pb-12 pt-10 small:pb-20 small:pt-16">
        <div className="content-container">
          <TextReveal
            as="h1"
            text={HERO_CONTENT.headline}
            className="max-w-[16ch] text-[2.75rem] font-black uppercase leading-[0.9] tracking-tighter text-bone xsmall:text-6xl small:text-8xl"
          />
          <p className="mt-4 text-base font-light text-bone/75 small:text-2xl">
            {HERO_CONTENT.subline}
          </p>
        </div>

        {heroProducts.length > 0 ? (
          <Carousel
            label="Featured products"
            slideCount={heroProducts.length}
            className="content-container mt-8"
          >
            {/* Eases back and fades slightly as you scroll past (scroll-linked). */}
            <ScrollParallax scale={[1, 0.94]} y={[0, 40]} opacity={[1, 0.7]}>
              <CarouselContent>
                {heroProducts.map((product, i) => (
                  <CarouselSlide
                    key={product.id}
                    index={i}
                    total={heroProducts.length}
                    className="basis-[86%] xsmall:basis-[60%] small:basis-[38%]"
                  >
                    <LocalizedClientLink
                      href={`/products/${product.handle}`}
                      className="group/hero block"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-ink">
                        <div className="absolute inset-0 transition-transform duration-slow ease-premium [@media(hover:hover)]:group-hover/hero:scale-[1.03] motion-reduce:transform-none">
                          <FadeInImage
                            src={
                              (product.thumbnail || product.images?.[0]?.url) ??
                              ""
                            }
                            alt={product.title}
                            fill
                            priority={i === 0}
                            sizes="(min-width: 1024px) 38vw, (min-width: 512px) 60vw, 86vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <p className="mt-3 truncate text-sm font-medium text-bone">
                        {product.title}
                      </p>
                    </LocalizedClientLink>
                  </CarouselSlide>
                ))}
              </CarouselContent>
            </ScrollParallax>
            <div className="mt-4 flex items-center justify-between gap-4">
              <CarouselPagination />
              <LocalizedClientLink
                href={HERO_CONTENT.cta.href}
                className={buttonClass({ className: "ms-auto" })}
              >
                {HERO_CONTENT.cta.label}
              </LocalizedClientLink>
            </div>
          </Carousel>
        ) : (
          <div className="content-container mt-8">
            <LocalizedClientLink
              href={HERO_CONTENT.cta.href}
              className={buttonClass()}
            >
              {HERO_CONTENT.cta.label}
            </LocalizedClientLink>
          </div>
        )}
      </section>

      {latest.length > 0 && (
        <section
          aria-labelledby="latest-heading"
          className="content-container pb-16 small:pb-24"
        >
          <SectionHeading
            id="latest-heading"
            title={COPY.latestTitle}
            link={COPY.latestLink}
          />
          <ScrollRevealGroup>
            <SnapCarousel label={COPY.latestTitle}>
              {latest.map((product) => (
                <ScrollRevealItem key={product.id}>
                  <ProductTile
                    product={product}
                    sizes="(min-width: 1024px) 25vw, 62vw"
                  />
                </ScrollRevealItem>
              ))}
            </SnapCarousel>
          </ScrollRevealGroup>
        </section>
      )}

      {brands.length > 0 && (
        <section
          aria-labelledby="brands-heading"
          className="content-container pb-16 small:pb-24"
        >
          <SectionHeading id="brands-heading" title={COPY.brandsTitle} />
          <FlipLinks
            links={brands.map((brand) => ({
              label: brand.name,
              href: `/brands/${brand.handle}`,
            }))}
          />
        </section>
      )}

      {lookbook.length > 0 && (
        <section className="content-container pb-8 small:pb-12">
          <LookbookCarousel
            slides={lookbook.map(({ brand, image }) => ({
              id: brand.id,
              title: brand.name,
              image,
              cta: {
                label: COPY.shopBrandLabel(brand.name),
                href: `/brands/${brand.handle}`,
              },
            }))}
          />
        </section>
      )}

      <ScrollReveal>
        <CtaBlock heading={COPY.closing.heading} cta={COPY.closing.cta} />
      </ScrollReveal>
    </>
  )
}

export default Landing
