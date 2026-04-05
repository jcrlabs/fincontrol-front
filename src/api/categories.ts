import { api } from './client'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types/category'

export const categoriesApi = {
  list: async (): Promise<Category[]> => {
    const { data } = await api.get<Category[]>('/categories')
    return data
  },

  create: async (input: CreateCategoryInput): Promise<Category> => {
    const { data } = await api.post<Category>('/categories', input)
    return data
  },

  update: async (id: string, input: UpdateCategoryInput): Promise<Category> => {
    const { data } = await api.put<Category>(`/categories/${id}`, input)
    return data
  },
}
