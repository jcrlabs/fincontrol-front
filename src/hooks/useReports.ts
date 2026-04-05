import { useQuery } from '@tanstack/react-query'
import { reportsApi } from '@/api/reports'
import { useUIStore } from '@/store/uiStore'

function useRange() {
  return useUIStore((s) => s.dateRange)
}

export function usePnL() {
  const range = useRange()
  const currency = useUIStore((s) => s.currency)
  return useQuery({
    queryKey: ['reports', 'pnl', range, currency],
    queryFn: () => reportsApi.pnl(range, currency),
  })
}

export function useBalanceSheet() {
  const range = useRange()
  const currency = useUIStore((s) => s.currency)
  return useQuery({
    queryKey: ['reports', 'balance-sheet', range, currency],
    queryFn: () => reportsApi.balanceSheet(range, currency),
  })
}

export function useCashFlow() {
  const range = useRange()
  const currency = useUIStore((s) => s.currency)
  return useQuery({
    queryKey: ['reports', 'cash-flow', range, currency],
    queryFn: () => reportsApi.cashFlow(range, currency),
  })
}

export function useCategoryReport() {
  const range = useRange()
  const currency = useUIStore((s) => s.currency)
  return useQuery({
    queryKey: ['reports', 'categories', range, currency],
    queryFn: () => reportsApi.categories(range, currency),
  })
}
