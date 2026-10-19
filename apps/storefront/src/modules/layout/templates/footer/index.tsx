import { STORE_NAME } from "@lib/constants"
import { listBrands } from "@lib/data/brands"
import { instagramUrl, whatsappUrl } from "@lib/social"
import FooterMinimalOutline, {
  FooterColumn,
  FooterLink,
} from "@modules/common/components/footer-minimal-outline"

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
    { label: "Delivery", href: "/delivery" },
    { label: "Contact", href: "/contact" },
  ]

  // Filled in src/lib/social.ts; empty values hide their link (and the column).
  const instagram = instagramUrl()
  const whatsapp = whatsappUrl()
  const social: FooterLink[] = [
    ...(instagram ? [{ label: "Instagram", href: instagram, external: true }] : []),
    ...(whatsapp ? [{ label: "WhatsApp", href: whatsapp, external: true }] : []),
  ]

  const columns: FooterColumn[] = [
    { heading: "Shop", links: shop },
    { heading: "Help", links: help },
    ...(social.length > 0 ? [{ heading: "Social", links: social }] : []),
  ]

  // Wiring for the 21st Footer with Minimal Outline.
  return (
    <FooterMinimalOutline
      brandName={STORE_NAME}
      columns={columns}
      copyright={`© ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.`}
    />
  )
}
