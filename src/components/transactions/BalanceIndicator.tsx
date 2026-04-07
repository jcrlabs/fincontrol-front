import { formatMoney } from '@/utils/money'
import { useUIStore } from '@/store/uiStore'

interface BalanceIndicatorProps {
  debits: number
  credits: number
  balance: number
  isBalanced: boolean
}

export function BalanceIndicator({ debits, credits, balance, isBalanced }: BalanceIndicatorProps) {
  const currency = useUIStore((s) => s.currency)

  return (
    <div
      className={`flex items-center justify-between rounded-md px-4 py-2 text-sm border ${
        isBalanced
          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
          : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      }`}
    >
      <div className="flex gap-6 text-gray-600 dark:text-gray-400">
        <span>Débito: <span className="font-medium text-gray-900 dark:text-white">{formatMoney(debits, currency)}</span></span>
        <span>Crédito: <span className="font-medium text-gray-900 dark:text-white">{formatMoney(credits, currency)}</span></span>
      </div>
      {isBalanced ? (
        <span className="font-semibold text-green-600 dark:text-green-400">Cuadrado ✓</span>
      ) : (
        <span className="font-semibold text-red-600 dark:text-red-400">
          Diferencia: {formatMoney(Math.abs(balance), currency)}
        </span>
      )}
    </div>
  )
}
