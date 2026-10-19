"use client"

import { createContext, useContext, useMemo, useState } from "react"

type CartDrawerContextType = {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  /**
   * Open the drawer once the cart shows this variant, so it never flashes the
   * previous (empty) cart while the refreshed one is still on its way.
   */
  openCartFor: (variantId: string) => void
  /** Variant waiting to appear before the drawer opens (read by the drawer). */
  pendingVariantId: string | null
}

const CartDrawerContext = createContext<CartDrawerContextType | null>(null)

// Lets the nav, the product page and the mobile bar open the same cart drawer.
export const CartDrawerProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [pendingVariantId, setPendingVariantId] = useState<string | null>(null)

  const value = useMemo(
    () => ({
      isOpen,
      openCart: () => {
        setPendingVariantId(null)
        setIsOpen(true)
      },
      closeCart: () => setIsOpen(false),
      openCartFor: (variantId: string) => setPendingVariantId(variantId),
      pendingVariantId,
    }),
    [isOpen, pendingVariantId]
  )

  return (
    <CartDrawerContext.Provider value={value}>
      {children}
    </CartDrawerContext.Provider>
  )
}

export const useCartDrawer = () => {
  const context = useContext(CartDrawerContext)
  if (!context) {
    throw new Error("useCartDrawer must be used within a CartDrawerProvider")
  }
  return context
}
