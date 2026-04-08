import { api } from './client'
import type { Account, CreateAccountInput, UpdateAccountInput } from '@/types/account'
import type { Entry } from '@/types/transaction'
import type { PaginatedResponse } from '@/types/common'

// Backend serializes decimal fields as strings — parse them to numbers here
// so the rest of the app works with the typed interface.
function parseAccount(raw: unknown): Account {
  const a = raw as Account & { balance: string }
  return { ...a, balance: parseFloat(a.balance) || 0 }
}

function parseEntry(raw: unknown): Entry {
  const e = raw as Entry & { amount: string }
  return { ...e, amount: parseFloat(e.amount) || 0 }
}

export const accountsApi = {
  list: async (): Promise<Account[]> => {
    const { data } = await api.get<unknown[]>('/accounts')
    return data.map(parseAccount)
  },

  get: async (id: string): Promise<Account> => {
    const { data } = await api.get<unknown>(`/accounts/${id}`)
    return parseAccount(data)
  },

  create: async (input: CreateAccountInput): Promise<Account> => {
    const { data } = await api.post<unknown>('/accounts', input)
    return parseAccount(data)
  },

  update: async (id: string, input: UpdateAccountInput): Promise<Account> => {
    const { data } = await api.put<unknown>(`/accounts/${id}`, input)
    return parseAccount(data)
  },

  listEntries: async (id: string, page = 1, perPage = 20): Promise<PaginatedResponse<Entry>> => {
    const { data } = await api.get<PaginatedResponse<unknown>>(`/accounts/${id}/entries`, {
      params: { page, per_page: perPage },
    })
    return { ...data, items: data.items.map(parseEntry) }
  },
}
