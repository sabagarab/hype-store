import { Brand } from "@lib/data/brands"
import BlurFade from "@modules/common/components/blur-fade"
import BrandCard from "./brand-card"
import BrandsCarousel from "./carousel"

// From this many brands up, the section is a swipeable carousel; fewer are a
// simple row of large cards so the section never looks half empty.
const CAROUSEL_FROM = 3

// "Shop by brand" on the homepage. Brands without products are already left
// out; with none at all the section isn't rendered.
const BrandsSection = ({ brands }: { brands: Brand[] }) => {
  if (!brands.length) {
    return null
  }

  return (
    <section
      aria-labelledby="brands-heading"
      className="content-container py-12 small:py-20"
    >
      <h2
        id="brands-heading"
        className="mb-6 text-2xl font-black uppercase tracking-tight text-bone small:mb-8 small:text-3xl"
      >
        Shop by brand
      </h2>

      {brands.length >= CAROUSEL_FROM ? (
        <BrandsCarousel brands={brands} />
      ) : (
        <div className="grid grid-cols-1 gap-4 xsmall:grid-cols-2">
          {brands.map((brand, index) => (
            <BlurFade key={brand.id} delay={index * 0.08}>
              <BrandCard
                brand={brand}
                className="small:aspect-[16/10]"
                sizes="(min-width: 512px) 50vw, 100vw"
              />
            </BlurFade>
          ))}
        </div>
      )}
    </section>
  )
}

export default BrandsSection
