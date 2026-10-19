import { Cash, ChatBubbleLeftRight, MapPin, TruckFast } from "@medusajs/icons"

import { whatsappUrl } from "@lib/social"
import { convertToLocale } from "@lib/util/money"
import { clx } from "@modules/common/components/ui"
import { TRUST_STRIP_CONTENT, TrustIcon } from "./content"

const ICONS: Record<TrustIcon, typeof Cash> = {
  cash: Cash,
  pin: MapPin,
  truck: TruckFast,
}

type TrustStripProps = {
  /** Price of the "Delivery" shipping option; null hides price-based items. */
  deliveryAmount: number | null
  currencyCode?: string
  className?: string
}

// Static row of reassurances (payment, delivery area, delivery price). No
// animation on purpose: it has to read instantly. Wraps onto two lines on
// narrow phones.
const TrustStrip = ({
  deliveryAmount,
  currencyCode = "usd",
  className,
}: TrustStripProps) => {
  const deliveryPrice =
    deliveryAmount !== null
      ? convertToLocale({
          amount: deliveryAmount,
          currency_code: currencyCode,
          // "$4" rather than "$4.00" for whole amounts.
          minimumFractionDigits: Number.isInteger(deliveryAmount) ? 0 : 2,
        })
      : null

  const whatsapp = whatsappUrl()

  const items = TRUST_STRIP_CONTENT.items.flatMap((item) => {
    if (typeof item.label === "string") {
      return [{ ...item, text: item.label }]
    }
    return deliveryPrice ? [{ ...item, text: item.label(deliveryPrice) }] : []
  })

  return (
    <ul
      className={clx(
        "flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-bone/70",
        className
      )}
      data-testid="trust-strip"
    >
      {items.map((item) => {
        const Icon = ICONS[item.icon]
        return (
          <li key={item.id} className="flex items-center gap-x-1.5">
            <Icon className="shrink-0 text-ember" aria-hidden="true" />
            {item.text}
          </li>
        )
      })}
      {whatsapp && (
        <li>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] items-center gap-x-1.5 underline-offset-4 transition-colors duration-200 hover:text-bone hover:underline"
          >
            <ChatBubbleLeftRight className="shrink-0 text-ember" aria-hidden="true" />
            {TRUST_STRIP_CONTENT.whatsappLabel}
          </a>
        </li>
      )}
    </ul>
  )
}

export default TrustStrip
