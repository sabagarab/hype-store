import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import { STORE_NAME } from "@lib/constants"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative w-full bg-black small:min-h-screen">
      <header className="h-16 border-b border-hairline">
        <nav className="content-container flex h-full items-center justify-between">
          <LocalizedClientLink
            href="/cart"
            className="-ml-2 flex h-11 flex-1 basis-0 items-center gap-x-2 px-2 text-sm font-medium text-bone/70 transition-colors duration-fast hover:text-bone"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="hidden small:block">Back to cart</span>
            <span className="block small:hidden">Back</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="flex h-11 items-center px-2 text-xl font-black uppercase tracking-tight text-bone transition-colors duration-fast hover:text-ember small:text-2xl"
            data-testid="store-link"
          >
            {STORE_NAME}
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </header>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
    </div>
  )
}
