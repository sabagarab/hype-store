import { HttpTypes } from "@medusajs/types"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@modules/common/components/accordion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Measurements, {
  hasMeasurements,
} from "@modules/products/components/measurements"
import { PRODUCT_DELIVERY_CONTENT as DELIVERY } from "./content"

// Product page accordions: Measurements (open by default, since all sales
// are final) and Delivery. No description/details section by design.
const ProductDetails = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const showMeasurements = hasMeasurements(product)

  return (
    <Accordion defaultValue={showMeasurements ? "measurements" : null}>
      {showMeasurements && (
        <AccordionItem value="measurements">
          <AccordionTrigger>Measurements</AccordionTrigger>
          <AccordionContent>
            <Measurements product={product} />
          </AccordionContent>
        </AccordionItem>
      )}
      <AccordionItem value="delivery">
        <AccordionTrigger>{DELIVERY.title}</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-y-2 text-sm text-bone/70">
          {DELIVERY.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <LocalizedClientLink
            href={DELIVERY.link.href}
            className="mt-1 self-start font-medium text-bone underline underline-offset-4 transition-colors duration-base ease-premium hover:text-ember"
          >
            {DELIVERY.link.label}
          </LocalizedClientLink>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ProductDetails
