import FadeInImage from "@modules/common/components/fade-in-image"
import ImagePlaceholder from "@modules/common/components/image-placeholder"
import { clx } from "@modules/common/components/ui"
import React from "react"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url?: string }[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <div
      className={clx(
        "relative w-full overflow-hidden rounded-card bg-ink",
        className,
        {
          "aspect-[11/14]": isFeatured,
          "aspect-[4/5]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} />
    </div>
  )
}

// Same loader as the product cards: Skeleton Swap, one retry, then the
// store wordmark placeholder.
const ImageOrPlaceholder = ({
  image,
}: Pick<ThumbnailProps, "size"> & { image?: string }) => {
  return image ? (
    <FadeInImage
      src={image}
      alt=""
      className="object-cover object-center"
      draggable={false}
      quality={50}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
      fallback={<ImagePlaceholder />}
    />
  ) : (
    <ImagePlaceholder />
  )
}

export default Thumbnail
