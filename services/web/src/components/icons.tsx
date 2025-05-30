// src/components/icons.tsx
import type { DishType, Allergen } from '@/lib/types';
import {
  Beef,
  Fish,
  Carrot,
  Vegan,
  Cake,
  Soup,
  GlassWater,
  Wheat,
  Milk,
  Egg,
  Shell,
  Nut,
  AlertTriangle,
  LucideIcon,
  type LucideProps,
  UtensilsCrossed,
} from 'lucide-react';

export const DishTypeIcons: Record<DishType, LucideIcon> = {
  carne: Beef,
  peixe: Fish,
  vegetariano: Carrot,
  vegan: Vegan,
  sobremesa: Cake,
  sopa: Soup,
  bebida: GlassWater,
};

export const AllergenIcons: Record<string, LucideIcon> = {
  gluten: Wheat,
  lactose: Milk,
  ovos: Egg,
  marisco: Shell,
  frutossecos: Nut,
  // Add more specific allergens as needed
  default: AlertTriangle,
};

export const CantinaCastLogo = (props: LucideProps) => (
  <UtensilsCrossed {...props} />
);

export function getAllergenIcon(allergenName: string): LucideIcon {
  const normalizedName = allergenName.toLowerCase().replace(/\s+/g, '');
  return AllergenIcons[normalizedName] || AllergenIcons.default;
}
