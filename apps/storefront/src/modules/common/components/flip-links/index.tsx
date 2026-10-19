import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

// Flip Links from 21st.dev (@vaib215/flip-links): huge type links whose
// letters roll up to a second copy on hover. Pure CSS. Adapted: Satoshi
// Black, bone with an ember second copy, shared timing, the roll only on
// devices that hover (taps just navigate), and each word is its own clipped
// box so long brand names can wrap on phones. Reduced motion keeps the
// letters still.

const LETTER =
  "inline-block transition-transform duration-slow ease-premium motion-reduce:transition-none"

const FlipWord = ({ word, offset }: { word: string; offset: number }) => (
  <span className="relative inline-block overflow-hidden align-top">
    <span className="block">
      {word.split("").map((letter, i) => (
        <span
          key={i}
          className={clx(
            LETTER,
            "[@media(hover:hover)]:group-hover/flip:-translate-y-[110%] motion-reduce:!translate-y-0"
          )}
          style={{ transitionDelay: `${(offset + i) * 15}ms` }}
        >
          {letter}
        </span>
      ))}
    </span>
    <span className="absolute inset-0 block text-ember motion-reduce:hidden">
      {word.split("").map((letter, i) => (
        <span
          key={i}
          className={clx(
            LETTER,
            "translate-y-[110%] [@media(hover:hover)]:group-hover/flip:translate-y-0"
          )}
          style={{ transitionDelay: `${(offset + i) * 15}ms` }}
        >
          {letter}
        </span>
      ))}
    </span>
  </span>
)

const FlipLink = ({ children, href }: { children: string; href: string }) => {
  const words = children.split(" ")
  let offset = 0

  return (
    <LocalizedClientLink
      href={href}
      aria-label={children}
      className="group/flip block text-[12vw] font-black uppercase leading-[0.9] tracking-tight text-bone small:text-8xl"
    >
      <span aria-hidden className="flex flex-wrap gap-x-[0.25em]">
        {words.map((word, i) => {
          const start = offset
          offset += word.length
          return <FlipWord key={i} word={word} offset={start} />
        })}
      </span>
    </LocalizedClientLink>
  )
}

const FlipLinks = ({
  links,
  className,
}: {
  links: { label: string; href: string }[]
  className?: string
}) => (
  <nav className={clx("flex flex-col gap-y-4 small:gap-y-6", className)}>
    {links.map((link) => (
      <FlipLink key={link.href} href={link.href}>
        {link.label}
      </FlipLink>
    ))}
  </nav>
)

export default FlipLinks
