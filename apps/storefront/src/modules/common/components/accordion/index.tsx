"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import React, { createContext, useContext, useId, useState } from "react"

import { INSTANT, TRANSITION } from "@lib/motion"
import { clx } from "@modules/common/components/ui"
import ChevronDown from "@modules/common/icons/chevron-down"

// Accordion from 21st.dev (@ibelick/accordion, Motion Primitives). Adapted to
// the shared tokens: hairline dividers, control-sm trigger height, bone text,
// ember focus ring, shared motion timing. Item value is passed through context
// instead of cloneElement, a `defaultValue` opens one item initially, and the
// trigger/panel are linked with aria-controls for screen readers.

type AccordionContextType = {
  expandedValue: string | null
  toggleItem: (value: string) => void
}

const AccordionContext = createContext<AccordionContextType | null>(null)

const useAccordion = () => {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error("Accordion parts must be used inside <Accordion>")
  }
  return context
}

type ItemContextType = { value: string; expanded: boolean; id: string }

const ItemContext = createContext<ItemContextType | null>(null)

const useItem = () => {
  const context = useContext(ItemContext)
  if (!context) {
    throw new Error("Accordion parts must be used inside <AccordionItem>")
  }
  return context
}

type AccordionProps = {
  children: React.ReactNode
  className?: string
  /** Item open on first render. */
  defaultValue?: string | null
}

export function Accordion({
  children,
  className,
  defaultValue = null,
}: AccordionProps) {
  const [expandedValue, setExpandedValue] = useState<string | null>(
    defaultValue
  )

  const toggleItem = (value: string) =>
    setExpandedValue((current) => (current === value ? null : value))

  return (
    <div
      className={clx(
        "flex flex-col divide-y divide-hairline border-y border-hairline",
        className
      )}
    >
      <AccordionContext.Provider value={{ expandedValue, toggleItem }}>
        {children}
      </AccordionContext.Provider>
    </div>
  )
}

export function AccordionItem({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const { expandedValue } = useAccordion()
  const id = useId()
  const expanded = value === expandedValue

  return (
    <div
      className={clx("overflow-hidden", className)}
      {...(expanded ? { "data-expanded": "" } : {})}
    >
      <ItemContext.Provider value={{ value, expanded, id }}>
        {children}
      </ItemContext.Provider>
    </div>
  )
}

export function AccordionTrigger({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { toggleItem } = useAccordion()
  const { value, expanded, id } = useItem()

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      aria-expanded={expanded}
      aria-controls={`${id}-panel`}
      id={`${id}-trigger`}
      className={clx(
        "group flex min-h-control-sm w-full items-center justify-between gap-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-bone",
        className
      )}
      {...(expanded ? { "data-expanded": "" } : {})}
    >
      {children}
      <ChevronDown
        size={16}
        aria-hidden="true"
        className="shrink-0 text-bone/60 transition-transform duration-base ease-premium group-data-[expanded]:-rotate-180"
      />
    </button>
  )
}

export function AccordionContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { expanded, id } = useItem()
  const reduced = useReducedMotion()

  return (
    <AnimatePresence initial={false}>
      {expanded && (
        <motion.div
          id={`${id}-panel`}
          role="region"
          aria-labelledby={`${id}-trigger`}
          initial="collapsed"
          animate="expanded"
          exit="collapsed"
          variants={{
            expanded: { height: "auto", opacity: 1 },
            collapsed: { height: 0, opacity: 0 },
          }}
          transition={reduced ? INSTANT : TRANSITION}
        >
          <div className={clx("pb-4", className)}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
