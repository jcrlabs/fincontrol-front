import { usePnL } from '@/hooks/useReports'
import { MoneyDisplay } from '@/components/common/MoneyDisplay'
import { Skeleton } from '@/components/common/Skeleton'
import { useUIStore } from '@/store/uiStore'

export function BurnRateCard() {
  const { data, isLoading } = usePnL()
  const currency = useUIStore((s) => s.currency)
  const dateRange = useUIStore((s) => s.dateRange)

  const days =
    (new Date(dateRange.to).getTime() - new Date(dateRange.from).getTime()) / (1000 * 60 * 60 * 24) + 1

  const dailyRate = data ? data.total_expenses / Math.max(days, 1) : 0
  const remaining = new Date(dateRange.to).getTime() - Date.now()
  const remainingDays = Math.max(0, remaining / (1000 * 60 * 60 * 24))
  const projection = dailyRate * remainingDays

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        Burn rate
      </p>
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      ) : (
        <>
          <MoneyDisplay amount={dailyRate} currency={currency} className="text-2xl font-bold text-gray-900 dark:text-white" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">por día</p>
          {remainingDays > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Proyección restante:{' '}
              <MoneyDisplay amount={projection} currency={currency} colored className="font-medium" />
            </p>
          )}
        </>
      )}
    </div>
  )
}
