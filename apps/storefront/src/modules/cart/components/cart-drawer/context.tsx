"use client"

import { createContext, useContext, useMemo, useState } from "react"

type CartDrawerContextType = {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartDrawerContext = createContext<CartDrawerContextType | null>(null)

// Lets the nav, the product page and the mobile bar open the same cart drawer.
export const CartDrawerProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const value = useMemo(
    () => ({
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [isOpen]
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
