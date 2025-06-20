"use client"

import type React from "react"

import { useState,useEffect } from "react"
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
import { CalendarDays, ClipboardList, Plus, Search, User, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { createCustomer, Customer, CreateCustomerDTO, getAllCustomers, updateCustomer, deleteCustomer } from "@/api/customers"
import { useForm } from "react-hook-form"



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

interface EditPhoneFormData {
  phone: string;
}

export default function ClientesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<CreateCustomerDTO>()

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
    setValue: setEditValue,
  } = useForm<EditPhoneFormData>()

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersData = await getAllCustomers()
        setCustomers(customersData)
      } catch (error) {
        console.error("Error al obtener clientes:", error)
        toast.error("Error al cargar los clientes")
      }
    }
    fetchCustomers()
  }, [])

  const handleCustomerSubmit = async (data: CreateCustomerDTO) => {
    try {
      const response = await createCustomer(data)
      setCustomers(prevCustomers => [...prevCustomers, response])
      toast.success("Cliente creado exitosamente")
      setIsDialogOpen(false)
      resetCreate()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error al crear el cliente: ${error.message}`)
      } else {
        toast.error("Error inesperado al crear el cliente")
      }
      console.error("Error en handleCustomerSubmit:", error)
    }
  }

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer)
    setEditValue('phone', customer.phone)
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = async (data: EditPhoneFormData) => {
    if (!selectedCustomer) return

    // Actualización optimista: actualizamos el estado local inmediatamente
    const updatedCustomer = {
      ...selectedCustomer,
      phone: data.phone
    }
    
    setCustomers(prevCustomers => 
      prevCustomers.map(customer => 
        customer.id === selectedCustomer.id ? updatedCustomer : customer
      )
    )

    try {
      // Llamada al API
      await updateCustomer(selectedCustomer.id, { 
        phone: data.phone,
        name: selectedCustomer.name,
        email: selectedCustomer.email
      })
      
      toast.success("Teléfono actualizado exitosamente")
      setIsEditDialogOpen(false)
      resetEdit()
    } catch (error) {
      // Si hay error, revertimos el cambio en el estado local
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer.id === selectedCustomer.id ? selectedCustomer : customer
        )
      )

      if (error instanceof Error) {
        toast.error(`Error al actualizar el teléfono: ${error.message}`)
      } else {
        toast.error("Error inesperado al actualizar el teléfono")
      }
    }
  }

  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedCustomer) return

    try {
      await deleteCustomer(selectedCustomer.id)
      setCustomers(prevCustomers => prevCustomers.filter(c => c.id !== selectedCustomer.id))
      toast.success("Cliente eliminado exitosamente")
      setIsDeleteDialogOpen(false)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error al eliminar el cliente: ${error.message}`)
      } else {
        toast.error("Error inesperado al eliminar el cliente")
      }
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    if (!customer || !customer.name || !customer.email) return false
    return (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Calcular la paginación
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage)

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
            <form onSubmit={handleSubmitCreate(handleCustomerSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input 
                    id="name" 
                    {...registerCreate("name", { required: "El nombre es requerido" })} 
                    placeholder="Nombre y apellidos" 
                  />
                  {errorsCreate.name && (
                    <span className="text-sm text-red-500">{errorsCreate.name.message}</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...registerCreate("email", { 
                        required: "El email es requerido",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email inválido"
                        }
                      })} 
                      placeholder="correo@ejemplo.com" 
                    />
                    {errorsCreate.email && (
                      <span className="text-sm text-red-500">{errorsCreate.email.message}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input 
                      id="phone" 
                      {...registerCreate("phone", { 
                        required: "El teléfono es requerido",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "El teléfono debe tener 10 dígitos"
                        }
                      })} 
                      placeholder="3146754323" 
                    />
                    {errorsCreate.phone && (
                      <span className="text-sm text-red-500">{errorsCreate.phone.message}</span>
                    )}
                  </div>
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
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{customer.email}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditClick(customer)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteClick(customer)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                    className="h-8 w-8"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Actualice la información del cliente
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(handleEditSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nombre</Label>
                <Input 
                  value={selectedCustomer?.name}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input 
                  value={selectedCustomer?.email}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input 
                  id="edit-phone" 
                  {...registerEdit("phone", { 
                    required: "El teléfono es requerido",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "El teléfono debe tener 10 dígitos"
                    }
                  })} 
                  placeholder="3146754323" 
                />
                {errorsEdit.phone && (
                  <span className="text-sm text-red-500">{errorsEdit.phone.message}</span>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar Cliente</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar al cliente {selectedCustomer?.name}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
