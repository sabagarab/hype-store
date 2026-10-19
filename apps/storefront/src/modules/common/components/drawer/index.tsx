"use client"

import { Drawer as BaseDrawer } from "@base-ui/react/drawer"
import { XMark } from "@medusajs/icons"
import * as React from "react"

import { clx } from "@modules/common/components/ui"

// Drawer from 21st.dev (@wensity/drawer, Base UI Drawer). A bottom sheet with
// a drag handle and swipe-down to close; Base UI provides the portal, focus
// trap and scroll lock. Adapted to the shared tokens: full-width sheet with the
// card radius on top, ink surface, hairline border, shared timing (300ms in,
// 200ms out, ease-premium), instant for reduced motion. Only the bottom side
// is kept, the title is visible, and header actions and a fixed footer (kept
// out of the scrolling body) are slots. Tabler's X is replaced by Medusa's.

export const Drawer = ({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) => (
  <BaseDrawer.Root
    open={open}
    onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
    swipeDirection="down"
    modal
  >
    {children}
  </BaseDrawer.Root>
)

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

export const DrawerContent = ({
  title,
  headerAction,
  footer,
  children,
}: {
  title: string
  /** Shown next to the title, e.g. a "Clear all" link. */
  headerAction?: React.ReactNode
  /** Stays at the bottom while the body scrolls. */
  footer?: React.ReactNode
  children: React.ReactNode
}) => (
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
        className={clx(
          "fixed inset-x-0 bottom-0 flex max-h-[85dvh] select-none flex-col rounded-t-card border-t border-hairline bg-ink outline-none",
          "pb-[env(safe-area-inset-bottom)]",
          "translate-y-[var(--drawer-swipe-movement-y,0px)]",
          "transition-[translate] duration-slow ease-premium data-[ending-style]:duration-base",
          "data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full",
          "motion-reduce:transition-none"
        )}
      >
        {/* Handle and header sit outside Drawer.Content: Base UI ignores mouse
            drags that start inside Content (kept for text selection). */}
        <div className="flex shrink-0 cursor-grab justify-center pb-1 pt-3 active:cursor-grabbing">
          <span className="h-1 w-10 rounded-full bg-bone/25" />
        </div>

        <div className="flex shrink-0 items-center justify-between gap-x-4 border-b border-hairline px-5 pb-3">
          <BaseDrawer.Title className="text-base font-bold tracking-tight text-bone">
            {title}
          </BaseDrawer.Title>
          <div className="flex items-center gap-x-1">
            {headerAction}
            <BaseDrawer.Close
              aria-label="Close"
              className="-mr-3 flex h-11 w-11 items-center justify-center rounded-full text-bone/70 transition-colors duration-fast hover:text-bone"
            >
              <XMark />
            </BaseDrawer.Close>
          </div>
        </div>

        <BaseDrawer.Content className="relative flex min-h-0 flex-1 flex-col">
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
