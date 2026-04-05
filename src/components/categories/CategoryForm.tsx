import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useCategories, useCreateCategory, useUpdateCategory } from '@/hooks/useCategories'
import type { Category } from '@/types/category'

const schema = z.object({
  name: z.string().min(1, 'Requerido').max(100),
  parent_id: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface CategoryFormProps {
  category?: Category
  onSuccess: () => void
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const { data: categories = [] } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name ?? '',
      parent_id: category?.parent_id ?? '',
    },
  })

  const onSubmit = async (data: FormData) => {
    const parent_id = data.parent_id || undefined
    try {
      if (category) {
        await updateCategory.mutateAsync({ id: category.id, input: { name: data.name, parent_id } })
        toast.success('Categoría actualizada')
      } else {
        await createCategory.mutateAsync({ name: data.name, parent_id })
        toast.success('Categoría creada')
      }
      onSuccess()
    } catch {
      toast.error('Error al guardar la categoría')
    }
  }

  // Exclude self and descendants when editing
  const parentOptions = categories.filter((c) => c.id !== category?.id)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nombre
        </label>
        <input
          {...register('name')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Categoría padre (opcional)
        </label>
        <select
          {...register('parent_id')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">— Sin padre —</option>
          {parentOptions.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-md"
        >
          {isSubmitting ? 'Guardando...' : category ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}
