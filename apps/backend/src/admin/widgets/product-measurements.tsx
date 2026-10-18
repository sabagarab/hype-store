import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, HttpTypes } from "@medusajs/framework/types"
import { PencilSquare } from "@medusajs/icons"
import {
  Button,
  Container,
  Drawer,
  Input,
  Label,
  Text,
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { sdk } from "../lib/client"

// Garment measurements (cm, measured flat), stored as separate keys in the
// product's metadata. The storefront product page shows the ones that are set.
// Keep the keys in sync with apps/storefront/src/modules/products/components/measurements.
const FIELDS = [
  { key: "pit_to_pit_cm", label: "Pit to pit" },
  { key: "length_cm", label: "Length" },
  { key: "sleeve_cm", label: "Sleeve" },
  { key: "waist_cm", label: "Waist" },
  { key: "inseam_cm", label: "Inseam" },
] as const

type FieldKey = (typeof FIELDS)[number]["key"]
type FormValues = Record<FieldKey, string>

const readValue = (metadata: Record<string, unknown> | null | undefined, key: FieldKey) => {
  const value = metadata?.[key]
  return typeof value === "number" || (typeof value === "string" && value !== "")
    ? String(value)
    : ""
}

const toFormValues = (metadata?: Record<string, unknown> | null): FormValues =>
  Object.fromEntries(
    FIELDS.map(({ key }) => [key, readValue(metadata, key)])
  ) as FormValues

const ProductMeasurementsWidget = ({
  data,
}: DetailWidgetProps<HttpTypes.AdminProduct>) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormValues>(() => toFormValues())
  const [error, setError] = useState<string | null>(null)

  // Display data loads on mount.
  const queryKey = ["product-measurements", data.id]
  const { data: product, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      sdk.admin.product
        .retrieve(data.id, { fields: "id,metadata" })
        .then(({ product }) => product),
  })

  const save = useMutation({
    mutationFn: (values: FormValues) => {
      // Medusa merges metadata on update: other keys are kept, and a key sent
      // as "" is removed, which is how a cleared field is deleted.
      const metadata: Record<string, unknown> = { ...(product?.metadata ?? {}) }
      for (const { key } of FIELDS) {
        metadata[key] = values[key] === "" ? "" : Number(values[key])
      }
      return sdk.admin.product.update(data.id, { metadata })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      // Refresh the dashboard's own product queries too (e.g. its Metadata
      // section), whatever key shape they use.
      queryClient.invalidateQueries({
        predicate: (query) => JSON.stringify(query.queryKey).includes(data.id),
      })
      toast.success("Measurements saved")
      setOpen(false)
    },
    onError: (e: Error) => {
      toast.error(e.message || "Couldn't save measurements")
    },
  })

  const openDrawer = () => {
    setForm(toFormValues(product?.metadata))
    setError(null)
    setOpen(true)
  }

  const handleSave = () => {
    const invalid = FIELDS.find(({ key }) => {
      const value = form[key]
      return value !== "" && !(Number(value) > 0)
    })
    if (invalid) {
      setError(`${invalid.label} must be a number above 0, or empty.`)
      return
    }
    save.mutate(form)
  }

  const current = toFormValues(product?.metadata)

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          Measurements (cm)
        </Text>
        <Button
          size="small"
          variant="secondary"
          onClick={openDrawer}
          disabled={isLoading}
          aria-label="Edit measurements"
        >
          <PencilSquare />
        </Button>
      </div>
      <div className="flex flex-col gap-y-2 px-6 py-4">
        {isLoading ? (
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            Loading…
          </Text>
        ) : (
          FIELDS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <Text size="small" leading="compact" className="text-ui-fg-subtle">
                {label}
              </Text>
              <Text size="small" leading="compact">
                {current[key] ? `${current[key]} cm` : "—"}
              </Text>
            </div>
          ))
        )}
        <Text size="xsmall" leading="compact" className="text-ui-fg-muted pt-2">
          Measured flat. Empty fields are hidden on the storefront.
        </Text>
      </div>

      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edit measurements</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="flex-1 overflow-auto p-4">
            <div className="flex flex-col gap-y-4">
              {FIELDS.map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-y-2">
                  <Label htmlFor={key}>{label} (cm)</Label>
                  <Input
                    id={key}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.5"
                    placeholder="—"
                    value={form[key]}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                  />
                </div>
              ))}
              <Text size="small" leading="compact" className="text-ui-fg-subtle">
                Leave a field empty to hide that row on the storefront.
              </Text>
              {error && (
                <Text size="small" leading="compact" className="text-ui-fg-error">
                  {error}
                </Text>
              )}
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <div className="flex items-center justify-end gap-x-2">
              <Drawer.Close asChild>
                <Button size="small" variant="secondary" disabled={save.isPending}>
                  Cancel
                </Button>
              </Drawer.Close>
              <Button
                size="small"
                onClick={handleSave}
                isLoading={save.isPending}
                disabled={save.isPending}
              >
                Save
              </Button>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.side",
})

export default ProductMeasurementsWidget
