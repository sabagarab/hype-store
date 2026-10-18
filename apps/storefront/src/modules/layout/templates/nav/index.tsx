import { Suspense } from "react"

import { STORE_NAME } from "@lib/constants"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import Search from "@modules/layout/components/search"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="glass relative mx-auto border-b border-bone/10 pt-[env(safe-area-inset-top)]">
        <nav className="content-container flex items-center justify-between w-full h-14 small:h-16 text-sm font-medium text-bone/80">
          <div className="flex-1 basis-0 h-11 flex items-center">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="flex items-center h-11 px-2 text-xl small:text-2xl font-black uppercase tracking-tight text-bone transition-colors duration-200 hover:text-ember"
              data-testid="nav-store-link"
            >
              {STORE_NAME}
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-4 small:gap-x-6 h-11 flex-1 basis-0 justify-end">
            <Search />
            <div className="hidden small:flex items-center h-full">
              <LocalizedClientLink
                className="flex items-center h-11 transition-colors duration-200 hover:text-ember"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex items-center h-11 gap-2 transition-colors duration-200 hover:text-ember"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
