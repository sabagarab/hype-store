"use client"

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import NumberTicker from "@modules/common/components/number-ticker"
import TrustStrip from "@modules/common/components/trust-strip"
import { clx } from "@modules/common/components/ui"
import { useCartDrawer } from "./context"
import DrawerItem from "./drawer-item"
import useCartProducts from "./use-cart-products"

type CartDrawerProps = {
  cart: HttpTypes.StoreCart | null
  /** Flat price of the region's "Delivery" shipping option, if it loaded. */
  deliveryAmount: number | null
}

const BUTTON_CLASS =
  "flex h-[52px] w-full items-center justify-center rounded-full text-base font-bold uppercase tracking-wide transition-colors duration-200"

// Glass cart drawer from the right (full width on phones). Headless UI's
// Dialog provides the focus trap, Esc/click-outside to close, scroll lock and
// focus return.
const CartDrawer = ({ cart, deliveryAmount }: CartDrawerProps) => {
  const { isOpen, closeCart } = useCartDrawer()
  const items = cart?.items ?? []
  const currencyCode = cart?.currency_code ?? "usd"
  const { lineInfo, hasUnavailable } = useCartProducts(cart)

  const sortedItems = [...items].sort((a, b) =>
    (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
  )

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={closeCart} className="relative z-[80]">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300 motion-reduce:duration-0"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200 motion-reduce:duration-0"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-y-0 right-0 flex w-full xsmall:max-w-[420px]">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300 motion-reduce:duration-0"
            enterFrom="translate-x-full motion-reduce:translate-x-0 motion-reduce:opacity-0"
            enterTo="translate-x-0 motion-reduce:opacity-100"
            leave="ease-in duration-200 motion-reduce:duration-0"
            leaveFrom="translate-x-0 motion-reduce:opacity-100"
            leaveTo="translate-x-full motion-reduce:translate-x-0 motion-reduce:opacity-0"
          >
            <DialogPanel
              className="glass flex h-full w-full flex-col border-l border-bone/10 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
              data-testid="cart-drawer"
            >
              <div className="flex items-center justify-between border-b border-bone/10 px-6 py-3">
                <DialogTitle className="text-lg font-black uppercase tracking-tight text-bone">
                  Cart{items.length > 0 && ` (${items.length})`}
                </DialogTitle>
                <button
                  type="button"
                  onClick={closeCart}
                  aria-label="Close cart"
                  className="-mr-3 flex h-11 w-11 items-center justify-center rounded-full text-bone transition-colors duration-200 hover:text-ember"
                >
                  <XMark />
                </button>
              </div>

              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-y-6 px-6 text-center">
                  <p className="text-xl font-bold text-bone">
                    Your cart is empty
                  </p>
                  <LocalizedClientLink
                    href="/store"
                    onClick={closeCart}
                    className={clx(BUTTON_CLASS, "max-w-xs bg-ember text-black hover:bg-ember-deep hover:text-bone")}
                  >
                    Shop now
                  </LocalizedClientLink>
                </div>
              ) : (
                <>
                  <ul className="flex-1 divide-y divide-bone/10 overflow-y-auto px-6">
                    {sortedItems.map((item) => {
                      const info = lineInfo(item)
                      return (
                        <DrawerItem
                          key={item.id}
                          item={item}
                          currencyCode={currencyCode}
                          brand={info.brand}
                          unavailable={info.unavailable}
                          onNavigate={closeCart}
                        />
                      )
                    })}
                  </ul>

                  <div className="flex flex-col gap-y-3 border-t border-bone/10 px-6 py-5">
                    <div className="flex items-center justify-between text-base">
                      <span className="text-bone/70">Subtotal</span>
                      <NumberTicker
                        value={cart?.item_subtotal ?? cart?.subtotal ?? 0}
                        currencyCode={currencyCode}
                        className="font-bold text-bone"
                      />
                    </div>
                    <TrustStrip
                      deliveryAmount={deliveryAmount}
                      currencyCode={currencyCode}
                      className="gap-x-4 text-xs"
                    />

                    {hasUnavailable && (
                      <p role="alert" className="text-sm font-medium text-ember">
                        Remove unavailable items to continue.
                      </p>
                    )}

                    {hasUnavailable ? (
                      <button
                        type="button"
                        disabled
                        className={clx(BUTTON_CLASS, "cursor-not-allowed border border-ui-border-base bg-ink text-bone/50")}
                        data-testid="cart-drawer-checkout"
                      >
                        Checkout
                      </button>
                    ) : (
                      <LocalizedClientLink
                        href="/checkout?step=address"
                        onClick={closeCart}
                        className={clx(BUTTON_CLASS, "bg-ember text-black hover:bg-ember-deep hover:text-bone")}
                        data-testid="cart-drawer-checkout"
                      >
                        Checkout
                      </LocalizedClientLink>
                    )}
                    <button
                      type="button"
                      onClick={closeCart}
                      className="mx-auto h-11 px-4 text-sm font-medium text-bone/70 underline-offset-4 transition-colors duration-200 hover:text-bone hover:underline"
                    >
                      Continue shopping
                    </button>
                  </div>
                </>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}

export default CartDrawer
