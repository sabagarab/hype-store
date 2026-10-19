// Copy for the product page's "Delivery" accordion. Edit text here only.
// No delivery price on the product page (it appears in the cart drawer and
// at checkout), and no returns: all sales are final.
export const PRODUCT_DELIVERY_CONTENT = {
  title: "Delivery",
  paragraphs: [
    "Delivery across Lebanon.",
    "Cash on Delivery: pay when your order arrives.",
    "All sales are final. Check measurements before ordering.",
  ],
  link: { label: "Delivery info", href: "/delivery" },
} as const
