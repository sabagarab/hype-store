// The 1OF1 mark, inlined from public/brand/1of1-mark.svg and
// 1of1-mark-small.svg (shapes copied unchanged) so it inherits `color`.
// Decorative by default; pass `label` when the mark stands alone as a name.

type MarkProps = {
  className?: string
  /** Accessible name, e.g. "1OF1", when no visible text accompanies it. */
  label?: string
}

const a11y = (label?: string) =>
  label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": true } as const)

/** Main mark, for nav, footer and large sizes. */
export function BrandMark({ className, label }: MarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="70 40 840 780"
      className={className}
      {...a11y(label)}
    >
      <g fill="currentColor">
        <path
          transform="translate(-50 0)"
          d="M155 180 L262 73 C305 120 345 230 345 330 C345 430 335 520 307 594 L277 618 C268 520 245 420 215 340 C195 280 170 220 155 180 Z"
        />
        <path
          transform="translate(50 0)"
          d="M825 670 L718 777 C675 730 635 620 635 520 C635 420 645 330 673 256 L703 232 C712 330 735 430 765 510 C785 570 810 630 825 670 Z"
        />
        <path d="M490 180 L525 215 L490 250 L455 215 Z" />
      </g>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={32}
        strokeLinejoin="miter"
        d="M490 307 L608 425 L490 543 L372 425 Z"
      />
    </svg>
  )
}

/** Thicker mark for favicons and tiny sizes. */
export function BrandMarkSmall({ className, label }: MarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="70 40 840 780"
      className={className}
      {...a11y(label)}
    >
      <g fill="currentColor">
        <path
          transform="translate(-50 0)"
          d="M155 180 L262 73 C305 120 345 230 345 330 C345 430 335 520 307 594 L277 618 C268 520 245 420 215 340 C195 280 170 220 155 180 Z"
        />
        <path
          transform="translate(50 0)"
          d="M825 670 L718 777 C675 730 635 620 635 520 C635 420 645 330 673 256 L703 232 C712 330 735 430 765 510 C785 570 810 630 825 670 Z"
        />
        <path d="M490 150 L540 200 L490 250 L440 200 Z" />
      </g>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={64}
        strokeLinejoin="miter"
        d="M490 307 L608 425 L490 543 L372 425 Z"
      />
    </svg>
  )
}

export default BrandMark
