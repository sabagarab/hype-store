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
