import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"
import { STORE_NAME } from "@lib/constants"
import { retrieveCustomer } from "@lib/data/customer"

// Both account slots render on /account; when signed in, defer to the
// dashboard's title so the tab doesn't say "Sign in".
export async function generateMetadata(): Promise<Metadata> {
  const customer = await retrieveCustomer().catch(() => null)
  if (customer) {
    return {}
  }
  return {
    title: "Sign in",
    description: `Sign in to your ${STORE_NAME} account.`,
  }
}

export default function Login() {
  return <LoginTemplate />
}
