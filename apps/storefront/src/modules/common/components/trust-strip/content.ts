// Trust strip copy, shown under the hero, under Add to cart, in the cart
// drawer and at the top of checkout. Add, remove or reorder items here; the
// component needs no changes.
//
// `label` is plain text, or a function of the formatted delivery price. Price
// items only appear where a price is passed in: the cart drawer and checkout
// (the end of the flow), never on the hero or product page.

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
