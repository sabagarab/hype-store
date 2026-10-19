"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { useEffect, useId, useRef, useState } from "react"

import { DURATION, EASE_PREMIUM, INSTANT, TRANSITION } from "@lib/motion"

// Command Palette from 21st.dev (@ddoemonn/command-palette): a centred
// overlay with a search field and a keyboard-driven list (arrows, Home/End,
// Enter, Esc). Adapted for store search: results come from the caller
// (InstantSearch) instead of the built-in fuzzy ranking, each row is a real
// link (Enter clicks it), rows are 44px+ with an optional thumbnail, the
// status line is a slot. Tokens: glass panel, hairline border, card radius,
// float shadow, shared TRANSITION instead of springs (instant with reduced
// motion). Mono hit counter and shortcut keys dropped (one font family).
// Phones open it near the top so the keyboard never covers the list. The
// active row is marked in ember. Headless UI's Dialog replaces the original
// hand-rolled layer for the focus trap and scroll lock.

export type PaletteItem = {
  id: string
  label: string
  href: string
  /** Small image shown before the label. */
  media?: React.ReactNode
}

type LinkProps = {
  href: string
  className?: string
  tabIndex?: number
  role?: string
  onClick?: () => void
  children: React.ReactNode
  "data-testid"?: string
}

