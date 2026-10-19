import { listProductsWithSort } from "@lib/data/products"
import BlurFade from "@modules/common/components/blur-fade"
import {
  PRODUCT_GRID_CLASS,
  revealDelay,
} from "@modules/products/components/product-preview/grid"
import { getRegion } from "@lib/data/regions"
import { OptionValueIds } from "@lib/util/product-option-filters"
import ProductPreview from "@modules/products/components/product-preview"
import ListingFilterSheet from "@modules/store/components/listing-filter-sheet"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  type_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  typeId,
  productsIds,
  countryCode,
  optionValueIds,
  filterSheet = false,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  /** Product Type id: the brand pages list one brand's products. */
  typeId?: string
  productsIds?: string[]
  countryCode: string
  optionValueIds?: OptionValueIds
  /** Show the phone "Filter & sort" bar (sort only) above the grid. */
  filterSheet?: boolean
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (typeId) {
    queryParams["type_id"] = [typeId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
    optionValueIds,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      {filterSheet && (
        <ListingFilterSheet
          sortBy={sortBy ?? "created_at"}
          count={count}
          hideOptionsPicker
        />
      )}
      <ul
        className={`${PRODUCT_GRID_CLASS} w-full`}
        data-testid="products-list"
      >
        {products.map((p, i) => {
          return (
            <li key={p.id}>
              <BlurFade delay={revealDelay(i)}>
                <ProductPreview product={p} region={region} />
              </BlurFade>
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
