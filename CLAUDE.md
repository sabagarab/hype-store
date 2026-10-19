# CLAUDE.md

Read [AGENTS.md](./AGENTS.md) first. It holds Medusa's directory structure, commands, conventions and off-limits paths. Follow it for all work here. This file adds **project-specific** context on top of it. If the two conflict on Medusa mechanics, AGENTS.md wins. On product, design and business rules, this file wins.

---

## 1. What we're building

An online store in **Lebanon** reselling hype streetwear: Supreme, Fear of God Essentials, and similar brands.

- Brand name is **not decided yet**. Use `STORE_NAME` / a single config constant, never hard-code a name across files.
- Customers mostly shop on **mobile**, coming from Instagram.
- Owner: Seb (solo developer + store owner). He manages products himself through the Medusa Admin.

### Brands

How brand names are written in all copy, metadata and content files:

- **Fear of God Essentials** is one brand (Fear of God's diffusion line). Write it as "Fear of God Essentials", or "FOG Essentials" where space is tight. Never "Essentials" alone, and never list "Fear of God" and "Essentials" as two brands.
- **Supreme** as is.
- Brand lists shown in the storefront (e.g. the announcement marquee) live in `content.ts` files next to their component, so brands can be added without touching component code.

## 2. Stack & layout

Monorepo created with `create-medusa-app` (Medusa v2).

| Part | Path | Notes |
|---|---|---|
| Backend + Admin | `apps/backend` | Medusa v2, Node/TS. Admin at `http://localhost:9000/app` |
| Storefront | `apps/storefront` | Medusa Next.js starter (App Router, Tailwind). We **reskin and extend** it, not rewrite it |
| Database | Neon Postgres (Frankfurt) | Direct (non-pooled) connection, `?sslmode=require` |

Ports: backend `9000`, storefront `8000`.

## 3. Dev environment (Windows)

- OS: Windows, **PowerShell** (not bash). Give PowerShell commands, use `\` paths, and avoid `&&` chains that PowerShell 5 doesn't support (use `;` or separate lines).
- Project root: `C:\dev\hype-store`
- Node v24 (max supported by the storefront). Don't upgrade past v24.
- **No Redis locally.** `REDIS_URL` is commented out; Medusa uses an in-memory fallback. Don't add Redis-dependent features without asking.
- **Neon free tier sleeps after ~5 min idle.** A first query after idle can be slow or drop. Long-running scripts that hold one connection open can be killed (`57P01`). Prefer short operations; retry once on connection drops.

Run:
```powershell
# Backend
cd C:\dev\hype-store\apps\backend; npm run dev
# Storefront (separate terminal)
cd C:\dev\hype-store\apps\storefront; npm run dev
```
Migrations after changing a custom module's data model:
```powershell
cd C:\dev\hype-store\apps\backend
npx medusa db:generate <moduleName>
npx medusa db:migrate
```
Check `package.json` scripts / AGENTS.md before inventing other commands.

## 4. Secrets & env

- `apps/backend/.env` and `apps/storefront/.env.local` hold real secrets (DB password, keys). **Never** commit them, print them, or copy their values into code, docs or chat.
- New env vars: add them to the matching `.env.template` with an empty/placeholder value and a comment.
- Publishable key is public by design. The DB URL, secret API keys, JWT/cookie secrets and Whish credentials are not.

## 5. Design system (storefront)

Look & feel: **StockX-style product presentation**, dark, premium, with subtle iOS **"liquid glass"** touches (frosted, translucent surfaces with blur). Attention-grabbing but clean.

**Colors**: define once as Tailwind tokens and CSS variables, then only use tokens:
| Token | Use |
|---|---|
| `black` (pure black) | Main background |
| `ink` (near-black) | Cards, surfaces, nav |
| `bone` (bone white) | Primary text, light surfaces |
| `ember` (burnt orange) | Primary accent: CTAs, prices, highlights |
| `ember-deep` (deeper burnt orange) | Hover/pressed states, secondary accent |

Exact hex values live in `tailwind.config.js`. Don't introduce new colors without asking.

**Typography**: **Satoshi** (Fontshare) only. One family; create hierarchy with weights (light → black) and size, never a second display font.

**Rules**
- **Mobile-first.** Design at ~375px first, then scale up. Tap targets ≥ 44px.
- Product imagery is the hero: big images, minimal chrome.
- Glass effects: use sparingly (nav, cart drawer, overlays), always with a solid fallback and enough text contrast.
- Animations: subtle and fast (≤ 300ms). Respect `prefers-reduced-motion`.
- Accessibility: WCAG AA contrast, real `alt` text, keyboard focus states visible (use `ember` for focus rings).
- Remove Medusa/Next.js starter branding (e.g. "Medusa Store", "Powered by Medusa", GitHub CTAs) as we reskin.

**UI components (standing rule)**
- **Every visible UI component comes from 21st.dev.** Don't design components yourself: find the best 21st component, install it, and adapt it to our tokens (black, ink, bone, ember, ember-deep, Satoshi). Custom code is only for wiring and data (Medusa calls, state, config), never for how things look.
- Keep installed components in `src/modules/common/components/<name>/` (starter folder structure) with a header comment naming the 21st source and author.
- **Consistency:** all components must look like one family: same corner radius, border, glass treatment, shadow, spacing scale and motion timing. These are defined once as shared tokens (`tailwind.config.js`, `src/styles/globals.css`, `src/lib/motion.ts`); every 21st component is adapted to them, replacing its own colors, radii, shadows and springs. If two candidates are equally good, pick the one closest to what we already have.
- **Choosing:** for each need, compare a few 21st options and pick the single best one for a dark, premium, StockX-like streetwear store on phones. Report the pick and why in one line; don't offer a menu.

## 6. Business rules (must hold everywhere)

1. **One-of-one items**: a product normally has 1 variant with inventory = 1. When sold it must show **"Sold"** (or drop off listings, configurable), never allow overselling. Rely on Medusa inventory + reservations; don't build a parallel stock system.
2. **Market**: Lebanon. Currency **USD**. A Lebanon region replaces the seeded Europe/`dk` region (pending setup; don't hard-code `dk`).
3. **Payments**:
   - **Cash on Delivery**: Medusa's manual/system payment provider, labelled "Cash on Delivery" in the storefront.
   - **Whish Pay** (planned): a custom payment provider module in `apps/backend/src/modules/`. Always **verify payment status server-side** with Whish before capturing or marking an order paid. Never trust client-side redirects alone.
   - No Stripe/PayPal. Hide those UI paths.
4. **Shipping**: local delivery within Lebanon (details TBD; ask before assuming prices or zones).
5. The owner adds/edits products **only through the Admin**. Nothing that requires code changes to update stock.

## 7. Planned features (roadmap)

1. Reskin storefront with the design system (nav, hero, product cards, product page, cart, checkout, footer).
2. Lebanon region + USD + COD set up end-to-end.
3. One-of-one "Sold" behaviour.
4. **360° spin viewer** on product pages: 24–36 sequential photos per item, drag/swipe to rotate, lazy-loaded, falls back to the normal gallery. Admin needs a way to upload/order the spin frames (admin widget + product metadata or a small custom module).
5. Whish Pay provider.
6. Analytics dashboard in Admin: sales, top items, revenue over time (admin UI route).
7. Later: AI features (smart search / "find similar", AI-written product descriptions in Admin).
8. Production: S3-compatible file storage (e.g. Cloudflare R2) via Medusa's S3 file provider; local file storage is dev only.

## 8. How to work in this repo

- **Plan first.** For anything beyond a small fix, show a short plan (files to touch and why) and wait for approval before editing.
- **Stay in scope.** Storefront tasks don't touch the backend and vice versa, unless the task needs it. Say so explicitly when it does.
- **Extend, don't fork, Medusa.** Use custom modules, workflows, API routes, subscribers, links and admin widgets/routes in `apps/backend/src`. Never patch `node_modules` or core packages.
- Mutations in custom backend code go through **workflows** (with compensation where it matters), per Medusa conventions.
- Storefront data fetching goes through the existing `src/lib/data/*` helpers and the Medusa JS SDK. Don't call the API ad hoc from components.
- Reuse existing starter components before creating new ones. Keep the starter's folder structure (`src/modules/<area>/components|templates`).
- TypeScript strict. No `any` unless unavoidable (comment why).
- Small, focused changes. After each logical step, suggest a commit message in conventional style (`feat(storefront): ...`, `fix(backend): ...`).
- After changes, run the relevant lint/build/type-check if available and report results honestly. Don't claim something works without running it.
- When unsure about a business decision (prices, shipping, copy, brand name), **ask** instead of guessing.

## 9. Off-limits

- `.medusa/` (auto-generated, never edit or commit)
- `node_modules/`
- Any `.env*` file except `.env.template`
- Database: never run destructive SQL, drop tables or reset the DB without explicit approval.