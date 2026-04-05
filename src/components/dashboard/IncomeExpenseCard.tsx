import { usePnL } from '@/hooks/useReports'
import { MoneyDisplay } from '@/components/common/MoneyDisplay'
import { Skeleton } from '@/components/common/Skeleton'
import { useUIStore } from '@/store/uiStore'

export function IncomeExpenseCard() {
  const { data, isLoading } = usePnL()
  const currency = useUIStore((s) => s.currency)

  const income = data?.total_income ?? 0
  const expenses = data?.total_expenses ?? 0
  const net = data?.total_net ?? 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        Ingresos / Gastos
      </p>
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-7 w-40" />
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Ingresos</span>
            <MoneyDisplay amount={income} currency={currency} colored />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Gastos</span>
            <MoneyDisplay amount={-expenses} currency={currency} colored />
          </div>
          <div className="flex justify-between text-base font-semibold border-t border-gray-100 dark:border-gray-700 pt-1.5">
            <span className="text-gray-700 dark:text-gray-300">Resultado</span>
            <MoneyDisplay amount={net} currency={currency} colored />
          </div>
        </div>
      )}
    </div>
  )
}
