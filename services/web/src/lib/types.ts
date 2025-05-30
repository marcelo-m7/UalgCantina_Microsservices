// src/lib/types.ts
import type { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role?: 'admin' | 'editor'; 
}

export interface Allergen {
  id: string;
  name: string;
  icon?: string; 
  description?: string;
}

export type DishType = 'carne' | 'peixe' | 'vegetariano' | 'vegan' | 'sobremesa' | 'sopa' | 'bebida';

export interface Dish {
  id: string;
  name: string;
  type: DishType;
  description?: string;
  price: number; // Ensure this is treated as number
  kcals?: number | null; // Ensure this is treated as number or null
  allergenIds?: string[];
  allergens?: Allergen[]; // Potentially resolved client-side or by API
  // 'icon' field was for frontend derived icon, API won't have LucideIcon type. 
  // It can be derived from 'type' or a specific 'icon_name' string from API.
}

export interface MenuEntry {
  id: string; // This ID might come from the API for the specific entry
  date: string; // YYYY-MM-DD
  mealType: 'almoco' | 'jantar';
  
  mainDishId: string;
  mainDish?: Dish; // Resolved dish object
  
  altDishId?: string;
  altDish?: Dish; // Resolved dish object
  
  dessertId: string;
  dessert?: Dish; // Resolved dish object
  
  sopaId?: string;
  sopa?: Dish; // Resolved dish object
  
  notes?: string;
}

export interface DayMenu {
  date: string; // YYYY-MM-DD
  lunch?: MenuEntry;
  dinner?: MenuEntry;
}

export interface WeeklyMenu {
  weekId: string; 
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  days: DayMenu[];
}

// For AI Suggestions (remains the same as it's internal to frontend-AI flow)
export interface AISuggestionInput {
  mainDish: string;
  availableSideDishes: string[];
}

export interface AISuggestionOutput {
  suggestedSideDish: string;
  reasoning: string;
}
