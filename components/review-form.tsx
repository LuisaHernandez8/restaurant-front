"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Star } from "lucide-react"
import { useReviews } from "@/hooks/useReviews"
import { toast } from "sonner"
import type { Review } from "@/api/reviews"

interface ReviewFormProps {
  onSuccess?: () => void
}

type NewReview = Omit<Review, '_id' | 'createdAt' | '__v'>

export function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [selectedDishes, setSelectedDishes] = useState<string[]>([])
  const [visitType, setVisitType] = useState("")
  const { addReview } = useReviews()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    if (!visitType) {
      toast.error("Por favor seleccione un tipo de visita")
      return
    }

    if (selectedDishes.length === 0) {
      toast.error("Por favor seleccione al menos un plato")
      return
    }

    try {
      const newReview: NewReview = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        visitType: visitType,
        visitDate: formData.get("visitDate") as string,
        calification: rating,
        consumedDishes: selectedDishes,
        comment: formData.get("comment") as string,
      }

      await addReview(newReview)

      toast.success("Reseña creada exitosamente")
      setIsOpen(false)
      setVisitType("")
      setRating(5)
      setSelectedDishes([])
      onSuccess?.()
    } catch (error) {
      toast.error("Error al crear la reseña")
    }
  }

  const handleDishToggle = (dish: string) => {
    if (selectedDishes.includes(dish)) {
      setSelectedDishes(selectedDishes.filter((d) => d !== dish))
    } else {
      setSelectedDishes([...selectedDishes, dish])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Nueva Reseña</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Añadir Nueva Reseña</DialogTitle>
          <DialogDescription>Comparta su experiencia en el restaurante</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" placeholder="Su nombre" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="Su correo electrónico" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="visitType">Tipo de Visita</Label>
                <Select value={visitType} onValueChange={setVisitType} required>
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
                <Label htmlFor="visitDate">Fecha de Visita</Label>
                <Input id="visitDate" name="visitDate" type="date" required />
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
                {[
                  "Paella Valenciana",
                  "Ceviche de Camarones",
                  "Lomo Saltado",
                  "Tiramisú",
                  "Ensalada César",
                  "Sopa de Mariscos",
                ].map((dish) => (
                  <div key={dish} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`dish-${dish}`}
                      checked={selectedDishes.includes(dish)}
                      onChange={() => handleDishToggle(dish)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`dish-${dish}`} className="text-sm font-normal">
                      {dish}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comment">Comentario</Label>
              <textarea
                id="comment"
                name="comment"
                className="min-h-[100px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
  )
} 