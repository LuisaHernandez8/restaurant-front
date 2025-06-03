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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Filter, Plus, Search, User, Users } from "lucide-react"
import { toast } from "sonner"
import { format, addDays, subDays } from "date-fns"
import { es } from "date-fns/locale"

// Datos de ejemplo
const reservations = [
  {
    id: "RES-001",
    name: "Carlos Rodríguez",
    email: "carlos@ejemplo.com",
    phone: "+34 612 345 678",
    date: "2025-05-20",
    time: "19:30",
    guests: 4,
    status: "confirmada",
    notes: "Prefiere mesa junto a la ventana",
  },
  {
    id: "RES-002",
    name: "María López",
    email: "maria@ejemplo.com",
    phone: "+34 623 456 789",
    date: "2025-05-20",
    time: "20:00",
    guests: 2,
    status: "pendiente",
    notes: "Celebración de aniversario",
  },
  {
    id: "RES-003",
    name: "Juan Pérez",
    email: "juan@ejemplo.com",
    phone: "+34 634 567 890",
    date: "2025-05-20",
    time: "21:15",
    guests: 6,
    status: "confirmada",
    notes: "Grupo de negocios",
  },
  {
    id: "RES-004",
    name: "Ana Martínez",
    email: "ana@ejemplo.com",
    phone: "+34 645 678 901",
    date: "2025-05-21",
    time: "18:45",
    guests: 3,
    status: "pendiente",
    notes: "Solicita trona para bebé",
  },
  {
    id: "RES-005",
    name: "Roberto Gómez",
    email: "roberto@ejemplo.com",
    phone: "+34 656 789 012",
    date: "2025-05-21",
    time: "20:30",
    guests: 5,
    status: "confirmada",
    notes: "Alergia a frutos secos",
  },
  {
    id: "RES-006",
    name: "Elena Torres",
    email: "elena@ejemplo.com",
    phone: "+34 667 890 123",
    date: "2025-05-22",
    time: "19:00",
    guests: 2,
    status: "confirmada",
    notes: "Prefiere terraza",
  },
]

