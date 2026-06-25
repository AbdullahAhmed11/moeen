import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type AuthUser = {
  name: string
  email: string
  initials: string
}

type AuthSession = {
  user: AuthUser
  token: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AUTH_STORAGE_KEY = 'hr-auth-session'

const DEMO_CREDENTIALS = {
  email: 'admin@mahrc.com',
  password: 'admin123',
  user: {
    name: 'Admin User',
    email: 'admin@mahrc.com',
    initials: 'AU',
  },
} as const

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthSession
    if (!parsed?.user?.email || !parsed?.token) return null
    return parsed
  } catch {
    return null
  }
}

function persistSession(session: AuthSession | null) {
  if (session) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = readStoredSession()
    setUser(session?.user ?? null)
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase()

    await new Promise((resolve) => setTimeout(resolve, 900))

    if (
      normalizedEmail !== DEMO_CREDENTIALS.email ||
      password !== DEMO_CREDENTIALS.password
    ) {
      throw new Error('invalid_credentials')
    }

    const session: AuthSession = {
      user: DEMO_CREDENTIALS.user,
      token: `session-${Date.now()}`,
    }

    persistSession(session)
    setUser(session.user)
  }, [])

  const logout = useCallback(() => {
    persistSession(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
