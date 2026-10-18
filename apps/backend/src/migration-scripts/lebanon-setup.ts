import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createServiceZonesWorkflow,
  createShippingOptionsWorkflow,
  createTaxRegionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

// Switches the store to Lebanon + USD. Runs once per database on
// `npx medusa db:migrate`. Additive only: the Europe region and its shipping
// stay as they are. Every step checks for existing data first, so nothing is
// created twice. Prices and the tax rate stay editable in Admin afterwards.

const COUNTRY = "lb"
const CURRENCY = "usd"
const DELIVERY_PRICE = 4 // USD, flat for all of Lebanon. Stored as-is, not in cents.

export default async function lebanonSetup({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // 1. Store default currency: USD (other supported currencies are kept).
  const {
    data: [store],
  } = await query.graph({
    entity: "store",
    fields: ["id", "supported_currencies.currency_code"],
  })

  const otherCurrencies = (store.supported_currencies ?? [])
    .map((c) => c?.currency_code)
    .filter((code): code is string => !!code && code !== CURRENCY)

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          { currency_code: CURRENCY, is_default: true },
          ...otherCurrencies.map((currency_code) => ({
            currency_code,
            is_default: false,
          })),
        ],
      },
    },
  })
  logger.info("Lebanon setup: store default currency is USD")

  // 2. Lebanon region with the system (manual) payment provider, which the
  // storefront labels "Cash on Delivery".
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "countries.iso_2"],
  })

  const existingRegion = regions.find((r) =>
    r.countries?.some((c) => c?.iso_2 === COUNTRY)
  )
  let regionId: string

  if (existingRegion) {
    regionId = existingRegion.id
    logger.info(
      `Lebanon setup: region "${existingRegion.name}" already covers LB`
    )
  } else {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Lebanon",
            currency_code: CURRENCY,
            countries: [COUNTRY],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    })
    regionId = result[0].id
    logger.info("Lebanon setup: created region Lebanon")
  }

  // 3. Tax region, 0% until the rate is confirmed (editable in Admin).
  const { data: taxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id"],
    filters: { country_code: COUNTRY },
  })

  if (taxRegions.length) {
    logger.info("Lebanon setup: tax region LB already exists")
  } else {
    await createTaxRegionsWorkflow(container).run({
      input: [
        {
          country_code: COUNTRY,
          provider_id: "tp_system",
          default_tax_rate: { name: "VAT", code: "VAT", rate: 0 },
        },
      ],
    })
    logger.info("Lebanon setup: created tax region LB at 0%")
  }

  // 4. Lebanon service zone on the existing stock location's shipping set, so
  // the stock already held there can ship to Lebanon.
  const { data: locations } = await query.graph({
    entity: "stock_location",
    fields: [
      "id",
      "name",
      "fulfillment_sets.id",
      "fulfillment_sets.type",
      "fulfillment_sets.service_zones.id",
      "fulfillment_sets.service_zones.geo_zones.country_code",
    ],
  })

  const location = locations[0]
  const shippingSet = location?.fulfillment_sets?.find(
    (set) => set?.type === "shipping"
  )

  if (!location || !shippingSet) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Lebanon setup: no stock location with a shipping fulfillment set found"
    )
  }

  let serviceZoneId = shippingSet.service_zones
    ?.find((zone) =>
      zone?.geo_zones?.some((geo) => geo?.country_code === COUNTRY)
    )
    ?.id

  if (serviceZoneId) {
    logger.info("Lebanon setup: a service zone already covers LB")
  } else {
    const { result } = await createServiceZonesWorkflow(container).run({
      input: {
        data: [
          {
            name: "Lebanon",
            fulfillment_set_id: shippingSet.id,
            geo_zones: [{ type: "country", country_code: COUNTRY }],
          },
        ],
      },
    })
    serviceZoneId = result[0].id
    logger.info(`Lebanon setup: created service zone Lebanon on ${location.name}`)
  }

  // 5. "Delivery" shipping option, flat USD price.
  const { data: existingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id"],
    filters: { service_zone_id: serviceZoneId, name: "Delivery" },
  })

  if (existingOptions.length) {
    logger.info("Lebanon setup: shipping option Delivery already exists")
  } else {
    const { data: profiles } = await query.graph({
      entity: "shipping_profile",
      fields: ["id", "type"],
    })
    const profile = profiles.find((p) => p.type === "default") ?? profiles[0]

    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Delivery",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: serviceZoneId,
          shipping_profile_id: profile.id,
          type: {
            label: "Delivery",
            description: "Delivery across Lebanon.",
            code: "delivery",
          },
          prices: [
            { currency_code: CURRENCY, amount: DELIVERY_PRICE },
            { region_id: regionId, amount: DELIVERY_PRICE },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    })
    logger.info(`Lebanon setup: created shipping option Delivery at $${DELIVERY_PRICE}`)
  }
}
