import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesApi } from '@/api/categories'
import { buildTree } from '@/utils/categories'
import type { CreateCategoryInput, UpdateCategoryInput } from '@/types/category'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
  })
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
    select: buildTree,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoriesApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
      categoriesApi.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}
