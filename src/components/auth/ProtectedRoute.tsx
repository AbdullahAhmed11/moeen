import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/ma-logo.png"
          alt="MA Human Resources"
          className="h-14 w-auto animate-login-logo-pulse"
        />
        <div className="flex gap-1.5">
          <span className="size-2 animate-login-dot rounded-full bg-indigo-400 [animation-delay:0ms]" />
          <span className="size-2 animate-login-dot rounded-full bg-indigo-400 [animation-delay:150ms]" />
          <span className="size-2 animate-login-dot rounded-full bg-indigo-400 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <AuthLoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
