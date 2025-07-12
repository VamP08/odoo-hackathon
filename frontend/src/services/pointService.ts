import { apiFetch } from '../utils/api';
import { PointsTransaction } from '../types';

const API_BASE = 'http://localhost:4000/api';

export const pointService = {
  async getAllPointTransactions(): Promise<PointsTransaction[]> {
    const response = await apiFetch(`${API_BASE}/points`);
    if (!response.ok) throw new Error('Failed to fetch point transactions');
    return response.json();
  },

  async getPointTransactionById(id: string): Promise<PointsTransaction> {
    const response = await apiFetch(`${API_BASE}/points/${id}`);
    if (!response.ok) throw new Error('Failed to fetch point transaction');
    return response.json();
  },

  async createPointTransaction(transactionData: {
    change_amount: number;
    transaction_type: string;
    reference_id?: string;
  }): Promise<{ id: string }> {
    const response = await apiFetch(`${API_BASE}/points`, {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
    if (!response.ok) throw new Error('Failed to create point transaction');
    return response.json();
  },
};
