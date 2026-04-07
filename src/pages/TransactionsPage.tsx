import { useTranslation } from 'react-i18next'
import { TransactionsTable } from '@/components/transactions/TransactionsTable'

export function TransactionsPage() {
  const { t } = useTranslation()
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('transactions.title')}</h1>
      <TransactionsTable />
    </div>
  )
}
