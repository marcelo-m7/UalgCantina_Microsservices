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
  price: number;
  kcals?: number | null;
  allergenIds?: string[];
  allergens?: Allergen[];
  /** Optional icon to visually represent the dish */
  icon?: LucideIcon;
}

export interface MenuEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: 'almoco' | 'jantar';
  
  mainDishId: string;
  mainDish?: Dish;
  
  altDishId?: string;
  altDish?: Dish;
  
  dessertId: string;
  dessert?: Dish;
  
  sopaId?: string;
  sopa?: Dish;
  
  notes?: string;
}

export interface DayMenu {
  /** ISO date string identifying the day */
  date: string;
  /** Lunch menu for the day */
  lunch?: MenuEntry;
  /** Dinner menu for the day */
  dinner?: MenuEntry;
}

export interface WeeklyMenu {
  weekId: string; 
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  days: DayMenu[];
}

// For AI Suggestions
export interface AISuggestionInput {
  mainDish: string;
  availableSideDishes: string[];
}
export interface AISuggestionOutput {
  suggestedSideDish: string;
  reasoning: string;
}
