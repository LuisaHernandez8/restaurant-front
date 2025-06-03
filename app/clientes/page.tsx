"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, ClipboardList, Plus, Search, User } from "lucide-react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"

// Datos de ejemplo
const customers = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    email: "carlos@ejemplo.com",
    phone: "+34 612 345 678",
    visits: 12,
    lastVisit: "20 Mayo, 2025",
    preferences: ["Vegetariano", "Sin gluten"],
    favoriteItems: ["Paella Valenciana", "Ensalada César"],
    notes: "Prefiere mesa junto a la ventana. Alérgico a los frutos secos.",
  },
  {
    id: 2,
    name: "María López",
    email: "maria@ejemplo.com",
    phone: "+34 623 456 789",
    visits: 8,
    lastVisit: "18 Mayo, 2025",
    preferences: ["Pescado fresco"],
    favoriteItems: ["Ceviche de Camarones", "Sopa de Mariscos"],
    notes: "Celebra su cumpleaños el 15 de junio. Le gusta el vino blanco.",
  },
  {
    id: 3,
    name: "Juan Pérez",
    email: "juan@ejemplo.com",
    phone: "+34 634 567 890",
    visits: 15,
    lastVisit: "15 Mayo, 2025",
    preferences: ["Carnes a la parrilla"],
    favoriteItems: ["Lomo Saltado"],
    notes: "Cliente VIP. Suele venir con grupos grandes de negocios.",
  },
  {
    id: 4,
    name: "Ana Martínez",
    email: "ana@ejemplo.com",
    phone: "+34 645 678 901",
    visits: 5,
    lastVisit: "10 Mayo, 2025",
    preferences: ["Sin lactosa", "Bajo en sal"],
    favoriteItems: ["Ensalada César", "Lomo Saltado"],
    notes: "Intolerante a la lactosa. Prefiere platos bajos en sal.",
  },
  {
    id: 5,
    name: "Roberto Gómez",
    email: "roberto@ejemplo.com",
    phone: "+34 656 789 012",
    visits: 3,
    lastVisit: "5 Mayo, 2025",
    preferences: ["Postres"],
    favoriteItems: ["Tiramisú"],
    notes: "Siempre pide postre. Le gusta sentarse en la terraza.",
  },
]

// Datos de ejemplo para las preferencias
const dietaryPreferences = [
  "Vegetariano",
  "Vegano",
  "Sin gluten",
  "Sin lactosa",
  "Bajo en sal",
  "Bajo en azúcar",
  "Pescado fresco",
  "Carnes a la parrilla",
  "Postres",
]

// Datos de ejemplo para el historial de pedidos
const orderHistory = [
  {
    id: "ORD-001",
    customer: "Carlos Rodríguez",
    date: "20 Mayo, 2025",
    items: [
      { name: "Paella Valenciana", quantity: 2, price: 18.99, notes: "Excelente presentación, le encantó" },
      { name: "Ensalada César", quantity: 1, price: 9.5, notes: "Pidió aderezo extra" },
    ],
    total: 47.48,
  },
  {
    id: "ORD-002",
    customer: "Carlos Rodríguez",
    date: "15 Mayo, 2025",
    items: [
      { name: "Ensalada César", quantity: 1, price: 9.5, notes: "Sin crutones por la intolerancia al gluten" },
      { name: "Lomo Saltado", quantity: 1, price: 16.75, notes: "Término medio" },
    ],
    total: 26.25,
  },
  {
    id: "ORD-003",
    customer: "Carlos Rodríguez",
    date: "10 Mayo, 2025",
    items: [
      { name: "Paella Valenciana", quantity: 1, price: 18.99, notes: "Compartida con su esposa" },
      { name: "Tiramisú", quantity: 2, price: 8.25, notes: "Les encantó el postre" },
    ],
    total: 35.49,
  },
]

