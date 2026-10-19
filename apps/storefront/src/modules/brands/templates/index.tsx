import { Suspense } from "react"

import { OptionValueIds } from "@lib/util/product-option-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"

// One brand's products (a Product Type), same grid and cards as collections.
export default function BrandTemplate({
  brand,
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  brand: { id: string; name: string }
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <aside
        aria-label="Sort"
        className="hidden small:mr-12 small:block small:w-[240px] small:shrink-0"
      >
        <RefinementList sortBy={sort} hideOptionsPicker />
      </aside>
      <div className="w-full min-w-0">
        <h1 className="mb-4 text-3xl font-black uppercase tracking-tight text-bone small:mb-8 small:text-5xl">
          {brand.name}
        </h1>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            typeId={brand.id}
            countryCode={countryCode}
            optionValueIds={optionValueIds}
            filterSheet
          />
        </Suspense>
      </div>
    </div>
  )
}
