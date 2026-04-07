import { formatMoney } from '@/utils/money'

interface MoneyDisplayProps {
  amount: number
  currency?: string
  colored?: boolean
  className?: string
}

export function MoneyDisplay({ amount, currency = 'EUR', colored = false, className = '' }: MoneyDisplayProps) {
  const colorClass = colored
    ? amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    : ''

  return (
    <span className={`tabular-nums ${colorClass} ${className}`}>
      {formatMoney(amount, currency)}
    </span>
  )
}
