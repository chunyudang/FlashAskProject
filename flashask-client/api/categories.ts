import { get } from './index'

interface Category {
  id: string
  name: string
  icon: string
  sort_order: number
  description: string
}

export const getCategories = () =>
  get<{ data: Category[] }>('/categories')
