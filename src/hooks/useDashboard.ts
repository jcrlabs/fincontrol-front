import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'
import { useUIStore } from '@/store/uiStore'

export function useDashboard() {
  const dateRange = useUIStore((s) => s.dateRange)
  return useQuery({
    queryKey: ['dashboard', dateRange],
    queryFn: () => dashboardApi.get(dateRange),
  })
}
