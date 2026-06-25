import { Eye, EyeOff, Loader2, Lock, Mail, Sparkles } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuth } from '../context/AuthContext'

type LocationState = {
  from?: { pathname: string }
}

export function LoginPage() {
  const { t } = useTranslation()
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from?.pathname ?? '/'

  const [email, setEmail] = useState('admin@mahrc.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 50)
    return () => window.clearTimeout(timer)
  }, [])

  if (!isLoading && isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return

    setError('')
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch {
      setError(t('login.invalidCredentials'))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-slate-950 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -start-24 -top-24 size-[420px] animate-login-orb-1 rounded-full bg-[#2B3FA8]/40 blur-3xl" />
        <div className="absolute -end-16 top-1/4 size-[360px] animate-login-orb-2 rounded-full bg-[#5B4FD4]/35 blur-3xl" />
        <div className="absolute bottom-0 start-1/3 size-[480px] animate-login-orb-3 rounded-full bg-[#1E3A8A]/30 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.2)_0%,rgba(15,23,42,0.95)_100%)]" />
        <div className="login-grid-overlay absolute inset-0 opacity-[0.04]" />
      </div>

      <div className="absolute end-4 top-4 z-20 flex items-center gap-2 sm:end-6 sm:top-6">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col lg:flex-row">
        <section
          className={[
            'flex flex-1 flex-col items-center justify-center px-6 py-12 text-center transition-all duration-700 lg:items-start lg:px-12 lg:py-16 lg:text-start',
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
          ].join(' ')}
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 -m-6 animate-login-glow rounded-full bg-indigo-500/20 blur-2xl" />
            {/* <img
              src="/ma-logo.png"
              alt={t('login.companyName')}
              className="relative h-16 w-auto sm:h-20 lg:h-24"
            /> */}
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-indigo-200 backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            {t('login.badge')}
          </div>

          <h1 className="mt-6 max-w-lg text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t('login.title')}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
            {t('login.subtitle')}
          </p>

          <div className="mt-10 hidden gap-6 lg:grid lg:grid-cols-3">
            {(['secure', 'fast', 'bilingual'] as const).map((key, index) => (
              <div
                key={key}
                className={[
                  'rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-500',
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
                ].join(' ')}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <p className="text-sm font-semibold text-white">{t(`login.features.${key}.title`)}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {t(`login.features.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center px-4 pb-10 lg:px-8 lg:pb-0">
          <div
            className={[
              'w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-6 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl transition-all duration-700 dark:bg-slate-900/90 sm:p-8',
              mounted ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-[0.98] opacity-0',
            ].join(' ')}
            style={{ transitionDelay: '150ms' }}
          >
            <div className="mb-8 text-center lg:text-start">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t('login.formTitle')}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {t('login.formSubtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div
                className={[
                  'space-y-2 transition-all duration-500',
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                ].join(' ')}
                style={{ transitionDelay: '250ms' }}
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  {t('login.email')}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t('login.emailPlaceholder')}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 ps-10 pe-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
                  />
                </div>
              </div>

              <div
                className={[
                  'space-y-2 transition-all duration-500',
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                ].join(' ')}
                style={{ transitionDelay: '350ms' }}
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  {t('login.password')}
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={t('login.passwordPlaceholder')}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 ps-10 pe-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                    className="absolute end-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error ? (
                <p
                  role="alert"
                  className="animate-login-shake rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
                >
                  {error}
                </p>
              ) : null}

              <div
                className={[
                  'transition-all duration-500',
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                ].join(' ')}
                style={{ transitionDelay: '450ms' }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-[#2B3FA8] via-[#4F46E5] to-[#6366F1] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {t('login.signingIn')}
                      </>
                    ) : (
                      t('login.signIn')
                    )}
                  </span>
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
              {t('login.demoHint')}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
