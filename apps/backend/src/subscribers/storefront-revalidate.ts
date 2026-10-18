import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import type { Logger } from "@medusajs/framework/types"

// Tells the storefront to drop its cached catalog data when products, stock or
// collections change, so changes made in Admin show up without a deploy or a
// hard refresh. The storefront route is apps/storefront/src/app/api/revalidate.
//
// One Admin save can emit many events, so calls are batched: the first event
// starts a short timer and everything until it fires becomes one request.
// Failures are logged, never thrown, so a storefront outage can't break an
// Admin save or a checkout. The storefront also refreshes every 5 minutes as a
// fallback.

// Must match CATALOG_CACHE_TAGS in apps/storefront/src/lib/data/cookies.ts.
const CATALOG_TAGS = [
  "products",
  "variants",
  "collections",
  "categories",
  "regions",
]

const BATCH_WINDOW_MS = 1000
const REQUEST_TIMEOUT_MS = 5000

let pending: ReturnType<typeof setTimeout> | null = null

async function revalidateStorefront(logger: Logger, trigger: string) {
  const url = process.env.STOREFRONT_URL
  const secret = process.env.STOREFRONT_REVALIDATE_SECRET

  if (!url || !secret) {
    logger.warn(
      "Storefront revalidation skipped: STOREFRONT_URL or STOREFRONT_REVALIDATE_SECRET is not set"
    )
    return
  }

  try {
    const response = await fetch(new URL("/api/revalidate", url), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ tags: CATALOG_TAGS }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (!response.ok) {
      logger.warn(
        `Storefront revalidation failed (${response.status}) after ${trigger}`
      )
      return
    }

    logger.info(`Storefront catalog cache revalidated after ${trigger}`)
  } catch (error) {
    logger.warn(
      `Storefront revalidation request failed after ${trigger}: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

export default async function storefrontRevalidateHandler({
  event,
  container,
}: SubscriberArgs<Record<string, unknown>>) {
  if (pending) {
    return
  }

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  pending = setTimeout(() => {
    pending = null
    void revalidateStorefront(logger, event.name)
  }, BATCH_WINDOW_MS)
}

export const config: SubscriberConfig = {
  event: [
    "product.created",
    "product.updated",
    "product.deleted",
    "product-variant.created",
    "product-variant.updated",
    "product-variant.deleted",
    "product-collection.created",
    "product-collection.updated",
    "product-collection.deleted",
    "product-category.created",
    "product-category.updated",
    "product-category.deleted",
    "inventory-level.created",
    "inventory-level.updated",
    "inventory-level.deleted",
    "reservation-item.created",
    "reservation-item.updated",
    "reservation-item.deleted",
    "region.created",
    "region.updated",
    "region.deleted",
    "order.placed",
    "order.canceled",
  ],
}
