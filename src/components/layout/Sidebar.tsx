import { ChevronLeft, LogOut, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { navItems } from '../../routes/nav'
import { useSidebar } from './SidebarContext'

export function Sidebar() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { isCollapsed, isMobileOpen, isMobile, toggleCollapsed, closeMobile } = useSidebar()

  const showExpanded = isMobile ? isMobileOpen : !isCollapsed
  const logoItem = navItems[0]

  return (
    <>
      <div
        aria-hidden={!isMobileOpen}
        onClick={closeMobile}
        className={[
          'fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isMobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      />

      <aside
        className={[
          'fixed inset-y-0 start-0 z-50 flex flex-col border-e border-slate-800/80 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100 shadow-2xl shadow-slate-950/40',
          'transition-[width,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[width,transform]',
          isMobile
            ? [
                'w-72',
                isMobileOpen
                  ? 'translate-x-0'
                  : '-translate-x-full rtl:translate-x-full rtl:-translate-x-0',
              ]
            : [isCollapsed ? 'w-[4.5rem]' : 'w-72'],
        ].join(' ')}
      >
        <div
          className={[
            'flex h-16 shrink-0 items-center border-b border-slate-800/80 px-3',
            showExpanded ? 'justify-between' : 'justify-center',
          ].join(' ')}
        >
          <div
            className={[
              'flex items-center gap-3 overflow-hidden transition-all duration-300',
              showExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0',
            ].join(' ')}
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/30">
              <logoItem.icon className="size-5 text-white" strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-white">
                {t('app.title')}
              </p>
              <p className="truncate text-xs text-slate-400">{t('app.subtitle')}</p>
            </div>
          </div>

          {!showExpanded && (
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/30">
              <logoItem.icon className="size-5 text-white" strokeWidth={2.25} />
            </div>
          )}

          {isMobile ? (
            <button
              type="button"
              onClick={closeMobile}
              aria-label={t('sidebar.close')}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <X className="size-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={isCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
              className={[
                'rounded-lg p-2 text-slate-400 transition-all duration-300 hover:bg-slate-800 hover:text-white',
                isCollapsed &&
                  'absolute -end-3 top-5 z-10 border border-slate-700 bg-slate-900 shadow-md',
              ].join(' ')}
            >
              <ChevronLeft
                className={[
                  'size-5 transition-transform duration-300 rtl:rotate-180',
                  isCollapsed && 'rotate-180 rtl:rotate-0',
                ].join(' ')}
              />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          {navItems.map((item, index) => (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === '/'}
              onClick={isMobile ? closeMobile : undefined}
              style={{ transitionDelay: `${index * 30}ms` }}
              className={({ isActive }) =>
                [
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-300 shadow-inner shadow-indigo-500/10'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100',
                  !showExpanded && 'justify-center px-0',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={[
                      'size-5 shrink-0 transition-transform duration-300 group-hover:scale-110',
                      isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-200',
                    ].join(' ')}
                    strokeWidth={2}
                  />

                  <span
                    className={[
                      'truncate whitespace-nowrap transition-all duration-300',
                      showExpanded
                        ? 'w-auto translate-x-0 opacity-100'
                        : 'w-0 -translate-x-2 opacity-0 rtl:translate-x-2',
                    ].join(' ')}
                  >
                    {t(`nav.${item.key}`)}
                  </span>

                  {isActive && showExpanded && (
                    <span className="ms-auto size-1.5 shrink-0 rounded-full bg-indigo-400" />
                  )}

                  {!showExpanded && (
                    <span className="pointer-events-none absolute start-full z-50 ms-3 hidden rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 lg:group-hover:block">
                      {t(`nav.${item.key}`)}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800/80 p-3">
          <div
            className={[
              'mb-3 flex items-center gap-3 overflow-hidden rounded-xl bg-slate-800/50 p-2 transition-all duration-300',
              showExpanded ? 'opacity-100' : 'justify-center opacity-100',
            ].join(' ')}
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-400 to-violet-500 text-xs font-bold text-white">
              {user?.initials ?? 'AD'}
            </div>
            <div
              className={[
                'min-w-0 flex-1 transition-all duration-300',
                showExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0',
              ].join(' ')}
            >
              <p className="truncate text-sm font-medium text-white">{user?.name ?? t('user.name')}</p>
              <p className="truncate text-xs text-slate-400">{user?.email ?? t('user.email')}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/login', { replace: true })
            }}
            className={[
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400',
              !showExpanded && 'justify-center px-0',
            ].join(' ')}
          >
            <LogOut className="size-5 shrink-0 rtl:rotate-180" strokeWidth={2} />
            <span
              className={[
                'truncate transition-all duration-300',
                showExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0',
              ].join(' ')}
            >
              {t('user.signOut')}
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}
