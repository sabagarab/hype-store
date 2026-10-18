import { createHash, timingSafeEqual } from "crypto"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

import { CATALOG_CACHE_TAGS } from "@lib/data/cookies"

// Called by the backend subscriber (src/subscribers/storefront-revalidate.ts)
// when catalog data changes. Body: { "tags": ["products", ...] }.
// Auth: x-revalidate-secret header must equal REVALIDATE_SECRET.

const hash = (value: string) =>
  new Uint8Array(createHash("sha256").update(value).digest())

// Compare digests so the check takes the same time whatever the input length.
const isValidSecret = (provided: string, expected: string) =>
  timingSafeEqual(hash(provided), hash(expected))

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET

  if (!expected) {
    return NextResponse.json(
      { message: "Revalidation is not configured" },
      { status: 500 }
    )
  }

  const provided = request.headers.get("x-revalidate-secret") ?? ""

  if (!isValidSecret(provided, expected)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => null)
  const requested =
    body && typeof body === "object" && "tags" in body ? body.tags : null

  if (!Array.isArray(requested)) {
    return NextResponse.json(
      { message: "Expected a JSON body with a tags array" },
      { status: 400 }
    )
  }

  const allowed: readonly string[] = CATALOG_CACHE_TAGS
  const tags = Array.from(new Set(requested)).filter(
    (tag): tag is string => typeof tag === "string" && allowed.includes(tag)
  )

  tags.forEach((tag) => revalidateTag(tag))

  return NextResponse.json({ revalidated: tags })
}
