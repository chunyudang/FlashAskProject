import request from '../utils/request';

export interface Category {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
  description: string;
}

export interface CreateCategoryBody {
  name: string;
  icon?: string;
  sortOrder?: number;
  description?: string;
}

export interface UpdateCategoryBody {
  name?: string;
  icon?: string;
  sortOrder?: number;
  description?: string;
}

export function fetchCategories(): Promise<{ data: Category[] }> {
  return request.get('/api/admin/categories').then((res) => res.data);
}

export function createCategory(body: CreateCategoryBody): Promise<{ id: string; message: string }> {
  return request.post('/api/admin/categories', body).then((res) => res.data);
}

export function updateCategory(id: string, body: UpdateCategoryBody): Promise<{ message: string }> {
  return request.put(`/api/admin/categories/${id}`, body).then((res) => res.data);
}

export function deleteCategory(id: string): Promise<{ message: string }> {
  return request.delete(`/api/admin/categories/${id}`).then((res) => res.data);
}
