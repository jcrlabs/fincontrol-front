import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAccount, useAccountEntries } from '@/hooks/useAccounts'
import { MoneyDisplay } from '@/components/common/MoneyDisplay'
import { Badge } from '@/components/common/Badge'
import { TableSkeleton } from '@/components/common/Skeleton'
import { formatDate } from '@/utils/dates'
import type { AccountType } from '@/types/account'

const typeVariant: Record<AccountType, 'green' | 'red' | 'blue' | 'amber' | 'gray'> = {
  asset: 'green',
  liability: 'red',
  equity: 'blue',
  income: 'green',
  expense: 'amber',
}

export function AccountDetail() {
  const { id = '' } = useParams()
  const [page, setPage] = useState(1)
  const { data: account, isLoading: loadingAccount } = useAccount(id)
  const { data: entries, isLoading: loadingEntries } = useAccountEntries(id, page)

  if (loadingAccount) return <TableSkeleton rows={3} cols={4} />
  if (!account) return <p className="text-gray-500">Cuenta no encontrada</p>

  const totalPages = entries ? Math.ceil(entries.total / entries.per_page) : 1

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/accounts" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← Cuentas
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{account.name}</h1>
        <Badge variant={typeVariant[account.type]}>{account.type}</Badge>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Balance</p>
        <MoneyDisplay
          amount={account.balance}
          currency={account.currency}
          colored
          className="text-3xl font-bold"
        />
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Movimientos</h2>
        {loadingEntries ? (
          <TableSkeleton rows={5} cols={4} />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {['Fecha', 'Descripción', 'Importe', 'Moneda'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {entries?.items.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(entry.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      <Link
                        to={`/transactions/${entry.journal_entry_id}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Ver transacción
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <MoneyDisplay amount={entry.amount} currency={entry.currency} colored />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {entry.currency}
                    </td>
                  </tr>
                ))}
                {!entries?.items.length && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      Sin movimientos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm text-blue-600 disabled:opacity-40 hover:underline"
            >
              ← Anterior
            </button>
            <span className="text-sm text-gray-500">Pág {page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-sm text-blue-600 disabled:opacity-40 hover:underline"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
