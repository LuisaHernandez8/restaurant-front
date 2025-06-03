import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"

// Datos de ejemplo
const reviews = [
  {
    id: 1,
    name: "Laura Sánchez",
    date: "18 Mayo, 2025",
    rating: 5,
    comment: "Excelente servicio y comida deliciosa. La paella valenciana es espectacular.",
    visitType: "Familiar",
    dish: "Paella Valenciana",
  },
  {
    id: 2,
    name: "Roberto Gómez",
    date: "17 Mayo, 2025",
    rating: 4,
    comment: "Muy buena atención. El ceviche estaba fresco y sabroso.",
    visitType: "Negocios",
    dish: "Ceviche de Camarones",
  },
  {
    id: 3,
    name: "Elena Torres",
    date: "16 Mayo, 2025",
    rating: 5,
    comment: "Ambiente acogedor y platos muy bien presentados. Volveré pronto.",
    visitType: "Pareja",
    dish: "Lomo Saltado",
  },
]

export default function RecentReviews() {
  return (
    <Card className="elegant-card border-restaurant-stone/10 bg-white">
      <CardHeader>
        <CardTitle className="text-restaurant-black">Reseñas Recientes</CardTitle>
        <CardDescription className="text-restaurant-stone">Lo que opinan nuestros clientes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="elegant-card overflow-hidden border-restaurant-stone/10 bg-white">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 border border-restaurant-gold/20">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={review.name} />
                  <AvatarFallback className="bg-restaurant-olive text-restaurant-ivory">
                    {review.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-restaurant-black">{review.name}</h3>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4 text-restaurant-gold" />
                      <span className="text-sm text-restaurant-stone">{review.date}</span>
                    </div>
                  </div>
                  <div className="mt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-restaurant-gold">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                      <Badge
                        className="ml-2 text-xs border-restaurant-stone/20 text-restaurant-stone"
                        variant="outline"
                      >
                        {review.visitType}
                      </Badge>
                      <Badge className="text-xs bg-restaurant-wine/10 text-restaurant-wine" variant="secondary">
                        {review.dish}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-restaurant-black">{review.comment}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
