import { isManual, paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { SummaryItemList } from "@modules/checkout/components/summary-items"
import CartTotals from "@modules/common/components/cart-totals"

const Block = ({
  label,
  children,
  ...props
}: {
  label: string
  children: React.ReactNode
  "data-testid"?: string
}) => (
  <div className="flex flex-col gap-y-0.5 text-sm text-bone/70" {...props}>
    <p className="mb-1 text-xs font-medium uppercase tracking-widest text-bone/55">
      {label}
    </p>
    {children}
  </div>
)

// What was ordered, where it goes and how it's paid. Shared by the order
// confirmation and the account's order details page.
const OrderSections = ({ order }: { order: HttpTypes.StoreOrder }) => {
  const address = order.shipping_address
  const method = order.shipping_methods?.[0]
  const payment = order.payment_collections?.[0]?.payments?.[0]
  const notes = address?.metadata?.delivery_notes

  const items = (order.items ?? []).map((item) => ({
    id: item.id,
    thumbnail: item.thumbnail,
    product_title: item.product_title,
    title: item.title,
    variant_title: item.variant_title,
    total: item.total,
    unit_price: item.unit_price,
    created_at: item.created_at,
    brand: item.product_type ?? null,
  }))

  return (
    <>
      <section
        aria-label="Order summary"
        className="flex flex-col gap-y-6 rounded-card border border-hairline bg-ink p-5 small:p-6"
      >
        <SummaryItemList items={items} currencyCode={order.currency_code} />
        <CartTotals totals={order} />
      </section>

      <section className="grid grid-cols-1 gap-y-6 xsmall:grid-cols-2 xsmall:gap-x-8">
        <Block label="Delivery address" data-testid="shipping-address-summary">
          <p className="text-bone">
            {address?.first_name} {address?.last_name}
          </p>
          <p>
            {[address?.address_1, address?.address_2]
              .filter(Boolean)
              .join(", ")}
          </p>
          <p>
            {[address?.postal_code, address?.city].filter(Boolean).join(", ")}
          </p>
          <p>{address?.country_code?.toUpperCase()}</p>
          {typeof notes === "string" && notes && (
            <p className="mt-2">Notes: {notes}</p>
          )}
        </Block>

        <Block label="Contact" data-testid="shipping-contact-summary">
          <p>{address?.phone}</p>
          <p className="break-all" data-testid="order-email">
            {order.email}
          </p>
        </Block>

        {method && (
          <Block label="Delivery" data-testid="shipping-method-summary">
            <p>
              {(method as { name?: string }).name} ·{" "}
              {convertToLocale({
                amount: method.total ?? 0,
                currency_code: order.currency_code,
              })}
            </p>
          </Block>
        )}

        {payment && (
          <Block label="Payment">
            <p className="text-bone" data-testid="payment-method">
              {paymentInfoMap[payment.provider_id]?.title ??
                payment.provider_id}
            </p>
            {isManual(payment.provider_id) && (
              <p>Pay in cash when your order arrives.</p>
            )}
          </Block>
        )}
      </section>
    </>
  )
}

export default OrderSections
