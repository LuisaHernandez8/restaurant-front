import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, Clock, Users } from "lucide-react"

// Datos de ejemplo
const reservations = [
  {
    id: "RES-001",
    name: "Carlos Rodríguez",
    date: "20 Mayo, 2025",
    time: "19:30",
    guests: 4,
    status: "confirmada",
  },
  {
    id: "RES-002",
    name: "María López",
    date: "20 Mayo, 2025",
    time: "20:00",
    guests: 2,
    status: "pendiente",
  },
  {
    id: "RES-003",
    name: "Juan Pérez",
    date: "20 Mayo, 2025",
    time: "21:15",
    guests: 6,
    status: "confirmada",
  },
  {
    id: "RES-004",
    name: "Ana Martínez",
    date: "21 Mayo, 2025",
    time: "18:45",
    guests: 3,
    status: "pendiente",
  },
]

export default function RecentReservations() {
  return (
    <Card className="elegant-card border-restaurant-stone/10 bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-restaurant-black">Reservas Recientes</CardTitle>
          <CardDescription className="text-restaurant-stone">
            Gestiona las reservas de los próximos días
          </CardDescription>
        </div>
        <Button size="sm">Ver todas</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-restaurant-ivory">
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Personas</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id} className="hover:bg-restaurant-ivory/50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-restaurant-gold/20">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={reservation.name} />
                      <AvatarFallback className="bg-restaurant-olive text-restaurant-ivory">
                        {reservation.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium text-restaurant-black">{reservation.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4 text-restaurant-gold" />
                    {reservation.date}
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
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-restaurant-wine hover:text-restaurant-wine hover:bg-restaurant-wine/10"
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
  )
}
