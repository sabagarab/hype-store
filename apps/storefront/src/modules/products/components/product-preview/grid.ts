// Shared product grid: 2 columns on phones, 3 from 768px, 4 from 1024px.
// Used by every product listing and its loading skeleton.
export const PRODUCT_GRID_CLASS =
  "grid grid-cols-2 md:grid-cols-3 small:grid-cols-4 gap-x-3 gap-y-6 small:gap-x-4 small:gap-y-8"

// Seconds between cards in a row for the scroll-in stagger.
export const revealDelay = (index: number) => (index % 4) * 0.05
