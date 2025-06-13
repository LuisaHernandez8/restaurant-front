"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CalendarDays, ChefHat, ClipboardList, Home, MessageSquare, Settings, User, Users } from "lucide-react"

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    label: "Clientes",
    icon: Users,
    href: "/clientes",
  },
  {
    label: "Menú",
    icon: ChefHat,
    href: "/menu",
  },
  {
    label: "Reservas",
    icon: CalendarDays,
    href: "/reservas",
  }, 
  {
    label: "Pedidos",
    icon: ClipboardList,
    href: "/pedidos",
  },
  {
    label: "Reseñas",
    icon: MessageSquare,
    href: "/resenas",
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-restaurant-black text-restaurant-ivory">
      <div className="flex h-20 items-center justify-center border-b border-restaurant-stone/20 px-4">
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-restaurant-gold">
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-restaurant-black">
              M
            </span>
          </div>
          <h1 className="text-xl font-bold text-restaurant-gold">
            Restaurante <span className="text-restaurant-ivory">MyC</span>
          </h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid items-start px-4 text-sm">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-restaurant-stone transition-all hover:text-restaurant-gold",
                pathname === route.href && "bg-restaurant-olive/20 font-medium text-restaurant-gold",
              )}
            >
              <route.icon className={cn("h-5 w-5", pathname === route.href && "text-restaurant-gold")} />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t border-restaurant-stone/20 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-restaurant-olive/20 px-3 py-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-restaurant-wine">
            <User className="absolute inset-0 h-full w-full p-2 text-restaurant-ivory" />
          </div>
          <div>
            <p className="text-sm font-medium text-restaurant-ivory">Admin</p>
            <p className="text-xs text-restaurant-stone">admin@myc.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
