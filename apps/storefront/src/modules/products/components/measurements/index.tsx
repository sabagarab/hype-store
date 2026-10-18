import { HttpTypes } from "@medusajs/types"

// Product metadata keys set by the Admin "Measurements" widget
// (apps/backend/src/admin/widgets/product-measurements.tsx). Keep in sync.
const ROWS = [
  { key: "pit_to_pit_cm", label: "Pit to pit" },
  { key: "length_cm", label: "Length" },
  { key: "sleeve_cm", label: "Sleeve" },
  { key: "waist_cm", label: "Waist" },
  { key: "inseam_cm", label: "Inseam" },
] as const

const toCm = (value: unknown): number | null => {
  const n = typeof value === "number" ? value : Number(value)
  return value !== "" && value !== null && Number.isFinite(n) && n > 0 ? n : null
}

// Measurements table; only rows with a value are shown, and nothing renders
// when there are none.
const Measurements = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const rows = ROWS.flatMap(({ key, label }) => {
    const cm = toCm(product.metadata?.[key])
    return cm === null ? [] : [{ key, label, cm }]
  })

  if (!rows.length) {
    return null
  }

  return (
    <section aria-labelledby="measurements-heading" className="flex flex-col gap-y-3">
      <h2
        id="measurements-heading"
        className="text-xs font-medium uppercase tracking-widest text-bone/55"
      >
        Measurements
      </h2>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-ui-border-base border-y border-ui-border-base">
          {rows.map(({ key, label, cm }) => (
            <tr key={key}>
              <th scope="row" className="py-2.5 text-left font-normal text-bone/70">
                {label}
              </th>
              <td className="py-2.5 text-right font-medium text-bone">
                {cm.toLocaleString("en-US", { maximumFractionDigits: 1 })} cm
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-bone/55">Measured flat, in cm.</p>
    </section>
  )
}

export default Measurements
