import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'

const CURRENCIES = ['EUR', 'USD', 'GBP']

export function Navbar() {
  const { t, i18n } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { currency, setCurrency, darkMode, toggleDarkMode, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore()

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')
  }

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
      <div className="flex items-center gap-2">
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="md:hidden p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          aria-label={t('common.openMenu')}
        >
          ☰
        </button>
        {/* Desktop collapse */}
        <button
          onClick={toggleSidebar}
          className="hidden md:block p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          aria-label={t('common.toggleSidebar')}
        >
          ☰
        </button>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <button
          onClick={toggleLanguage}
          className="text-sm font-medium px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          aria-label="Switch language"
        >
          {i18n.language === 'es' ? 'EN' : 'ES'}
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          aria-label={t('common.toggleDark')}
        >
          {darkMode ? '☀' : '🌙'}
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-200">{user?.name}</span>
          <button
            onClick={logout}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            {t('common.logout')}
          </button>
        </div>
      </div>
    </header>
  )
}
