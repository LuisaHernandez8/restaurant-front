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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Plus, Search, Star } from "lucide-react"
import { toast } from "sonner"

// Datos de ejemplo
const reviews = [
  {
    id: 1,
    name: "Laura Sánchez",
    date: "18 Mayo, 2025",
    rating: 5,
    comment:
      "Excelente servicio y comida deliciosa. La paella valenciana es espectacular. El ambiente es muy acogedor y el personal muy atento. Definitivamente volveré pronto.",
    visitType: "Familiar",
    dishes: ["Paella Valenciana", "Tiramisú"],
  },
  {
    id: 2,
    name: "Roberto Gómez",
    date: "17 Mayo, 2025",
    rating: 4,
    comment:
      "Muy buena atención. El ceviche estaba fresco y sabroso. El servicio fue rápido y el personal amable. Solo le faltó un poco más de limón al ceviche para mi gusto.",
    visitType: "Negocios",
    dishes: ["Ceviche de Camarones", "Lomo Saltado"],
  },
  {
    id: 3,
    name: "Elena Torres",
    date: "16 Mayo, 2025",
    rating: 5,
    comment:
      "Ambiente acogedor y platos muy bien presentados. El lomo saltado estaba perfectamente cocinado y la sopa de mariscos tenía un sabor excepcional. Volveré pronto.",
    visitType: "Pareja",
    dishes: ["Lomo Saltado", "Sopa de Mariscos"],
  },
  {
    id: 4,
    name: "Miguel Ángel Pérez",
    date: "15 Mayo, 2025",
    rating: 3,
    comment:
      "La comida estaba buena pero el servicio fue un poco lento. Tuvimos que esperar más de lo esperado para que nos atendieran. La ensalada César estaba fresca.",
    visitType: "Amigos",
    dishes: ["Ensalada César", "Paella Valenciana"],
  },
  {
    id: 5,
    name: "Carmen Rodríguez",
    date: "14 Mayo, 2025",
    rating: 4,
    comment:
      "Buena relación calidad-precio. Los postres son deliciosos, especialmente el tiramisú. El ambiente es agradable y el personal atento.",
    visitType: "Familiar",
    dishes: ["Ceviche de Camarones", "Tiramisú"],
  },
]

// Datos de ejemplo para el menú
const menuItems = [
  { id: 1, name: "Paella Valenciana", category: "Plato Principal" },
  { id: 2, name: "Ceviche de Camarones", category: "Entrada" },
  { id: 3, name: "Lomo Saltado", category: "Plato Principal" },
  { id: 4, name: "Tiramisú", category: "Postre" },
  { id: 5, name: "Ensalada César", category: "Entrada" },
  { id: 6, name: "Sopa de Mariscos", category: "Entrada" },
]

export default function ResenasPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [visitTypeFilter, setVisitTypeFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [dishFilter, setDishFilter] = useState("all")
  const [selectedDishes, setSelectedDishes] = useState<string[]>([])
  const [rating, setRating] = useState(5)

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Reseña guardada con éxito", {
      description: "Gracias por compartir su experiencia",
    })
    setSelectedDishes([])
    setRating(5)
    setIsDialogOpen(false)
  }

  const handleDishToggle = (dish: string) => {
    if (selectedDishes.includes(dish)) {
      setSelectedDishes(selectedDishes.filter((d) => d !== dish))
    } else {
      setSelectedDishes([...selectedDishes, dish])
    }
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesVisitType = visitTypeFilter === "all" || review.visitType === visitTypeFilter
    const matchesRating = ratingFilter === "all" || review.rating === Number.parseInt(ratingFilter)
    const matchesDish = dishFilter === "all" || review.dishes.includes(dishFilter)

    return matchesSearch && matchesVisitType && matchesRating && matchesDish
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reseñas de Clientes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Reseña
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Añadir Nueva Reseña</DialogTitle>
              <DialogDescription>Comparta su experiencia en el restaurante</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleReviewSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" placeholder="Su nombre" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Su correo electrónico" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="visitType">Tipo de Visita</Label>
                    <Select required>
                      <SelectTrigger id="visitType">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Familiar">Familiar</SelectItem>
                        <SelectItem value="Pareja">Pareja</SelectItem>
                        <SelectItem value="Amigos">Amigos</SelectItem>
                        <SelectItem value="Negocios">Negocios</SelectItem>
                        <SelectItem value="Solo">Solo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Fecha de Visita</Label>
                    <Input id="date" type="date" required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Calificación</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${rating >= star ? "text-amber-500" : "text-muted-foreground"}`}
                        onClick={() => setRating(star)}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </Button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">{rating} de 5 estrellas</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Platos Consumidos</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {menuItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`dish-${item.id}`}
                          checked={selectedDishes.includes(item.name)}
                          onChange={() => handleDishToggle(item.name)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={`dish-${item.id}`} className="text-sm font-normal">
                          {item.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="comment">Comentario</Label>
                  <textarea
                    id="comment"
                    className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Comparta su experiencia..."
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Enviar Reseña</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Filtrar Reseñas</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar en reseñas..."
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
              <Label htmlFor="visitTypeFilter" className="mb-2 block">
                Tipo de Visita
              </Label>
              <Select value={visitTypeFilter} onValueChange={setVisitTypeFilter}>
                <SelectTrigger id="visitTypeFilter" className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Familiar">Familiar</SelectItem>
                  <SelectItem value="Pareja">Pareja</SelectItem>
                  <SelectItem value="Amigos">Amigos</SelectItem>
                  <SelectItem value="Negocios">Negocios</SelectItem>
                  <SelectItem value="Solo">Solo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <Label htmlFor="ratingFilter" className="mb-2 block">
                Calificación
              </Label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger id="ratingFilter" className="w-full">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="5">5 Estrellas</SelectItem>
                  <SelectItem value="4">4 Estrellas</SelectItem>
                  <SelectItem value="3">3 Estrellas</SelectItem>
                  <SelectItem value="2">2 Estrellas</SelectItem>
                  <SelectItem value="1">1 Estrella</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <Label htmlFor="dishFilter" className="mb-2 block">
                Plato
              </Label>
              <Select value={dishFilter} onValueChange={setDishFilter}>
                <SelectTrigger id="dishFilter" className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {menuItems.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recientes</TabsTrigger>
          <TabsTrigger value="highest">Mejor Valoradas</TabsTrigger>
          <TabsTrigger value="lowest">Peor Valoradas</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          {filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-center text-muted-foreground">
                  No se encontraron reseñas con los filtros seleccionados.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={review.name} />
                      <AvatarFallback>{review.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-semibold">{review.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            {review.date}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">{review.visitType}</Badge>
                        {review.dishes.map((dish, index) => (
                          <Badge key={index} variant="secondary">
                            {dish}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-2">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        <TabsContent value="highest" className="space-y-4">
          {filteredReviews
            .filter((review) => review.rating >= 4)
            .sort((a, b) => b.rating - a.rating)
            .map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={review.name} />
                      <AvatarFallback>{review.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-semibold">{review.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            {review.date}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">{review.visitType}</Badge>
                        {review.dishes.map((dish, index) => (
                          <Badge key={index} variant="secondary">
                            {dish}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-2">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
        <TabsContent value="lowest" className="space-y-4">
          {filteredReviews
            .filter((review) => review.rating <= 3)
            .sort((a, b) => a.rating - b.rating)
            .map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={review.name} />
                      <AvatarFallback>{review.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-semibold">{review.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            {review.date}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">{review.visitType}</Badge>
                        {review.dishes.map((dish, index) => (
                          <Badge key={index} variant="secondary">
                            {dish}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-2">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
