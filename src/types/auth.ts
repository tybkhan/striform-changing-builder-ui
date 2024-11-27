export interface User {
  id: string
  name: string
  email: string
  isPro: boolean
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ token: string; user: User }>
  logout: () => void
}