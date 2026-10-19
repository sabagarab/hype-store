import { Heading } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-6">
      <Heading className="text-sm font-bold">Need help?</Heading>
      <div className="text-sm my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <LocalizedClientLink href="/contact">Contact</LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
