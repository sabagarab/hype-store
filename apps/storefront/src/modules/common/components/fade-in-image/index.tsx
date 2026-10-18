"use client"

import Image, { ImageProps } from "next/image"
import { useEffect, useState } from "react"

import { clx } from "@modules/common/components/ui"

const RETRY_DELAY_MS = 1000

type FadeInImageProps = ImageProps & {
  /** Rendered instead of the image if it still fails after one retry. */
  fallback?: React.ReactNode
}

// next/image that stays transparent until the file is fully loaded and
// decoded, then fades in. Prevents large images from painting top-down
// (a visible "slice" over the placeholder) while they download. A failed
// load is retried once; after that the fallback (if any) is shown.
const FadeInImage = ({
  className,
  onLoad,
  onError,
  alt,
  fallback = null,
  ...props
}: FadeInImageProps) => {
  const [loaded, setLoaded] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [retryPending, setRetryPending] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!retryPending) {
      return
    }
    const timer = window.setTimeout(() => {
      setRetryPending(false)
      setAttempt(1)
    }, RETRY_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [retryPending])

  if (failed) {
    return <>{fallback}</>
  }

  return (
    <Image
      // A new key remounts the <img>, which makes the browser request it again.
      key={attempt}
      {...props}
      alt={alt}
      onLoad={(event) => {
        setLoaded(true)
        onLoad?.(event)
      }}
      onError={(event) => {
        if (attempt === 0) {
          setRetryPending(true)
        } else {
          setFailed(true)
        }
        onError?.(event)
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
