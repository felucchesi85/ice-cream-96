"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"
import type { Order } from "@/lib/types"

interface OrderConfirmationPageProps {
  params: {
    orderId: string
  }
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders?id=${params.orderId}`)
        const result = await response.json()

        if (result.success && result.order) {
          setOrder(result.order)
        } else {
          setError(result.error || "Pedido no encontrado")
        }
      } catch (err) {
        setError("Error al cargar el pedido")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando información del pedido...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold mb-4">Pedido no encontrado</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Link href="/">
              <Button size="lg">Volver al inicio</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { label: "Pendiente", variant: "secondary" as const },
      confirmed: { label: "Confirmado", variant: "default" as const },
      preparing: { label: "Preparando", variant: "default" as const },
      ready: { label: "Listo", variant: "default" as const },
      delivered: { label: "Entregado", variant: "default" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    }

    const config = statusConfig[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">¡Pedido Confirmado!</h1>
          <p className="text-muted-foreground">Tu pedido ha sido recibido y está siendo procesado</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif">Pedido #{order.id}</CardTitle>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-sm text-muted-foreground">Realizado el {formatDate(order.createdAt)}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.estimatedDelivery && (
                  <div className="flex items-center space-x-2 p-3 bg-accent/5 rounded-lg">
                    <Clock className="w-5 h-5 text-accent" />
                    <div>
                      <div className="font-medium">Entrega estimada</div>
                      <div className="text-sm text-muted-foreground">{formatDate(order.estimatedDelivery)}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Productos Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.product.id}-${item.selectedFlavor || "default"}-${index}`}
                      className="flex items-center space-x-4"
                    >
                      <img
                        src={item.product.imageUrl || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        {item.selectedFlavor && (
                          <p className="text-sm text-muted-foreground">Sabor: {item.selectedFlavor}</p>
                        )}
                        <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.product.price * item.quantity}</p>
                        <p className="text-sm text-muted-foreground">${item.product.price} c/u</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Información de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">
                      {order.customerInfo.firstName} {order.customerInfo.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">{order.customerInfo.address}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.customerInfo.city} {order.customerInfo.postalCode}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">{order.customerInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">{order.customerInfo.email}</span>
                </div>
                {order.customerInfo.notes && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-1">Notas adicionales:</div>
                    <div className="text-sm text-muted-foreground">{order.customerInfo.notes}</div>
                  </div>
                )}
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
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>{order.shipping === 0 ? "Gratis" : `$${order.shipping}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${order.total}</span>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium mb-1">Método de pago:</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {order.paymentMethod.type === "efectivo" && "Efectivo (contra entrega)"}
                    {order.paymentMethod.type === "tarjeta" && "Tarjeta de crédito/débito"}
                    {order.paymentMethod.type === "transferencia" && "Transferencia bancaria"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href="/">
                    <Button variant="outline" className="w-full bg-transparent">
                      Seguir Comprando
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => window.print()}>
                    Imprimir Pedido
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
