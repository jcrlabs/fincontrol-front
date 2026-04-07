import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCategoryTree } from '@/hooks/useCategories'
import { TableSkeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Modal } from '@/components/common/Modal'
import { CategoryForm } from './CategoryForm'
import type { CategoryNode } from '@/types/category'
import type { Category } from '@/types/category'

interface NodeRowProps {
  node: CategoryNode
  depth: number
  onEdit: (cat: Category) => void
  editLabel: string
}

function NodeRow({ node, depth, onEdit, editLabel }: NodeRowProps) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children.length > 0

  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
        <td className="px-4 py-2.5 text-sm text-gray-900 dark:text-white">
          <div className="flex items-center gap-1" style={{ paddingLeft: `${depth * 20}px` }}>
            {hasChildren ? (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0"
              >
                {expanded ? '▾' : '▸'}
              </button>
            ) : (
              <span className="w-5 shrink-0 text-gray-300 dark:text-gray-600 text-xs pl-1">└</span>
            )}
            <span>{node.name}</span>
          </div>
        </td>
        <td className="px-4 py-2.5 text-right">
          <button
            onClick={() => onEdit(node)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {editLabel}
          </button>
        </td>
      </tr>
      {expanded && node.children.map((child) => (
        <NodeRow key={child.id} node={child} depth={depth + 1} onEdit={onEdit} editLabel={editLabel} />
      ))}
    </>
  )
}

export function CategoryTree() {
  const { t } = useTranslation()
  const { data: tree, isLoading } = useCategoryTree()
  const [editing, setEditing] = useState<Category | null>(null)
  const [creating, setCreating] = useState(false)

  return (
    <>
      {isLoading ? (
        <TableSkeleton rows={4} cols={2} />
      ) : !tree?.length ? (
        <EmptyState
          title={t('categories.empty')}
          description={t('categories.emptyDesc')}
          action={
            <button
              onClick={() => setCreating(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              {t('categories.newButton')}
            </button>
          }
        />
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setCreating(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              {t('categories.new')}
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('categories.nameHeader')}
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {tree.map((node) => (
                  <NodeRow key={node.id} node={node} depth={0} onEdit={setEditing} editLabel={t('categories.edit')} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title={t('categories.newModal')}>
        <CategoryForm onSuccess={() => setCreating(false)} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={t('categories.editModal')}>
        {editing && (
          <CategoryForm category={editing} onSuccess={() => setEditing(null)} />
        )}
      </Modal>
    </>
  )
}
