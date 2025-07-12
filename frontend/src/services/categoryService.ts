import { apiFetch } from '../utils/api';
import { Category } from '../types';

const API_BASE = 'http://localhost:4000/api';

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    const response = await apiFetch(`${API_BASE}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async createCategory(categoryData: {
    name: string;
  }): Promise<Category> {
    const response = await apiFetch(`${API_BASE}/categories`, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },
};
