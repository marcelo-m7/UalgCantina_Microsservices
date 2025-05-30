// src/services/allergenService.ts
import apiClient from '@/lib/api-client';
import type { Allergen } from '@/lib/types';

export const getAllergens = async (): Promise<Allergen[]> => {
  const response = await apiClient.get('/allergens/');
  return response.data;
};

export const createAllergen = async (allergenData: Omit<Allergen, 'id'>): Promise<Allergen> => {
  const response = await apiClient.post('/allergens/', allergenData);
  return response.data;
};

export const updateAllergen = async (id: string, allergenData: Partial<Omit<Allergen, 'id'>>): Promise<Allergen> => {
  const response = await apiClient.put(`/allergens/${id}`, allergenData);
  return response.data;
};

export const deleteAllergen = async (id: string): Promise<void> => {
  await apiClient.delete(`/allergens/${id}`);
};
