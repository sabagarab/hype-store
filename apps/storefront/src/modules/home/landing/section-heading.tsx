import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Plain section title with an optional text link on the right.
const SectionHeading = ({
  id,
  title,
  link,
}: {
  id: string
  title: string
  link?: { label: string; href: string }
}) => (
  <div className="mb-6 flex items-end justify-between gap-4 small:mb-8">
    <h2
      id={id}
      className="text-2xl font-black uppercase leading-none tracking-tight text-bone small:text-4xl"
    >
      {title}
    </h2>
    {link && (
      <LocalizedClientLink
        href={link.href}
        className="flex min-h-control-sm items-center text-sm font-medium text-bone/70 underline-offset-4 transition-colors duration-base hover:text-bone hover:underline"
      >
        {link.label}
      </LocalizedClientLink>
    )}
  </div>
)

export default SectionHeading
