"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"
import { products } from "@/lib/data/products"

export default function AdminDashboard() {
  // Calculate statistics
  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.stock < 20).length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const avgPrice = Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)

  // Mock data for recent orders and sales
  const recentOrders = [
    { id: "ORD-001", customer: "María García", total: 2400, status: "confirmed" },
    { id: "ORD-002", customer: "Juan Pérez", total: 1800, status: "preparing" },
    { id: "ORD-003", customer: "Ana López", total: 3200, status: "ready" },
  ]

  const todaySales = 15600
  const yesterdaySales = 12400
  const salesGrowth = (((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(1)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Resumen general de tu heladería</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">{lowStockProducts} con stock bajo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${todaySales}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />+{salesGrowth}% vs ayer
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStock}</div>
              <p className="text-xs text-muted-foreground">unidades disponibles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${avgPrice}</div>
              <p className="text-xs text-muted-foreground">por producto</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Órdenes Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-muted-foreground">{order.customer}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${order.total}</div>
                      <Badge
                        variant={
                          order.status === "confirmed"
                            ? "default"
                            : order.status === "preparing"
                              ? "secondary"
                              : order.status === "ready"
                                ? "default"
                                : "secondary"
                        }
                      >
                        {order.status === "confirmed" && "Confirmado"}
                        {order.status === "preparing" && "Preparando"}
                        {order.status === "ready" && "Listo"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                Alertas de Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products
                  .filter((p) => p.stock < 20)
                  .slice(0, 5)
                  .map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground capitalize">{product.category}</div>
                      </div>
                      <Badge variant="destructive">
                        {product.stock} {product.stockType}
                      </Badge>
                    </div>
                  ))}
                {products.filter((p) => p.stock < 20).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    ¡Todos los productos tienen stock suficiente!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
