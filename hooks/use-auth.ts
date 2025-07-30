"use client"

import { useState } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useAuthContext } from "@/components/providers/auth-provider"

// Mock user for development
const createMockUser = (email: string, displayName?: string) => ({
  uid: `mock_${email.replace("@", "_").replace(".", "_")}`,
  email,
  displayName: displayName || email.split("@")[0],
  emailVerified: true,
})

export function useAuth() {
  const { user, loading } = useAuthContext()
  const [authLoading, setAuthLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setAuthLoading(true)
    try {
      if (auth) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        // Mock login
        console.log("Mock login:", email)
        const mockUser = createMockUser(email)
        // Store mock user in localStorage for persistence
        localStorage.setItem("mockUser", JSON.stringify(mockUser))

        // Check for redirect parameter
        const urlParams = new URLSearchParams(window.location.search)
        const redirect = urlParams.get("redirect")

        if (redirect === "payment") {
          window.location.href = "/payment"
        } else {
          window.location.reload()
        }
      }
    } finally {
      setAuthLoading(false)
    }
  }

  const register = async (
    email: string,
    password: string,
    userData: {
      firstName: string
      lastName: string
    },
  ) => {
    setAuthLoading(true)
    try {
      if (auth && db) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)

        // Update profile
        await updateProfile(user, {
          displayName: `${userData.firstName} ${userData.lastName}`,
        })

        // Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email,
          createdAt: new Date(),
          role: "user",
        })
      } else {
        // Mock registration
        console.log("Mock registration:", email, userData)
        const mockUser = createMockUser(email, `${userData.firstName} ${userData.lastName}`)
        // Store mock user in localStorage for persistence
        localStorage.setItem("mockUser", JSON.stringify(mockUser))
        // Trigger a page reload to update auth state
        window.location.reload()
      }
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = async () => {
    if (auth) {
      await signOut(auth)
    } else {
      // Mock logout
      localStorage.removeItem("mockUser")
      window.location.reload()
    }
  }

  return {
    user,
    loading: loading || authLoading,
    login,
    register,
    logout,
  }
}
