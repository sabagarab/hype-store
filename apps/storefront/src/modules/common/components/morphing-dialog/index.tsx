"use client"

import { XMark } from "@medusajs/icons"
import {
  AnimatePresence,
  MotionConfig,
  Transition,
  motion,
} from "motion/react"
import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"

import { clx } from "@modules/common/components/ui"

// Adapted from Motion Primitives' MorphingDialog
// (https://motion-primitives.com, MIT): the trigger morphs into the dialog
// via a shared layoutId. Changes from the original: brand tokens instead of
// shadcn colors, @medusajs/icons instead of lucide, focus returns to the
// trigger on close (the original never set the trigger ref), triggers take a
// real aria-label, and MotionConfig uses reducedMotion="user" so the morph is
// skipped for people who prefer reduced motion.

type MorphingDialogContextType = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  uniqueId: string
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const MorphingDialogContext =
  React.createContext<MorphingDialogContextType | null>(null)

export function useMorphingDialog() {
  const context = useContext(MorphingDialogContext)
  if (!context) {
    throw new Error("useMorphingDialog must be used within a MorphingDialog")
  }
  return context
}

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.3,
}

export function MorphingDialog({
  children,
  transition = DEFAULT_TRANSITION,
}: {
  children: React.ReactNode
  transition?: Transition
}) {
  const [isOpen, setIsOpen] = useState(false)
  const uniqueId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const value = useMemo(
    () => ({ isOpen, setIsOpen, uniqueId, triggerRef }),
    [isOpen, uniqueId]
  )

  return (
    <MorphingDialogContext.Provider value={value}>
      <MotionConfig transition={transition} reducedMotion="user">
        {children}
      </MotionConfig>
    </MorphingDialogContext.Provider>
  )
}

export function MorphingDialogTrigger({
  children,
  className,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode
  className?: string
  "aria-label": string
}) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useMorphingDialog()

  return (
    <motion.button
      ref={triggerRef}
      type="button"
      layoutId={`dialog-${uniqueId}`}
      className={clx("relative cursor-zoom-in", className)}
      onClick={() => setIsOpen(true)}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={`morphing-dialog-content-${uniqueId}`}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  )
}

export function MorphingDialogContent({
  children,
  className,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode
  className?: string
  "aria-label": string
}) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useMorphingDialog()
  const containerRef = useRef<HTMLDivElement>(null)

  // Escape closes; Tab stays inside the dialog.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        return
      }
      if (event.key !== "Tab" || !containerRef.current) {
        return
      }
      const focusable = containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable.length) {
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [setIsOpen])

  // Lock page scroll while open; move focus in, then back to the trigger.
  useEffect(() => {
    if (!isOpen) {
      return
    }
    const trigger = triggerRef.current
    document.body.classList.add("overflow-hidden")
    containerRef.current
      ?.querySelector<HTMLElement>("button, [href], [tabindex]")
      ?.focus()

    return () => {
      document.body.classList.remove("overflow-hidden")
      trigger?.focus()
    }
  }, [isOpen, triggerRef])

  return (
    <motion.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      id={`morphing-dialog-content-${uniqueId}`}
      className={clx("overflow-hidden", className)}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      {children}
    </motion.div>
  )
}

export function MorphingDialogContainer({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOpen, uniqueId } = useMorphingDialog()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) {
    return null
  }

  return createPortal(
    <AnimatePresence initial={false} mode="sync">
      {isOpen && (
        <>
          <motion.div
            key={`backdrop-${uniqueId}`}
            className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {children}
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export function MorphingDialogClose({ className }: { className?: string }) {
  const { setIsOpen } = useMorphingDialog()
  const close = useCallback(() => setIsOpen(false), [setIsOpen])

  return (
    <button
      type="button"
      onClick={close}
      aria-label="Close"
      className={clx(
        "flex h-11 w-11 items-center justify-center rounded-full glass text-bone transition-colors duration-200 hover:text-ember",
        className
      )}
    >
      <XMark />
    </button>
  )
}
