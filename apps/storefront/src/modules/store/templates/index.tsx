"use client"

import type { SearchClient } from "instantsearch.js"
import { Configure, InstantSearch } from "react-instantsearch"

import { PRODUCT_INDEX_NAME, searchClient } from "@lib/search-client"
import StoreHits from "@modules/store/components/store-hits"
import StoreRefinements, {
  StoreFilterSheet,
} from "@modules/store/components/store-refinements"
import StoreSearchBox from "@modules/store/components/store-search-box"

const PRODUCT_LIMIT = 12

const StoreTemplate = ({ currencyCode }: { currencyCode: string }) => {
  return (
    <div className="py-6 content-container" data-testid="category-container">
      <h1
        className="mb-4 text-3xl font-black uppercase tracking-tight text-bone small:mb-8 small:text-5xl"
        data-testid="store-page-title"
      >
        All products
      </h1>

      <InstantSearch
        indexName={PRODUCT_INDEX_NAME}
        searchClient={searchClient as unknown as SearchClient}
        routing
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <Configure hitsPerPage={PRODUCT_LIMIT} />
        <div className="flex flex-col small:flex-row small:items-start">
          <StoreRefinements currencyCode={currencyCode} />
          <div className="w-full min-w-0">
            <StoreFilterSheet currencyCode={currencyCode} />
            {/* Phones search from the nav; the store search box is desktop only. */}
            <div className="hidden small:block">
              <StoreSearchBox />
            </div>
            <StoreHits
              hitsPerPage={PRODUCT_LIMIT}
              currencyCode={currencyCode}
            />
          </div>
        </div>
      </InstantSearch>
    </div>
  )
}

export default StoreTemplate
