"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface AdminUser {
  uid: string
  email: string
  displayName: string
  emailVerified: boolean
}

interface AuthContextType {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for admin user in localStorage
    const adminUser = localStorage.getItem("adminUser")
    if (adminUser) {
      setUser(JSON.parse(adminUser) as AdminUser)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simple admin authentication
    if (email === "Admin@admin.com" && password === "Admin@123") {
      const adminUser: AdminUser = {
        uid: "admin_user",
        email: "Admin@admin.com",
        displayName: "Admin",
        emailVerified: true,
      }
      localStorage.setItem("adminUser", JSON.stringify(adminUser))
      setUser(adminUser)
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = () => {
    localStorage.removeItem("adminUser")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
