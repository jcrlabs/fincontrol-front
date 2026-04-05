import { Link } from 'react-router-dom'
import { useBudgets } from '@/hooks/useBudgets'
import { MoneyDisplay } from '@/components/common/MoneyDisplay'
import { Skeleton } from '@/components/common/Skeleton'
import { useUIStore } from '@/store/uiStore'

export function BudgetAlerts() {
  const currency = useUIStore((s) => s.currency)
  const { data: budgets, isLoading } = useBudgets()

  const alerts = budgets?.filter((b) => (b.percentage ?? 0) >= (b.alert_threshold_pct ?? 80)) ?? []

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Alertas de presupuesto
        </p>
        <Link to="/budgets" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
          Ver todos
        </Link>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      ) : alerts.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">Sin alertas activas</p>
      ) : (
        <div className="space-y-3">
          {alerts.map((budget) => {
            const pct = Math.min(budget.percentage ?? 0, 100)
            const barColor =
              pct >= 100
                ? 'bg-red-500'
                : pct >= 80
                ? 'bg-amber-500'
                : 'bg-green-500'
            return (
              <div key={budget.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {budget.category_name ?? '—'}
                  </span>
                  <span className={pct >= 100 ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-amber-600 dark:text-amber-400'}>
                    <MoneyDisplay amount={budget.spent ?? 0} currency={currency} /> / <MoneyDisplay amount={budget.amount} currency={currency} />
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${barColor} ${pct >= 100 ? 'animate-pulse' : ''}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
