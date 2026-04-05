import { useAccounts } from '@/hooks/useAccounts'
import { MoneyDisplay } from '@/components/common/MoneyDisplay'
import { Skeleton } from '@/components/common/Skeleton'
import { useUIStore } from '@/store/uiStore'

export function BalanceCard() {
  const { data: accounts, isLoading } = useAccounts()
  const currency = useUIStore((s) => s.currency)

  const netWorth = accounts
    ? accounts
        .filter((a) => ['asset', 'liability'].includes(a.type))
        .reduce((sum, a) => {
          return a.type === 'asset' ? sum + a.balance : sum - a.balance
        }, 0)
    : 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        Patrimonio neto
      </p>
      {isLoading ? (
        <Skeleton className="h-9 w-40" />
      ) : (
        <MoneyDisplay
          amount={netWorth}
          currency={currency}
          colored
          className="text-3xl font-bold"
        />
      )}
    </div>
  )
}
