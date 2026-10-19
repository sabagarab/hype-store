"use client"

import { useRefinementList } from "react-instantsearch"

import CheckboxWithLabel from "@modules/common/components/checkbox"
import { FilterSection } from "@modules/store/components/filter-sheet"

type RefinementGroupProps = {
  attribute: string
  title: string
}

const RefinementGroup = ({ attribute, title }: RefinementGroupProps) => {
  const { items, refine } = useRefinementList({
    attribute,
    limit: 20,
    sortBy: ["count:desc", "name:asc"],
  })

  if (!items.length) {
    return null
  }

  return (
    <FilterSection
      title={title}
      selected={items.filter((item) => item.isRefined).length}
    >
      <ul className="-my-1 flex flex-col">
        {items.map((item) => (
          <li key={item.value}>
            <CheckboxWithLabel
              label={item.label}
              checked={item.isRefined}
              onChange={() => refine(item.value)}
              data-testid={`refinement-${attribute}`}
            />
          </li>
        ))}
      </ul>
    </FilterSection>
  )
}

export default RefinementGroup
