import { clx } from "@modules/common/components/ui"

// Radio dot from 21st.dev (@sean0205/c-radio-group-8, shadcn RadioGroupItem).
// Visual only: the row around it (Headless UI Radio, see radio-card) owns the
// radio role, focus and keyboard handling. Adapted to the shared tokens:
// hairline ring at rest, ember ring and dot when selected, shared timing.
const Radio = ({
  checked,
  "data-testid": dataTestId,
}: {
  checked: boolean
  "data-testid"?: string
}) => {
  return (
    <span
      aria-hidden="true"
      data-state={checked ? "checked" : "unchecked"}
      data-testid={dataTestId || "radio-button"}
      className={clx(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-control border transition-colors duration-fast ease-premium",
        checked ? "border-ember" : "border-bone/40"
      )}
    >
      {checked && <span className="h-2.5 w-2.5 rounded-control bg-ember" />}
    </span>
  )
}

export default Radio
