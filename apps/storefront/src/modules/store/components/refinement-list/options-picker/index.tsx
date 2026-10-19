"use client"

import { useEffect, useState } from "react"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import {
  FilterPill,
  FilterSection,
} from "@modules/store/components/filter-sheet"

type OptionsPickerProps = {
  selectedValueIds: string[]
  setOptionValueIds: (valueIds: string[]) => void
}

const OptionsPicker = ({
  selectedValueIds,
  setOptionValueIds,
}: OptionsPickerProps) => {
  const [options, setOptions] = useState<HttpTypes.StoreProductOption[]>([])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await sdk.client.fetch<{
          product_options?: HttpTypes.StoreProductOption[]
        }>("/store/product-options", {
          method: "GET",
          query: {
            is_exclusive: false,
            fields: "*values",
          },
        })

        if (response?.product_options) {
          setOptions(response.product_options)
        }
      } catch (error) {
        console.error("Failed to fetch product options", error)
      }
    }

    fetchOptions()
  }, [])

  if (!options.length) {
    return null
  }

  return (
    <>
      {options.map((option) => {
        const values =
          option.values
            ?.map((value) => ({
              id: value.id,
              label: value.value,
            }))
            .filter(
              (value): value is { id: string; label: string } =>
                !!value.id && !!value.label
            ) || []

        if (!values.length) {
          return null
        }

        const toggleValue = (valueId: string) => {
          const isSelected = selectedValueIds.includes(valueId)
          const nextSelections = isSelected
            ? selectedValueIds.filter((id) => id !== valueId)
            : [...selectedValueIds, valueId]

          setOptionValueIds(Array.from(new Set(nextSelections)))
        }

        return (
          <FilterSection
            key={option.id}
            title={option.title || "Option"}
            selected={
              values.filter((value) => selectedValueIds.includes(value.id))
                .length
            }
          >
            <div className="flex flex-wrap gap-2">
              {values.map((value) => (
                <FilterPill
                  key={value.id}
                  selected={selectedValueIds.includes(value.id)}
                  onClick={() => toggleValue(value.id)}
                >
                  {value.label}
                </FilterPill>
              ))}
            </div>
          </FilterSection>
        )
      })}
    </>
  )
}

export default OptionsPicker
