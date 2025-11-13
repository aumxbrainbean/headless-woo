"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/components/ToastProvider"
import { motion } from "framer-motion"
import { ShoppingCart, Check } from "lucide-react"

export default function ProductClient({ product }: any) {
  const toast = useToast()
  const { add } = useCart()
  const [qty, setQty] = useState<number>(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    add({
      id: Number(product.id),
      name: product.name,
      price: Number(product.price || 0),
      image: product.image,
      qty,
    })
    if (toast?.show) toast.show(`${product.name} added to cart`)
    else alert(`${product.name} added to cart`)

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <label htmlFor="quantity" className="text-sm font-normal text-foreground">
          Quantity
        </label>
        <div className="flex items-center border border-border">
          <button
            onClick={() => setQty((v) => Math.max(1, v - 1))}
            className="px-4 py-3 hover:bg-secondary transition-colors font-light"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id="quantity"
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number.parseInt(e.target.value) || 1))}
            className="w-20 text-center py-3 focus:outline-none bg-background font-light border-x border-border"
          />
          <button
            onClick={() => setQty((v) => v + 1)}
            className="px-4 py-3 hover:bg-secondary transition-colors font-light"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <motion.button
        onClick={handleAdd}
        className={`w-full px-8 py-4 font-normal text-base transition-all duration-300 flex items-center justify-center gap-3 ${added ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        whileHover={{ scale: added ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {added ? (
          <>
            <Check size={20} />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            Add to Cart
          </>
        )}
      </motion.button>
    </div>
  )
}
