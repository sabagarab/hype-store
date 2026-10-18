import { getBaseURL } from "@lib/util/env"
import { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "styles/globals.css"

const satoshi = localFont({
  src: [
    {
      path: "../fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "../fonts/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export const viewport: Viewport = {
  themeColor: "#000000",
  viewportFit: "cover",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="dark" className={satoshi.variable}>
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
