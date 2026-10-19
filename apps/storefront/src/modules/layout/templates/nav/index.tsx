import { Suspense } from "react"

import { listBrands } from "@lib/data/brands"
import { getLocale } from "@lib/data/locale-actions"
import { listLocales } from "@lib/data/locales"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import NavShell from "@modules/layout/components/nav-shell"
import Search from "@modules/layout/components/search"

// Loads the nav's data (brands for the links and menu, locales) and hands it
// to the client NavShell, which handles the scroll pill and the menu sheet.
export default async function Nav({ countryCode }: { countryCode: string }) {
  const [brands, locales, currentLocale] = await Promise.all([
    // A failure only drops the brand links, never the nav.
    listBrands(countryCode).catch(() => []),
    listLocales(),
    getLocale(),
  ])

  return (
    <NavShell
      brands={brands}
      locales={locales}
      currentLocale={currentLocale}
      search={<Search />}
      cart={
        <Suspense
          fallback={
            <LocalizedClientLink
              className="flex h-11 items-center gap-2 transition-colors duration-200 hover:text-ember"
              href="/cart"
              data-testid="nav-cart-link"
            >
              Cart (0)
            </LocalizedClientLink>
          }
        >
          <CartButton />
        </Suspense>
      }
    />
  )
}
