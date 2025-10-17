import api from './api';

export interface CategoryPayload {
  name: string;
  icon?: string;
  color?: string;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
  color?: string;
}

export async function listCategories(): Promise<Category[]> {
  const { data } = await api.get('/api/categories/');
  return data;
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const { data } = await api.post('/api/categories/', payload);
  return data;
}

export async function getCategory(id: number): Promise<Category> {
  const { data } = await api.get(`/api/categories/${id}/`);
  return data;
}

export async function updateCategory(id: number, payload: Partial<CategoryPayload>): Promise<Category> {
  const { data } = await api.patch(`/api/categories/${id}/`, payload);
  return data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/api/categories/${id}/delete/`);
}
