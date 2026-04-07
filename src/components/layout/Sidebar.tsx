import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '@/store/uiStore'

export function Sidebar() {
  const { t } = useTranslation()
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen)
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen)

  const navItems = [
    { to: '/', label: t('nav.dashboard'), icon: '▦', end: true },
    { to: '/accounts', label: t('nav.accounts'), icon: '🏦' },
    { to: '/transactions', label: t('nav.transactions'), icon: '↕' },
    { to: '/categories', label: t('nav.categories'), icon: '🏷' },
    { to: '/budgets', label: t('nav.budgets'), icon: '📊' },
    { to: '/reports', label: t('nav.reports'), icon: '📈' },
    { to: '/scheduled', label: t('nav.scheduled'), icon: '🔄' },
    { to: '/import', label: t('nav.import'), icon: '📥' },
  ]

  return (
    <aside
      className={[
        'flex flex-col bg-gray-900 text-gray-100 transition-all duration-200 shrink-0',
        // Mobile: fixed drawer, shown/hidden via transform
        'fixed inset-y-0 left-0 z-30',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        // Desktop: static, never translated
        'md:static md:translate-x-0 md:inset-auto md:z-auto',
        collapsed ? 'md:w-16' : 'md:w-56',
        // Mobile width always full sidebar
        'w-64 md:w-auto',
      ].join(' ')}
    >
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-700">
        <span className={`text-lg font-semibold text-white tracking-tight ${collapsed ? 'md:hidden' : ''}`}>
          FinControl
        </span>
        {collapsed && <span className="hidden md:block text-xl mx-auto">FC</span>}
        {/* Close button — mobile only */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden p-1 rounded text-gray-400 hover:text-white"
          aria-label={t('common.close')}
        >
          ✕
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-sm transition-colors rounded-none ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span className="text-base shrink-0">{item.icon}</span>
            <span className={collapsed ? 'md:hidden' : ''}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
