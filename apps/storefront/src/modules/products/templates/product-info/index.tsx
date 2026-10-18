import { HttpTypes } from "@medusajs/types"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

// Brand (the product's Type, full name) and title. Price, size and Add to cart
// follow in ProductActions.
const ProductInfo = ({ product }: ProductInfoProps) => {
  const brand = product.type?.value

  return (
    <div id="product-info" className="flex flex-col gap-y-2">
      {brand && (
        <p className="text-xs font-medium uppercase tracking-widest text-bone/55">
          {brand}
        </p>
      )}
      <h1
        className="text-3xl font-black leading-tight tracking-tight text-bone small:text-4xl"
        data-testid="product-title"
      >
        {product.title}
      </h1>
    </div>
  )
}

export default ProductInfo
