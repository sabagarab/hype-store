import { buttonClass } from "@modules/common/components/button"
import BrandGrid from "@modules/common/components/brand-grid"
import ClosingCta from "@modules/common/components/closing-cta"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ScrollRevealImage from "@modules/common/components/scroll-reveal-image"
import TextReveal from "@modules/common/components/text-reveal"
import { clx } from "@modules/common/components/ui"
import { HERO_CONTENT } from "@modules/home/components/hero/content"
import { ANNOUNCEMENT_CONTENT } from "@modules/layout/components/announcement-bar/content"
import ProductTile from "@modules/products/components/product-tile"
import { LANDING_CONTENT as COPY } from "./content"
import { LandingData, unusedBrandImage } from "./get-landing-data"
import SectionHeading from "./section-heading"

// Direction A, "Drop Feed": a type-led hero, then the newest products in a
// grid straight away (StockX / END.). One strong moment: the editorial image
// that opens up as you scroll.
const DirectionA = ({ data }: { data: LandingData }) => {
  const { heroProducts, latest, brands } = data

  // Photos already on the page (grid + brand tiles); the editorial image
  // must be a different one.
  const used = new Set(
    [
      ...latest.map((product) => product.thumbnail),
      ...brands.map((brand) => brand.image),
    ].filter((url): url is string => !!url)
  )
  const editorial = brands
    .map((brand) => ({
      brand,
      image: unusedBrandImage(brand, [...heroProducts, ...latest], used),
    }))
    .find((entry) => entry.image)

  // Only full rows: 2 per row on phones, 4 on desktop (fewer than 4 items
  // use that many columns instead).
  const count = latest.length
  const phoneShown = count >= 2 ? count - (count % 2) : count
  const desktopShown = count > 4 ? count - (count % 4) : count
  const desktopCols =
    count >= 4
      ? "small:grid-cols-4"
      : count === 3
      ? "small:grid-cols-3"
      : "small:grid-cols-2"

  return (
    <>
      <section className="content-container pb-10 pt-10 small:pb-16 small:pt-20">
        <TextReveal
          as="h1"
          text={HERO_CONTENT.headline}
          className="max-w-[14ch] text-5xl font-black uppercase leading-[0.9] tracking-tighter text-bone xsmall:text-6xl small:text-8xl large:text-9xl"
        />
        <p className="mt-5 text-lg font-light text-bone/75 small:text-2xl">
          {HERO_CONTENT.subline}
        </p>
        <LocalizedClientLink
          href={HERO_CONTENT.cta.href}
          className={buttonClass({ className: "mt-8" })}
        >
          {HERO_CONTENT.cta.label}
        </LocalizedClientLink>
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
          <ul
            className={clx(
              "grid grid-cols-2 gap-x-3 gap-y-8 small:gap-x-6",
              desktopCols
            )}
          >
            {latest.map((product, i) => (
              <li
                key={product.id}
                className={clx(
                  i >= phoneShown && "hidden",
                  i >= phoneShown && i < desktopShown && "small:block",
                  i < phoneShown && i >= desktopShown && "small:hidden"
                )}
              >
                <ProductTile
                  product={product}
                  sizes={count >= 4 ? "(min-width: 1024px) 25vw, 50vw" : "(min-width: 1024px) 33vw, 50vw"}
                  priority={i < 2}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {brands.length > 0 && (
        <section
          aria-labelledby="brands-heading"
          className="content-container pb-16 small:pb-24"
        >
          <SectionHeading id="brands-heading" title={COPY.brandsTitle} />
          <BrandGrid
            items={brands.map((brand) => ({
              id: brand.id,
              name: brand.name,
              href: `/brands/${brand.handle}`,
              image: brand.image,
            }))}
          />
        </section>
      )}

      {editorial?.image && (
        <section aria-labelledby="editorial-heading" className="pb-16 small:pb-24">
          <div className="content-container">
            <ScrollRevealImage
              src={editorial.image}
              alt={editorial.brand.name}
              className="aspect-[4/5] small:aspect-[16/9]"
            />
            <div className="mt-6 flex flex-col items-start gap-6 small:flex-row small:items-end small:justify-between">
              <h2
                id="editorial-heading"
                className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-bone small:text-6xl"
              >
                {editorial.brand.name}
              </h2>
              <LocalizedClientLink
                href={`/brands/${editorial.brand.handle}`}
                className={buttonClass({ variant: "secondary" })}
              >
                {COPY.shopBrandLabel(editorial.brand.name)}
              </LocalizedClientLink>
            </div>
          </div>
        </section>
      )}

      <ClosingCta
        heading={COPY.closing.heading}
        phrase={ANNOUNCEMENT_CONTENT.brands.join(" · ")}
        cta={COPY.closing.cta}
      />
    </>
  )
}

export default DirectionA
