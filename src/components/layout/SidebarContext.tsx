import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

type SidebarContextValue = {
  isCollapsed: boolean
  isMobileOpen: boolean
  isMobile: boolean
  toggleCollapsed: () => void
  toggleMobile: () => void
  closeMobile: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

const STORAGE_KEY = 'hr-sidebar-collapsed'

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(STORAGE_KEY) === 'true'
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isCollapsed))
  }, [isCollapsed])

  useEffect(() => {
    if (!isMobile) setIsMobileOpen(false)
  }, [isMobile])

  useEffect(() => {
    document.body.style.overflow = isMobile && isMobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobile, isMobileOpen])

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev)
  }, [])

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev)
  }, [])

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      isCollapsed,
      isMobileOpen,
      isMobile,
      toggleCollapsed,
      toggleMobile,
      closeMobile,
    }),
    [isCollapsed, isMobileOpen, isMobile, toggleCollapsed, toggleMobile, closeMobile],
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}
