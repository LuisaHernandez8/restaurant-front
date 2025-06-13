"use client"

import { useEffect, useState } from "react"
import { useReviews } from "@/hooks/useReviews"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Search, Star } from "lucide-react"
import { ReviewForm } from "@/components/review-form"

export default function ResenasPage() {
  const { reviews = [], isLoading, error, fetchReviews } = useReviews();
  const [searchTerm, setSearchTerm] = useState("")
  const [visitTypeFilter, setVisitTypeFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [dishFilter, setDishFilter] = useState("all")

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (isLoading) {
    return <div>Cargando reseñas...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesVisitType = visitTypeFilter === "all" || review.visitType === visitTypeFilter
    const matchesRating = ratingFilter === "all" || review.calification === Number.parseInt(ratingFilter)
    const matchesDish = dishFilter === "all" || review.consumedDishes.includes(dishFilter)

    return matchesSearch && matchesVisitType && matchesRating && matchesDish
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reseñas</h1>
        <ReviewForm onSuccess={fetchReviews} />
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
                  <SelectItem value="Paella Valenciana">Paella Valenciana</SelectItem>
                  <SelectItem value="Ceviche de Camarones">Ceviche de Camarones</SelectItem>
                  <SelectItem value="Lomo Saltado">Lomo Saltado</SelectItem>
                  <SelectItem value="Tiramisú">Tiramisú</SelectItem>
                  <SelectItem value="Ensalada César">Ensalada César</SelectItem>
                  <SelectItem value="Sopa de Mariscos">Sopa de Mariscos</SelectItem>
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
              <Card key={review._id}>
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
                                className={`h-4 w-4 ${i < review.calification ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(review.visitDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">{review.visitType}</Badge>
                        {review.consumedDishes.map((dish, index) => (
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
            .filter((review) => review.calification >= 4)
            .sort((a, b) => b.calification - a.calification)
            .map((review) => (
              <Card key={review._id}>
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
                                className={`h-4 w-4 ${i < review.calification ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(review.visitDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">{review.visitType}</Badge>
                        {review.consumedDishes.map((dish, index) => (
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
            .filter((review) => review.calification <= 3)
            .sort((a, b) => a.calification - b.calification)
            .map((review) => (
              <Card key={review._id}>
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
                                className={`h-4 w-4 ${i < review.calification ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(review.visitDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">{review.visitType}</Badge>
                        {review.consumedDishes.map((dish, index) => (
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
