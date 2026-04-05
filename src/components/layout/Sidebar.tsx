import { NavLink } from 'react-router-dom'
import { useUIStore } from '@/store/uiStore'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '▦', end: true },
  { to: '/accounts', label: 'Cuentas', icon: '🏦' },
  { to: '/transactions', label: 'Transacciones', icon: '↕' },
  { to: '/categories', label: 'Categorías', icon: '🏷' },
  { to: '/budgets', label: 'Presupuestos', icon: '📊' },
  { to: '/reports', label: 'Informes', icon: '📈' },
  { to: '/scheduled', label: 'Recurrentes', icon: '🔄' },
  { to: '/import', label: 'Importar', icon: '📥' },
]

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)

  return (
    <aside
      className={`flex flex-col bg-gray-900 text-gray-100 transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-56'
      } min-h-screen shrink-0`}
    >
      <div className="flex items-center h-14 px-4 border-b border-gray-700">
        {!collapsed && (
          <span className="text-lg font-semibold text-white tracking-tight">FinControl</span>
        )}
        {collapsed && <span className="text-xl mx-auto">FC</span>}
      </div>

      <nav className="flex-1 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-sm transition-colors rounded-none ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span className="text-base shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
