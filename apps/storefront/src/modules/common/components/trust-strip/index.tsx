import { Cash, ChatBubbleLeftRight, MapPin, TruckFast } from "@medusajs/icons"

import { whatsappUrl } from "@lib/social"
import { convertToLocale } from "@lib/util/money"
import Badge from "@modules/common/components/badge"
import { clx } from "@modules/common/components/ui"
import { TRUST_STRIP_CONTENT, TrustIcon } from "./content"

const ICONS: Record<TrustIcon, typeof Cash> = {
  cash: Cash,
  pin: MapPin,
  truck: TruckFast,
}

type TrustStripProps = {
  /**
   * Price of the "Delivery" shipping option. Pass it only at the end of the
   * flow (cart drawer, checkout); without it, price-based items are hidden.
   */
  deliveryAmount?: number | null
  currencyCode?: string
  size?: "md" | "sm"
  className?: string
}

// Row of reassurance badges (payment, delivery area, delivery price). Static
// on purpose so it reads instantly; wraps on narrow phones.
const TrustStrip = ({
  deliveryAmount = null,
  currencyCode = "usd",
  size = "md",
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
      className={clx("flex flex-wrap items-center gap-2", className)}
      data-testid="trust-strip"
    >
      {items.map((item) => {
        const Icon = ICONS[item.icon]
        return (
          <li key={item.id}>
            <Badge size={size}>
              <Icon aria-hidden="true" />
              {item.text}
            </Badge>
          </li>
        )
      })}
      {whatsapp && (
        <li>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] items-center rounded-control"
          >
            <Badge
              size={size}
              className="transition-colors duration-base ease-premium hover:text-bone"
            >
              <ChatBubbleLeftRight aria-hidden="true" />
              {TRUST_STRIP_CONTENT.whatsappLabel}
            </Badge>
          </a>
        </li>
      )}
    </ul>
  )
}

export default TrustStrip
