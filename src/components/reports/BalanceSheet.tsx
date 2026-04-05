import { useBalanceSheet } from '@/hooks/useReports'
import { MoneyDisplay } from '@/components/common/MoneyDisplay'
import { TableSkeleton } from '@/components/common/Skeleton'
import { useUIStore } from '@/store/uiStore'
import type { BalanceSheetAccount } from '@/types/report'

function AccountGroup({ title, accounts, total, colorClass }: {
  title: string
  accounts: BalanceSheetAccount[]
  total: number
  colorClass: string
}) {
  const currency = useUIStore((s) => s.currency)
  return (
    <div>
      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{title}</h3>
        <MoneyDisplay amount={total} currency={currency} className={`font-bold ${colorClass}`} />
      </div>
      {accounts.map((a) => (
        <div key={a.id} className="flex justify-between py-2 pl-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">{a.name}</span>
          <MoneyDisplay amount={a.balance} currency={a.currency} className="text-sm" />
        </div>
      ))}
    </div>
  )
}

export function BalanceSheet() {
  const { data, isLoading } = useBalanceSheet()
  const currency = useUIStore((s) => s.currency)

  if (isLoading) return <TableSkeleton rows={8} cols={2} />

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total activos</p>
          <MoneyDisplay amount={data?.total_assets ?? 0} currency={currency} className="text-xl font-bold text-green-600 dark:text-green-400" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Patrimonio neto</p>
          <MoneyDisplay amount={data?.net_worth ?? 0} currency={currency} colored className="text-xl font-bold" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <AccountGroup
          title="Activos"
          accounts={data?.assets ?? []}
          total={data?.total_assets ?? 0}
          colorClass="text-green-600 dark:text-green-400"
        />
        <AccountGroup
          title="Pasivos"
          accounts={data?.liabilities ?? []}
          total={data?.total_liabilities ?? 0}
          colorClass="text-red-600 dark:text-red-400"
        />
        <AccountGroup
          title="Patrimonio"
          accounts={data?.equity ?? []}
          total={data?.net_worth ?? 0}
          colorClass="text-blue-600 dark:text-blue-400"
        />
      </div>
    </div>
  )
}
