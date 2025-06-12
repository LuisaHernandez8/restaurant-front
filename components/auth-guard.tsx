"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated, canAccess, type UserRole } from "@/api/auth"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      
      if (!authenticated) {
        router.push("/login")
        return
      }

      if (allowedRoles && !canAccess(allowedRoles)) {
        router.push("/")
        return
      }
    }

    checkAuth()
  }, [router, pathname, allowedRoles])

  return <>{children}</>
} 