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
