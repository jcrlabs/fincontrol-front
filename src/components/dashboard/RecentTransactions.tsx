import { Link } from 'react-router-dom'
import { useTransactions } from '@/hooks/useTransactions'
import { MoneyDisplay } from '@/components/common/MoneyDisplay'
import { TableSkeleton } from '@/components/common/Skeleton'
import { formatDate } from '@/utils/dates'

export function RecentTransactions() {
  const { data, isLoading } = useTransactions({ per_page: 10, page: 1 })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Últimas transacciones
        </p>
        <Link to="/transactions" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
          Ver todas
        </Link>
      </div>
      {isLoading ? (
        <TableSkeleton rows={5} cols={3} />
      ) : (
        <div className="space-y-2">
          {data?.items?.map((tx) => {
            const debit = tx.entries.filter((e) => e.amount > 0).reduce((s, e) => s + e.amount, 0)
            const firstEntry = tx.entries[0]
            return (
              <div key={tx.id} className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/transactions/${tx.id}`}
                    className="text-sm text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                  >
                    {tx.description}
                  </Link>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(tx.date)}</span>
                </div>
                <MoneyDisplay
                  amount={debit}
                  currency={firstEntry?.currency ?? 'EUR'}
                  className="text-sm shrink-0"
                />
              </div>
            )
          })}
          {!data?.items.length && (
            <p className="text-sm text-gray-400 dark:text-gray-500">Sin transacciones</p>
          )}
        </div>
      )}
    </div>
  )
}
