"use client"

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { motion } from "motion/react"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

import { STORE_NAME } from "@lib/constants"
import { Brand } from "@lib/data/brands"
import { Locale } from "@lib/data/locales"
import useToggleState from "@lib/hooks/use-toggle-state"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import LanguageSelect from "../language-select"

type MenuSheetProps = {
  open: boolean
  onClose: () => void
  brands: Brand[]
  locales: Locale[] | null
  currentLocale: string | null
}

// Full-screen glass menu (phones/tablets via "Menu", desktop via "Brands").
// Headless UI's Dialog provides the focus trap, Esc to close, scroll lock and
// focus return. Links stagger in (≤300ms in total); with reduced motion they
// appear at once (CSS overrides, so server and client markup match).
const MenuSheet = ({
  open,
  onClose,
  brands,
  locales,
  currentLocale,
}: MenuSheetProps) => {
  const pathname = usePathname()
  const languageToggleState = useToggleState()

  const links = [
    { label: "Store", href: "/store" },
    ...brands.map((brand) => ({
      label: brand.name,
      href: `/brands/${brand.handle}`,
    })),
    { label: "Delivery & returns", href: "/delivery-returns" },
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
          enter="ease-out duration-200 motion-reduce:duration-0"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150 motion-reduce:duration-0"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
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
                className="-mr-3 flex h-11 w-11 items-center justify-center rounded-full text-bone transition-colors duration-200 hover:text-ember"
                data-testid="close-menu-button"
              >
                <XMark />
              </button>
            </div>

            <nav
              aria-label="Menu"
              className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-10"
            >
              <ul className="flex flex-col gap-y-1">
                {links.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    // Last link starts by 80ms and finishes by 300ms, however
                    // many brands there are.
                    transition={{
                      duration: 0.22,
                      delay: Math.min(index * 0.02, 0.08),
                      ease: "easeOut",
                    }}
                    className="motion-reduce:!transform-none motion-reduce:!opacity-100"
                  >
                    <LocalizedClientLink
                      href={link.href}
                      onClick={onClose}
                      aria-current={isCurrent(link.href) ? "page" : undefined}
                      className={clx(
                        "flex min-h-[44px] items-center py-1 text-4xl font-black uppercase leading-tight tracking-tight transition-colors duration-200 hover:text-ember small:text-6xl",
                        isCurrent(link.href) ? "text-ember" : "text-bone"
                      )}
                    >
                      {link.label}
                    </LocalizedClientLink>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-4 text-sm text-bone/55">
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
                      "transition-transform duration-150",
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
