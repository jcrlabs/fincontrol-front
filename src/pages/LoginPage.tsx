import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

type LoginFormData = { email: string; password: string }
type RegisterFormData = { name: string; email: string; password: string; confirmPassword: string }

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const loginSchema = z.object({
    email: z.string().email(t('auth.emailInvalid')),
    password: z.string().min(6, t('auth.passwordMinLogin')),
  })

  const registerSchema = z.object({
    name: z.string().min(2, t('auth.nameMin')),
    email: z.string().email(t('auth.emailInvalid')),
    password: z.string().min(8, t('auth.passwordMinRegister')),
    confirmPassword: z.string(),
  }).refine((d) => d.password === d.confirmPassword, {
    message: t('auth.passwordsNoMatch'),
    path: ['confirmPassword'],
  })

  const loginForm = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  const onLogin = async (data: LoginFormData) => {
    setLoading(true)
    try {
      const res = await authApi.login(data)
      login(res.user, res.access_token, '')
      navigate('/')
    } catch {
      toast.error(t('auth.loginError'))
    } finally {
      setLoading(false)
    }
  }

  const onRegister = async (data: RegisterFormData) => {
    setLoading(true)
    try {
      const res = await authApi.register({ email: data.email, password: data.password, name: data.name })
      login(res.user, res.access_token, '')
      toast.success(t('auth.welcome', { name: res.user.name }))
      navigate('/')
    } catch {
      toast.error(t('auth.registerError'))
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">FinControl</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {mode === 'login' ? t('auth.signIn') : t('auth.createAccount')}
        </p>

        {mode === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.email')}
              </label>
              <input type="email" {...loginForm.register('email')} className={inputClass} />
              {loginForm.formState.errors.email && (
                <p className="mt-1 text-xs text-red-600">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.password')}
              </label>
              <input type="password" {...loginForm.register('password')} className={inputClass} />
              {loginForm.formState.errors.password && (
                <p className="mt-1 text-xs text-red-600">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
            >
              {loading ? t('auth.loggingIn') : t('auth.login')}
            </button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.name')}
              </label>
              <input type="text" {...registerForm.register('name')} className={inputClass} />
              {registerForm.formState.errors.name && (
                <p className="mt-1 text-xs text-red-600">{registerForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.email')}
              </label>
              <input type="email" {...registerForm.register('email')} className={inputClass} />
              {registerForm.formState.errors.email && (
                <p className="mt-1 text-xs text-red-600">{registerForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.password')}
              </label>
              <input type="password" {...registerForm.register('password')} className={inputClass} />
              {registerForm.formState.errors.password && (
                <p className="mt-1 text-xs text-red-600">{registerForm.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.confirmPassword')}
              </label>
              <input type="password" {...registerForm.register('confirmPassword')} className={inputClass} />
              {registerForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{registerForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
            >
              {loading ? t('auth.registering') : t('auth.register')}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-blue-600 hover:underline font-medium"
          >
            {mode === 'login' ? t('auth.signUp') : t('auth.signInLink')}
          </button>
        </p>
      </div>
    </div>
  )
}
