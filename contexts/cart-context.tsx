"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { CartItem, Product } from "@/lib/types"

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number; selectedFlavor?: string } }
  | { type: "REMOVE_ITEM"; payload: { productId: number; selectedFlavor?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; quantity: number; selectedFlavor?: string } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, selectedFlavor } = action.payload
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === product.id && item.selectedFlavor === selectedFlavor,
      )

      let newItems: CartItem[]
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        newItems = [...state.items, { product, quantity, selectedFlavor }]
      }

      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      return { items: newItems, total }
    }

    case "REMOVE_ITEM": {
      const { productId, selectedFlavor } = action.payload
      const newItems = state.items.filter(
        (item) => !(item.product.id === productId && item.selectedFlavor === selectedFlavor),
      )
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      return { items: newItems, total }
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity, selectedFlavor } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { productId, selectedFlavor } })
      }

      const newItems = state.items.map((item) =>
        item.product.id === productId && item.selectedFlavor === selectedFlavor ? { ...item, quantity } : item,
      )
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      return { items: newItems, total }
    }

    case "CLEAR_CART":
      return { items: [], total: 0 }

    case "LOAD_CART":
      return action.payload

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (product: Product, quantity: number, selectedFlavor?: string) => void
  removeItem: (productId: number, selectedFlavor?: string) => void
  updateQuantity: (productId: number, quantity: number, selectedFlavor?: string) => void
  clearCart: () => void
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("heladeria-cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: parsedCart })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("heladeria-cart", JSON.stringify(state))
  }, [state])

  const addItem = (product: Product, quantity: number, selectedFlavor?: string) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity, selectedFlavor } })
  }

  const removeItem = (productId: number, selectedFlavor?: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, selectedFlavor } })
  }

  const updateQuantity = (productId: number, quantity: number, selectedFlavor?: string) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity, selectedFlavor } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, getItemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
