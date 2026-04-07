import { CategoryTree } from '@/components/categories/CategoryTree'

export function CategoriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Categorías</h1>
      <CategoryTree />
    </div>
  )
}
