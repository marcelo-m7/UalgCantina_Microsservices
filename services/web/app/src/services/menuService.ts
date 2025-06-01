// src/services/menuService.ts
import apiClient from '@/lib/api-client';
import type { WeeklyMenu, MenuEntry, DayMenu } from '@/lib/types';

// Assuming API returns a structure similar to WeeklyMenu
// The '/public/weekly' endpoint is for public access, might not need auth.
// The admin endpoint for menus would be different, e.g., '/menus/weekly'

export const getPublicWeeklyMenu = async (): Promise<WeeklyMenu> => {
  const response = await apiClient.get('/public/weekly/'); // Ensure this matches your public API endpoint
  // TODO: Data transformation might be needed here if API structure differs significantly from WeeklyMenu type
  // For example, resolving dish details if only IDs are returned.
  // For now, assume the API returns a compatible structure or this function will be adapted.
  return response.data;
};

// Example for admin-specific fetching if needed, may require authentication
export const getAdminWeeklyMenu = async (): Promise<WeeklyMenu> => {
  const response = await apiClient.get('/menus/weekly-admin/'); // Placeholder, adjust to actual admin endpoint
  return response.data;
};

// Assuming an endpoint for updating a specific meal in a day menu
// The MenuEntry type might be simplified for the payload, e.g. sending only IDs
export type MenuEntryUpdatePayload = {
  date: string; // YYYY-MM-DD
  mealType: 'lunch' | 'dinner';
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
