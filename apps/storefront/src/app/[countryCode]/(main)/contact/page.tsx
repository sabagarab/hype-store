import { Metadata } from "next"

import { STORE_NAME } from "@lib/constants"
import { instagramUrl, SOCIAL, whatsappUrl } from "@lib/social"
import InfoPage from "@modules/content/templates/info-page"
import { CONTACT_CONTENT as CONTENT } from "./content"

export const metadata: Metadata = {
  title: `${CONTENT.title} | ${STORE_NAME}`,
  robots: CONTENT.indexable ? undefined : { index: false },
}

export default function ContactPage() {
  const instagram = instagramUrl()
  const whatsapp = whatsappUrl()
  const links = [
    ...(whatsapp ? [{ label: "WhatsApp", detail: "Message us", href: whatsapp }] : []),
    ...(instagram
      ? [
          {
            label: "Instagram",
            detail: `@${SOCIAL.instagramHandle.replace(/^@/, "")}`,
            href: instagram,
          },
        ]
      : []),
  ]

  return (
    <InfoPage title={CONTENT.title} paragraphs={CONTENT.paragraphs}>
      {links.length > 0 && (
        <ul className="mt-8 flex flex-col gap-y-3">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-x-3 text-bone transition-colors duration-200 hover:text-ember"
              >
                <span className="font-bold">{link.label}</span>
                <span className="text-bone/60">{link.detail}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </InfoPage>
  )
}
