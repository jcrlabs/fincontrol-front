import type { Category, CategoryNode } from '@/types/category'

export function buildTree(categories: Category[]): CategoryNode[] {
  const map = new Map<string, CategoryNode>()
  const roots: CategoryNode[] = []

  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] })
  }
  for (const node of map.values()) {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
}

export function flattenTree(nodes: CategoryNode[], depth = 0): Array<{ node: CategoryNode; depth: number }> {
  const result: Array<{ node: CategoryNode; depth: number }> = []
  for (const node of nodes) {
    result.push({ node, depth })
    if (node.children.length > 0) {
      result.push(...flattenTree(node.children, depth + 1))
    }
  }
  return result
}

export function getAncestors(categories: Category[], id: string): Category[] {
  const map = new Map(categories.map((c) => [c.id, c]))
  const ancestors: Category[] = []
  let current = map.get(id)
  while (current?.parent_id) {
    const parent = map.get(current.parent_id)
    if (!parent) break
    ancestors.unshift(parent)
    current = parent
  }
  return ancestors
}

export function formatCategoryPath(categories: Category[], id: string): string {
  const ancestors = getAncestors(categories, id)
  const current = categories.find((c) => c.id === id)
  if (!current) return ''
  return [...ancestors, current].map((c) => c.name).join(' › ')
}
