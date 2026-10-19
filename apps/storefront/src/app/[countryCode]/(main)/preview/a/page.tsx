import { Metadata } from "next"
import { notFound } from "next/navigation"

import { STORE_NAME } from "@lib/constants"
import DirectionA from "@modules/home/landing/direction-a"
import { getLandingData } from "@modules/home/landing/get-landing-data"

// Temporary preview of landing direction A. Delete once a direction is picked.
export const metadata: Metadata = {
  title: `Preview A | ${STORE_NAME}`,
  robots: { index: false, follow: false },
}

export default async function PreviewA(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const data = await getLandingData(countryCode)

  if (!data) {
    notFound()
  }

  return <DirectionA data={data} />
}
