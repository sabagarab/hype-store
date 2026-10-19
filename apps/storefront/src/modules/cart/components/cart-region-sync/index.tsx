"use client"

import { syncCartRegion } from "@lib/data/cart"
import Spinner from "@modules/common/icons/spinner"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

// Moves a cart created in another region (e.g. an old Europe cart) to the
// region of the current country, then re-renders the page. Runs as a server
// action because cache revalidation isn't allowed while a page renders.
const CartRegionSync = ({ countryCode }: { countryCode: string }) => {
  const router = useRouter()
  const started = useRef(false)

  useEffect(() => {
    if (started.current) {
      return
    }
    started.current = true
    syncCartRegion(countryCode).then(() => router.refresh())
  }, [countryCode, router])

  return (
    <div
      role="status"
      aria-live="polite"
      className="content-container flex min-h-[50vh] items-center justify-center gap-x-3 text-bone/70"
    >
      <Spinner size={20} />
      <span>Updating your cart…</span>
    </div>
  )
}

export default CartRegionSync
