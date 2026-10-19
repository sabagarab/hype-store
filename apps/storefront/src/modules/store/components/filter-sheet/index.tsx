"use client"

import React, { useState } from "react"

import Button from "@modules/common/components/button"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@modules/common/components/drawer"
import { clx } from "@modules/common/components/ui"

export const itemsLabel = (count: number) =>
  `${count} ${count === 1 ? "item" : "items"}`

/** Heading of one filter group; shows a count only when something is selected. */
export const FilterSection = ({
  title,
  selected = 0,
  children,
  className,
}: {
  title: string
  selected?: number
  children: React.ReactNode
  className?: string
}) => (
  <section className={clx("flex flex-col gap-y-3", className)}>
    <h3 className="text-xs font-medium uppercase tracking-widest text-bone/55">
      {title}
      {selected > 0 && <span className="text-bone"> ({selected})</span>}
    </h3>
    {children}
  </section>
)

/** Toggle pill for an option value, styled like the product page size pills. */
export const FilterPill = ({
  selected,
  onClick,
  children,
  ...props
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  "data-testid"?: string
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={clx(
      "flex h-11 min-w-[56px] items-center justify-center gap-x-1.5 rounded-control border px-4 text-sm font-medium transition-colors duration-fast",
      selected
        ? "border-bone bg-bone/10 text-bone"
        : "border-bone/25 text-bone/80 hover:border-bone/60 hover:text-bone"
    )}
    {...props}
  >
    {children}
  </button>
)

/**
 * Phones: a slim sticky bar above the grid ("Filter & sort" with the active
 * count, item count on the right) that opens the filters in a bottom sheet.
 * The sheet's button shows the live result count and closes it.
 */
const FilterSheet = ({
  activeCount,
  itemCount,
  onClear,
  children,
}: {
  activeCount: number
  /** Null while the count isn't known yet. */
  itemCount: number | null
  /** Clears every filter; the link only shows when filters are on. */
  onClear?: () => void
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const label = `Filter & sort${activeCount > 0 ? ` (${activeCount})` : ""}`

  return (
    <div className="sticky top-[calc(env(safe-area-inset-top)+4.5rem)] z-30 -mx-6 mb-4 border-y border-hairline bg-black/80 px-6 backdrop-blur-md supports-[not(backdrop-filter:blur(0))]:bg-black small:hidden">
      <Drawer open={open} onOpenChange={setOpen}>
        <div className="flex h-12 items-center justify-between">
          <DrawerTrigger
            className="-ml-2 flex h-11 items-center px-2 text-sm font-bold text-bone"
            data-testid="filter-sheet-trigger"
          >
            {label}
          </DrawerTrigger>
          {itemCount !== null && (
            <span className="text-sm text-bone/70" data-testid="item-count">
              {itemsLabel(itemCount)}
            </span>
          )}
        </div>
        <DrawerContent
          title="Filter & sort"
          headerAction={
            onClear &&
            activeCount > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="h-11 px-2 text-sm font-medium text-bone/70 underline underline-offset-4 transition-colors duration-fast hover:text-bone"
                data-testid="clear-refinements"
              >
                Clear all
              </button>
            )
          }
          footer={
            <Button
              className="w-full"
              onClick={() => setOpen(false)}
              data-testid="show-items-button"
            >
              {itemCount === null ? "Show items" : `Show ${itemsLabel(itemCount)}`}
            </Button>
          }
        >
          <div className="flex flex-col divide-y divide-hairline [&>*]:py-5">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default FilterSheet
