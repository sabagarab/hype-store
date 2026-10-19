// Landing page copy (preview directions A and B). Hero copy lives in
// ../components/hero/content.ts; the scrolling brand list in the closing CTA
// comes from the announcement bar's content.ts.
export const LANDING_CONTENT = {
  latestTitle: "Just dropped",
  latestLink: { label: "View all", href: "/store" },
  brandsTitle: "Brands",
  /** Editorial moment: brand name plus this button label. */
  shopBrandLabel: (brand: string) => `Shop ${brand}`,
  closing: {
    heading: "New drops regularly.",
    cta: { label: "Shop now", href: "/store" },
  },
} as const
