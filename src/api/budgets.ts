import { api } from './client'
import type { Budget, CreateBudgetInput, UpdateBudgetInput } from '@/types/budget'

export const budgetsApi = {
  list: async (month?: string): Promise<Budget[]> => {
    const { data } = await api.get<Budget[]>('/budgets', { params: month ? { month } : undefined })
    return data
  },

  create: async (input: CreateBudgetInput): Promise<Budget> => {
    const { data } = await api.post<Budget>('/budgets', input)
    return data
  },

  update: async (id: string, input: UpdateBudgetInput): Promise<Budget> => {
    const { data } = await api.put<Budget>(`/budgets/${id}`, input)
    return data
  },
}
