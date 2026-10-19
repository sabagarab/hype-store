import { clx } from "@modules/common/components/ui"
import { TRUST_CONTENT } from "./content"

// One quiet line of reassurance (payment, delivery area). Plain text on
// purpose: no icons, no pills.
const TrustLine = ({ className }: { className?: string }) => (
  <p
    className={clx("text-sm text-bone/55", className)}
    data-testid="trust-line"
  >
    {TRUST_CONTENT.items.join(TRUST_CONTENT.separator)}
  </p>
)

export default TrustLine
