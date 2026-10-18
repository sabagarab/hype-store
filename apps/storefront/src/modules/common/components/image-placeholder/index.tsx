import { STORE_NAME } from "@lib/constants"

// Shown where a product image couldn't be loaded: the store wordmark in muted
// bone on ink. Fills its (relatively positioned) parent.
const ImagePlaceholder = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center bg-ink"
    >
      <span className="text-lg font-black uppercase tracking-tight text-bone/30">
        {STORE_NAME}
      </span>
    </div>
  )
}

export default ImagePlaceholder
