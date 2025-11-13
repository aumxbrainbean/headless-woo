// src/context/CartContext.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  image?: string
  qty: number
}

export interface CartContextType {
  cart: CartItem[]
  add: (item: CartItem) => void
  remove: (id: number) => void
  updateQty: (id: number, qty: number) => void
  clear: () => void
  total: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart_v1")
      if (stored) setCart(JSON.parse(stored))
    } catch {}
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart_v1", JSON.stringify(cart))
    } catch {}
  }, [cart])

  const add = (item: CartItem) => {
    setCart(prev => {
      const id = Number(item.id)
      const existing = prev.find(i => Number(i.id) === id)

      if (existing) {
        return prev.map(i =>
          Number(i.id) === id
            ? { ...i, qty: i.qty + item.qty }
            : i
        )
      }

      return [...prev, { ...item, id }]
    })
  }

  const remove = (id: number) =>
    setCart(prev => prev.filter(i => Number(i.id) !== Number(id)))

  const updateQty = (id: number, qty: number) =>
    setCart(prev =>
      prev.map(i =>
        Number(i.id) === Number(id)
          ? { ...i, qty }
          : i
      )
    )

  const clear = () => {
    setCart([])
    localStorage.removeItem("cart_v1")
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  const value: CartContextType = {
    cart,
    add,
    remove,
    updateQty,
    clear,
    total,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
