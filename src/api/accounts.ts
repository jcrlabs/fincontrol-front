import { api } from './client'
import type { Account, CreateAccountInput, UpdateAccountInput } from '@/types/account'
import type { Entry } from '@/types/transaction'
import type { PaginatedResponse } from '@/types/common'

export const accountsApi = {
  list: async (): Promise<Account[]> => {
    const { data } = await api.get<Account[]>('/accounts')
    return data
  },

  get: async (id: string): Promise<Account> => {
    const { data } = await api.get<Account>(`/accounts/${id}`)
    return data
  },

  create: async (input: CreateAccountInput): Promise<Account> => {
    const { data } = await api.post<Account>('/accounts', input)
    return data
  },

  update: async (id: string, input: UpdateAccountInput): Promise<Account> => {
    const { data } = await api.put<Account>(`/accounts/${id}`, input)
    return data
  },

  listEntries: async (id: string, page = 1, perPage = 20): Promise<PaginatedResponse<Entry>> => {
    const { data } = await api.get<PaginatedResponse<Entry>>(`/accounts/${id}/entries`, {
      params: { page, per_page: perPage },
    })
    return data
  },
}
