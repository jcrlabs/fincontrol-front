import { api } from './client'
import type { JournalEntry, CreateTransactionInput, TransactionFilters } from '@/types/transaction'
import type { PaginatedResponse } from '@/types/common'

// Backend serializes entry amounts as decimal strings — parse to number here.
function parseJournal(raw: JournalEntry): JournalEntry {
  return {
    ...raw,
    entries: raw.entries.map((e) => ({ ...e, amount: parseFloat(e.amount as unknown as string) || 0 })),
  }
}

export const transactionsApi = {
  list: async (filters?: TransactionFilters): Promise<PaginatedResponse<JournalEntry>> => {
    const { data } = await api.get<PaginatedResponse<JournalEntry>>('/transactions', { params: filters })
    return { ...data, items: data.items.map(parseJournal) }
  },

  get: async (id: string): Promise<JournalEntry> => {
    const { data } = await api.get<JournalEntry>(`/transactions/${id}`)
    return parseJournal(data)
  },

  create: async (input: CreateTransactionInput): Promise<JournalEntry> => {
    const { data } = await api.post<JournalEntry>('/transactions', input)
    return parseJournal(data)
  },

  void: async (id: string): Promise<JournalEntry> => {
    const { data } = await api.post<JournalEntry>(`/transactions/${id}/void`)
    return parseJournal(data)
  },
}
