import { Metadata } from "next"
import { notFound } from "next/navigation"

import { STORE_NAME } from "@lib/constants"
import { getBrandByHandle } from "@lib/data/brands"
import { parseOptionValueIds } from "@lib/util/product-option-filters"
import BrandTemplate from "@modules/brands/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<
    Record<string, string | string[] | undefined> & {
      page?: string
      sortBy?: SortOptions
      optionValueIds?: string | string[]
    }
  >
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { handle, countryCode } = await props.params
  const brand = await getBrandByHandle(handle, countryCode)

  if (!brand) {
    notFound()
  }

  return {
    title: `${brand.name} | ${STORE_NAME}`,
    description: `Shop ${brand.name} at ${STORE_NAME}.`,
  }
}

export default async function BrandPage(props: Props) {
  const searchParams = await props.searchParams
  const { handle, countryCode } = await props.params
  const brand = await getBrandByHandle(handle, countryCode)

  if (!brand) {
    notFound()
  }

  return (
    <BrandTemplate
      brand={brand}
      page={searchParams.page}
      sortBy={searchParams.sortBy}
      countryCode={countryCode}
      optionValueIds={parseOptionValueIds(searchParams)}
    />
  )
}
