export interface Product {
  id: number
  name: string
  category: "palitos" | "tacitas" | "conos" | "tortas" | "postres" | "criollos"
  flavors?: string[]
  price: number
  stockType: "unidad" | "bolsa" | "kilo"
  stock: number
  imageUrl: string
  description: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedFlavor?: string
}

export interface Promotion {
  id: number
  name: string
  productsIncluded: { productId: number; quantity: number }[]
  promotionalPrice: number
  imageUrl: string
  description: string
}

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  notes?: string
}

export interface PaymentMethod {
  type: "efectivo" | "tarjeta" | "transferencia"
  details?: string
}

export interface Order {
  id: string
  customerInfo: CustomerInfo
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  paymentMethod: PaymentMethod
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  createdAt: string
  estimatedDelivery?: string
}

export interface OrderResponse {
  success: boolean
  order?: Order
  error?: string
}
