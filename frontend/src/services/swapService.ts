import { apiFetch } from '../utils/api';
import { Swap } from '../types';

const API_BASE = 'http://localhost:4000/api';

export const swapService = {
  async getAllSwaps(): Promise<Swap[]> {
    const response = await apiFetch(`${API_BASE}/swaps`);
    if (!response.ok) throw new Error('Failed to fetch swaps');
    return response.json();
  },

  async getSwapById(id: string): Promise<Swap> {
    const response = await apiFetch(`${API_BASE}/swaps/${id}`);
    if (!response.ok) throw new Error('Failed to fetch swap');
    return response.json();
  },

  async createSwap(swapData: {
    requested_item_id: string;
    offered_item_id?: string;
  }): Promise<{ id: string }> {
    const response = await apiFetch(`${API_BASE}/swaps`, {
      method: 'POST',
      body: JSON.stringify(swapData),
    });
    if (!response.ok) throw new Error('Failed to create swap');
    return response.json();
  },

  async updateSwap(id: string, swapData: {
    status?: string;
  }): Promise<Swap> {
    const response = await apiFetch(`${API_BASE}/swaps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(swapData),
    });
    if (!response.ok) throw new Error('Failed to update swap');
    return response.json();
  },

  async deleteSwap(id: string): Promise<void> {
    const response = await apiFetch(`${API_BASE}/swaps/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete swap');
  },
};
