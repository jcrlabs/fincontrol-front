import { TransactionsTable } from '@/components/transactions/TransactionsTable'

export function TransactionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Transacciones</h1>
      <TransactionsTable />
    </div>
  )
}
