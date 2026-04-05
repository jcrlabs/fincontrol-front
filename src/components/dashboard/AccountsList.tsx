import { Link } from 'react-router-dom'
import { useAccounts } from '@/hooks/useAccounts'
import { MoneyDisplay } from '@/components/common/MoneyDisplay'
import { Badge } from '@/components/common/Badge'
import { TableSkeleton } from '@/components/common/Skeleton'
import type { AccountType } from '@/types/account'

const typeVariant: Record<AccountType, 'green' | 'red' | 'blue' | 'amber' | 'gray'> = {
  asset: 'green', liability: 'red', equity: 'blue', income: 'green', expense: 'amber',
}

export function AccountsList() {
  const { data: accounts, isLoading } = useAccounts()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Cuentas
        </p>
        <Link to="/accounts" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
          Ver todas
        </Link>
      </div>
      {isLoading ? (
        <TableSkeleton rows={4} cols={3} />
      ) : (
        <div className="space-y-2">
          {accounts?.filter((a) => a.is_active && a.type === 'asset').slice(0, 5).map((account) => (
            <div key={account.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Badge variant={typeVariant[account.type]}>{account.type}</Badge>
                <span className="text-sm text-gray-900 dark:text-white truncate">{account.name}</span>
              </div>
              <MoneyDisplay amount={account.balance} currency={account.currency} colored className="text-sm shrink-0" />
            </div>
          ))}
          {!accounts?.length && (
            <p className="text-sm text-gray-400 dark:text-gray-500">Sin cuentas</p>
          )}
        </div>
      )}
    </div>
  )
}
