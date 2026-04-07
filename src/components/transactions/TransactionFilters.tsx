import { useTranslation } from 'react-i18next'
import { useAccounts } from '@/hooks/useAccounts'
import { CategorySelect } from '@/components/categories/CategorySelect'
import type { TransactionFilters } from '@/types/transaction'

interface TransactionFiltersProps {
  filters: TransactionFilters
  onChange: (filters: TransactionFilters) => void
}

export function TransactionFiltersBar({ filters, onChange }: TransactionFiltersProps) {
  const { t } = useTranslation()
  const { data: accounts = [] } = useAccounts()

  const update = (patch: Partial<TransactionFilters>) =>
    onChange({ ...filters, page: 1, ...patch })

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="date"
        value={filters.date_from ?? ''}
        onChange={(e) => update({ date_from: e.target.value || undefined })}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={t('transactions.filterFromDate')}
      />
      <input
        type="date"
        value={filters.date_to ?? ''}
        onChange={(e) => update({ date_to: e.target.value || undefined })}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={t('transactions.filterToDate')}
      />
      <select
        value={filters.account_id ?? ''}
        onChange={(e) => update({ account_id: e.target.value || undefined })}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{t('transactions.filterAllAccounts')}</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
      <CategorySelect
        value={filters.category_id ?? ''}
        onChange={(v) => update({ category_id: v || undefined })}
        placeholder={t('transactions.filterAllCategories')}
      />
      {(filters.date_from || filters.date_to || filters.account_id || filters.category_id) && (
        <button
          onClick={() => onChange({ page: 1, per_page: filters.per_page })}
          className="text-sm text-red-600 dark:text-red-400 hover:underline px-2"
        >
          {t('transactions.filterClear')}
        </button>
      )}
    </div>
  )
}
