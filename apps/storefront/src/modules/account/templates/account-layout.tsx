import React from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto flex flex-col">
        <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] py-12">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
        <p className="border-t border-bone/10 py-12 text-base text-bone/70">
          Questions about an order?{" "}
          <LocalizedClientLink
            href="/contact"
            className="font-medium text-bone underline underline-offset-4 transition-colors duration-base hover:text-ember"
          >
            Contact us
          </LocalizedClientLink>
        </p>
      </div>
    </div>
  )
}

export default AccountLayout