export default function ClientesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPreferencesDialogOpen, setIsPreferencesDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [preferenceFilter, setPreferenceFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof customers)[0] | null>(null)
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Cliente guardado con éxito", {
      description: "Los datos del cliente han sido registrados",
    })
    setIsDialogOpen(false)
  }

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Preferencias guardadas con éxito", {
      description: "Las preferencias del cliente han sido actualizadas",
    })
    setIsPreferencesDialogOpen(false)
  }

  const handlePreferenceToggle = (preference: string) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== preference))
    } else {
      setSelectedPreferences([...selectedPreferences, preference])
    }
  }

  const openPreferencesDialog = (customer: (typeof customers)[0]) => {
    setSelectedCustomer(customer)
    setSelectedPreferences(customer.preferences)
    setIsPreferencesDialogOpen(true)
  }

  const openHistoryDialog = (customer: (typeof customers)[0]) => {
    setSelectedCustomer(customer)
    setIsHistoryDialogOpen(true)
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPreference = preferenceFilter === "all" || customer.preferences.includes(preferenceFilter)

    return matchesSearch && matchesPreference
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
              <DialogDescription>Complete los datos para registrar un nuevo cliente</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCustomerSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" placeholder="Nombre y apellidos" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="correo@ejemplo.com" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" placeholder="+34 600 000 000" required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="preferences">Preferencias Alimenticias</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {dietaryPreferences.map((preference, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input type="checkbox" id={`preference-${index}`} className="h-4 w-4 rounded border-gray-300" />
                        <Label htmlFor={`preference-${index}`} className="text-sm font-normal">
                          {preference}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notas Adicionales</Label>
                  <textarea
                    id="notes"
                    className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Alergias, preferencias especiales, etc."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Guardar Cliente</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Filtrar Clientes</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar clientes..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <Label htmlFor="preferenceFilter" className="mb-2 block">
                Preferencia Alimenticia
              </Label>
              <Select value={preferenceFilter} onValueChange={setPreferenceFilter}>
                <SelectTrigger id="preferenceFilter" className="w-full">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {dietaryPreferences.map((preference, index) => (
                    <SelectItem key={index} value={preference}>
                      {preference}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista de Clientes</TabsTrigger>
          <TabsTrigger value="cards">Tarjetas de Clientes</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Visitas</TableHead>
                    <TableHead>Última Visita</TableHead>
                    <TableHead>Preferencias</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={customer.name} />
                            <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{customer.email}</span>
                          <span className="text-sm text-muted-foreground">{customer.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>{customer.visits}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          {customer.lastVisit}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {customer.preferences.map((preference, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {preference}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openPreferencesDialog(customer)}>
                            Preferencias
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openHistoryDialog(customer)}>
                            Historial
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cards" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={customer.name} />
                      <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <CardDescription>{customer.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{customer.lastVisit}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Preferencias</h4>
                    <div className="flex flex-wrap gap-1">
                      {customer.preferences.map((preference, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {preference}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Platos Favoritos</h4>
                    <div className="flex flex-wrap gap-1">
                      {customer.favoriteItems.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Notas</h4>
                    <p className="text-sm text-muted-foreground">{customer.notes}</p>
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={() => openPreferencesDialog(customer)}>
                      Preferencias
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openHistoryDialog(customer)}>
                      Historial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Diálogo de Preferencias */}
      <Dialog open={isPreferencesDialogOpen} onOpenChange={setIsPreferencesDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Preferencias de {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>Actualice las preferencias alimenticias del cliente</DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePreferencesSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Preferencias Alimenticias</Label>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {dietaryPreferences.map((preference, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`preference-edit-${index}`}
                        checked={selectedPreferences.includes(preference)}
                        onChange={() => handlePreferenceToggle(preference)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={`preference-edit-${index}`} className="text-sm font-normal">
                        {preference}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="allergies">Alergias e Intolerancias</Label>
                <Input id="allergies" placeholder="Frutos secos, gluten, etc." />
              </div>
              <div className="grid gap-2">
                <Label>Recomendaciones Personalizadas</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="recommend-vegetarian" />
                    <Label htmlFor="recommend-vegetarian">Recomendar platos vegetarianos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="recommend-gluten-free" />
                    <Label htmlFor="recommend-gluten-free">Recomendar platos sin gluten</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="recommend-low-salt" />
                    <Label htmlFor="recommend-low-salt">Recomendar platos bajos en sal</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar Preferencias</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Historial */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Historial de {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>Historial detallado de pedidos y observaciones</DialogDescription>
          </DialogHeader>
          <div className="max-h-[500px] overflow-y-auto">
            {orderHistory.map((order) => (
              <Card key={order.id} className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{order.id}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {order.date}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">${order.total.toFixed(2)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3 pt-0">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="rounded-md border p-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <div className="text-sm">
                            {item.quantity} x ${item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          <span className="font-medium">Observaciones:</span> {item.notes}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsHistoryDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