export function CommandPaletteLayer({
  open,
  onDismiss,
  label,
  children,
}: {
  open: boolean
  onDismiss: () => void
  /** Accessible name of the dialog. */
  label: string
  children: React.ReactNode
}) {
  const reduced = useReducedMotion()
  const transition = reduced ? INSTANT : TRANSITION
  const exit = reduced
    ? INSTANT
    : { duration: DURATION.fast, ease: EASE_PREMIUM }

  // Headless UI's Dialog (static, so the exit animation can play) provides
  // the portal, focus trap, inert page, iOS-safe scroll lock, Esc and
  // outside-click to close, and focus return to the trigger.
  return (
    <AnimatePresence>
      {open && (
        <Dialog static open onClose={onDismiss} className="relative z-[95]">
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition }}
            exit={{ opacity: 0, transition: exit }}
          />
          <div className="fixed inset-0 flex items-start justify-center px-4 pt-[calc(env(safe-area-inset-top)+4.5rem)] small:items-center small:pt-0">
            <DialogPanel className="w-full max-w-[560px]">
              <DialogTitle className="sr-only">{label}</DialogTitle>
              <motion.div
                initial={
                  reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }
                }
                animate={{ opacity: 1, scale: 1, y: 0, transition }}
                exit={
                  reduced
                    ? { opacity: 0, transition: exit }
                    : { opacity: 0, scale: 0.98, y: 4, transition: exit }
                }
              >
                {children}
              </motion.div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

export function CommandPaletteSurface({
  items,
  query,
  onQueryChange,
  status,
  label,
  placeholder,
  linkAs: LinkAs,
  onNavigate,
  onClose,
  "data-testid": dataTestId,
  inputTestId,
  listTestId,
  itemTestId,
}: {
  items: PaletteItem[]
  query: string
  onQueryChange: (value: string) => void
  /** Shown instead of the list: empty, loading, error or no results. */
  status?: React.ReactNode
  label: string
  placeholder: string
  linkAs: React.ComponentType<LinkProps>
  onNavigate: () => void
  onClose: () => void
  "data-testid"?: string
  inputTestId?: string
  listTestId?: string
  itemTestId?: string
}) {
  const uid = useId()
  const reduced = useReducedMotion()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const pointer = useRef({ x: -1, y: -1 })
  const [pinned, setPinned] = useState<string | null>(null)

  const activeId = items.some((item) => item.id === pinned)
    ? pinned
    : items[0]?.id ?? null
  const activeIndex = items.findIndex((item) => item.id === activeId)

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0
  }, [query])

  const reveal = (index: number) => {
    const row = listRef.current?.children[index]
    if (row instanceof HTMLElement) row.scrollIntoView({ block: "nearest" })
  }

  const jump = (index: number) => {
    if (!items.length) return
    const next = Math.max(0, Math.min(items.length - 1, index))
    setPinned(items[next].id)
    reveal(next)
  }

  const move = (delta: number) => {
    if (!items.length) return
    const from = activeIndex < 0 ? 0 : activeIndex
    jump((from + delta + items.length) % items.length)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      move(1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      move(-1)
    } else if (event.key === "Home" && items.length) {
      event.preventDefault()
      jump(0)
    } else if (event.key === "End" && items.length) {
      event.preventDefault()
      jump(items.length - 1)
    } else if (event.key === "Enter" && activeId) {
      event.preventDefault()
      // The row is a real link: clicking it navigates like a tap would.
      document
        .getElementById(`${uid}-${activeId}`)
        ?.querySelector<HTMLAnchorElement>("a")
        ?.click()
    }
  }

  const fade = reduced ? INSTANT : TRANSITION
  const showList = !status && items.length > 0

  return (
    <div
      className="glass w-full overflow-hidden rounded-card border border-hairline shadow-float transition-colors duration-base ease-premium focus-within:border-ember/50"
      data-testid={dataTestId}
    >
      <div className="flex h-14 items-center gap-3 border-b border-hairline pl-4 pr-1">
        <svg
          viewBox="0 0 16 16"
          className="h-4 w-4 shrink-0 text-bone/55"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="4.25" />
          <path d="M10.2 10.2 13.5 13.5" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-label={label}
          aria-expanded={showList}
          aria-controls={`${uid}-list`}
          aria-autocomplete="list"
          aria-activedescendant={
            showList && activeId ? `${uid}-${activeId}` : undefined
          }
          autoComplete="off"
          spellCheck={false}
          value={query}
          placeholder={placeholder}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={onKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent text-base text-bone outline-none placeholder:text-bone/55"
          data-testid={inputTestId}
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="flex h-control-sm w-11 shrink-0 items-center justify-center rounded-control text-bone/70 transition-colors duration-base ease-premium hover:text-bone"
          data-testid="close-search-drawer"
        >
          <XMark />
        </button>
      </div>

      <div className="max-h-[min(60dvh,26rem)] overflow-y-auto overscroll-contain">
        {showList ? (
          <ul
            ref={listRef}
            id={`${uid}-list`}
            role="listbox"
            aria-label={label}
            onMouseDown={(event) => event.preventDefault()}
            className="flex flex-col gap-0.5 p-1.5"
            data-testid={listTestId}
          >
            {items.map((item) => {
              const active = item.id === activeId
              return (
                <li
                  key={item.id}
                  id={`${uid}-${item.id}`}
                  role="option"
                  aria-selected={active}
                  onPointerMove={(event) => {
                    const { x, y } = pointer.current
                    if (event.clientX === x && event.clientY === y) return
                    pointer.current = { x: event.clientX, y: event.clientY }
                    if (!active) setPinned(item.id)
                  }}
                  className="relative"
                >
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{ opacity: active ? 1 : 0 }}
                    transition={fade}
                    className="absolute inset-0 rounded-card bg-bone/10"
                  />
                  {/* Presentational inside the option; Enter and taps still
                      follow the link. */}
                  <LinkAs
                    href={item.href}
                    tabIndex={-1}
                    role="presentation"
                    onClick={onNavigate}
                    className="relative flex min-h-control-sm items-center gap-3 px-2.5 py-2"
                    data-testid={itemTestId}
                  >
                    {item.media}
                    <span
                      className={
                        active
                          ? "line-clamp-2 text-sm font-medium text-ember"
                          : "line-clamp-2 text-sm font-medium text-bone"
                      }
                    >
                      {item.label}
                    </span>
                  </LinkAs>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="px-4 py-8 text-center text-sm text-bone/55">
            {status}
          </div>
        )}
      </div>
    </div>
  )
}
