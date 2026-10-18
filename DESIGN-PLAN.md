# Design Plan — Components & Animations

Goal: the cleanest dark streetwear store. Premium, fast, mobile-first.
Palette: black · ink · bone · ember · ember-deep. Font: Satoshi only.

> Rule of thumb: **one "wow" moment per screen**, everything else calm.
> Every animation ≤ 300ms for UI, respects `prefers-reduced-motion`, and never blocks tapping "Add to cart".

All picks below are React + Tailwind libraries hosted on **21st.dev** (Aceternity UI, Magic UI, Motion Primitives, Fancy Components, shadcn/ui).
Exact names can differ slightly on the site, so search by name on 21st.dev or ask Claude Code to find them via the Magic MCP.

---

## Shared setup (do once)

- `motion` (Framer Motion) for animations, already the standard for these libraries
- `lenis` for smooth scrolling (disabled when reduced motion is on)
- `sonner` for toasts ("Added to cart")
- shadcn/ui primitives: `Sheet` (cart drawer, mobile menu), `Dialog`, `Skeleton`

---

## Page by page

### 1. Top announcement bar
| Pick | Library | Use |
|---|---|---|
| **Marquee** | Magic UI | Endless brand ticker: `SUPREME • ESSENTIALS • FEAR OF GOD • NEW DROPS WEEKLY •` in bone on ember. Pauses on hover |

### 2. Nav (already glass)
| Pick | Library | Use |
|---|---|---|
| **Resizable / Floating Navbar** | Aceternity UI | Nav shrinks into a floating glass pill on scroll |
| **Sheet** | shadcn/ui | Full-height mobile menu with big Satoshi links that stagger in |

### 3. Homepage hero ("wow" moment #1)
| Pick | Library | Use |
|---|---|---|
| **Hero Parallax** | Aceternity UI | Rows of real product photos sliding at different speeds as you scroll. Best showcase for clothes |
| *or* **Images Slider** | Aceternity UI | Full-screen photo slideshow with headline on top (simpler, lighter on mobile) |
| **Text Effect / Text Animate** | Motion Primitives / Magic UI | Headline reveals word by word (blur-in) |
| **Spotlight** | Aceternity UI | Faint ember glow behind the headline. Subtle |
| **Shimmer Button** | Magic UI | "Shop now" in ember with a light sweep |

### 4. Brands / collections row
| Pick | Library | Use |
|---|---|---|
| **Apple Cards Carousel** | Aceternity UI | Swipeable big cards per brand (Supreme, Essentials…). Tapping opens the collection |
| *or* **Focus Cards** | Aceternity UI | Grid where the hovered card sharpens and others blur |

### 5. "New drops" / product grid
| Pick | Library | Use |
|---|---|---|
| **Magic Card** | Magic UI | Product card with an ember glow that follows the cursor (desktop only) |
| **Tilt** | Motion Primitives | Very light 3D tilt on hover (desktop only) |
| **Blur Fade / In View** | Magic UI / Motion Primitives | Cards fade up as they scroll into view, staggered |
| Badge | shadcn/ui | "SOLD" badge in ember-deep, card greyed out |

### 6. Product page ("wow" moment #2)
| Pick | Library | Use |
|---|---|---|
| **Thumbnail Image Viewer** | community (21st) | Main image + thumbnail strip, swipe on mobile |
| **Morphing Dialog** | Motion Primitives | Tap image → it smoothly expands into fullscreen zoom |
| **360° spin viewer** | custom build | Drag/swipe through 24–36 frames. No good ready-made one, so Claude builds it |
| **Magnetic** | Motion Primitives | "Add to cart" button gently pulls toward the cursor (desktop) |
| Sticky mobile bar | starter (restyle) | Price + Add to cart stuck at the bottom on phones |

### 7. Cart drawer
| Pick | Library | Use |
|---|---|---|
| **Sheet** | shadcn/ui | Glass side drawer |
| **Number Ticker / Animated Number** | Magic UI / Motion Primitives | Subtotal counts up/down when items change |
| **Sonner** | sonner | "Added to cart" toast |

### 8. Footer ("wow" moment #3)
| Pick | Library | Use |
|---|---|---|
| **Text Hover Effect** | Aceternity UI | Giant outlined store name across the footer that lights up ember on hover |
| Simple columns | — | Shop · Help · Instagram · WhatsApp |

### 9. Loading & empty states
| Pick | Library | Use |
|---|---|---|
| **Skeleton** | shadcn/ui | Shimmer placeholders in ink |
| Empty cart | custom | Big bone text + "Shop now" button |

---

## Skip (wrong for this store)
- Custom cursors, heavy WebGL shaders, globes, 3D scenes in the hero: slow on phones, distract from the clothes
- AI chat widgets (later, maybe)
- Anything with bright gradients or rainbow colors: breaks the palette

---

## Build order
1. Fix leftover white panels (cart, checkout, account) → whole site consistent
2. Footer + side menu + remove remaining Medusa branding
3. Announcement marquee + hero upgrade
4. Product cards + grid animations
5. Product page gallery + zoom (360° later)
6. Cart drawer + toasts
7. Brands carousel
8. Polish pass: performance (Lighthouse mobile ≥ 90), reduced motion, real phone test
