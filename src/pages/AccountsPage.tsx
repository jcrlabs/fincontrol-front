import { AccountsTable } from '@/components/accounts/AccountsTable'

export function AccountsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cuentas</h1>
      <AccountsTable />
    </div>
  )
}
