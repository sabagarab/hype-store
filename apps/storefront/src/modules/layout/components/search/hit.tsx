import Image from "next/image"
import type { Hit as HitType } from "instantsearch.js"

import ImagePlaceholder from "@modules/common/components/image-placeholder"

export type ProductHit = HitType<{
  title: string | null
  handle: string | null
  thumbnail: string | null
}>

// Small product photo shown before a search result's title.
export const HitThumbnail = ({ src }: { src: string | null }) => (
  <div className="relative aspect-[4/5] w-10 shrink-0 overflow-hidden rounded-card bg-ink">
    {src ? (
      <Image
        src={src}
        alt=""
        fill
        sizes="40px"
        className="object-cover"
        draggable={false}
      />
    ) : (
      <ImagePlaceholder />
    )}
  </div>
)
