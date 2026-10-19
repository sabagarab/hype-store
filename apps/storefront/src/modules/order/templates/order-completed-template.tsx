import { cookies as nextCookies } from "next/headers"

import { HttpTypes } from "@medusajs/types"
import { buttonClass } from "@modules/common/components/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderSections from "@modules/order/components/order-sections"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

// Order confirmation, in the checkout's quiet style: what was ordered, where
// it goes and how it's paid.
export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="content-container max-w-2xl py-10 small:py-16">
      {isOnboarding && (
        <div className="mb-10">
          <OnboardingCta orderId={order.id} />
        </div>
      )}
      <div
        className="flex flex-col gap-y-10"
        data-testid="order-complete-container"
      >
        <header className="flex flex-col gap-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-bone/55">
            Order confirmed
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-bone small:text-4xl">
            Thank you!
          </h1>
          <p className="text-bone/70">Your order was placed successfully.</p>
          <p className="mt-2 text-sm text-bone/70">
            Order{" "}
            <span className="font-bold text-ember" data-testid="order-id">
              #{order.display_id}
            </span>
            <span aria-hidden="true"> · </span>
            <span data-testid="order-date">
              {new Date(order.created_at).toDateString()}
            </span>
          </p>
        </header>

        <OrderSections order={order} />

        <div className="flex flex-col gap-y-4 border-t border-hairline pt-8">
          <LocalizedClientLink
            href="/store"
            className={buttonClass({ className: "w-full" })}
          >
            Continue shopping
          </LocalizedClientLink>
          <p className="text-center text-sm text-bone/70">
            Need help?{" "}
            <LocalizedClientLink
              href="/contact"
              className="text-bone underline underline-offset-4 hover:text-ember"
            >
              Contact us
            </LocalizedClientLink>
          </p>
        </div>
      </div>
    </div>
  )
}
