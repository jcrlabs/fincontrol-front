import { api } from './client'
import type { JournalEntry, CreateTransactionInput, TransactionFilters } from '@/types/transaction'
import type { PaginatedResponse } from '@/types/common'

export const transactionsApi = {
  list: async (filters?: TransactionFilters): Promise<PaginatedResponse<JournalEntry>> => {
    const { data } = await api.get<PaginatedResponse<JournalEntry>>('/transactions', { params: filters })
    return data
  },

  get: async (id: string): Promise<JournalEntry> => {
    const { data } = await api.get<JournalEntry>(`/transactions/${id}`)
    return data
  },

  create: async (input: CreateTransactionInput): Promise<JournalEntry> => {
    const { data } = await api.post<JournalEntry>('/transactions', input)
    return data
  },

  void: async (id: string): Promise<JournalEntry> => {
    const { data } = await api.post<JournalEntry>(`/transactions/${id}/void`)
    return data
  },
}
