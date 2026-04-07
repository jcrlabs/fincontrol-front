import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTransactions } from '@/hooks/useTransactions'
import { MoneyDisplay } from '@/components/common/MoneyDisplay'
import { Badge } from '@/components/common/Badge'
import { TableSkeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Modal } from '@/components/common/Modal'
import { TransactionForm } from './TransactionForm'
import { TransactionFiltersBar } from './TransactionFilters'
import { formatDate } from '@/utils/dates'
import type { TransactionFilters } from '@/types/transaction'

export function TransactionsTable() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1, per_page: 20 })
  const [creating, setCreating] = useState(false)
  const { data, isLoading } = useTransactions(filters)

  const totalPages = data ? Math.ceil(data.total / (filters.per_page ?? 20)) : 1
  const page = filters.page ?? 1

  if (isLoading) return <TableSkeleton rows={6} cols={5} />

  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={() => setCreating(true)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
          {t('transactions.new')}
        </button>
      </div>

      <TransactionFiltersBar filters={filters} onChange={setFilters} />

      {!data?.items.length ? (
        <EmptyState
          title={t('transactions.empty')}
          description={t('transactions.emptyDesc')}
          action={
            <button onClick={() => setCreating(true)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
              {t('transactions.newButton')}
            </button>
          }
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {[t('transactions.date'), t('transactions.description'), t('transactions.category'), t('transactions.lines'), t('transactions.status')].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {data.items.map((tx) => {
                  const debitTotal = tx.entries.filter((e) => e.amount > 0).reduce((s, e) => s + e.amount, 0)
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{formatDate(tx.date)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        <Link to={`/transactions/${tx.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">{tx.description}</Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{tx.category_name ?? '—'}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 dark:text-gray-400">{t('transactions.entriesCount', { count: tx.entries.length })}</span>
                          <MoneyDisplay amount={debitTotal} colored />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {tx.is_reversal ? <Badge variant="red">{t('transactions.voided')}</Badge> : <Badge variant="green">{t('transactions.active')}</Badge>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, page - 1) }))} disabled={page === 1} className="text-sm text-blue-600 disabled:opacity-40 hover:underline">
                {t('common.previous')}
              </button>
              <span className="text-sm text-gray-500">{t('common.page', { page, total: totalPages })}</span>
              <button onClick={() => setFilters((f) => ({ ...f, page: Math.min(totalPages, page + 1) }))} disabled={page === totalPages} className="text-sm text-blue-600 disabled:opacity-40 hover:underline">
                {t('common.next')}
              </button>
            </div>
          )}
        </>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title={t('transactions.newModal')}>
        <TransactionForm onSuccess={() => setCreating(false)} />
      </Modal>
    </>
  )
}
