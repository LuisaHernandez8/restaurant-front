import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, ChefHat, ClipboardList, Users } from "lucide-react"
import RecentReservations from "@/components/recent-reservations"
import PopularDishes from "@/components/popular-dishes"
import RecentReviews from "@/components/recent-reviews"

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-restaurant-black">Dashboard</h1>
        <div className="text-sm text-restaurant-stone">
          Bienvenido al sistema de gestión del <span className="font-medium text-restaurant-gold">Restaurante MyC</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="elegant-card border-restaurant-stone/10 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-restaurant-black">Reservas Hoy</CardTitle>
            <CalendarDays className="h-4 w-4 text-restaurant-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-restaurant-black">12</div>
            <p className="text-xs text-restaurant-stone">+2 comparado con ayer</p>
          </CardContent>
        </Card>

        <Card className="elegant-card border-restaurant-stone/10 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-restaurant-black">Pedidos Hoy</CardTitle>
            <ClipboardList className="h-4 w-4 text-restaurant-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-restaurant-black">24</div>
            <p className="text-xs text-restaurant-stone">+5 comparado con ayer</p>
          </CardContent>
        </Card>

        <Card className="elegant-card border-restaurant-stone/10 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-restaurant-black">Platos Disponibles</CardTitle>
            <ChefHat className="h-4 w-4 text-restaurant-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-restaurant-black">32</div>
            <p className="text-xs text-restaurant-stone">+3 nuevos esta semana</p>
          </CardContent>
        </Card>

        <Card className="elegant-card border-restaurant-stone/10 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-restaurant-black">Clientes Nuevos</CardTitle>
            <Users className="h-4 w-4 text-restaurant-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-restaurant-black">8</div>
            <p className="text-xs text-restaurant-stone">+2 comparado con ayer</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reservations" className="space-y-4">
        <TabsList className="bg-white border border-restaurant-stone/10">
          <TabsTrigger
            value="reservations"
            className="data-[state=active]:bg-restaurant-gold data-[state=active]:text-restaurant-black"
          >
            Reservas Recientes
          </TabsTrigger>
          <TabsTrigger
            value="dishes"
            className="data-[state=active]:bg-restaurant-gold data-[state=active]:text-restaurant-black"
          >
            Platos Populares
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="data-[state=active]:bg-restaurant-gold data-[state=active]:text-restaurant-black"
          >
            Reseñas Recientes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="reservations" className="space-y-4">
          <RecentReservations />
        </TabsContent>
        <TabsContent value="dishes" className="space-y-4">
          <PopularDishes />
        </TabsContent>
        <TabsContent value="reviews" className="space-y-4">
          <RecentReviews />
        </TabsContent>
      </Tabs>
    </div>
  )
}
