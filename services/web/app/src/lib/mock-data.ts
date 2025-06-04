// src/lib/mock-data.ts
import type { Allergen, Dish, WeeklyMenu, DishType } from './types';
import { Beef, Fish, Carrot, Vegan, Cake, Soup, GlassWater } from 'lucide-react';

export const mockAllergens: Allergen[] = [
  { id: '1', name: 'Glúten', icon: 'Wheat', description: 'Contém trigo, centeio, cevada ou aveia.' },
  { id: '2', name: 'Lactose', icon: 'Milk', description: 'Contém leite ou produtos lácteos.' },
  { id: '3', name: 'Ovos', icon: 'Egg', description: 'Contém ovos ou produtos à base de ovo.' },
  { id: '4', name: 'Marisco', icon: 'Shell', description: 'Contém crustáceos ou moluscos.' },
  { id: '5', name: 'Frutos Secos', icon: 'Nut', description: 'Contém amêndoas, nozes, avelãs, etc.' },
  { id: '6', name: 'Soja', icon: 'AlertTriangle', description: 'Contém soja ou produtos à base de soja.' },
  { id: '7', name: 'Peixe', icon: 'Fish', description: 'Contém peixe ou produtos à base de peixe.'}
];

export const mockDishes: Dish[] = [
  // Sopas
  { id: 's1', name: 'Sopa de Legumes', type: 'sopa', price: 1.50, kcals: 120, allergenIds: [] },
  { id: 's2', name: 'Creme de Cenoura', type: 'sopa', price: 1.50, kcals: 150, allergenIds: ['2'] }, // Lactose

  // Pratos de Carne
  { id: 'c1', name: 'Bife com Batatas Fritas', type: 'carne', price: 7.50, kcals: 600, allergenIds: [] },
  { id: 'c2', name: 'Frango Assado com Arroz', type: 'carne', price: 6.80, kcals: 550, allergenIds: [] },
  { id: 'c3', name: 'Lasanha à Bolonhesa', type: 'carne', price: 7.20, kcals: 650, allergenIds: ['1', '2'] }, // Glúten, Lactose

  // Pratos de Peixe
  { id: 'p1', name: 'Salmão Grelhado com Legumes', type: 'peixe', price: 8.50, kcals: 500, allergenIds: ['7'] },
  { id: 'p2', name: 'Bacalhau com Natas', type: 'peixe', price: 9.00, kcals: 700, allergenIds: ['1', '2', '7'] }, // Glúten, Lactose, Peixe

  // Pratos Vegetarianos
  { id: 'v1', name: 'Caril de Vegetais com Arroz Basmati', type: 'vegetariano', price: 6.50, kcals: 450, allergenIds: [] },
  { id: 'v2', name: 'Quiche de Espinafres e Ricota', type: 'vegetariano', price: 6.00, kcals: 400, allergenIds: ['1', '2', '3'] }, // Glúten, Lactose, Ovos

  // Pratos Vegan
  { id: 'vg1', name: 'Hambúrguer de Grão de Bico com Batata Doce', type: 'vegan', price: 7.00, kcals: 500, allergenIds: ['1'] }, // Glúten (pão)
  { id: 'vg2', name: 'Feijoada Vegan', type: 'vegan', price: 6.80, kcals: 480, allergenIds: [] },
  
  // Sobremesas
  { id: 'd1', name: 'Mousse de Chocolate', type: 'sobremesa', price: 2.50, kcals: 300, allergenIds: ['2', '3'] }, // Lactose, Ovos
  { id: 'd2', name: 'Salada de Frutas', type: 'sobremesa', price: 2.00, kcals: 150, allergenIds: [] },
  { id: 'd3', name: 'Arroz Doce', type: 'sobremesa', price: 2.20, kcals: 250, allergenIds: ['2'] }, // Lactose

  // Bebidas
  { id: 'b1', name: 'Água Mineral 50cl', type: 'bebida', price: 1.00, kcals: 0 },
  { id: 'b2', name: 'Sumo de Laranja Natural', type: 'bebida', price: 2.00, kcals: 110 },
];

// Helper to populate dish details
const getDish = (id: string) => mockDishes.find(d => d.id === id);

