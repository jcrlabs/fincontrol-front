import { useMemo } from 'react'
import type { EntryFormData } from '@/types/transaction'

export function useBalanceCheck(entries: EntryFormData[]) {
  return useMemo(() => {
    let debits = 0
    let credits = 0
    for (const entry of entries) {
      const amount = parseFloat(entry.amount) || 0
      if (entry.type === 'debit') debits += amount
      else credits += amount
    }
    const balance = debits - credits
    return {
      debits,
      credits,
      balance,
      isBalanced: Math.abs(balance) < 0.001,
    }
  }, [entries])
}
