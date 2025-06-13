"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { getAllCustomers, type Customer } from "@/api/customers"
import { getOrders, createOrder, type Order, type CreateOrderDTO } from "@/api/orders"
import { getDishes, type Dish } from "@/api/dishes"

export default function PedidosPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [orderItems, setOrderItems] = useState<{ id: number; name: string; quantity: number; price: number }[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [dishes, setDishes] = useState<Dish[]>([])
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dishSearchTerm, setDishSearchTerm] = useState("")

  const fetchOrders = async () => {
    try {
      const response = await getOrders()
      setOrders(response)
    } catch (error) {
      console.error("Error al cargar los pedidos:", error)
      toast.error("Error al cargar los pedidos")
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, dishesData] = await Promise.all([
          getAllCustomers(),
          getDishes()
        ])
        setCustomers(customersData)
        setDishes(dishesData)
        await fetchOrders()
      } catch (error) {
        console.error("Error al cargar los datos:", error)
        toast.error("Error al cargar los datos")
      }
    }
    fetchData()
  }, [])

  const handleAddItem = (id: number, name: string, price: string | number) => {
    const existingItem = orderItems.find((item) => item.id === id)
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price

    if (existingItem) {
      setOrderItems(orderItems.map((item) => 
        item.id === id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ))
    } else {
      setOrderItems([...orderItems, { id, name, quantity: 1, price: numericPrice }])
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
    return orderItems.reduce((total, item) => {
      const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price
      return total + (itemPrice * item.quantity)
    }, 0)
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCustomer) {
      toast.error("Por favor seleccione un cliente")
      return
    }

    if (orderItems.length === 0) {
      toast.error("Por favor agregue al menos un plato al pedido")
      return
    }

    try {
      const orderData: CreateOrderDTO = {
        customer_id: parseInt(selectedCustomer),
        dishes: orderItems.map(item => ({
          dish_id: item.id,
          quantity: item.quantity
        }))
      }

      await createOrder(orderData)
      toast.success("Pedido creado con éxito")
    setOrderItems([])
      setSelectedCustomer("")
    setIsDialogOpen(false)
      // Actualizar la lista de pedidos
      await fetchOrders()
    } catch (error: any) {
      console.error("Error al crear el pedido:", error)
      toast.error(error.message || "Error al crear el pedido")
    }
  }

  const filteredOrders = orders.filter((order) => {
    return order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm)
  })

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(dishSearchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || dish.category === categoryFilter
    return matchesSearch && matchesCategory && dish.available
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "d 'de' MMMM, yyyy", { locale: es })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "HH:mm", { locale: es })
  }

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(numericPrice)
  }

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
                  <div className="grid gap-2">
                    <Label htmlFor="customer">Cliente</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer} required>
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Platos</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                      <Input 
                        type="search" 
                        placeholder="Buscar platos..." 
                        className="pl-8"
                        value={dishSearchTerm}
                        onChange={(e) => setDishSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto mb-4">
                    {filteredDishes.map((dish) => (
                      <div key={dish.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <p className="font-medium">{dish.name}</p>
                          <p className="text-sm text-muted-foreground">{formatPrice(dish.price)}</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddItem(dish.id, dish.name, dish.price)}
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
                            <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
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
                        <span className="font-bold">{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={orderItems.length === 0 || !selectedCustomer}>
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
            </div>
          </div>
        </CardHeader>
      </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Total</TableHead>
                <TableHead>Detalles</TableHead>
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
                      {order.customer_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {formatDate(order.order_date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        {formatTime(order.order_date)}
                          </div>
                        </div>
                      </TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                      <TableCell>
                    <div className="space-y-1">
                      {order.order_details.map((detail, index) => (
                        <div key={index} className="text-sm">
                          {detail.quantity}x {detail.dish_name}
                        </div>
                      ))}
                    </div>
                      </TableCell>
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
    </div>
  )
}