export const mockWeeklyMenu: WeeklyMenu = {
  weekId: '2024-W23',
  startDate: '2024-06-03',
  endDate: '2024-06-07',
  days: [
    { // Segunda-feira
      date: '2024-06-03',
      lunch: {
        id: 'ml1', mealType: 'almoco', date: '2024-06-03',
        sopaId: 's1', sopa: getDish('s1'),
        mainDishId: 'c1', mainDish: getDish('c1'),
        altDishId: 'v1', altDish: getDish('v1'),
        dessertId: 'd1', dessert: getDish('d1'),
        notes: 'Promoção estudante: Prato + Sopa + Pão = 5.00€'
      },
      dinner: {
        id: 'md1', mealType: 'jantar', date: '2024-06-03',
        sopaId: 's1', sopa: getDish('s1'),
        mainDishId: 'c2', mainDish: getDish('c2'),
        altDishId: 'vg1', altDish: getDish('vg1'),
        dessertId: 'd2', dessert: getDish('d2'),
      }
    },
    { // Terça-feira
      date: '2024-06-04',
      lunch: {
        id: 'ml2', mealType: 'almoco', date: '2024-06-04',
        sopaId: 's2', sopa: getDish('s2'),
        mainDishId: 'p1', mainDish: getDish('p1'),
        altDishId: 'v2', altDish: getDish('v2'),
        dessertId: 'd3', dessert: getDish('d3'),
      },
      dinner: {
        id: 'md2', mealType: 'jantar', date: '2024-06-04',
        sopaId: 's2', sopa: getDish('s2'),
        mainDishId: 'c3', mainDish: getDish('c3'),
        altDishId: 'vg2', altDish: getDish('vg2'),
        dessertId: 'd1', dessert: getDish('d1'),
      }
    },
    // Quarta-feira
    {
      date: '2024-06-05',
      lunch: {
        id: 'ml3', mealType: 'almoco', date: '2024-06-05',
        sopaId: 's1', sopa: getDish('s1'),
        mainDishId: 'c2', mainDish: getDish('c2'),
        altDishId: 'vg1', altDish: getDish('vg1'),
        dessertId: 'd2', dessert: getDish('d2'),
      },
      dinner: {
        id: 'md3', mealType: 'jantar', date: '2024-06-05',
        sopaId: 's1', sopa: getDish('s1'),
        mainDishId: 'p2', mainDish: getDish('p2'),
        altDishId: 'v1', altDish: getDish('v1'),
        dessertId: 'd3', dessert: getDish('d3'),
      }
    },
    // Quinta-feira
    {
      date: '2024-06-06',
      lunch: {
        id: 'ml4', mealType: 'almoco', date: '2024-06-06',
        sopaId: 's2', sopa: getDish('s2'),
        mainDishId: 'c1', mainDish: getDish('c1'),
        altDishId: 'v1', altDish: getDish('v1'),
        dessertId: 'd1', dessert: getDish('d1'),
      },
      dinner: {
        id: 'md4', mealType: 'jantar', date: '2024-06-06',
        sopaId: 's2', sopa: getDish('s2'),
        mainDishId: 'p1', mainDish: getDish('p1'),
        altDishId: 'vg2', altDish: getDish('vg2'),
        dessertId: 'd2', dessert: getDish('d2'),
      }
    },
    // Sexta-feira
    {
      date: '2024-06-07',
      lunch: {
        id: 'ml5', mealType: 'almoco', date: '2024-06-07',
        sopaId: 's1', sopa: getDish('s1'),
        mainDishId: 'c3', mainDish: getDish('c3'),
        altDishId: 'v2', altDish: getDish('v2'),
        dessertId: 'd3', dessert: getDish('d3'),
      },
      dinner: {
        id: 'md5', mealType: 'jantar', date: '2024-06-07',
        sopaId: 's1', sopa: getDish('s1'),
        mainDishId: 'c1', mainDish: getDish('c1'),
        altDishId: 'vg1', altDish: getDish('vg1'),
        dessertId: 'd1', dessert: getDish('d1'),
        notes: 'Bom fim de semana!'
      }
    },
  ]
};

export const availableSideDishesForAI = mockDishes
  .filter(dish => dish.type === 'vegetariano' || dish.type === 'vegan' || dish.name.toLowerCase().includes('arroz') || dish.name.toLowerCase().includes('batata') || dish.name.toLowerCase().includes('legumes'))
  .map(dish => dish.name);
