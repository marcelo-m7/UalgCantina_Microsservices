// src/services/menuService.ts
import apiClient from '@/lib/api-client';
import axios from 'axios';
import type { WeeklyMenu, MenuEntry, DayMenu } from '@/lib/types';

// Assuming API returns a structure similar to WeeklyMenu
// The '/public/weekly' endpoint is for public access, might not need auth.
// The admin endpoint for menus would be different, e.g., '/menus/weekly'

// ✅ Buscar o menu “público” que já vem como objeto único
export const getPublicWeeklyMenu = async (): Promise<WeeklyMenu | null> => {
  try {
    const { data } = await apiClient.get('/public/weekly/');
    // garante que sempre exista o array days, nem que vazio
    return { ...data, days: data.days ?? [] };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

/* — se quiser o endpoint de gestão —
   listagem de TODOS os menus semanais (array) */
export const listWeeklyMenus = async (): Promise<WeeklyMenu[]> => {
  const { data } = await apiClient.get('/weekly-menus/');
  return data;
};


// Example for admin-specific fetching if needed, may require authentication
export const getAdminWeeklyMenu = async (): Promise<WeeklyMenu> => {
  const { data } = await apiClient.get('/menus/weekly-admin/');
  const weekly = Array.isArray(data) ? data[0] : data;
  return { ...weekly, days: weekly?.days ?? [] };
};

// Assuming an endpoint for updating a specific meal in a day menu
// The MenuEntry type might be simplified for the payload, e.g. sending only IDs
export type MenuEntryUpdatePayload = {
  date: string; // YYYY-MM-DD
  /** Meal type must follow API convention */
  mealType: 'almoco' | 'jantar';
  sopaId?: string | null; // Use null to clear
  mainDishId: string;
  altDishId?: string | null; // Use null to clear
  dessertId: string;
  notes?: string;
};

export const updateMenuEntry = async (payload: MenuEntryUpdatePayload): Promise<DayMenu> => {
  // The API endpoint might be something like /menus/day/{date}/meal/{mealType}
  // Or a more general /menus/entry/{entryId} if entries have unique IDs globally
  // For this example, let's assume an endpoint that updates a meal based on date and type
  const response = await apiClient.put(`/menus/day/${payload.date}/${payload.mealType}`, payload);
  return response.data; // Assuming API returns the updated DayMenu or MenuEntry
};
