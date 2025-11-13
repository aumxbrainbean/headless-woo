// src/context/CartContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type CartItem = { id: number; name: string; price: number; image?: string; qty: number; };

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem("cart_v1");
      if (s) setCart(JSON.parse(s));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("cart_v1", JSON.stringify(cart)); } catch {}
  }, [cart]);

  const add = (item: CartItem) => {
    setCart(prev => {
      const id = Number(item.id);
      const existing = prev.find(i => Number(i.id) === id);
      if (existing) {
        return prev.map(i => Number(i.id) === id ? { ...i, qty: i.qty + item.qty } : i);
      }
      return [...prev, { ...item, id }];
    });
  };

  const remove = (id: number) => setCart(prev => prev.filter(i => Number(i.id) !== Number(id)));
  const updateQty = (id: number, qty: number) => setCart(prev => prev.map(i => Number(i.id) === Number(id) ? { ...i, qty } : i));
  const clear = () => { setCart([]); localStorage.removeItem("cart_v1"); };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return <CartContext.Provider value={{ cart, add, remove, updateQty, clear, total }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
