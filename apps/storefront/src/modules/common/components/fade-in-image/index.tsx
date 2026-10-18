"use client"

import Image, { ImageProps } from "next/image"
import { useState } from "react"

import { clx } from "@modules/common/components/ui"

// next/image that stays transparent until the file is fully loaded and
// decoded, then fades in. Prevents large images from painting top-down
// (a visible "slice" over the placeholder) while they download.
const FadeInImage = ({ className, onLoad, alt, ...props }: ImageProps) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <Image
      {...props}
      alt={alt}
      onLoad={(event) => {
        setLoaded(true)
        onLoad?.(event)
      }}
      className={clx(
        "transition-opacity duration-300 motion-reduce:transition-none",
        loaded ? "opacity-100" : "opacity-0",
        className
      )}
    />
  )
}

export default FadeInImage
