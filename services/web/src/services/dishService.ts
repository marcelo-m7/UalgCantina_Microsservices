// src/services/dishService.ts
import apiClient from '@/lib/api-client';
import type { Dish } from '@/lib/types';

// The API might expect DishFormData which excludes resolved 'allergens' objects and 'icon'
// For now, assuming Allergen type is flexible or API handles it.
// Input for create/update should likely be Omit<Dish, 'id' | 'allergens' | 'icon'> & { allergenIds?: string[] }
type DishMutationData = Omit<Dish, 'id' | 'allergens' | 'icon'> & { allergenIds?: string[] };


export const getDishes = async (): Promise<Dish[]> => {
  const response = await apiClient.get('/dishes/');
  // Assuming API returns dishes with allergenIds. Client might need to resolve names/icons if not embedded.
  // For simplicity, let's assume the API response structure matches the Dish type closely, including resolved allergens if possible.
  // If not, frontend will need to map allergenIds to Allergen objects after fetching all allergens separately.
  return response.data.map((dish: any) => ({
    ...dish,
    // Ensure price is a number
    price: parseFloat(dish.price) || 0,
    // Ensure kcals is a number or null
    kcals: dish.kcals ? parseInt(dish.kcals, 10) : null,
  }));
};

export const getDishById = async (id: string): Promise<Dish> => {
  const response = await apiClient.get(`/dishes/${id}`);
   return {
    ...response.data,
    price: parseFloat(response.data.price) || 0,
    kcals: response.data.kcals ? parseInt(response.data.kcals, 10) : null,
  };
};

export const createDish = async (dishData: DishMutationData): Promise<Dish> => {
  const response = await apiClient.post('/dishes/', dishData);
  return {
    ...response.data,
    price: parseFloat(response.data.price) || 0,
    kcals: response.data.kcals ? parseInt(response.data.kcals, 10) : null,
  };
};

export const updateDish = async (id: string, dishData: Partial<DishMutationData>): Promise<Dish> => {
  const response = await apiClient.put(`/dishes/${id}`, dishData);
   return {
    ...response.data,
    price: parseFloat(response.data.price) || 0,
    kcals: response.data.kcals ? parseInt(response.data.kcals, 10) : null,
  };
};

export const deleteDish = async (id: string): Promise<void> => {
  await apiClient.delete(`/dishes/${id}`);
};
