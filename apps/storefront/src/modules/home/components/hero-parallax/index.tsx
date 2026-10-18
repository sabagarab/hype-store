"use client"

import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import { useRef } from "react"

import FadeInImage from "@modules/common/components/fade-in-image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

export type HeroProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string
}

type HeroParallaxProps = {
  /** Already padded to 15 items (3 rows of 5). Empty disables the parallax. */
  products: HeroProduct[]
  /** Hero header content, rendered above the rows. */
  children: React.ReactNode
}

// Ported from Aceternity UI's Hero Parallax (21st.dev). Rows of product photos
// slide in opposite directions on scroll. Desktop only (small: and up); on
// mobile and with reduced motion only the header renders. Reduced motion is
// handled in CSS (motion-safe:) so server and client markup match.
const HeroParallax = ({ products, children }: HeroParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const enabled = products.length > 0

  const firstRow = products.slice(0, 5)
  const secondRow = products.slice(5, 10)
  const thirdRow = products.slice(10, 15)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const springConfig = { stiffness: 300, damping: 30 }

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  )
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  )
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  )
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  )
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  )
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  )

  return (
    <div
      ref={ref}
      className={clx(
        "relative flex flex-col overflow-hidden",
        enabled &&
          "small:motion-safe:h-[300vh] small:motion-safe:pb-40 small:[perspective:1000px] small:[transform-style:preserve-3d]"
      )}
    >
      {children}
      {enabled && (
        <motion.div
          aria-label="Featured products"
          role="region"
          className="hidden small:motion-safe:block"
          style={{ rotateX, rotateZ, translateY, opacity }}
        >
          <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
            {firstRow.map((product, i) => (
              <ProductCard
                key={`${product.id}-${i}`}
                product={product}
                translate={translateX}
              />
            ))}
          </motion.div>
          <motion.div className="mb-20 flex flex-row space-x-20">
            {secondRow.map((product, i) => (
              <ProductCard
                key={`${product.id}-${i}`}
                product={product}
                translate={translateXReverse}
              />
            ))}
          </motion.div>
          <motion.div className="flex flex-row-reverse space-x-20 space-x-reverse">
            {thirdRow.map((product, i) => (
              <ProductCard
                key={`${product.id}-${i}`}
                product={product}
                translate={translateX}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

const ProductCard = ({
  product,
  translate,
}: {
  product: HeroProduct
  translate: MotionValue<number>
}) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      transition={{ duration: 0.2 }}
      className="group/product relative h-96 w-[30rem] flex-shrink-0 overflow-hidden rounded-large bg-ink"
    >
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="block h-full w-full"
      >
        <FadeInImage
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="480px"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-200 group-hover/product:opacity-70 group-focus-within/product:opacity-70" />
        <h2 className="absolute bottom-4 left-4 text-xl font-bold text-bone opacity-0 transition-opacity duration-200 group-hover/product:opacity-100 group-focus-within/product:opacity-100">
          {product.title}
        </h2>
      </LocalizedClientLink>
    </motion.div>
  )
}

export default HeroParallax
