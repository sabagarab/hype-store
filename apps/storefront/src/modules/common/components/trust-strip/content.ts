// Trust strip copy, shown under the hero, under Add to cart, in the cart
// drawer and at the top of checkout. Add, remove or reorder items here; the
// component needs no changes.
//
// `label` is plain text, or a function of the formatted delivery price for
// items that need it (those are hidden until the price is known).

export type TrustIcon = "cash" | "pin" | "truck"

export type TrustItem = {
  id: string
  icon: TrustIcon
  label: string | ((deliveryPrice: string) => string)
}

export const TRUST_STRIP_CONTENT = {
  items: [
    { id: "cod", icon: "cash", label: "Cash on Delivery" },
    { id: "lebanon", icon: "pin", label: "Delivery across Lebanon" },
    {
      id: "delivery-price",
      icon: "truck",
      label: (deliveryPrice) => `${deliveryPrice} flat delivery`,
    },
  ] satisfies TrustItem[],
  /** Shown as a link only when a WhatsApp number is set in lib/social.ts. */
  whatsappLabel: "WhatsApp us",
}
