import { Metadata } from "next"

import { STORE_NAME } from "@lib/constants"
import InfoPage from "@modules/content/templates/info-page"
import { DELIVERY_RETURNS_CONTENT as CONTENT } from "./content"

export const metadata: Metadata = {
  title: `${CONTENT.title} | ${STORE_NAME}`,
  robots: CONTENT.indexable ? undefined : { index: false },
}

export default function DeliveryReturnsPage() {
  return <InfoPage title={CONTENT.title} paragraphs={CONTENT.paragraphs} />
}
