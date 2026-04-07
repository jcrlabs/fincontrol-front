import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAccounts } from '@/hooks/useAccounts'
import { MoneyDisplay } from '@/components/common/MoneyDisplay'
import { Badge } from '@/components/common/Badge'
import { TableSkeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Modal } from '@/components/common/Modal'
import { AccountForm } from './AccountForm'
import type { Account, AccountType } from '@/types/account'

const typeVariant: Record<AccountType, 'green' | 'red' | 'blue' | 'amber' | 'gray'> = {
  asset: 'green',
  liability: 'red',
  equity: 'blue',
  income: 'green',
  expense: 'amber',
}

export function AccountsTable() {
  const { t } = useTranslation()
  const { data: accounts, isLoading } = useAccounts()
  const [editing, setEditing] = useState<Account | null>(null)
  const [creating, setCreating] = useState(false)

  return (
    <>
      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : !accounts?.length ? (
        <EmptyState
          title={t('accounts.empty')}
          description={t('accounts.emptyDesc')}
          action={
            <button
              onClick={() => setCreating(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              {t('accounts.newButton')}
            </button>
          }
        />
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setCreating(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              {t('accounts.new')}
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {[t('accounts.name'), t('accounts.type'), t('accounts.currency'), t('accounts.balance'), ''].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {accounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      <Link
                        to={`/accounts/${account.id}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {account.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={typeVariant[account.type]}>{account.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {account.currency}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <MoneyDisplay amount={account.balance} currency={account.currency} colored />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditing(account)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {t('common.edit')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title={t('accounts.newModal')}>
        <AccountForm onSuccess={() => setCreating(false)} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={t('accounts.editModal')}>
        {editing && (
          <AccountForm account={editing} onSuccess={() => setEditing(null)} />
        )}
      </Modal>
    </>
  )
}
