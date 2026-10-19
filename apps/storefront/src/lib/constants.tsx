import { Cash } from "@medusajs/icons"
import React from "react"

/* Map of payment provider_id to the title and icon shown at checkout. Only
providers enabled on the storefront's regions are offered, so this store
(Lebanon) shows Cash on Delivery only. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  // Medusa's system (manual) provider: payment is collected on delivery and
  // captured in Admin.
  pp_system_default: {
    title: "Cash on Delivery",
    icon: <Cash />,
  },
}

// This only checks if it is native stripe or medusa payments for card payments, it ignores the other stripe-based providers
export const isStripeLike = (providerId?: string) => {
  return (
    providerId?.startsWith("pp_stripe_") || providerId?.startsWith("pp_medusa-")
  )
}

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}
export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]

// Store brand name (1OF1). Change it here only; never hard-code it.
export const STORE_NAME = "1OF1"
