import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'

const CURRENCIES = ['EUR', 'USD', 'GBP']

export function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { currency, setCurrency, darkMode, toggleDarkMode, toggleSidebar } = useUIStore()

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
      <button
        onClick={toggleSidebar}
        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <div className="flex items-center gap-3">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀' : '🌙'}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-200">{user?.name}</span>
          <button
            onClick={logout}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