export default function ReservasPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [guestsFilter, setGuestsFilter] = useState("all")
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<any>(null)

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Reserva creada con éxito", {
      description: "La reserva ha sido registrada en el sistema",
    })
    setIsDialogOpen(false)
  }

  const handleDateChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedDate(subDays(selectedDate, 1))
    } else {
      setSelectedDate(addDays(selectedDate, 1))
    }
  }

  const openDetailDialog = (reservation: any) => {
    setSelectedReservation(reservation)
    setIsDetailDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "d 'de' MMMM, yyyy", { locale: es })
  }

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.phone.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter

    const matchesGuests =
      guestsFilter === "all" ||
      (guestsFilter === "1-2" && reservation.guests <= 2) ||
      (guestsFilter === "3-4" && reservation.guests >= 3 && reservation.guests <= 4) ||
      (guestsFilter === "5+" && reservation.guests >= 5)

    const formattedSelectedDate = format(selectedDate, "yyyy-MM-dd")
    const matchesDate = reservation.date === formattedSelectedDate

    return matchesSearch && matchesStatus && matchesGuests && matchesDate
  })

  // Agrupar reservas por hora
  const reservationsByTime = filteredReservations.reduce((acc: any, reservation) => {
    const hour = reservation.time.split(":")[0]
    if (!acc[hour]) {
      acc[hour] = []
    }
    acc[hour].push(reservation)
    return acc
  }, {})

  // Ordenar horas
  const sortedHours = Object.keys(reservationsByTime).sort()

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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                    <Label htmlFor="name" className="text-restaurant-black">
                      Nombre del Cliente
                    </Label>
                    <Input
                      id="name"
                      placeholder="Nombre completo"
                      required
                      className="border-restaurant-stone/20 bg-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="text-restaurant-black">
                      Teléfono
                    </Label>
                    <Input
                      id="phone"
                      placeholder="Número de teléfono"
                      required
                      className="border-restaurant-stone/20 bg-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-restaurant-black">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      className="border-restaurant-stone/20 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date" className="text-restaurant-black">
                        Fecha
                      </Label>
                      <Input id="date" type="date" required className="border-restaurant-stone/20 bg-white" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time" className="text-restaurant-black">
                        Hora
                      </Label>
                      <Input id="time" type="time" required className="border-restaurant-stone/20 bg-white" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="guests" className="text-restaurant-black">
                      Número de Personas
                    </Label>
                    <Select required>
                      <SelectTrigger id="guests" className="border-restaurant-stone/20 bg-white">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent className="border-restaurant-stone/10 bg-white">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "persona" : "personas"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes" className="text-restaurant-black">
                      Notas Adicionales
                    </Label>
                    <Input
                      id="notes"
                      placeholder="Alergias, preferencias, etc."
                      className="border-restaurant-stone/20 bg-white"
                    />
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
              <Button className="mt-4">
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
                        {reservationsByTime[hour].map((reservation: any) => (
                          <Card
                            key={reservation.id}
                            className="elegant-card overflow-hidden border-l-4 border-restaurant-stone/10 bg-white"
                            style={{ borderLeftColor: reservation.status === "confirmada" ? "#D4AF37" : "#A49E9E" }}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-restaurant-black">{reservation.name}</h3>
                                  <div className="flex items-center gap-1 text-sm text-restaurant-stone">
                                    <Clock className="h-3 w-3 text-restaurant-gold" />
                                    {reservation.time}
                                  </div>
                                </div>
                                <Badge
                                  variant={reservation.status === "confirmada" ? "default" : "outline"}
                                  className={
                                    reservation.status === "confirmada"
                                      ? "bg-restaurant-olive text-restaurant-ivory"
                                      : "border-restaurant-stone text-restaurant-stone"
                                  }
                                >
                                  {reservation.status}
                                </Badge>
                              </div>
                              <div className="mt-2 flex items-center gap-1 text-sm">
                                <Users className="h-3 w-3 text-restaurant-gold" />
                                <span className="text-restaurant-black">
                                  {reservation.guests} {reservation.guests === 1 ? "persona" : "personas"}
                                </span>
                              </div>
                              {reservation.notes && (
                                <p className="mt-2 text-sm text-restaurant-stone line-clamp-1">{reservation.notes}</p>
                              )}
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
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="list">
                <Card className="elegant-card border-restaurant-stone/10 bg-white">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-restaurant-ivory">
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Hora</TableHead>
                          <TableHead>Personas</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Notas</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReservations.map((reservation) => (
                          <TableRow key={reservation.id} className="hover:bg-restaurant-ivory/50">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 border border-restaurant-gold/20">
                                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={reservation.name} />
                                  <AvatarFallback className="bg-restaurant-olive text-restaurant-ivory">
                                    {reservation.name.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-restaurant-black">{reservation.name}</div>
                                  <div className="text-xs text-restaurant-stone">{reservation.phone}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-restaurant-gold" />
                                {reservation.time}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-restaurant-gold" />
                                {reservation.guests}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={reservation.status === "confirmada" ? "default" : "outline"}
                                className={
                                  reservation.status === "confirmada"
                                    ? "bg-restaurant-olive text-restaurant-ivory"
                                    : "border-restaurant-stone text-restaurant-stone"
                                }
                              >
                                {reservation.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                              <p className="truncate text-sm text-restaurant-stone">{reservation.notes || "-"}</p>
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
                        ))}
                      </TableBody>
                    </Table>
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
              Reserva #{selectedReservation?.id} - {selectedReservation && formatDate(selectedReservation.date)}
            </DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border border-restaurant-gold/20">
                  <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={selectedReservation.name} />
                  <AvatarFallback className="bg-restaurant-olive text-restaurant-ivory">
                    {selectedReservation.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-restaurant-black">{selectedReservation.name}</h3>
                  <div className="text-sm text-restaurant-stone">{selectedReservation.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-restaurant-stone">Teléfono</Label>
                  <div className="flex items-center gap-1 text-restaurant-black">
                    <User className="h-4 w-4 text-restaurant-gold" />
                    {selectedReservation.phone}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-restaurant-stone">Estado</Label>
                  <div>
                    <Badge
                      variant={selectedReservation.status === "confirmada" ? "default" : "outline"}
                      className={
                        selectedReservation.status === "confirmada"
                          ? "bg-restaurant-olive text-restaurant-ivory"
                          : "border-restaurant-stone text-restaurant-stone"
                      }
                    >
                      {selectedReservation.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-restaurant-stone">Fecha</Label>
                  <div className="flex items-center gap-1 text-restaurant-black">
                    <CalendarDays className="h-4 w-4 text-restaurant-gold" />
                    {formatDate(selectedReservation.date)}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-restaurant-stone">Hora</Label>
                  <div className="flex items-center gap-1 text-restaurant-black">
                    <Clock className="h-4 w-4 text-restaurant-gold" />
                    {selectedReservation.time}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-restaurant-stone">Número de Personas</Label>
                <div className="flex items-center gap-1 text-restaurant-black">
                  <Users className="h-4 w-4 text-restaurant-gold" />
                  {selectedReservation.guests} {selectedReservation.guests === 1 ? "persona" : "personas"}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-restaurant-stone">Notas</Label>
                <div className="rounded-md bg-restaurant-ivory p-3 text-sm text-restaurant-black">
                  {selectedReservation.notes || "Sin notas adicionales"}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2 sm:justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-restaurant-stone/20 bg-white text-restaurant-black hover:bg-restaurant-stone/10"
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                className="bg-restaurant-wine text-restaurant-ivory hover:bg-restaurant-wine/90"
              >
                Cancelar Reserva
              </Button>
            </div>
            <Button onClick={() => setIsDetailDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
