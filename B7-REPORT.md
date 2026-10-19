# B7 report

Storefront restyle, run as five sub-batches. One commit per sub-batch.

## B7.1 Products

**What changed**
- Store listing cards and homepage tiles both use one Product Card now, so the second, hand-built listing card is gone.
  - On desktop (real mouse) only: hover photo swap and Magic Card glow. On phones the second photo is never loaded, and the glow's border no longer lights up on a tap or scroll.
  - Sold state and short brand names are kept.
- Tactile press on cards and buttons: scale .98 over 120ms (new `press` timing token), switched off for reduced motion.
- BlurFade has no blur now, only a fade and a small rise on the shared timing.
- Every product image shows a flat ink placeholder (Skeleton Swap) that crossfades into the photo. It only appears after 120ms, so cached images never flash it. The retry after a failed load still works.
- On phones the product gallery is the Embla carousel. Dots show from the first paint (no layout jump), tapping a dot jumps instantly for reduced motion, and dot labels say "Go to image 2 of 4".
- Size pills are a Toggle Group in an ink track. The selected size is filled bone (ember stays for CTAs and prices); sold-out sizes are crossed out and can't be picked. Hover only applies with a real mouse.
- The zoom dialog and viewer use the shared timing, easing and control shape.

**21st components**
- Product Card (deltacomponents): it was already our card, and it's StockX-like with the text under a big photo.
- Skeleton Swap (ddoemonn): it crossfades without layout shift and has a show delay, so fast images never flash. Blur and spring were dropped.
- Carousel (appica-dev): already installed.
- Toggle Group (klyv-ui): real aria-pressed buttons; icons dropped.

**Review fixes** (from a separate reviewer)
- Dots no longer appear late and shift the layout.
- Gallery honours reduced motion.
- One press token and one reduced-motion pattern shared by cards and buttons.
- Hover styles on the size pills only apply with a real mouse.
- Clearer dot labels.
- The size group was announced twice; now once.
- A little more space between brand and title.

**Unsure**
- The homepage tile now also has the hover swap and glow, so it matches the listing cards. Its 1px glow border is visible on phones too, but faint.
- With slow images, the placeholder holds a photo back for at least 300ms (normal Skeleton Swap behaviour).

## B7.2 Cart and overlays

**What changed**
- The Drawer has a responsive mode: a bottom sheet with drag to close on phones, and a 420px right-hand side panel (swipe right to close) from 1024px. Glass surface with a solid ink fallback, and the sheet rides above the iOS keyboard.
  - The old slide animation never actually played (a `transition-[translate]` on Tailwind 3 transforms). It does now, and it is switched off while you drag.
- The cart drawer, the phone size sheet and the account address add/edit forms all use that Drawer. Cart totals and actions sit in the footer that stays put while the list scrolls.
- Every button is now the originui Button, and every button-styled link uses `buttonClass()`, "Continue shopping" included. Links no longer wrap a `<button>`. The old `isLoading` behaviour (disabled, "Loading...") is kept explicitly.
- Toasts: card radius, hairline border, ink surface, title over a muted description. Same placement as before.
- The cart total ticker uses the shared spring.
- The cart-transfer error banner moved from orange to ink + ember. That fixes contrast (its button was unreadable on orange) and removes non-token colours.

**21st components**
- Drawer (wensity): already installed, and Base UI gives drag-to-close, focus trap and scroll lock. Extended rather than replaced, so the filter sheet and cart stay one family.
- Button (originui): already installed.
- Sonner Toast (isaiahbjork): a quiet card toast, title over a muted description, no icons or gradients.

**Review fixes** (from a separate reviewer)
- Banner contrast.
- Keyboard inset on the bottom sheet.
- Shadow only on the bottom sheet.
- Empty cart centred again on desktop.
- "Close cart" label restored.
- Text inside the drawer can be selected.
- Last raw durations removed.
- The free-shipping nudge (still rendered by the main layout) moved to the new Button.

