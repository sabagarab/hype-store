import { clx } from "@modules/common/components/ui"
import { CSSProperties, HTMLAttributes } from "react"

// Ported from Magic UI's Marquee (21st.dev). CSS-only infinite scroll; the
// `marquee` keyframes live in tailwind.config.js.
type MarqueeProps = HTMLAttributes<HTMLDivElement> & {
  reverse?: boolean
  pauseOnHover?: boolean
  /** How many copies of the children to render so the track never runs out. */
  repeat?: number
  /** Time for one copy to scroll past, e.g. "40s". */
  duration?: string
  /** Space between items and between copies, e.g. "1rem". */
  gap?: string
}

const Marquee = ({
  className,
  reverse = false,
  pauseOnHover = false,
  repeat = 4,
  duration = "40s",
  gap = "1rem",
  style,
  children,
  ...props
}: MarqueeProps) => {
  return (
    <div
      {...props}
      style={{ ...style, "--duration": duration, "--gap": gap } as CSSProperties}
      className={clx(
        "group flex flex-row overflow-hidden [gap:var(--gap)]",
        className
      )}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          // Only the first copy is exposed to assistive tech and keyboard.
          aria-hidden={i > 0 || undefined}
          inert={i > 0 || undefined}
          className={clx(
            "flex shrink-0 flex-row justify-around animate-marquee [gap:var(--gap)] motion-reduce:[animation-play-state:paused]",
            pauseOnHover &&
              "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

export default Marquee
