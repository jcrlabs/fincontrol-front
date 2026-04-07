import { useTranslation } from 'react-i18next'
import { AccountsTable } from '@/components/accounts/AccountsTable'

export function AccountsPage() {
  const { t } = useTranslation()
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('accounts.title')}</h1>
      <AccountsTable />
    </div>
  )
}
