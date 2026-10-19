import { clx } from "@modules/common/components/ui"

// Menu Toggle Icon from 21st.dev (@efferd, part of Header 1): two strokes
// that morph from a menu glyph into an X. Adapted: shared slow duration and
// premium ease via Tailwind classes instead of an inline duration prop, no
// motion with reduced motion, decorative (the button carries the label).
export function MenuToggleIcon({
  open,
  className,
}: {
  open: boolean
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clx(
        "transition-transform duration-slow ease-premium motion-reduce:transition-none",
        open && "-rotate-45",
        className
      )}
    >
      <path
        className={clx(
          "transition-all duration-slow ease-premium motion-reduce:transition-none",
          open
            ? "[stroke-dasharray:20_300] [stroke-dashoffset:-32.42px]"
            : "[stroke-dasharray:12_63]"
        )}
        d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
      />
      <path d="M7 16 27 16" />
    </svg>
  )
}

export default MenuToggleIcon
