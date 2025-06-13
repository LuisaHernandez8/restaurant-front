"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, ChefHat, ClipboardList, Users, TrendingUp, Star, Clock } from "lucide-react"
import { getAllReservations } from "@/api/reservations"
import { getDishes } from "@/api/dishes"
import { getAllReviews } from "@/api/reviews"
import { getAllCustomers } from "@/api/customers"
import { getOrders } from "@/api/orders"
import { format, isToday, isYesterday } from "date-fns"
import { es } from "date-fns/locale"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const [stats, setStats] = useState({
    todayReservations: 0,
    yesterdayReservations: 0,
    todayOrders: 0,
    yesterdayOrders: 0,
    availableDishes: 0,
    totalCustomers: 0
  })

  const [recentData, setRecentData] = useState({
    reservations: [],
    popularDishes: [],
    reviews: []
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservations, dishes, reviews, customers, orders] = await Promise.all([
          getAllReservations(),
          getDishes(),
          getAllReviews(),
          getAllCustomers(),
          getOrders()
        ])

        // Pedidos hoy y ayer
        const todayOrders = orders.filter(o => isToday(new Date(o.order_date))).length
        const yesterdayOrders = orders.filter(o => isYesterday(new Date(o.order_date))).length

        // Platos populares (por cantidad pedida)
        const dishCount: Record<number, number> = {}
        orders.forEach(order => {
          order.order_details.forEach(detail => {
            dishCount[detail.dish_id] = (dishCount[detail.dish_id] || 0) + detail.quantity
          })
        })
        const popularDishes = [...dishes]
          .map(dish => ({
            ...dish,
            popularity: dishCount[dish.id] || 0
          }))
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 5)

        // Clientes totales
        const totalCustomers = customers.length

        // Platos disponibles
        const availableDishes = dishes.filter(d => d.available).length

        // Reservas hoy y ayer
        const todayReservations = reservations.filter(r => isToday(new Date(r.reservation_date))).length
        const yesterdayReservations = reservations.filter(r => isYesterday(new Date(r.reservation_date))).length

        // Join reservas con clientes para mostrar nombre
        const reservationsWithCustomer = reservations
          .sort((a, b) => new Date(b.reservation_date).getTime() - new Date(a.reservation_date).getTime())
          .slice(0, 5)
          .map(r => {
            const customer = customers.find(c => c.id === r.customer_id)
            return {
              ...r,
              customer_name: customer ? customer.name : 'Desconocido'
            }
          })

        // Reseñas recientes (adaptar campo de fecha)
        const reviewsList = Array.isArray(reviews.data) ? reviews.data : reviews
        const recentReviews = reviewsList
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)

        setStats({
          todayReservations,
          yesterdayReservations,
          todayOrders,
          yesterdayOrders,
          availableDishes,
          totalCustomers
        })
        setRecentData({
          reservations: reservationsWithCustomer,
          popularDishes,
          reviews: recentReviews
        })
      } catch (error) {
        console.error("Error al cargar los datos:", error)
      }
    }
    fetchData()
  }, [])

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
            <div className="text-2xl font-bold text-restaurant-black">{stats.todayReservations}</div>
          </CardContent>
        </Card>

        <Card className="elegant-card border-restaurant-stone/10 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-restaurant-black">Pedidos Hoy</CardTitle>
            <ClipboardList className="h-4 w-4 text-restaurant-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-restaurant-black">{stats.todayOrders}</div>
          </CardContent>
        </Card>

        <Card className="elegant-card border-restaurant-stone/10 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-restaurant-black">Platos Disponibles</CardTitle>
            <ChefHat className="h-4 w-4 text-restaurant-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-restaurant-black">{stats.availableDishes}</div>
            <p className="text-xs text-restaurant-stone">Total disponibles</p>
          </CardContent>
        </Card>

        <Card className="elegant-card border-restaurant-stone/10 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-restaurant-black">Clientes Registrados</CardTitle>
            <Users className="h-4 w-4 text-restaurant-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-restaurant-black">{stats.totalCustomers}</div>
            <p className="text-xs text-restaurant-stone">Total registrados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Reservas Recientes */}
        <Card className="elegant-card border-restaurant-stone/10 bg-white">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-restaurant-black">
              <CalendarDays className="h-4 w-4 text-restaurant-gold" />
              Reservas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentData.reservations.map((reservation: any) => (
                <div key={reservation.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-restaurant-gold/20">
                      <AvatarFallback className="bg-restaurant-olive text-restaurant-ivory">
                        {reservation.customer_name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-restaurant-black">{reservation.customer_name}</p>
                      <p className="text-xs text-restaurant-stone">
                        {format(new Date(reservation.reservation_date), "d 'de' MMM", { locale: es })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-restaurant-olive text-restaurant-ivory">
                    {reservation.reservation_time}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platos Populares */}
        <Card className="elegant-card border-restaurant-stone/10 bg-white">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-restaurant-black">
              <TrendingUp className="h-4 w-4 text-restaurant-gold" />
              Platos Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentData.popularDishes.map((dish: any) => (
                <div key={dish.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-restaurant-black">{dish.name}</p>
                    <Badge variant="outline" className="border-restaurant-gold/30 text-restaurant-gold">
                      {dish.category}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-restaurant-stone">
                      <span>Veces pedido</span>
                      <span>{dish.popularity}</span>
                    </div>
                    <Progress value={dish.popularity} max={Math.max(...recentData.popularDishes.map((d: any) => d.popularity), 1)} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reseñas Recientes */}
        <Card className="elegant-card border-restaurant-stone/10 bg-white">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-restaurant-black">
              <Star className="h-4 w-4 text-restaurant-gold" />
              Reseñas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentData.reviews.map((review: any) => (
                <div key={review._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-restaurant-gold/20">
                        <AvatarFallback className="bg-restaurant-olive text-restaurant-ivory text-xs">
                          {review.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium text-restaurant-black">{review.name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-restaurant-gold text-restaurant-gold" />
                      <span className="text-sm text-restaurant-black">{review.calification}</span>
                    </div>
                  </div>
                  <p className="text-xs text-restaurant-stone line-clamp-2">{review.comment}</p>
                  <div className="flex items-center gap-1 text-xs text-restaurant-stone">
                    <Clock className="h-3 w-3" />
                    {format(new Date(review.createdAt), "d 'de' MMM, HH:mm", { locale: es })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
