"use client"

import FilterSheet from "@modules/store/components/filter-sheet"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

/**
 * Phones: the "Filter & sort" bar and sheet for listings that filter through
 * the URL (brand pages). The sheet holds the same RefinementList as the
 * desktop sidebar; `count` comes from the server-rendered product list.
 */
const ListingFilterSheet = ({
  sortBy,
  count,
  hideOptionsPicker,
}: {
  sortBy: SortOptions
  count: number
  hideOptionsPicker?: boolean
}) => (
  <FilterSheet activeCount={0} itemCount={count}>
    <RefinementList sortBy={sortBy} hideOptionsPicker={hideOptionsPicker} />
  </FilterSheet>
)

export default ListingFilterSheet
