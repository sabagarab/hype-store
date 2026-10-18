"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"
import { listProducts } from "./products"

// Brands are Product Types in Admin (Type = brand, Categories = garment kind).
export type Brand = {
  id: string
  name: string
  /** Optional short name for small screens (Type metadata "short_name"). */
  shortName: string | null
  handle: string
  /** Photo of the brand's newest product, if it has one. */
  image: string | null
}

// "Fear of God Essentials" -> "fear-of-god-essentials"
const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const listProductTypes = async () => {
  // Cached with the catalog's "products" tag, so product changes in Admin
  // refresh it on demand (plus the 5-minute fallback).
  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ product_types: HttpTypes.StoreProductType[] }>(
      "/store/product-types",
      {
        query: { fields: "id,value,metadata", limit: 100 },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_types }) => product_types)
}

/**
 * Brands that have at least one published product, each with its newest
 * product's photo.
 */
export const listBrands = async (countryCode: string): Promise<Brand[]> => {
  const types = await listProductTypes()

  const brands = await Promise.all(
    types.map(async (type): Promise<Brand | null> => {
      const {
        response: { products },
      } = await listProducts({
        countryCode,
        queryParams: { type_id: [type.id], limit: 1, order: "-created_at" },
      })

      const newest = products[0]
      if (!newest) {
        return null
      }

      const shortName = type.metadata?.short_name
      return {
        id: type.id,
        name: type.value,
        shortName:
          typeof shortName === "string" && shortName.trim() ? shortName : null,
        handle: slugify(type.value),
        image: newest.thumbnail || newest.images?.[0]?.url || null,
      }
    })
  )

  return brands.filter((brand): brand is Brand => brand !== null)
}

/**
 * The brand whose name slugifies to `handle`, or null (also for brands with
 * no published products, so their pages 404 like an unknown handle).
 */
export const getBrandByHandle = async (
  handle: string,
  countryCode: string
): Promise<Brand | null> => {
  const brands = await listBrands(countryCode)
  return brands.find((brand) => brand.handle === handle) ?? null
}
