import { Metadata } from "next"
import { notFound } from "next/navigation"

import { STORE_NAME } from "@lib/constants"
import DirectionB from "@modules/home/landing/direction-b"
import { getLandingData } from "@modules/home/landing/get-landing-data"

// Temporary preview of landing direction B. Delete once a direction is picked.
export const metadata: Metadata = {
  title: `Preview B | ${STORE_NAME}`,
  robots: { index: false, follow: false },
}

export default async function PreviewB(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const data = await getLandingData(countryCode)

  if (!data) {
    notFound()
  }

  return <DirectionB data={data} />
}