**Unsure**
- The filter sheet also gets the glass surface now, for consistency.
- I couldn't open the address drawers in the browser (they need a signed-in customer). They're checked by type-check and review only.

## B7.3 Navigation

**What changed**
- The nav pill (Aceternity Resizable Navbar) moved out of `nav-shell` into a shared component, `common/components/resizable-navbar`; `nav-shell` is now only wiring.
  - Token pass: control radius, hairline border, new `float` shadow token, slow/premium timing instead of a raw 250ms, highlight on the shared transition.
  - It looks the same as before.
- Mobile menu:
  - It's now the efferd Header 1 mobile menu: one frosted full-screen panel that fades and settles from 97% scale, with plain big links.
  - On phones the word "Menu" is now efferd's menu toggle icon (labelled "Menu"); inside the sheet the same glyph shows as an X.
  - Instagram and WhatsApp links appear only when `lib/social.ts` has values (both are empty now, so nothing shows).
- Search is the ddoemonn Command Palette:
  - It's a centred palette on desktop, and opens near the top on phones so the keyboard doesn't cover it.
  - Results still come from InstantSearch, with small thumbnails.
  - Arrow keys move through the results, and Enter opens the highlighted one (marked in ember). Esc, tapping outside or the X closes it.
  - Headless UI's Dialog provides the focus trap, iOS-safe scroll lock and focus return, as the old drawer did.
- Marquee: header comment and token check only. It already holds still for reduced motion.

**21st components and why**
- Resizable Navbar (Aceternity / manuarora700): already our pill.
- Header 1 mobile menu and menu toggle (efferd), **instead of hyperiux Immersive Full Screen Navigation**. The hyperiux menu needs GSAP (a new dependency), runs 1.2s clip-path wipes and per-letter "roll" hovers, and comes with image tiles. That breaks the ≤300ms motion rule and reads flashy and template-like. efferd's version is a quiet frosted panel with plain links, closer to Kith/StockX.
- Command Palette (ddoemonn): keyboard-first and quiet. Its built-in fuzzy ranking is bypassed so InstantSearch stays the source of results.

**Review fixes** (from a separate reviewer)
- Focus returns to the search button on close.
- Real focus trap, with the page inert while the palette is open.
- Scroll lock that holds on iOS.
- Visible close button restored.
- Active row marked in ember, panel border turns ember while focused.
- Valid option markup.
- "No results" shown when no hit has a link.
- `aria-expanded` added on the search button.
- Placeholder contrast raised.

**Unsure**
- On phones the menu button is now an icon instead of the word "Menu". Say if you prefer the word back.
- Cmd/Ctrl+Enter in search opens the result in the same tab (clicking with Cmd/Ctrl works normally).

## B7.4 Footer and pages

**What changed**
- Footer: the scrollxui Footer with Minimal Outline.
  - Shop / Help / Social columns (Social only when `lib/social.ts` is filled) and the copyright line.
  - A large outlined STORE_NAME watermark that fades in whole (no stroke drawing). It's SVG so any name fits the width.
  - The old stroke-drawing wordmark component is removed.
- A thin ember progress bar at the very top. It starts when you click an internal link, creeps to 90% and fills and fades once the new page lands.
  - It ignores clicks that end a drag (carousels) and gives up after 10s.
  - Back/forward and `router.push` don't show it.
- A 200ms fade (fade only) when the page changes: a CSS animation keyed on the path, so it works before JavaScript loads and doesn't fade on filter/sort changes. Off for reduced motion.
- Account, login, register and order pages: every starter class (ui-*, *-semi, *-regular, txt-*, mixed radii, raw durations) is mapped to our tokens.
  - Login and register get a centred title over a muted line.
  - Account nav: active link in ember, 44px rows.
  - Address cards are ink surfaces with the card radius; the add card is a quiet dashed outline.
  - Success messages are plain text instead of green/red badges.
  - The order thumbnails use the shared image loader.
  - The Heading and Container shims now use our tokens.
