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

export const hasMeasurements = (product: HttpTypes.StoreProduct) =>
  measurementRows(product).length > 0

const measurementRows = (product: HttpTypes.StoreProduct) =>
  ROWS.flatMap(({ key, label }) => {
    const cm = toCm(product.metadata?.[key])
    return cm === null ? [] : [{ key, label, cm }]
  })

// Measurements table (only rows with a value). The heading comes from the
// accordion around it; render it only when hasMeasurements() is true.
const Measurements = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const rows = measurementRows(product)

  return (
    <div className="flex flex-col gap-y-3">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-hairline">
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
    </div>
  )
}

export default Measurements
