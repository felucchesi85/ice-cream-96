"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/lib/types"

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    category: "palitos",
    flavors: [],
    price: 0,
    stockType: "unidad",
    stock: 0,
    imageUrl: "",
    description: "",
  })
  const [flavorsInput, setFlavorsInput] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Process flavors
    const flavors = flavorsInput.trim()
      ? flavorsInput
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f.length > 0)
      : undefined

    const productData = {
      ...product,
      flavors: flavors && flavors.length > 0 ? flavors : undefined,
      id: Date.now(), // Mock ID generation
    }

    // Mock API call - in production this would call your Java backend
    console.log("Creating product:", productData)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    router.push("/admin/productos")
  }

  const handleInputChange = (field: keyof Product, value: any) => {
    setProduct((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/admin/productos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold">Nuevo Producto</h1>
            <p className="text-muted-foreground">Agrega un nuevo producto a tu catálogo</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre del Producto *</Label>
                    <Input
                      id="name"
                      value={product.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ej: Palito de Agua"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      value={product.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe el producto..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoría *</Label>
                      <Select value={product.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="palitos">Palitos</SelectItem>
                          <SelectItem value="tacitas">Tacitas</SelectItem>
                          <SelectItem value="conos">Conos</SelectItem>
                          <SelectItem value="tortas">Tortas</SelectItem>
                          <SelectItem value="postres">Postres</SelectItem>
                          <SelectItem value="criollos">Criollos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="imageUrl">URL de Imagen</Label>
                      <Input
                        id="imageUrl"
                        value={product.imageUrl}
                        onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                        placeholder="/imagen-producto.png"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="flavors">Sabores (opcional)</Label>
                    <Input
                      id="flavors"
                      value={flavorsInput}
                      onChange={(e) => setFlavorsInput(e.target.value)}
                      placeholder="Chocolate, Vainilla, Frutilla (separados por comas)"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Deja vacío si el producto no tiene sabores específicos
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Stock */}
              <Card>
                <CardHeader>
                  <CardTitle>Precio y Stock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Precio *</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="50"
                        value={product.price}
                        onChange={(e) => handleInputChange("price", Number.parseInt(e.target.value) || 0)}
                        placeholder="500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="stock">Stock Inicial *</Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={product.stock}
                        onChange={(e) => handleInputChange("stock", Number.parseInt(e.target.value) || 0)}
                        placeholder="100"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="stockType">Tipo de Stock *</Label>
                      <Select
                        value={product.stockType}
                        onValueChange={(value) => handleInputChange("stockType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unidad">Unidad</SelectItem>
                          <SelectItem value="bolsa">Bolsa</SelectItem>
                          <SelectItem value="kilo">Kilo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Vista Previa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.name || "Producto"}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-muted-foreground">Sin imagen</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold">{product.name || "Nombre del producto"}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                      <p className="text-lg font-bold text-primary">${product.price}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.stock} {product.stockType} disponibles
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 mt-6">
            <Link href="/admin/productos">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Guardando..." : "Guardar Producto"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
