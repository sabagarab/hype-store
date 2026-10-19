"use client"

import { LayoutGroup, MotionConfig, motion } from "motion/react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { STORE_NAME } from "@lib/constants"
import { Brand } from "@lib/data/brands"
import { Locale } from "@lib/data/locales"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import MenuSheet from "@modules/layout/components/side-menu"

// Past this many px of scrolling the bar becomes the floating pill (about
// when the announcement marquee has scrolled away).
const PILL_THRESHOLD = 80
// Desktop shows this many brands inline; more adds a "Brands" link that opens
// the full-screen menu.
const INLINE_BRANDS = 3

const LINK_BASE =
  "relative flex h-11 items-center px-4 text-sm font-medium transition-colors duration-200"

// Adapted from Aceternity UI's Resizable Navbar (https://ui.aceternity.com,
// MIT): the bar shrinks into a floating, rounded glass pill on scroll, and
// desktop links share a sliding hover highlight. Changes: brand tokens, a
// CSS transition (~250ms, none with reduced motion) instead of springs, state
// only flips when crossing the threshold, and phones/tablets get a Menu
// button with a full-screen sheet instead of the original dropdown.
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
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > PILL_THRESHOLD)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const inlineBrands = brands.slice(0, INLINE_BRANDS)
  const showBrandsLink = brands.length > INLINE_BRANDS
  const desktopLinks = [
    { label: "Store", href: "/store" },
    ...inlineBrands.map((brand) => ({
      label: brand.name,
      href: `/brands/${brand.handle}`,
    })),
  ]
  const isCurrent = (href: string) =>
    pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") === href

  const highlight = (index: number) =>
    hovered === index && (
      <motion.span
        layoutId="nav-hover"
        className="absolute inset-0 -z-10 rounded-full bg-ink"
        transition={{ type: "spring", bounce: 0, duration: 0.25 }}
      />
    )

  const wordmark = (
    <LocalizedClientLink
      href="/"
      className="flex h-11 items-center px-2 text-xl font-black uppercase tracking-tight text-bone transition-colors duration-200 hover:text-ember small:text-2xl"
      data-testid="nav-store-link"
    >
      {STORE_NAME}
    </LocalizedClientLink>
  )

  return (
    <>
      {/* Transparent outer strip lets clicks through around the pill. The
          pill's gap from the top is padding here: a margin on the header
          would collapse through this sticky wrapper and disappear. */}
      <div
        className={clx(
          "pointer-events-none sticky inset-x-0 top-0 z-50 transition-[padding] duration-[250ms] ease-out motion-reduce:transition-none",
          scrolled && "pt-[calc(env(safe-area-inset-top)+0.75rem)]"
        )}
      >
        <header
          className={clx(
            "glass pointer-events-auto mx-auto transition-[max-width,border-radius,box-shadow,padding] duration-[250ms] ease-out motion-reduce:transition-none",
            scrolled
              ? "max-w-[calc(100%-1.5rem)] rounded-full border border-bone/10 shadow-[0_8px_32px_rgba(0,0,0,0.45)] small:max-w-[880px]"
              : "max-w-full rounded-none border-b border-bone/10 pt-[env(safe-area-inset-top)]"
          )}
          data-scrolled={scrolled || undefined}
        >
          <nav
            aria-label="Main"
            className={clx(
              "grid w-full grid-cols-[1fr_auto_1fr] items-center text-sm font-medium text-bone/80 transition-[height] duration-[250ms] motion-reduce:transition-none",
              scrolled ? "h-[52px] px-3 small:px-5" : "h-14 px-6 small:h-16",
              !scrolled && "mx-auto max-w-[1440px]"
            )}
          >
            {/* Left: Menu (phones/tablets) or wordmark (desktop). */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={menuOpen}
                className="flex h-11 min-w-[44px] items-center transition-colors duration-200 hover:text-ember small:hidden"
                data-testid="nav-menu-button"
              >
                Menu
              </button>
              <div className="hidden small:block">{wordmark}</div>
            </div>

            {/* Center: wordmark (phones/tablets) or inline links (desktop). */}
            <div className="flex items-center justify-center">
              <div className="small:hidden">{wordmark}</div>
              <MotionConfig reducedMotion="user">
                <LayoutGroup id="nav-links">
                  <ul
                    className="hidden items-center small:flex"
                    onMouseLeave={() => setHovered(null)}
                  >
                    {desktopLinks.map((link, index) => (
                      <li key={link.href} className="relative isolate">
                        <LocalizedClientLink
                          href={link.href}
                          onMouseEnter={() => setHovered(index)}
                          onFocus={() => setHovered(index)}
                          aria-current={isCurrent(link.href) ? "page" : undefined}
                          className={clx(
                            LINK_BASE,
                            isCurrent(link.href)
                              ? "text-ember"
                              : "text-bone/80 hover:text-ember"
                          )}
                        >
                          {highlight(index)}
                          <span className="whitespace-nowrap">{link.label}</span>
                        </LocalizedClientLink>
                      </li>
                    ))}
                    {showBrandsLink && (
                      <li className="relative isolate">
                        <button
                          type="button"
                          onClick={() => setMenuOpen(true)}
                          onMouseEnter={() => setHovered(desktopLinks.length)}
                          onFocus={() => setHovered(desktopLinks.length)}
                          aria-haspopup="dialog"
                          className={clx(LINK_BASE, "text-bone/80 hover:text-ember")}
                        >
                          {highlight(desktopLinks.length)}
                          Brands
                        </button>
                      </li>
                    )}
                  </ul>
                </LayoutGroup>
              </MotionConfig>
            </div>

            {/* Right: search, account (desktop), cart. */}
            <div className="flex items-center justify-end gap-x-4 small:gap-x-6">
              {search}
              <LocalizedClientLink
                className="hidden h-11 items-center transition-colors duration-200 hover:text-ember small:flex"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
              {cart}
            </div>
          </nav>
        </header>
      </div>

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
