import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, AuthContextType } from '../types/auth'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ? {
        id: session.user.id,
        name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || '',
        email: session.user.email || '',
        isPro: false // Set based on your pro user logic
      } : null)
      setIsAuthenticated(!!session)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ? {
        id: session.user.id,
        name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || '',
        email: session.user.email || '',
        isPro: false // Set based on your pro user logic
      } : null)
      setIsAuthenticated(!!session)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return {
      token: data.session?.access_token,
      user: {
        id: data.user.id,
        name: data.user.user_metadata.full_name || data.user.email?.split('@')[0] || '',
        email: data.user.email || '',
        isPro: false // Set based on your pro user logic
      }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token: session?.access_token || null,
      isAuthenticated, 
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}