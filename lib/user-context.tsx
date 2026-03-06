"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { User } from "./types"
import { mockUser } from "./data"


interface UserContextType {
  user: User & { avatarUrl?: string }
  isAuthenticated: boolean
  isLoading: boolean
  isInitialLoad: boolean
  purchaseCourse: (courseId: string) => void
  hasCourseAccess: (courseId: string) => boolean
  signOut: () => Promise<void>
  // Corrected to accept a File object for the profile picture
  updateProfile: (data: { displayName?: string; bio?: string; avatarFile?: File }) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

function ConvexUserProvider({ children }: { children: ReactNode }) {
  // Query current user - will be null if not authenticated
  const currentUser = useQuery(api.users.currentUser)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [cookieAuth, setCookieAuth] = useState<string | null>(null)

  useEffect(() => {
    // Check for auth cookie on mount
    if (typeof document !== "undefined") {
      const authCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_session="));
      
      if (authCookie) {
        const email = authCookie.split("=")[1];
        setCookieAuth(email);
      }
    }
  }, []);

  useEffect(() => {
    // After first render, mark initial load as done
    if (currentUser !== undefined || cookieAuth) {
      setIsInitialLoad(false)
    }
  }, [currentUser, cookieAuth])

  // Determine if user is authenticated based on cookie or currentUser
  const isAuthenticated = cookieAuth !== null || (currentUser !== null && currentUser !== undefined)
  
  const user: User & { avatarUrl?: string } = currentUser
    ? {
        name: currentUser.displayName || "User",
        email: currentUser.email || cookieAuth || "",
        coursesPurchased: [],
        avatarUrl: currentUser.avatarUrl || undefined,
      }
    : cookieAuth
    ? {
        name: cookieAuth.split("@")[0],
        email: cookieAuth,
        coursesPurchased: [],
      }
    : mockUser

  const signOut = async () => {
    // Clear the auth cookie
    if (typeof document !== "undefined") {
      document.cookie = "auth_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    setCookieAuth(null);
    
    // Redirect to home page after sign out
    window.location.href = "/"
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
        isLoading: currentUser === undefined && !cookieAuth,
        isInitialLoad,
        purchaseCourse,
        hasCourseAccess,
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
