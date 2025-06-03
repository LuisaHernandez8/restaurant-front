import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo
const dishes = [
  {
    id: 1,
    name: "Paella Valenciana",
    category: "Plato Principal",
    price: "$18.99",
    rating: 4.8,
    orders: 42,
    available: true,
  },
  {
    id: 2,
    name: "Ceviche de Camarones",
    category: "Entrada",
    price: "$12.50",
    rating: 4.7,
    orders: 38,
    available: true,
  },
  {
    id: 3,
    name: "Lomo Saltado",
    category: "Plato Principal",
    price: "$16.75",
    rating: 4.6,
    orders: 35,
    available: true,
  },
  {
    id: 4,
    name: "Tiramisú",
    category: "Postre",
    price: "$8.25",
    rating: 4.9,
    orders: 30,
    available: false,
  },
]

export default function PopularDishes() {
  return (
    <Card className="elegant-card border-restaurant-stone/10 bg-white">
      <CardHeader>
        <CardTitle className="text-restaurant-black">Platos Populares</CardTitle>
        <CardDescription className="text-restaurant-stone">Los platos más pedidos esta semana</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dishes.map((dish) => (
            <Card key={dish.id} className="elegant-card overflow-hidden border-restaurant-stone/10 bg-white">
              <div className="aspect-video w-full bg-restaurant-stone/10">
                <img
                  src={`/placeholder.svg?height=120&width=240&text=${encodeURIComponent(dish.name)}`}
                  alt={dish.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-restaurant-black">{dish.name}</h3>
                  <Badge
                    variant={dish.available ? "default" : "destructive"}
                    className={
                      dish.available
                        ? "bg-restaurant-olive text-restaurant-ivory"
                        : "bg-restaurant-wine text-restaurant-ivory"
                    }
                  >
                    {dish.available ? "Disponible" : "Agotado"}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-restaurant-stone">
                  <span>{dish.category}</span>
                  <span className="font-medium text-restaurant-black">{dish.price}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-restaurant-gold">★ {dish.rating}</span>
                  </div>
                  <span className="text-sm text-restaurant-stone">{dish.orders} pedidos</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
