"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Banknote, Smartphone } from "lucide-react"
import Link from "next/link"
import type { CustomerInfo, PaymentMethod, OrderResponse } from "@/lib/types"

export default function CheckoutPage() {
  const { state, clearCart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "efectivo",
  })

  // Redirect if cart is empty
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold mb-4">No hay productos en tu carrito</h1>
            <p className="text-muted-foreground mb-8">Agrega algunos productos antes de proceder al checkout</p>
            <Link href="/">
              <Button size="lg">Explorar Productos</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitOrder = async () => {
    // Basic validation
    const requiredFields: (keyof CustomerInfo)[] = ["firstName", "lastName", "email", "phone", "address", "city"]
    const missingFields = requiredFields.filter((field) => !customerInfo[field].trim())

    if (missingFields.length > 0) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerInfo,
          items: state.items,
          paymentMethod,
          total: state.total,
        }),
      })

      const result: OrderResponse = await response.json()

      if (result.success && result.order) {
        clearCart()
        router.push(`/pedido-confirmado/${result.order.id}`)
      } else {
        alert(result.error || "Error al procesar el pedido")
      }
    } catch (error) {
      console.error("Error submitting order:", error)
      alert("Error al procesar el pedido. Por favor intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/carrito">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Carrito
              </Button>
            </Link>
            <h1 className="text-2xl font-serif font-bold text-primary">Checkout</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(011) 1234-5678"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Información de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Calle y número"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Tu ciudad"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Código Postal</Label>
                    <Input
                      id="postalCode"
                      value={customerInfo.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      placeholder="1234"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Textarea
                    id="notes"
                    value={customerInfo.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Instrucciones especiales para la entrega..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Método de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod.type}
                  onValueChange={(value) => setPaymentMethod({ type: value as PaymentMethod["type"] })}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="efectivo" id="efectivo" />
                    <Banknote className="w-5 h-5 text-muted-foreground" />
                    <Label htmlFor="efectivo" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">Efectivo</div>
                        <div className="text-sm text-muted-foreground">Pago contra entrega</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="tarjeta" id="tarjeta" />
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <Label htmlFor="tarjeta" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">Tarjeta de Crédito/Débito</div>
                        <div className="text-sm text-muted-foreground">Visa, Mastercard, American Express</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="transferencia" id="transferencia" />
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    <Label htmlFor="transferencia" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">Transferencia Bancaria</div>
                        <div className="text-sm text-muted-foreground">Mercado Pago, Banco, etc.</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="font-serif">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {state.items.map((item, index) => (
                    <div
                      key={`${item.product.id}-${item.selectedFlavor || "default"}-${index}`}
                      className="flex justify-between text-sm"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{item.product.name}</div>
                        {item.selectedFlavor && (
                          <div className="text-muted-foreground">Sabor: {item.selectedFlavor}</div>
                        )}
                        <div className="text-muted-foreground">Cantidad: {item.quantity}</div>
                      </div>
                      <div className="font-medium">${item.product.price * item.quantity}</div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${state.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${state.total}</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={handleSubmitOrder} disabled={isLoading}>
                  {isLoading ? "Procesando..." : "Confirmar Pedido"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Al confirmar tu pedido aceptas nuestros términos y condiciones
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
