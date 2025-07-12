import { apiFetch } from '../utils/api';
import { Item } from '../types';

const API_BASE = 'http://localhost:4000/api';

export const itemService = {
  async getAllItems(): Promise<Item[]> {
    const response = await apiFetch(`${API_BASE}/items`);
    if (!response.ok) throw new Error('Failed to fetch items');
    return response.json();
  },

  async getItemById(id: string): Promise<Item> {
    const response = await apiFetch(`${API_BASE}/items/${id}`);
    if (!response.ok) throw new Error('Failed to fetch item');
    return response.json();
  },

  async getFeaturedItems(): Promise<Item[]> {
    const response = await apiFetch(`${API_BASE}/items/featured`);
    if (!response.ok) throw new Error('Failed to fetch featured items');
    return response.json();
  },

  async createItem(itemData: {
    category_id: number | null;
    title: string;
    description?: string;
    size?: string;
    condition?: string;
    point_cost?: number;
  }): Promise<{ id: string }> {
    const response = await apiFetch(`${API_BASE}/items`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error('Failed to create item');
    return response.json();
  },

  async updateItem(id: string, itemData: {
    title?: string;
    description?: string;
    size?: string;
    condition?: string;
    point_cost?: number;
  }): Promise<Item> {
    const response = await apiFetch(`${API_BASE}/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error('Failed to update item');
    return response.json();
  },

  async deleteItem(id: string): Promise<void> {
    const response = await apiFetch(`${API_BASE}/items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete item');
  },
};
