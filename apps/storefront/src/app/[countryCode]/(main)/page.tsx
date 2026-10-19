import { Metadata } from "next"
import { notFound } from "next/navigation"

import { STORE_NAME } from "@lib/constants"
import { HERO_CONTENT } from "@modules/home/components/hero/content"
import Landing from "@modules/home/landing"
import { getLandingData } from "@modules/home/landing/get-landing-data"

export const metadata: Metadata = {
  title: STORE_NAME,
  description: HERO_CONTENT.subline,
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const data = await getLandingData(countryCode)

  if (!data) {
    notFound()
  }

  return <Landing data={data} />
}
