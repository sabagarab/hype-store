import Marquee from "@modules/common/components/marquee"
import { ANNOUNCEMENT_CONTENT } from "./content"

const AnnouncementBar = () => {
  const items = [...ANNOUNCEMENT_CONTENT.brands, ANNOUNCEMENT_CONTENT.tagline]

  return (
    <div className="bg-ember text-black pt-[env(safe-area-inset-top)]">
      {/* Screen readers get the message once instead of a looping ticker. */}
      <p className="sr-only">{items.join(", ")}</p>
      <Marquee
        aria-hidden
        pauseOnHover
        duration="30s"
        gap="0px"
        className="h-9 items-center text-xs font-bold uppercase tracking-[0.18em]"
      >
        {items.map((item) => (
          <span key={item} className="flex items-center whitespace-nowrap">
            <span className="px-4">{item}</span>
            <span aria-hidden>•</span>
          </span>
        ))}
      </Marquee>
    </div>
  )
}

export default AnnouncementBar
