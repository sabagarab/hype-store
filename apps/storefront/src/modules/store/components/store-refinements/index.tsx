"use client"

import {
  useClearRefinements,
  useCurrentRefinements,
  useInstantSearch,
  useSortBy,
} from "react-instantsearch"

import { priceAttribute } from "@lib/search-client"
import FilterRadioGroup from "@modules/common/components/filter-radio-group"
import FilterSheet from "@modules/store/components/filter-sheet"
import {
  CATEGORY_ATTRIBUTE,
  LABELS_ATTRIBUTE,
  getSortOptions,
} from "./attributes"
import CurrentRefinements from "./current-refinements"
import OnSaleToggle from "./on-sale-toggle"
import OptionRefinements from "./option-refinements"
import PriceRange from "./price-range"
import RefinementGroup from "./refinement-group"

const SortProducts = ({ currencyCode }: { currencyCode: string }) => {
  const items = getSortOptions(currencyCode)
  const { currentRefinement, refine } = useSortBy({ items })

  return (
    <FilterRadioGroup
      title="Sort by"
      items={items}
      value={currentRefinement}
      handleChange={refine}
      data-testid="sort-by-container"
    />
  )
}

/** Every filter group, in the order shown in the sidebar and the sheet. */
const FilterPanel = ({ currencyCode }: { currencyCode: string }) => (
  <>
    <SortProducts currencyCode={currencyCode} />
    <OptionRefinements />
    <PriceRange currencyCode={currencyCode} />
    <OnSaleToggle currencyCode={currencyCode} />
    <RefinementGroup attribute={CATEGORY_ATTRIBUTE} title="Category" />
    <RefinementGroup attribute={LABELS_ATTRIBUTE} title="Labels" />
  </>
)

/** Phones: sticky "Filter & sort" bar and bottom sheet. */
export const StoreFilterSheet = ({
  currencyCode,
}: {
  currencyCode: string
}) => {
  const { items } = useCurrentRefinements()
  const { canRefine: canClear, refine: clearAll } = useClearRefinements()
  const { results } = useInstantSearch()

  // A price range counts once, even with both bounds set.
  const minPrice = priceAttribute("min_price", currencyCode)
  const activeCount = items.reduce(
    (sum, item) =>
      sum + (item.attribute === minPrice ? 1 : item.refinements.length),
    0
  )

  return (
    <FilterSheet
      activeCount={activeCount}
      itemCount={results?.__isArtificial ? null : results?.nbHits ?? null}
      onClear={canClear ? clearAll : undefined}
    >
      <FilterPanel currencyCode={currencyCode} />
    </FilterSheet>
  )
}

/** Desktop: sidebar next to the grid. */
const StoreRefinements = ({ currencyCode }: { currencyCode: string }) => {
  return (
    <aside
      aria-label="Filters"
      className="hidden small:mr-12 small:flex small:w-[240px] small:shrink-0 small:flex-col small:divide-y small:divide-hairline [&>*]:py-6 [&>*:first-child]:pt-0"
    >
      <CurrentRefinements currencyCode={currencyCode} />
      <FilterPanel currencyCode={currencyCode} />
    </aside>
  )
}

export default StoreRefinements
