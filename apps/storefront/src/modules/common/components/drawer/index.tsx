"use client"

import { Drawer as BaseDrawer } from "@base-ui/react/drawer"
import { XMark } from "@medusajs/icons"
import * as React from "react"

import useMediaQuery, { DESKTOP_QUERY } from "@lib/hooks/use-media-query"
import { clx } from "@modules/common/components/ui"

// Drawer from 21st.dev (@wensity/drawer, Base UI Drawer). A bottom sheet with
// a drag handle and swipe-down to close; Base UI provides the portal, focus
// trap and scroll lock. Adapted to the shared tokens: glass surface (solid ink
// fallback), card radius, hairline border, shared timing (300ms in, 200ms
// out, ease-premium), instant for reduced motion. The title is visible, and
// header actions and a fixed footer (kept out of the scrolling body) are
// slots. Tabler's X is replaced by Medusa's. Added: `responsive` keeps the
// bottom sheet on phones and becomes a right-hand side panel (swipe right to
// close) from the desktop breakpoint.

type Side = "bottom" | "right"

const SideContext = React.createContext<Side>("bottom")

export const Drawer = ({
  open,
  onOpenChange,
  responsive = false,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Bottom sheet on phones, side panel on desktop. */
  responsive?: boolean
  children: React.ReactNode
}) => {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const side: Side = responsive && isDesktop ? "right" : "bottom"

  return (
    <SideContext.Provider value={side}>
      <BaseDrawer.Root
        open={open}
        onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
        swipeDirection={side === "right" ? "right" : "down"}
        modal
      >
        {children}
      </BaseDrawer.Root>
    </SideContext.Provider>
  )
}

export const DrawerTrigger = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseDrawer.Trigger>) => (
  <BaseDrawer.Trigger className={className} {...props}>
    {children}
  </BaseDrawer.Trigger>
)

export const DrawerClose = BaseDrawer.Close

const POPUP_SIDE: Record<Side, string> = {
  bottom: clx(
    // Rides above the on-screen keyboard (Base UI sets the inset).
    "inset-x-0 bottom-[var(--drawer-keyboard-inset,0px)] max-h-[85dvh] rounded-t-card border-t shadow-glass",
    "pb-[env(safe-area-inset-bottom)]",
    "translate-y-[var(--drawer-swipe-movement-y,0px)]",
    "data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full"
  ),
  right: clx(
    "inset-y-0 right-0 h-full w-full max-w-[420px] border-l",
    "pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]",
    "translate-x-[var(--drawer-swipe-movement-x,0px)]",
    "data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full"
  ),
}

export const DrawerContent = ({
  title,
  headerAction,
  footer,
  closeLabel = "Close",
  children,
  "data-testid": dataTestId,
}: {
  title: React.ReactNode
  /** Accessible name of the X button, e.g. "Close cart". */
  closeLabel?: string
  /** Shown next to the title, e.g. a "Clear all" link. */
  headerAction?: React.ReactNode
  /** Stays at the bottom while the body scrolls. */
  footer?: React.ReactNode
  children: React.ReactNode
  "data-testid"?: string
}) => {
  const side = React.useContext(SideContext)

  return (
    <BaseDrawer.Portal>
      <BaseDrawer.Backdrop
        className={clx(
          "fixed inset-0 z-[90] bg-black/60",
          "transition-opacity duration-slow ease-premium data-[ending-style]:duration-base",
          "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none"
        )}
      />
      <BaseDrawer.Viewport className="fixed inset-0 z-[90] outline-none">
        <BaseDrawer.Popup
          data-testid={dataTestId}
          className={clx(
            "glass fixed flex select-none flex-col border-hairline outline-none",
            "transition-transform duration-slow ease-premium data-[ending-style]:duration-base",
            "data-[swiping]:transition-none motion-reduce:transition-none",
            POPUP_SIDE[side]
          )}
        >
          {/* Handle and header sit outside Drawer.Content: Base UI ignores
              mouse drags that start inside Content (kept for text selection). */}
          {side === "bottom" ? (
            <div className="flex shrink-0 cursor-grab justify-center pb-1 pt-3 active:cursor-grabbing">
              <span className="h-1 w-10 rounded-control bg-bone/25" />
            </div>
          ) : (
            <div className="h-3 shrink-0" />
          )}

          <div className="flex shrink-0 items-center justify-between gap-x-4 border-b border-hairline px-5 pb-3">
            <BaseDrawer.Title className="text-base font-bold tracking-tight text-bone">
              {title}
            </BaseDrawer.Title>
            <div className="flex items-center gap-x-1">
              {headerAction}
              <BaseDrawer.Close
                aria-label={closeLabel}
                className="-mr-3 flex h-control-sm w-11 items-center justify-center rounded-control text-bone/70 transition-colors duration-fast ease-premium hover:text-bone"
                data-testid="close-modal-button"
              >
                <XMark />
              </BaseDrawer.Close>
            </div>
          </div>

          <BaseDrawer.Content className="relative flex min-h-0 flex-1 select-text flex-col">
            <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain px-5">
              {children}
            </div>

            {footer && (
              <div className="shrink-0 border-t border-hairline px-5 py-4">
                {footer}
              </div>
            )}
          </BaseDrawer.Content>
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  )
}
