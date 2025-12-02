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
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Filter, Plus, Search, User, Users } from "lucide-react"
import { toast } from "sonner"
import { format, addDays, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { getAllCustomers, createCustomer, type Customer, type CreateCustomerDTO } from "@/api/customers"
import { getTables, type Table } from "@/api/tables"
import { createReservation, getAllReservations, type Reservation, updateReservation, deleteReservation } from "@/api/reservations"
import { useForm } from "react-hook-form"

export default function ReservasPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [guestsFilter, setGuestsFilter] = useState("all")
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false)
  const [formData, setFormData] = useState({
    customer_id: "",
    table_id: "",
    reservation_date: format(new Date(), "yyyy-MM-dd"),
    reservation_time: "20:00"
  })

  // Formulario para crear cliente
  const {
    register: registerCustomer,
    handleSubmit: handleSubmitCustomer,
    reset: resetCustomer,
    formState: { errors: errorsCustomer },
  } = useForm<CreateCustomerDTO>()

  const fetchReservations = async () => {
    try {
      const response = await getAllReservations()
      setReservations(response)
    } catch (error) {
      console.error("Error al cargar las reservas:", error)
      toast.error("Error al cargar las reservas")
    }
  }

  const fetchCustomers = async () => {
    try {
      const customersData = await getAllCustomers()
      setCustomers(customersData)
    } catch (error) {
      console.error("Error al cargar los clientes:", error)
      toast.error("Error al cargar los clientes")
    }
  }

  const handleCreateCustomer = async (data: CreateCustomerDTO) => {
    try {
      const newCustomer = await createCustomer(data)
      setCustomers(prevCustomers => [...prevCustomers, newCustomer])
      setFormData(prev => ({ ...prev, customer_id: newCustomer.id.toString() }))
      setIsCreatingCustomer(false)
      resetCustomer()
      toast.success("Cliente creado exitosamente")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error al crear el cliente: ${error.message}`)
      } else {
        toast.error("Error inesperado al crear el cliente")
      }
      console.error("Error en handleCreateCustomer:", error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tablesData] = await Promise.all([
          getTables()
        ])
        setTables(tablesData)
        await Promise.all([
          fetchCustomers(),
          fetchReservations()
        ])
      } catch (error) {
        console.error("Error al cargar los datos:", error)
        toast.error("Error al cargar los datos")
      }
    }
    fetchData()
  }, [])

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setIsCreatingCustomer(false)
      resetCustomer()
      setFormData({
        customer_id: "",
        table_id: "",
        reservation_date: format(new Date(), "yyyy-MM-dd"),
        reservation_time: "20:00"
      })
    }
  }

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que todos los campos estén llenos
    if (!formData.customer_id || !formData.table_id || !formData.reservation_date || !formData.reservation_time) {
      toast.error("Por favor complete todos los campos")
      return
    }

    // Validar que la fecha de la reserva no sea menor a la fecha actual (solo YYYY-MM-DD)
    const todayStr = new Date().toISOString().slice(0, 10)
    if (formData.reservation_date < todayStr) {
      toast.error("La fecha de la reserva no puede ser menor a la fecha actual")
      return
    }

    try {
      // Formatear la fecha y hora
      const [hours, minutes] = formData.reservation_time.split(':')
      const reservationDate = new Date(formData.reservation_date)
      reservationDate.setHours(parseInt(hours), parseInt(minutes))

      await createReservation({
        customer_id: parseInt(formData.customer_id),
        table_id: parseInt(formData.table_id),
        reservation_date: reservationDate.toISOString(),
        reservation_time: formData.reservation_time
      })
      
      toast.success("Reserva creada con éxito")
      setIsDialogOpen(false)
      setIsCreatingCustomer(false)
      resetCustomer()
      setFormData({
        customer_id: "",
        table_id: "",
        reservation_date: format(new Date(), "yyyy-MM-dd"),
        reservation_time: "20:00"
      })
      // Actualizar la lista de reservas inmediatamente
      await fetchReservations()
    } catch (error: any) {
      console.error("Error al crear la reserva:", error)
      // Mostrar el mensaje de error en un toast con estilo de error
      toast.error(error.message || "Error al crear la reserva", {
        duration: 5000,
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5'
        }
      })
    }
  }

  const handleDateChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedDate(subDays(selectedDate, 1))
    } else {
      setSelectedDate(addDays(selectedDate, 1))
    }
  }

  const openDetailDialog = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setIsDetailDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "d 'de' MMMM, yyyy", { locale: es })
  }

  const filteredReservations = reservations.filter((reservation) => {
    const customer = customers.find(c => c.id === reservation.customer_id)
    const matchesSearch = customer && (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter

    const table = tables.find(t => t.id === reservation.table_id)
    const matchesGuests =
      guestsFilter === "all" ||
      (guestsFilter === "1-2" && table && table.capacity <= 2) ||
      (guestsFilter === "3-4" && table && table.capacity >= 3 && table.capacity <= 4) ||
      (guestsFilter === "5+" && table && table.capacity >= 5)

    // Convertir la fecha de la reserva a formato YYYY-MM-DD para comparar
    const reservationDate = new Date(reservation.reservation_date)
    const formattedReservationDate = format(reservationDate, "yyyy-MM-dd")
    const formattedSelectedDate = format(selectedDate, "yyyy-MM-dd")
    
    const matchesDate = formattedReservationDate === formattedSelectedDate

    return matchesSearch && matchesStatus && matchesGuests && matchesDate
  })

  // Agrupar reservas por hora
  const reservationsByTime = filteredReservations.reduce((acc: Record<string, Reservation[]>, reservation: Reservation) => {
    const hour = reservation.reservation_time.split(":")[0]
    if (!acc[hour]) {
      acc[hour] = []
    }
    acc[hour].push(reservation)
    return acc
  }, {})

  // Ordenar horas
  const sortedHours = Object.keys(reservationsByTime).sort()

  const handleDeleteReservation = async () => {
    if (!selectedReservation) return

    try {
      // Eliminación optimista
      setReservations(prevReservations => 
        prevReservations.filter(reservation => reservation.id !== selectedReservation.id)
      )

      await deleteReservation(selectedReservation.id)
      toast.success("Reserva eliminada exitosamente")
      setIsDeleteDialogOpen(false)
      setIsDetailDialogOpen(false)
    } catch (error) {
      // Revertir cambios si hay error
      setReservations(prevReservations => [...prevReservations, selectedReservation])

      if (error instanceof Error) {
        toast.error(`Error al eliminar la reserva: ${error.message}`)
      } else {
        toast.error("Error inesperado al eliminar la reserva")
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-restaurant-black">Gestión de Reservas</h1>
        <div className="flex gap-2">
          <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-restaurant-stone/20 bg-white text-restaurant-black hover:bg-restaurant-stone/10"
              >
                <Filter className="mr-2 h-4 w-4 text-restaurant-gold" />
                Filtros
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-restaurant-stone/10 bg-white">
              <DialogHeader>
                <DialogTitle className="text-restaurant-black">Filtrar Reservas</DialogTitle>
                <DialogDescription className="text-restaurant-stone">
                  Ajuste los filtros para encontrar reservas específicas
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="status-filter" className="text-restaurant-black">
                    Estado
                  </Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status-filter" className="border-restaurant-stone/20 bg-white">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent className="border-restaurant-stone/10 bg-white">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="confirmada">Confirmadas</SelectItem>
                      <SelectItem value="pendiente">Pendientes</SelectItem>
                      <SelectItem value="cancelada">Canceladas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="guests-filter" className="text-restaurant-black">
                    Número de Personas
                  </Label>
                  <Select value={guestsFilter} onValueChange={setGuestsFilter}>
                    <SelectTrigger id="guests-filter" className="border-restaurant-stone/20 bg-white">
                      <SelectValue placeholder="Cualquier tamaño" />
                    </SelectTrigger>
                    <SelectContent className="border-restaurant-stone/10 bg-white">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="1-2">1-2 personas</SelectItem>
                      <SelectItem value="3-4">3-4 personas</SelectItem>
                      <SelectItem value="5+">5 o más personas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsFilterDialogOpen(false)}>Aplicar Filtros</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Reserva
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-restaurant-stone/10 bg-white">
              <DialogHeader>
                <DialogTitle className="text-restaurant-black">Nueva Reserva</DialogTitle>
                <DialogDescription className="text-restaurant-stone">
                  Complete los detalles para crear una nueva reserva
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleReservationSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="customer" className="text-restaurant-black">
                      Cliente
                    </Label>
                    <Select
                      value={isCreatingCustomer ? "new" : formData.customer_id}
                      onValueChange={(value) => {
                        if (value === "new") {
                          setIsCreatingCustomer(true)
                          setFormData({ ...formData, customer_id: "" })
                        } else {
                          setIsCreatingCustomer(false)
                          setFormData({ ...formData, customer_id: value })
                        }
                      }}
                      required
                    >
                      <SelectTrigger id="customer" className="border-restaurant-stone/20 bg-white">
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent className="border-restaurant-stone/10 bg-white">
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.name} - {customer.phone}
                          </SelectItem>
                        ))}
                        <SelectItem value="new" className="font-medium text-restaurant-gold">
                          <Plus className="mr-2 h-4 w-4 inline" />
                          Crear nuevo cliente
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {/* Formulario para crear nuevo cliente */}
                    {isCreatingCustomer && (
                      <Card className="border-restaurant-gold/30 bg-restaurant-ivory/50 p-4">
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <Label htmlFor="new-customer-name" className="text-restaurant-black">
                              Nombre Completo
                            </Label>
                            <Input
                              id="new-customer-name"
                              {...registerCustomer("name", { required: "El nombre es requerido" })}
                              placeholder="Nombre y apellidos"
                              className="border-restaurant-stone/20 bg-white"
                            />
                            {errorsCustomer.name && (
                              <span className="text-sm text-red-500">{errorsCustomer.name.message}</span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="new-customer-email" className="text-restaurant-black">
                                Email
                              </Label>
                              <Input
                                id="new-customer-email"
                                type="email"
                                {...registerCustomer("email", {
                                  required: "El email es requerido",
                                  pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email inválido"
                                  }
                                })}
                                placeholder="correo@ejemplo.com"
                                className="border-restaurant-stone/20 bg-white"
                              />
                              {errorsCustomer.email && (
                                <span className="text-sm text-red-500">{errorsCustomer.email.message}</span>
                              )}
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="new-customer-phone" className="text-restaurant-black">
                                Teléfono
                              </Label>
                              <Input
                                id="new-customer-phone"
                                {...registerCustomer("phone", {
                                  required: "El teléfono es requerido",
                                  pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "El teléfono debe tener 10 dígitos"
                                  }
                                })}
                                placeholder="3146754323"
                                className="border-restaurant-stone/20 bg-white"
                              />
                              {errorsCustomer.phone && (
                                <span className="text-sm text-red-500">{errorsCustomer.phone.message}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              type="button"
                              size="sm"
                              onClick={handleSubmitCustomer(handleCreateCustomer)}
                            >
                              Crear Cliente
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setIsCreatingCustomer(false)
                                resetCustomer()
                              }}
                              className="border-restaurant-stone/20 bg-white"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="table" className="text-restaurant-black">
                      Mesa
                    </Label>
                    <Select
                      value={formData.table_id}
                      onValueChange={(value) => setFormData({ ...formData, table_id: value })}
                      required
                    >
                      <SelectTrigger id="table" className="border-restaurant-stone/20 bg-white">
                        <SelectValue placeholder="Seleccionar mesa" />
                      </SelectTrigger>
                      <SelectContent className="border-restaurant-stone/10 bg-white">
                        {tables.map((table) => (
                          <SelectItem key={table.id} value={table.id.toString()}>
                            Mesa {table.id} - {table.capacity} personas ({table.location})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date" className="text-restaurant-black">
                        Fecha
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.reservation_date}
                        onChange={(e) => setFormData({ ...formData, reservation_date: e.target.value })}
                        required
                        className="border-restaurant-stone/20 bg-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time" className="text-restaurant-black">
                        Hora
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.reservation_time}
                        onChange={(e) => setFormData({ ...formData, reservation_time: e.target.value })}
                        required
                        className="border-restaurant-stone/20 bg-white"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Crear Reserva</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="mb-4 elegant-card border-restaurant-stone/10 bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDateChange("prev")}
                  className="border-restaurant-stone/20 bg-white text-restaurant-black hover:bg-restaurant-stone/10"
                >
                  <ChevronLeft className="h-4 w-4 text-restaurant-gold" />
                </Button>
                <div className="w-[280px] md:w-[320px] px-4 text-center">
                  <div className="text-lg font-medium truncate text-restaurant-black">
                    {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDateChange("next")}
                  className="border-restaurant-stone/20 bg-white text-restaurant-black hover:bg-restaurant-stone/10"
                >
                  <ChevronRight className="h-4 w-4 text-restaurant-gold" />
                </Button>
              </div>
              <div className="flex items-center">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-restaurant-gold" />
                  <Input
                    type="search"
                    placeholder="Buscar reservas..."
                    className="pl-8 w-full sm:w-[200px] md:w-[300px] border-restaurant-stone/20 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-restaurant-gold/30 text-restaurant-gold"
              >
                <CalendarDays className="h-3 w-3" />
                {format(selectedDate, "yyyy-MM-dd")}
              </Badge>
              {statusFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-restaurant-wine/10 text-restaurant-wine"
                >
                  Estado: {statusFilter}
                </Badge>
              )}
              {guestsFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-restaurant-wine/10 text-restaurant-wine"
                >
                  <Users className="h-3 w-3" />
                  {guestsFilter === "1-2" ? "1-2 personas" : guestsFilter === "3-4" ? "3-4 personas" : "5+ personas"}
                </Badge>
              )}
              {(statusFilter !== "all" || guestsFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-restaurant-stone hover:text-restaurant-black hover:bg-restaurant-stone/10"
                  onClick={() => {
                    setStatusFilter("all")
                    setGuestsFilter("all")
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {filteredReservations.length === 0 ? (
          <Card className="elegant-card border-restaurant-stone/10 bg-white">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <CalendarDays className="mb-4 h-12 w-12 text-restaurant-gold" />
              <h3 className="mb-2 text-lg font-medium text-restaurant-black">No hay reservas para esta fecha</h3>
              <p className="text-restaurant-stone">
                No se encontraron reservas para el {format(selectedDate, "d 'de' MMMM", { locale: es })} con los filtros
                seleccionados.
              </p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Nueva Reserva
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="timeline" className="space-y-4">
              <TabsList className="border border-restaurant-stone/10 bg-white">
                <TabsTrigger
                  value="timeline"
                  className="data-[state=active]:bg-restaurant-gold data-[state=active]:text-restaurant-black"
                >
                  Línea de Tiempo
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="data-[state=active]:bg-restaurant-gold data-[state=active]:text-restaurant-black"
                >
                  Lista
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="space-y-4">
                {sortedHours.map((hour) => (
                  <Card key={hour} className="elegant-card overflow-hidden border-restaurant-stone/10 bg-white">
                    <CardHeader className="bg-restaurant-olive/10 p-4">
                      <CardTitle className="text-base flex items-center gap-2 text-restaurant-black">
                        <Clock className="h-4 w-4 text-restaurant-gold" />
                        {hour}:00 - {Number.parseInt(hour) + 1}:00
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {reservationsByTime[hour].map((reservation) => {
                          const customer = customers.find(c => c.id === reservation.customer_id)
                          const table = tables.find(t => t.id === reservation.table_id)
                          return (
                          <Card
                            key={reservation.id}
                            className="elegant-card overflow-hidden border-l-4 border-restaurant-stone/10 bg-white"
                              style={{ borderLeftColor: "#D4AF37" }}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-restaurant-black">{customer?.name}</h3>
                                  <div className="flex items-center gap-1 text-sm text-restaurant-stone">
                                    <Clock className="h-3 w-3 text-restaurant-gold" />
                                      {reservation.reservation_time}
                                  </div>
                                </div>
                                <Badge
                                    variant="default"
                                    className="bg-restaurant-olive text-restaurant-ivory"
                                  >
                                    Confirmada
                                </Badge>
                              </div>
                              <div className="mt-2 flex items-center gap-1 text-sm">
                                <Users className="h-3 w-3 text-restaurant-gold" />
                                <span className="text-restaurant-black">
                                    Mesa {table?.id} - {table?.capacity} personas ({table?.location})
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 w-full text-restaurant-wine hover:text-restaurant-wine hover:bg-restaurant-wine/10"
                                onClick={() => openDetailDialog(reservation)}
                              >
                                Ver Detalles
                              </Button>
                            </CardContent>
                          </Card>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="list">
                <Card className="elegant-card border-restaurant-stone/10 bg-white">
                  <CardContent className="p-0">
                    <UITable>
                      <TableHeader className="bg-restaurant-ivory">
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Mesa</TableHead>
                          <TableHead>Hora</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReservations.map((reservation) => {
                          const customer = customers.find(c => c.id === reservation.customer_id)
                          const table = tables.find(t => t.id === reservation.table_id)
                          return (
                          <TableRow key={reservation.id} className="hover:bg-restaurant-ivory/50">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 border border-restaurant-gold/20">
                                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={customer?.name} />
                                  <AvatarFallback className="bg-restaurant-olive text-restaurant-ivory">
                                      {customer?.name?.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium text-restaurant-black">{customer?.name}</div>
                                    <div className="text-xs text-restaurant-stone">{customer?.phone}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4 text-restaurant-gold" />
                                  Mesa {table?.id} ({table?.location})
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-restaurant-gold" />
                                  {reservation.reservation_time}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                  variant="default"
                                  className="bg-restaurant-olive text-restaurant-ivory"
                                >
                                  Confirmada
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-restaurant-wine hover:text-restaurant-wine hover:bg-restaurant-wine/10"
                                onClick={() => openDetailDialog(reservation)}
                              >
                                Detalles
                              </Button>
                            </TableCell>
                          </TableRow>
                          )
                        })}
                      </TableBody>
                    </UITable>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Diálogo de Detalles de Reserva */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-restaurant-stone/10 bg-white">
          <DialogHeader>
            <DialogTitle className="text-restaurant-black">Detalles de Reserva</DialogTitle>
            <DialogDescription className="text-restaurant-stone">
              Reserva #{selectedReservation?.id} - {selectedReservation && formatDate(selectedReservation.reservation_date)}
            </DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="grid gap-4 py-4">
              {(() => {
                const customer = customers.find(c => c.id === selectedReservation.customer_id)
                const table = tables.find(t => t.id === selectedReservation.table_id)
                return (
                  <>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border border-restaurant-gold/20">
                        <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={customer?.name} />
                  <AvatarFallback className="bg-restaurant-olive text-restaurant-ivory">
                          {customer?.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                        <h3 className="font-medium text-restaurant-black">{customer?.name}</h3>
                        <div className="text-sm text-restaurant-stone">{customer?.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-restaurant-stone">Teléfono</Label>
                  <div className="flex items-center gap-1 text-restaurant-black">
                    <User className="h-4 w-4 text-restaurant-gold" />
                          {customer?.phone}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-restaurant-stone">Estado</Label>
                  <div>
                    <Badge
                            variant="default"
                            className="bg-restaurant-olive text-restaurant-ivory"
                          >
                            Confirmada
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-restaurant-stone">Fecha</Label>
                  <div className="flex items-center gap-1 text-restaurant-black">
                    <CalendarDays className="h-4 w-4 text-restaurant-gold" />
                          {formatDate(selectedReservation.reservation_date)}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-restaurant-stone">Hora</Label>
                  <div className="flex items-center gap-1 text-restaurant-black">
                    <Clock className="h-4 w-4 text-restaurant-gold" />
                          {selectedReservation.reservation_time}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                      <Label className="text-xs text-restaurant-stone">Mesa</Label>
                <div className="flex items-center gap-1 text-restaurant-black">
                  <Users className="h-4 w-4 text-restaurant-gold" />
                        Mesa {table?.id} - {table?.capacity} personas ({table?.location})
                </div>
              </div>
                  </>
                )
              })()}
            </div>
          )}
          <DialogFooter className="flex gap-2 sm:justify-between">
            <div className="flex gap-2">
              <Button
                variant="destructive"
                className="bg-restaurant-wine text-restaurant-ivory hover:bg-restaurant-wine/90"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Cancelar Reserva
              </Button>
            </div>
            <Button onClick={() => setIsDetailDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-restaurant-stone/10 bg-white">
          <DialogHeader>
            <DialogTitle className="text-restaurant-black">Cancelar Reserva</DialogTitle>
            <DialogDescription className="text-restaurant-stone">
              ¿Está seguro que desea cancelar la reserva #{selectedReservation?.id}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-restaurant-stone/20 bg-white text-restaurant-black hover:text-black hover:bg-restaurant-stone/10"
            >
              No cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteReservation}
              className="bg-restaurant-wine text-restaurant-ivory hover:bg-restaurant-wine/90"
            >
              Sí, Cancelar Reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
