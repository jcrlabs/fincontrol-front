import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetsApi } from '@/api/budgets'
import { useUIStore } from '@/store/uiStore'
import type { CreateBudgetInput, UpdateBudgetInput } from '@/types/budget'

export function useBudgets(month?: string) {
  const dateRange = useUIStore((s) => s.dateRange)
  const effectiveMonth = month ?? dateRange.from.slice(0, 7) + '-01'
  return useQuery({
    queryKey: ['budgets', effectiveMonth],
    queryFn: () => budgetsApi.list(effectiveMonth),
  })
}

export function useCreateBudget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateBudgetInput) => budgetsApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  })
}

export function useUpdateBudget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBudgetInput }) =>
      budgetsApi.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  })
}
