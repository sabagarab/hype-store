"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"

import { STORE_NAME } from "@lib/constants"
import { Brand } from "@lib/data/brands"
import { Locale } from "@lib/data/locales"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MenuToggleIcon from "@modules/common/components/menu-toggle-icon"
import {
  NAV_ITEM_CLASS,
  NavBody,
  NavItems,
  Navbar,
  useNavbarScrolled,
} from "@modules/common/components/resizable-navbar"
import { clx } from "@modules/common/components/ui"
import MenuSheet from "@modules/layout/components/side-menu"

// Past this many px of scrolling the bar becomes the floating pill (about
// when the announcement marquee has scrolled away).
const PILL_THRESHOLD = 80
// Desktop shows this many brands inline; more adds a "Brands" link that opens
// the full-screen menu.
const INLINE_BRANDS = 3

// Wiring for the 21st Resizable Navbar: links, the Menu toggle (phones and
// tablets) and the full-screen menu sheet.
const NavShell = ({
  brands,
  locales,
  currentLocale,
  search,
  cart,
}: {
  brands: Brand[]
  locales: Locale[] | null
  currentLocale: string | null
  search: React.ReactNode
  cart: React.ReactNode
}) => {
  const scrolled = useNavbarScrolled(PILL_THRESHOLD)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const inlineBrands = brands.slice(0, INLINE_BRANDS)
  const showBrandsLink = brands.length > INLINE_BRANDS
  const desktopLinks: { label: string; href?: string }[] = [
    { label: "Store", href: "/store" },
    ...inlineBrands.map((brand) => ({
      label: brand.name,
      href: `/brands/${brand.handle}`,
    })),
    ...(showBrandsLink ? [{ label: "Brands" }] : []),
  ]
  const isCurrent = (href: string) =>
    pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") === href

  const wordmark = (
    <LocalizedClientLink
      href="/"
      className="flex h-control-sm items-center px-2 text-xl font-black uppercase tracking-tight text-bone transition-colors duration-base ease-premium hover:text-ember small:text-2xl"
      data-testid="nav-store-link"
    >
      {STORE_NAME}
    </LocalizedClientLink>
  )

  return (
    <>
      <Navbar scrolled={scrolled}>
        <NavBody scrolled={scrolled}>
          {/* Left: Menu (phones/tablets) or wordmark (desktop). */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-label="Menu"
              className="-ml-2.5 flex h-control-sm w-11 items-center justify-center transition-colors duration-base ease-premium hover:text-ember small:hidden"
              data-testid="nav-menu-button"
            >
              <MenuToggleIcon open={false} className="h-6 w-6" />
            </button>
            <div className="hidden small:block">{wordmark}</div>
          </div>

          {/* Center: wordmark (phones/tablets) or inline links (desktop). */}
          <div className="flex items-center justify-center">
            <div className="small:hidden">{wordmark}</div>
            <NavItems
              className="hidden small:flex"
              items={desktopLinks}
              renderItem={(link, { highlight, onMouseEnter, onFocus }) =>
                link.href ? (
                  <LocalizedClientLink
                    href={link.href}
                    onMouseEnter={onMouseEnter}
                    onFocus={onFocus}
                    aria-current={isCurrent(link.href) ? "page" : undefined}
                    className={clx(
                      NAV_ITEM_CLASS,
                      isCurrent(link.href)
                        ? "text-ember"
                        : "text-bone/80 hover:text-ember"
                    )}
                  >
                    {highlight}
                    <span className="whitespace-nowrap">{link.label}</span>
                  </LocalizedClientLink>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    onMouseEnter={onMouseEnter}
                    onFocus={onFocus}
                    aria-haspopup="dialog"
                    className={clx(
                      NAV_ITEM_CLASS,
                      "text-bone/80 hover:text-ember"
                    )}
                  >
                    {highlight}
                    {link.label}
                  </button>
                )
              }
            />
          </div>

          {/* Right: search, account (desktop), cart. */}
          <div className="flex items-center justify-end gap-x-4 small:gap-x-6">
            {search}
            <LocalizedClientLink
              className="hidden h-control-sm items-center transition-colors duration-base ease-premium hover:text-ember small:flex"
              href="/account"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>
            {cart}
          </div>
        </NavBody>
      </Navbar>

      <MenuSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        brands={brands}
        locales={locales}
        currentLocale={currentLocale}
      />
    </>
  )
}

export default NavShell
