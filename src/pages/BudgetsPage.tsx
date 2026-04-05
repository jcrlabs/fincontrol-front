import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useBudgets, useCreateBudget, useUpdateBudget } from '@/hooks/useBudgets'
import { CategorySelect } from '@/components/categories/CategorySelect'
import { MoneyDisplay } from '@/components/common/MoneyDisplay'
import { Modal } from '@/components/common/Modal'
import { TableSkeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { useUIStore } from '@/store/uiStore'
import { formatMoney } from '@/utils/money'
import type { Budget } from '@/types/budget'

const schema = z.object({
  category_id: z.string().min(1, 'Requerido'),
  month: z.string().min(1, 'Requerido'),
  amount: z.string().min(1, 'Requerido'),
})
type FormData = z.infer<typeof schema>

function BudgetForm({ budget, onSuccess }: { budget?: Budget; onSuccess: () => void }) {
  const createBudget = useCreateBudget()
  const updateBudget = useUpdateBudget()
  const [catId, setCatId] = useState(budget?.category_id ?? '')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category_id: budget?.category_id ?? '', month: budget?.month?.slice(0, 7) ?? '', amount: String(budget?.amount ?? '') },
  })
  const onSubmit = async (data: FormData) => {
    try {
      if (budget) {
        await updateBudget.mutateAsync({ id: budget.id, input: { amount: parseFloat(data.amount) } })
        toast.success('Presupuesto actualizado')
      } else {
        await createBudget.mutateAsync({ category_id: catId, month: data.month + '-01', amount: parseFloat(data.amount) })
        toast.success('Presupuesto creado')
      }
      onSuccess()
    } catch { toast.error('Error al guardar') }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!budget && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
            <CategorySelect value={catId} onChange={setCatId} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mes</label>
            <input type="month" {...register('month')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.month && <p className="mt-1 text-xs text-red-600">{errors.month.message}</p>}
          </div>
        </>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto</label>
        <input type="number" step="0.01" {...register('amount')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>}
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-md">
          {isSubmitting ? 'Guardando...' : budget ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}

export function BudgetsPage() {
  const currency = useUIStore((s) => s.currency)
  const { data: budgets, isLoading } = useBudgets()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Budget | null>(null)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Presupuestos</h1>
        <button onClick={() => setCreating(true)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">+ Nuevo</button>
      </div>

      {isLoading ? <TableSkeleton rows={4} cols={5} /> : !budgets?.length ? (
        <EmptyState title="Sin presupuestos" description="Crea presupuestos por categoría para controlar tus gastos."
          action={<button onClick={() => setCreating(true)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">Nuevo presupuesto</button>} />
      ) : (
        <div className="space-y-3">
          {budgets.map((b) => {
            const pct = Math.min(b.percentage ?? 0, 100)
            const barColor = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-green-500'
            return (
              <div key={b.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{b.category_name ?? '—'}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                      <MoneyDisplay amount={b.spent ?? 0} currency={currency} /> / {formatMoney(b.amount, currency)}
                    </span>
                    <span className={`text-xs font-semibold ${pct >= 100 ? 'text-red-600 dark:text-red-400' : pct >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                      {(b.percentage ?? 0).toFixed(0)}%
                    </span>
                    <button onClick={() => setEditing(b)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Editar</button>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColor} ${pct >= 100 ? 'animate-pulse' : ''}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="Nuevo presupuesto">
        <BudgetForm onSuccess={() => setCreating(false)} />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar presupuesto">
        {editing && <BudgetForm budget={editing} onSuccess={() => setEditing(null)} />}
      </Modal>
    </div>
  )
}
