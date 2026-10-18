// Simple text page (delivery & returns, contact, ...): a heading and
// paragraphs from the page's content.ts, plus optional extra content.
const InfoPage = ({
  title,
  paragraphs,
  children,
}: {
  title: string
  paragraphs: readonly string[]
  children?: React.ReactNode
}) => {
  return (
    <div className="content-container py-12 small:py-20">
      <div className="max-w-2xl">
        <h1 className="mb-6 text-3xl font-black uppercase tracking-tight text-bone small:text-5xl">
          {title}
        </h1>
        <div className="flex flex-col gap-y-4 text-base text-bone/75">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {children}
      </div>
    </div>
  )
}

export default InfoPage
