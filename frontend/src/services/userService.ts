import { apiFetch } from '../utils/api';
import { User } from '../types';

const API_BASE = 'http://localhost:4000/api';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const response = await apiFetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiFetch(`${API_BASE}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async updateUser(id: string, userData: {
    full_name?: string;
    avatar_url?: string;
  }): Promise<User> {
    const response = await apiFetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  async deleteUser(id: string): Promise<void> {
    const response = await apiFetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  },
};
