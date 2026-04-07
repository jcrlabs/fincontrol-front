import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { useUIStore } from '@/store/uiStore'

export function Layout() {
  const darkMode = useUIStore((s) => s.darkMode)
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen)
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile overlay backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Navbar />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
