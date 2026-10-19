"use client"

import { MagnifyingGlass } from "@medusajs/icons"
import { useCallback, useEffect, useRef, useState } from "react"
import type { SearchClient } from "instantsearch.js"
import {
  Configure,
  InstantSearch,
  useHits,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch"

import useSearchSettled from "@lib/hooks/use-search-settled"
import useToggleState from "@lib/hooks/use-toggle-state"
import { PRODUCT_INDEX_NAME, searchClient } from "@lib/search-client"
import {
  CommandPaletteLayer,
  CommandPaletteSurface,
  PaletteItem,
} from "@modules/common/components/command-palette"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HitThumbnail, ProductHit } from "./hit"

const HITS_PER_PAGE = 12
const DEBOUNCE_MS = 250

const SearchPanel = ({
  onNavigate,
  onClose,
}: {
  onNavigate: () => void
  onClose: () => void
}) => {
  const timer = useRef<number | undefined>(undefined)

  const queryHook = useCallback(
    (nextQuery: string, search: (value: string) => void) => {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => search(nextQuery), DEBOUNCE_MS)
    },
    []
  )

  const { query, refine } = useSearchBox({ queryHook })
  const { items } = useHits<ProductHit>()
  const { status: status_, error } = useInstantSearch()
  const { isSettled } = useSearchSettled()

  const [inputValue, setInputValue] = useState(query)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const hasInput = Boolean(inputValue.trim())
  const isPending = inputValue.trim() !== query.trim()
  const hasResults = Boolean(query.trim()) && items.length > 0

  const status = !hasInput ? (
    <p data-testid="search-empty">Start typing to search for products.</p>
  ) : status_ === "error" ? (
    <p className="text-error" data-testid="search-error">
      Couldn&apos;t search products
      {error?.message ? `: ${error.message}` : "."}
    </p>
  ) : !isSettled ? (
    <p data-testid="search-loading">Searching&hellip;</p>
  ) : hasResults && items.some((hit) => hit.handle) ? null : hasResults ? (
    <p data-testid="search-no-results">
      No products found for &quot;{query}&quot;
    </p>
  ) : isPending || !query.trim() ? (
    <p data-testid="search-loading">Searching&hellip;</p>
  ) : (
    <p data-testid="search-no-results">
      No products found for &quot;{query}&quot;
    </p>
  )

  const paletteItems: PaletteItem[] = items.flatMap((hit) =>
    hit.handle
      ? [
          {
            id: hit.objectID,
            label: hit.title ?? "",
            href: `/products/${hit.handle}`,
            media: <HitThumbnail src={hit.thumbnail} />,
          },
        ]
      : []
  )

  return (
    <CommandPaletteSurface
      label="Search products"
      placeholder="Search products"
      query={inputValue}
      onQueryChange={(value) => {
        setInputValue(value)
        refine(value)
      }}
      items={paletteItems}
      status={status}
      linkAs={LocalizedClientLink}
      onNavigate={onNavigate}
      onClose={onClose}
      data-testid="search-drawer"
      inputTestId="search-input"
      listTestId="search-results"
      itemTestId="search-hit-link"
    />
  )
}

const Search = () => {
  const { state: isOpen, open, close } = useToggleState()

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Search products"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="-mx-3 flex h-control-sm w-11 items-center justify-center transition-colors duration-base ease-premium hover:text-ember"
        data-testid="nav-search-button"
      >
        <MagnifyingGlass />
      </button>

      <CommandPaletteLayer
        open={isOpen}
        onDismiss={close}
        label="Search products"
      >
        <InstantSearch
          indexName={PRODUCT_INDEX_NAME}
          searchClient={searchClient as unknown as SearchClient}
          future={{ preserveSharedStateOnUnmount: true }}
        >
          <Configure hitsPerPage={HITS_PER_PAGE} />
          <SearchPanel onNavigate={close} onClose={close} />
        </InstantSearch>
      </CommandPaletteLayer>
    </>
  )
}

export default Search
