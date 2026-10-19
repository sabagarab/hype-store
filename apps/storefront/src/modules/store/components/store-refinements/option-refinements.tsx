"use client"

import { useRefinementList } from "react-instantsearch"

import {
  FilterPill,
  FilterSection,
} from "@modules/store/components/filter-sheet"

import { OPTION_VALUES_ATTRIBUTE } from "./attributes"

const FACET_LIMIT = 200

type OptionGroup = {
  title: string
  values: {
    label: string
    value: string
    count: number
    isRefined: boolean
  }[]
}

function groupItems(
  items: ReturnType<typeof useRefinementList>["items"]
): OptionGroup[] {
  const groups = new Map<string, OptionGroup>()

  for (const item of items) {
    const separator = item.label.indexOf(":")

    if (separator < 1) {
      continue
    }

    const title = item.label.slice(0, separator)
    const label = item.label.slice(separator + 1)

    if (!groups.has(title)) {
      groups.set(title, { title, values: [] })
    }

    groups.get(title)!.values.push({
      label,
      value: item.value,
      count: item.count,
      isRefined: item.isRefined,
    })
  }

  return Array.from(groups.values())
}

// Size first, as on the product page; any other option follows by name.
const groupOrder = (title: string) => (title.toLowerCase() === "size" ? 0 : 1)

const OptionRefinements = () => {
  const { items, refine } = useRefinementList({
    attribute: OPTION_VALUES_ATTRIBUTE,
    limit: FACET_LIMIT,
    // Alphabetical keeps a size or colour list stable as counts move around.
    sortBy: ["name:asc"],
    operator: "and",
  })

  const groups = groupItems(items).sort(
    (a, b) => groupOrder(a.title) - groupOrder(b.title)
  )

  if (!groups.length) {
    return null
  }

  return (
    <>
      {groups.map((group) => (
        <FilterSection
          key={group.title}
          title={group.title}
          selected={group.values.filter((value) => value.isRefined).length}
        >
          <div className="flex flex-wrap gap-2">
            {group.values.map((value) => (
              <FilterPill
                key={value.value}
                selected={value.isRefined}
                onClick={() => refine(value.value)}
                data-testid="option-refinement"
              >
                {value.label}
              </FilterPill>
            ))}
          </div>
        </FilterSection>
      ))}
    </>
  )
}

export default OptionRefinements
