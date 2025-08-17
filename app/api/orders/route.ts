import { type NextRequest, NextResponse } from "next/server"
import type { CustomerInfo, CartItem, PaymentMethod, Order, OrderResponse } from "@/lib/types"

// Mock database - in production this would be replaced with actual database calls
const orders: Order[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerInfo,
      items,
      paymentMethod,
      total,
    }: {
      customerInfo: CustomerInfo
      items: CartItem[]
      paymentMethod: PaymentMethod
      total: number
    } = body

    // Basic validation
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone) {
      return NextResponse.json({
        success: false,
        error: "Información del cliente incompleta",
      } as OrderResponse)
    }

    if (!items || items.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No hay productos en el pedido",
      } as OrderResponse)
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Calculate estimated delivery (2-3 hours from now)
    const estimatedDelivery = new Date()
    estimatedDelivery.setHours(estimatedDelivery.getHours() + 2)

    // Create order
    const newOrder: Order = {
      id: orderId,
      customerInfo,
      items,
      subtotal: total,
      shipping: 0, // Free shipping
      total,
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
      estimatedDelivery: estimatedDelivery.toISOString(),
    }

    // Save order (mock - in production this would be saved to database)
    orders.push(newOrder)

    // Mock stock reduction (in production this would update the database)
    console.log("Stock reduction for order:", orderId)
    items.forEach((item) => {
      console.log(`Reducing stock for product ${item.product.id} by ${item.quantity}`)
    })

    // Mock notification to admin (in production this would send real notifications)
    console.log("New order notification sent to admin:", orderId)

    return NextResponse.json({
      success: true,
      order: newOrder,
    } as OrderResponse)
  } catch (error) {
    console.error("Error processing order:", error)
    return NextResponse.json({
      success: false,
      error: "Error interno del servidor",
    } as OrderResponse)
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get("id")

  if (orderId) {
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      return NextResponse.json({ success: true, order } as OrderResponse)
    } else {
      return NextResponse.json({ success: false, error: "Pedido no encontrado" } as OrderResponse)
    }
  }

  // Return all orders (for admin panel)
  return NextResponse.json({ success: true, orders })
}
