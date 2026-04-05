export interface Category {
  id: string
  user_id: string
  name: string
  parent_id: string | null
  icon?: string
  created_at: string
}

export interface CategoryNode extends Category {
  children: CategoryNode[]
}

export interface CreateCategoryInput {
  name: string
  parent_id?: string
  icon?: string
}

export interface UpdateCategoryInput {
  name: string
  parent_id?: string
}
