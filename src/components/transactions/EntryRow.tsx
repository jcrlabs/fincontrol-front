import type { UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { useAccounts } from '@/hooks/useAccounts'
import type { TransactionFormData } from '@/types/transaction'

interface EntryRowProps {
  index: number
  register: UseFormRegister<TransactionFormData>
  setValue: UseFormSetValue<TransactionFormData>
  typeValue: 'debit' | 'credit'
  canRemove: boolean
  onRemove: () => void
}

export function EntryRow({ index, register, setValue, typeValue, canRemove, onRemove }: EntryRowProps) {
  const { data: accounts = [] } = useAccounts()

  return (
    <div className="flex gap-2 items-start">
      <select
        {...register(`entries.${index}.account_id`)}
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">— Cuenta —</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name} ({a.type})
          </option>
        ))}
      </select>

      <input
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        {...register(`entries.${index}.amount`)}
        className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 tabular-nums"
      />

      <button
        type="button"
        onClick={() =>
          setValue(`entries.${index}.type`, typeValue === 'debit' ? 'credit' : 'debit')
        }
        className={`px-3 py-2 text-xs font-medium rounded-md border transition-colors w-20 ${
          typeValue === 'debit'
            ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
            : 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300'
        }`}
      >
        {typeValue === 'debit' ? 'Débito' : 'Crédito'}
      </button>

      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Eliminar línea"
      >
        ✕
      </button>
    </div>
  )
}
