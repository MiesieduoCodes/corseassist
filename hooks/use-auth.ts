"use client"

import { useAuthContext } from "@/components/providers/auth-provider"

export function useAuth() {
  const { user, loading, login, logout } = useAuthContext()

  return {
    user,
    loading,
    login,
    logout,
  }
}
