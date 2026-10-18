// Social/contact links shown in the footer and on the Contact page. Leave a
// value empty to hide its link; fill it in and the link appears everywhere.
export const SOCIAL = {
  /** Instagram username without the @, e.g. "yourstore". */
  instagramHandle: "",
  /** WhatsApp number in international format, e.g. "96170123456". */
  whatsappNumber: "",
}

/** Prefilled message when a customer opens WhatsApp from the store. */
export const WHATSAPP_MESSAGE = "Hi, I have a question about an order"

export const instagramUrl = (): string | null => {
  const handle = SOCIAL.instagramHandle.trim().replace(/^@/, "")
  return handle ? `https://instagram.com/${encodeURIComponent(handle)}` : null
}

export const whatsappUrl = (): string | null => {
  // wa.me needs digits only: no +, spaces or dashes.
  const digits = SOCIAL.whatsappNumber.replace(/\D/g, "")
  return digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    : null
}
