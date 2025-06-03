"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, Clock, Plus, Search, Trash, User } from "lucide-react"
import { toast } from "sonner"

// Datos de ejemplo
const orders = [
  {
    id: "ORD-001",
    customer: "Carlos Rodríguez",
    table: "5",
    date: "20 Mayo, 2025",
    time: "19:45",
    items: [
      { name: "Paella Valenciana", quantity: 2, price: 18.99 },
      { name: "Ensalada César", quantity: 1, price: 9.5 },
      { name: "Tiramisú", quantity: 2, price: 8.25 },
    ],
    status: "completado",
    total: 63.98,
  },
  {
    id: "ORD-002",
    customer: "María López",
    table: "3",
    date: "20 Mayo, 2025",
    time: "20:15",
    items: [
      { name: "Ceviche de Camarones", quantity: 1, price: 12.5 },
      { name: "Lomo Saltado", quantity: 1, price: 16.75 },
    ],
    status: "en proceso",
    total: 29.25,
  },
  {
    id: "ORD-003",
    customer: "Juan Pérez",
    table: "8",
    date: "20 Mayo, 2025",
    time: "20:30",
    items: [
      { name: "Sopa de Mariscos", quantity: 2, price: 14.99 },
      { name: "Paella Valenciana", quantity: 1, price: 18.99 },
      { name: "Tiramisú", quantity: 1, price: 8.25 },
    ],
    status: "pendiente",
    total: 57.22,
  },
]

// Datos de ejemplo para el menú
const menuItems = [
  { id: 1, name: "Paella Valenciana", category: "Plato Principal", price: 18.99 },
  { id: 2, name: "Ceviche de Camarones", category: "Entrada", price: 12.5 },
  { id: 3, name: "Lomo Saltado", category: "Plato Principal", price: 16.75 },
  { id: 4, name: "Tiramisú", category: "Postre", price: 8.25 },
  { id: 5, name: "Ensalada César", category: "Entrada", price: 9.5 },
  { id: 6, name: "Sopa de Mariscos", category: "Entrada", price: 14.99 },
]

export default function PedidosPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orderItems, setOrderItems] = useState<{ id: number; name: string; quantity: number; price: number }[]>([])

  const handleAddItem = (id: number, name: string, price: number) => {
    const existingItem = orderItems.find((item) => item.id === id)

    if (existingItem) {
      setOrderItems(orderItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setOrderItems([...orderItems, { id, name, quantity: 1, price }])
    }
  }

  const handleRemoveItem = (id: number) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id)
      return
    }

    setOrderItems(orderItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Pedido creado con éxito", {
      description: "El pedido ha sido registrado en el sistema",
    })
    setOrderItems([])
    setIsDialogOpen(false)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Pedido
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Pedido</DialogTitle>
              <DialogDescription>Registre un nuevo pedido para un cliente</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleOrderSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="customer">Cliente</Label>
                    <Input id="customer" placeholder="Nombre del cliente" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="table">Mesa</Label>
                    <Select required>
                      <SelectTrigger id="table">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            Mesa {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Platos</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="Entrada">Entradas</SelectItem>
                        <SelectItem value="Plato Principal">Platos Principales</SelectItem>
                        <SelectItem value="Postre">Postres</SelectItem>
                        <SelectItem value="Bebida">Bebidas</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="search" placeholder="Buscar platos..." className="pl-8" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto mb-4">
                    {menuItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddItem(item.id, item.name, item.price)}
                        >
                          Añadir
                        </Button>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-medium mb-2">Pedido Actual</h3>
                  {orderItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay platos seleccionados</p>
                  ) : (
                    <div className="space-y-2">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span>{item.quantity}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-between pt-4 border-t mt-4">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notas Adicionales</Label>
                  <Input id="notes" placeholder="Instrucciones especiales, alergias, etc." />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={orderItems.length === 0}>
                  Crear Pedido
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Pedidos</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar pedidos..."
                  className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="en proceso">En Proceso</SelectItem>
                  <SelectItem value="completado">Completados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Pedidos Activos</TabsTrigger>
          <TabsTrigger value="completed">Pedidos Completados</TabsTrigger>
          <TabsTrigger value="all">Todos los Pedidos</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Mesa</TableHead>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders
                    .filter((order) => order.status !== "completado")
                    .map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {order.customer}
                          </div>
                        </TableCell>
                        <TableCell>Mesa {order.table}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                              {order.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {order.time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "completado"
                                ? "default"
                                : order.status === "en proceso"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Mesa</TableHead>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders
                    .filter((order) => order.status === "completado")
                    .map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {order.customer}
                          </div>
                        </TableCell>
                        <TableCell>Mesa {order.table}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                              {order.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {order.time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{order.status}</Badge>
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Mesa</TableHead>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {order.customer}
                        </div>
                      </TableCell>
                      <TableCell>Mesa {order.table}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            {order.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {order.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "completado"
                              ? "default"
                              : order.status === "en proceso"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
