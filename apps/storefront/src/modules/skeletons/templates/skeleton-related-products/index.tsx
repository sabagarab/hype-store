import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { PRODUCT_GRID_CLASS } from "@modules/products/components/product-preview/grid"

const SkeletonRelatedProducts = () => {
  return (
    <div className="product-page-constraint">
      <div className="flex flex-col gap-8 items-center text-center mb-8">
        <div className="w-20 h-6 animate-pulse bg-ink"></div>
        <div className="flex flex-col gap-4 items-center text-center mb-16">
          <div className="w-96 h-10 animate-pulse bg-ink"></div>
          <div className="w-48 h-10 animate-pulse bg-ink"></div>
        </div>
      </div>
      <ul className={`${PRODUCT_GRID_CLASS} flex-1`}>
        {repeat(3).map((index) => (
          <li key={index}>
            <SkeletonProductPreview />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SkeletonRelatedProducts
