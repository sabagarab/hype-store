"use client"

import { useSearchParams } from "next/navigation"
import { Fragment } from "react"

import { clx } from "@modules/common/components/ui"

// Step progress as one quiet line of text. Review is the last part of the
// Payment step (it only holds the Place order button).
const STEPS = [
  { label: "Address", steps: ["address"] },
  { label: "Delivery", steps: ["delivery"] },
  { label: "Payment", steps: ["payment", "review"] },
] as const

const CheckoutSteps = () => {
  const step = useSearchParams().get("step") ?? "address"
  const current = Math.max(
    0,
    STEPS.findIndex((s) => (s.steps as readonly string[]).includes(step))
  )

  return (
    <nav aria-label="Checkout progress">
      <ol className="flex items-center gap-x-2 text-xs font-medium uppercase tracking-widest">
        {STEPS.map((s, index) => (
          <Fragment key={s.label}>
            {index > 0 && (
              <li aria-hidden="true" className="text-bone/30">
                →
              </li>
            )}
            <li
              aria-current={index === current ? "step" : undefined}
              className={clx(
                "transition-colors duration-fast",
                index === current ? "font-bold text-bone" : "text-bone/55"
              )}
            >
              {s.label}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}

export default CheckoutSteps
