import { useCategories } from '@/hooks/useCategories'
import { flattenTree, buildTree } from '@/utils/categories'

interface CategorySelectProps {
  value: string
  onChange: (id: string) => void
  placeholder?: string
  className?: string
}

export function CategorySelect({ value, onChange, placeholder = '— Sin categoría —', className = '' }: CategorySelectProps) {
  const { data: categories = [] } = useCategories()
  const flat = flattenTree(buildTree(categories))

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      <option value="">{placeholder}</option>
      {flat.map(({ node, depth }) => (
        <option key={node.id} value={node.id}>
          {'  '.repeat(depth)}{depth > 0 ? '└ ' : ''}{node.name}
        </option>
      ))}
    </select>
  )
}
