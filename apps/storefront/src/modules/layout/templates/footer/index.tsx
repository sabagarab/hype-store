import { STORE_NAME } from "@lib/constants"
import { listBrands } from "@lib/data/brands"
import { instagramUrl, whatsappUrl } from "@lib/social"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FooterWordmark from "@modules/layout/components/footer-wordmark"

type FooterLink = { label: string; href: string; external?: boolean }

const LINK_CLASS =
  "inline-flex min-h-[44px] items-center text-sm text-bone/70 transition-colors duration-200 hover:text-ember small:min-h-0 small:py-1"

const FooterColumn = ({ title, links }: { title: string; links: FooterLink[] }) => (
  <div className="flex flex-col gap-y-1 small:gap-y-2">
    <h2 className="mb-1 text-xs font-medium uppercase tracking-widest text-bone/55">
      {title}
    </h2>
    <ul className="flex flex-col">
      {links.map((link) => (
        <li key={link.href}>
          {link.external ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              {link.label}
            </a>
          ) : (
            <LocalizedClientLink href={link.href} className={LINK_CLASS}>
              {link.label}
            </LocalizedClientLink>
          )}
        </li>
      ))}
    </ul>
  </div>
)

export default async function Footer({ countryCode }: { countryCode: string }) {
  // A failure only drops the brand links, never the footer.
  const brands = await listBrands(countryCode).catch(() => [])

  const shop: FooterLink[] = [
    { label: "Store", href: "/store" },
    ...brands.map((brand) => ({
      label: brand.name,
      href: `/brands/${brand.handle}`,
    })),
  ]

  const help: FooterLink[] = [
    { label: "Delivery & returns", href: "/delivery-returns" },
    { label: "Contact", href: "/contact" },
  ]

  // Filled in src/lib/social.ts; empty values hide their link (and the column).
  const instagram = instagramUrl()
  const whatsapp = whatsappUrl()
  const social: FooterLink[] = [
    ...(instagram ? [{ label: "Instagram", href: instagram, external: true }] : []),
    ...(whatsapp ? [{ label: "WhatsApp", href: whatsapp, external: true }] : []),
  ]

  return (
    <footer className="w-full border-t border-ui-border-base">
      <div className="content-container flex flex-col">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 small:grid-cols-4 small:py-16">
          <FooterColumn title="Shop" links={shop} />
          <FooterColumn title="Help" links={help} />
          {social.length > 0 && <FooterColumn title="Social" links={social} />}
        </div>

        <FooterWordmark text={STORE_NAME} />

        <p className="py-8 text-xs text-bone/55">
          © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