- The order confirmation's layout moved into a shared `OrderSections` component (no visible change on that page).

**21st components**
- Footer with Minimal Outline (scrollxui): as requested.
- Loading progress bar (motiondotdev, Motion for React): a plain bar on a spring, nothing decorative.
- Presence Fade (corr): fade only, done in CSS.

**Review fixes** (from a separate reviewer)
- The active address's ember border now shows.
- The progress bar's give-up timer stops its trickle, and drags no longer start it.
- Footer links render without JavaScript; only the watermark animates.
- Visible dividers on the transfer pages.
- 44px tap targets on address Edit/Remove, the Sign in/Join switch and the account nav.
- Leftover junk class removed.
- Success no longer shares the error colour.
- A hydration warning on the login page: moving the progress bar to the end of `<body>` cleared it, so it was probably the bar's Suspense shifting React's generated ids.
- **Restored:** I had moved the account order-details page onto the confirmation layout, but that dropped the "Need help?" block and the confirmation-email line and renamed labels ("Shipping Address" → "Delivery address"). That's a copy change, so I reverted to the original page and only restyled it.

**Unsure**
- Product thumbnails in cart and order lists are now 4:5 (was 9:16) to match the product photos. That's a small layout change in the cart page and order lists.
- I didn't check pages behind sign-in (account overview, profile, addresses, order details) in the browser. They're covered by type-check and review only.

## B7.5 Token sweep

**What changed**
- A scripted sweep across the whole storefront moved every leftover starter class to our tokens. That covers `ui-*` colours/borders, `*-semi`/`*-regular`/`txt-*` text classes, raw durations (100–500ms), `ease-in`/`ease-out`, `shadow-xl/md/elevation-*`, mixed radii and `h-[52px]`.
  - Radii: md/lg/large/2xl → `card`, full → `control`.
  - Heights: `h-[52px]` → `h-control`.
  - Most of it was in the skeletons, line-item prices, store pagination, not-found pages and the free-shipping nudge.
- Free-shipping nudge:
  - Its green/gradient progress bar is now plain ember, and the "unlocked" check icon ember too.
  - Its buttons use the shared Button styles, and the popup fits phone width.
  - It still fades out with the same 1s delay.
- Removed:
  - **Unused files:** the old Modal + its context, profile-password, the cart preview template, order payment-details, nine unused icons.
  - **Unused `ui` shim exports:** Button, Badge, IconBadge, RadioGroup, Checkbox.
  - **Legacy CSS in `globals.css`:** the text-*-semi/regular classes, `.contrast-btn` and the `txt-*` font rule.
  - **Unused Tailwind config:** radius tokens (soft/rounded/large/circle), keyframes/animations, transition names, the grey palette and the `tailwindcss-radix` plugin.
- Packages uninstalled: `@radix-ui/react-accordion`, `pg`, `qs`, `@types/pg`, `tailwindcss-radix`, `@types/react-instantsearch-dom`.

**Review fixes** (from a separate reviewer)
- The language dropdown's shadow (a mapping slip had produced a non-existent class).
- The nudge's delayed fade-out.
- The shim Input and IconButton on the control radius and 44px.
- Page titles that were 30px keep that size (3xl token) instead of shrinking to 24px.
- One skeleton colour, and skeleton bars on the control radius.
- The address-select chevron transition (it was a no-op before).

**Unsure / left as is**
- The checkbox keeps a 4px radius (`rounded-base`): a pill or 16px radius looks wrong on a 20px box. It's the one exception to card/control.
- `lib/data/variants.ts` and `lib/util/product.ts` are unused but they're data helpers, not UI, so I left them.
- Stripe packages stay installed: checkout code still imports them (hidden in the UI). Removing them would be a logic change.
- The Magic Card ember glow on product cards (desktop hover) technically brushes the "no gradient glows" rule. It stays because you asked for it in B7.1.
- Error text and the accent are both ember, so errors don't stand out by colour alone.
