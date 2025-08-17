"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/contexts/cart-context"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedFlavor, setSelectedFlavor] = useState<string>("")
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (product.flavors && product.flavors.length > 0 && !selectedFlavor) {
      alert("Por favor selecciona un sabor")
      return
    }

    addItem(product, quantity, selectedFlavor || undefined)
    setQuantity(1)
    setSelectedFlavor("")
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
        {product.stock < 10 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Stock bajo
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-serif font-bold mb-2">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-3">{product.description}</p>

        {/* Flavor Selection */}
        {product.flavors && product.flavors.length > 0 && (
          <div className="mb-3">
            <label className="text-sm font-medium mb-2 block">Sabor:</label>
            <Select value={selectedFlavor} onValueChange={setSelectedFlavor}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un sabor" />
              </SelectTrigger>
              <SelectContent>
                {product.flavors.map((flavor) => (
                  <SelectItem key={flavor} value={flavor}>
                    {flavor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Quantity Selection */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={decrementQuantity} disabled={quantity <= 1}>
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button variant="outline" size="sm" onClick={incrementQuantity}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">${product.price}</div>
            <div className="text-xs text-muted-foreground">por {product.stockType}</div>
          </div>
        </div>

        <Button className="w-full" onClick={handleAddToCart} disabled={product.stock === 0}>
          {product.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
        </Button>
      </CardContent>
    </Card>
  )
}
