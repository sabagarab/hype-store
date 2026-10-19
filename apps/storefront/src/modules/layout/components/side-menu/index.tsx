"use client"

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react"
import { ArrowRightMini } from "@medusajs/icons"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

import { STORE_NAME } from "@lib/constants"
import { Brand } from "@lib/data/brands"
import { Locale } from "@lib/data/locales"
import useToggleState from "@lib/hooks/use-toggle-state"
import { instagramUrl, whatsappUrl } from "@lib/social"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MenuToggleIcon from "@modules/common/components/menu-toggle-icon"
import { clx } from "@modules/common/components/ui"
import LanguageSelect from "../language-select"

type MenuSheetProps = {
  open: boolean
  onClose: () => void
  brands: Brand[]
  locales: Locale[] | null
  currentLocale: string | null
}

// Full-screen glass menu (phones/tablets via the menu toggle, desktop via
// "Brands"), after the mobile menu in 21st.dev's Header 1 (@efferd): one
// quiet frosted panel that fades and settles from 97% scale, closed by the
// same toggle glyph in its X state, plain text links. Chosen over hyperiux's Immersive Full
// Screen Navigation, whose GSAP clip-path wipes (1.2s), letter-roll hovers and
// image tiles break the 300ms motion rule and the no-AI-look rule. Instagram
// and WhatsApp show only when lib/social.ts has them. Headless UI's Dialog
// provides the focus trap, Esc to close, scroll lock and focus return.
const MenuSheet = ({
  open,
  onClose,
  brands,
  locales,
  currentLocale,
}: MenuSheetProps) => {
  const pathname = usePathname()
  const languageToggleState = useToggleState()
  const socials = [
    { label: "Instagram", href: instagramUrl() },
    { label: "WhatsApp", href: whatsappUrl() },
  ].filter((social): social is { label: string; href: string } => !!social.href)

  const links = [
    { label: "Store", href: "/store" },
    ...brands.map((brand) => ({
      label: brand.name,
      href: `/brands/${brand.handle}`,
    })),
    { label: "Delivery", href: "/delivery" },
    { label: "Contact", href: "/contact" },
    { label: "Account", href: "/account" },
  ]

  // pathname includes the country prefix, e.g. /lb/store.
  const isCurrent = (href: string) =>
    pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") === href

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-[85]">
        <TransitionChild
          as={Fragment}
          enter="transition ease-premium duration-base motion-reduce:duration-0"
          enterFrom="opacity-0 scale-[0.97] motion-reduce:scale-100"
          enterTo="opacity-100 scale-100"
          leave="transition ease-premium duration-fast motion-reduce:duration-0"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-[0.97] motion-reduce:scale-100"
        >
          <DialogPanel
            className="glass fixed inset-0 flex flex-col overflow-y-auto px-6 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)]"
            data-testid="nav-menu-popup"
          >
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-black uppercase tracking-tight text-bone">
                {STORE_NAME}
              </DialogTitle>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="-mr-2.5 flex h-control-sm w-11 items-center justify-center rounded-control text-bone transition-colors duration-base ease-premium hover:text-ember"
                data-testid="close-menu-button"
              >
                <MenuToggleIcon open className="h-6 w-6" />
              </button>
            </div>

            <nav
              aria-label="Menu"
              className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-10"
            >
              <ul className="flex flex-col gap-y-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <LocalizedClientLink
                      href={link.href}
                      onClick={onClose}
                      aria-current={isCurrent(link.href) ? "page" : undefined}
                      className={clx(
                        "flex min-h-control-sm items-center py-1 text-4xl font-black uppercase leading-tight tracking-tight transition-colors duration-base ease-premium hover:text-ember small:text-6xl",
                        isCurrent(link.href) ? "text-ember" : "text-bone"
                      )}
                    >
                      {link.label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-4 text-sm text-bone/55">
              {socials.length > 0 && (
                <ul className="flex gap-x-6">
                  {socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-control-sm items-center font-medium text-bone transition-colors duration-base ease-premium hover:text-ember"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {locales && locales.length > 1 && (
                <div
                  className="flex justify-between"
                  onMouseEnter={languageToggleState.open}
                  onMouseLeave={languageToggleState.close}
                >
                  <LanguageSelect
                    toggleState={languageToggleState}
                    locales={locales}
                    currentLocale={currentLocale}
                  />
                  <ArrowRightMini
                    className={clx(
                      "transition-transform duration-fast ease-premium",
                      languageToggleState.state ? "-rotate-90" : ""
                    )}
                  />
                </div>
              )}
              <p>
                © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
              </p>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  )
}

export default MenuSheet
