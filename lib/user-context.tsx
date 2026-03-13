"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { User } from "./types"
import { mockUser } from "./data"
import { useAuthActions, useAuthToken } from "@convex-dev/auth/react"


interface UserContextType {
  user: User & { avatarUrl?: string }
  isAuthenticated: boolean
  /** True only when a real Convex JWT is present — safe to call Convex mutations */
  hasConvexToken: boolean
  isLoading: boolean
  isInitialLoad: boolean
  purchaseCourse: (courseId: string) => void
  hasCourseAccess: (courseId: string) => boolean
  signOut: () => Promise<void>
  refreshAuth: () => void
  // Corrected to accept a File object for the profile picture
  updateProfile: (data: { displayName?: string; bio?: string; avatarFile?: File }) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

function ConvexUserProvider({ children }: { children: ReactNode }) {
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [cookieAuth, setCookieAuth] = useState<string | null>(null)
  const [hasExplicitSignOut, setHasExplicitSignOut] = useState(false)
  const authToken = useAuthToken()
  const { signOut: convexSignOut } = useAuthActions()

  const refreshAuth = useCallback(() => {
    if (typeof document === "undefined") return

    const authCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_session="))

    const email = authCookie ? decodeURIComponent(authCookie.split("=")[1] ?? "") : null
    setCookieAuth(email || null)
  }, [])

  useEffect(() => {
    // Initial auth check and client-side sync hooks (login/logout in other tabs, etc.)
    refreshAuth()

    const handleVisibility = () => {
      if (document.visibilityState === "visible") refreshAuth()
    }
    const handleFocus = () => refreshAuth()
    const handleAuthChanged = () => refreshAuth()

    document.addEventListener("visibilitychange", handleVisibility)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("auth-state-changed", handleAuthChanged)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("auth-state-changed", handleAuthChanged)
    }
  }, [refreshAuth])

  useEffect(() => {
    // Finish initial hydration pass after first mount/auth refresh.
    setIsInitialLoad(false)
  }, [])

  useEffect(() => {
    if (authToken || cookieAuth) {
      setHasExplicitSignOut(false)
    }
  }, [authToken, cookieAuth])

  const isAuthenticated = !hasExplicitSignOut && (!!authToken || cookieAuth !== null)
  const hasConvexToken = !hasExplicitSignOut && !!authToken

  const user: User & { avatarUrl?: string } = cookieAuth
    ? {
        name: cookieAuth.split("@")[0],
        email: cookieAuth,
        coursesPurchased: [],
      }
    : isAuthenticated
      ? {
          // Keep a neutral user object during auth-token/cookie sync windows.
          name: "",
          coursesPurchased: [],
        }
      : mockUser

  const signOut = async () => {
    setHasExplicitSignOut(true)

    try {
      await convexSignOut()
    } catch (error) {
      console.warn("Convex signOut failed:", error)
    }

    // Clear the auth cookie
    if (typeof document !== "undefined") {
      document.cookie = "auth_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }
    setCookieAuth(null)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-state-changed"))
    }
  }

  const purchaseCourse = (_id: string) => {
    // TODO: Implement course purchase logic
  }

  const hasCourseAccess = (_id: string) => {
    return false
  }

  const updateProfile = async (_data: { displayName?: string; bio?: string; avatarFile?: File }) => {
    // TODO: Implement profile update logic
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        hasConvexToken,
        isLoading: isInitialLoad,
        isInitialLoad,
        purchaseCourse,
        hasCourseAccess,
        refreshAuth,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function UserProvider({ children }: { children: ReactNode }) {
  return <ConvexUserProvider>{children}</ConvexUserProvider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) throw new Error("useUser must be used within a UserProvider")
  return context
}
