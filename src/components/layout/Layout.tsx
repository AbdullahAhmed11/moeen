import { Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { ThemeToggle } from '../ThemeToggle'
import { getNavItemByPath } from '../../routes/nav'
import { Sidebar } from './Sidebar'
import { SidebarProvider, useSidebar } from './SidebarContext'

function LayoutShell() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { isCollapsed, isMobile, toggleMobile } = useSidebar()
  const { pathname } = useLocation()
  const currentNav = getNavItemByPath(pathname)

  return (
    <div className="min-h-svh bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <Sidebar />

      <div
        className={[
          'min-h-svh transition-[margin] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          isMobile ? 'ms-0' : isCollapsed ? 'lg:ms-[4.5rem]' : 'lg:ms-72',
        ].join(' ')}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-900/80 sm:gap-4 sm:px-6">
          <button
            type="button"
            onClick={toggleMobile}
            aria-label={t('sidebar.open')}
            className="rounded-xl p-2 text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-xl">
              {t(`nav.${currentNav.key}`)}
            </h1>
            {currentNav.key === 'dashboard' && (
              <p className="hidden truncate text-sm text-slate-500 dark:text-slate-400 sm:block">
                {t('header.welcome')}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          <div className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-indigo-400 to-violet-500 text-xs font-bold text-white shadow-md shadow-indigo-500/20 lg:hidden">
            {user?.initials ?? 'AD'}
          </div>
        </header>

        <main className="animate-fade-in p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function Layout() {
  return (
    <SidebarProvider>
      <LayoutShell />
    </SidebarProvider>
  )
}
