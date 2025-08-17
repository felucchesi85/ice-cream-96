"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Package, Clock, CheckCircle, XCircle } from "lucide-react"

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock orders data
  const orders = [
    {
      id: "ORD-1705123456789-abc123def",
      customerName: "María García",
      email: "maria@email.com",
      phone: "(011) 1234-5678",
      total: 2400,
      status: "confirmed",
      createdAt: "2025-01-13T10:30:00Z",
      items: [
        { name: "Palito de Agua", flavor: "Limón", quantity: 2, price: 500 },
        { name: "Tacita de Chocolate", quantity: 1, price: 1400 },
      ],
    },
    {
      id: "ORD-1705123456790-def456ghi",
      customerName: "Juan Pérez",
      email: "juan@email.com",
      phone: "(011) 2345-6789",
      total: 1800,
      status: "preparing",
      createdAt: "2025-01-13T09:15:00Z",
      items: [{ name: "Cono Triple", quantity: 1, price: 1800 }],
    },
    {
      id: "ORD-1705123456791-ghi789jkl",
      customerName: "Ana López",
      email: "ana@email.com",
      phone: "(011) 3456-7890",
      total: 3200,
      status: "ready",
      createdAt: "2025-01-13T08:45:00Z",
      items: [
        { name: "Torta Chocolate", quantity: 1, price: 3500 },
        { name: "Palito Bombón", flavor: "Chocolate", quantity: 2, price: 800 },
      ],
    },
    {
      id: "ORD-1705123456792-jkl012mno",
      customerName: "Carlos Ruiz",
      email: "carlos@email.com",
      phone: "(011) 4567-8901",
      total: 1600,
      status: "delivered",
      createdAt: "2025-01-12T16:20:00Z",
      items: [
        { name: "Tacita de Frutilla", quantity: 1, price: 1200 },
        { name: "Palito de Crema", flavor: "Vainilla", quantity: 1, price: 650 },
      ],
    },
    {
      id: "ORD-1705123456793-mno345pqr",
      customerName: "Laura Martín",
      email: "laura@email.com",
      phone: "(011) 5678-9012",
      total: 2800,
      status: "cancelled",
      createdAt: "2025-01-12T14:10:00Z",
      items: [{ name: "Postre Familiar Almendrado", quantity: 1, price: 2800 }],
    },
  ]

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", variant: "secondary" as const, icon: Clock },
      confirmed: { label: "Confirmado", variant: "default" as const, icon: CheckCircle },
      preparing: { label: "Preparando", variant: "default" as const, icon: Package },
      ready: { label: "Listo", variant: "default" as const, icon: CheckCircle },
      delivered: { label: "Entregado", variant: "default" as const, icon: CheckCircle },
      cancelled: { label: "Cancelado", variant: "destructive" as const, icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // Mock function - in production this would call your Java backend
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
    // Here you would make an API call to update the order status
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold">Órdenes</h1>
          <p className="text-muted-foreground">Gestiona los pedidos de tus clientes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Órdenes</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold">
                    {orders.filter((o) => o.status === "pending" || o.status === "confirmed").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En Preparación</p>
                  <p className="text-2xl font-bold">
                    {orders.filter((o) => o.status === "preparing" || o.status === "ready").length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completadas</p>
                  <p className="text-2xl font-bold">{orders.filter((o) => o.status === "delivered").length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por ID, cliente o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="preparing">Preparando</SelectItem>
                  <SelectItem value="ready">Listo</SelectItem>
                  <SelectItem value="delivered">Entregado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Órdenes ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Orden</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id.split("-")[1].substring(0, 8)}...</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-muted-foreground">{order.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell className="font-medium">${order.total}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {order.status === "confirmed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "preparing")}
                            >
                              Preparar
                            </Button>
                          )}
                          {order.status === "preparing" && (
                            <Button variant="outline" size="sm" onClick={() => updateOrderStatus(order.id, "ready")}>
                              Marcar Listo
                            </Button>
                          )}
                          {order.status === "ready" && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "delivered")}
                            >
                              Entregar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
