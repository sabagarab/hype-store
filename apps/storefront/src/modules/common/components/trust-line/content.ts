// Reassurance copy, the single source for this text. The product page shows
// the items as one plain line under Add to cart; the cart drawer and checkout
// show delivery as a summary row instead. Add or reorder items here.
export const TRUST_CONTENT = {
  items: ["Cash on Delivery", "Delivery across Lebanon"],
  separator: " · ",
  /** Summary row label in the cart drawer and checkout. */
  deliveryLabel: "Delivery",
  /** Shown in the delivery row when the price can't be read yet. */
  deliveryPending: "Added at checkout",
} as const
