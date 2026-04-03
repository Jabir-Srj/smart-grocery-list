import { ShoppingList, GroceryItem } from '../types';
import { generateId, categorizeItem } from './groceryUtils';

export const LIST_TEMPLATES = {
  weekly: {
    name: 'Weekly Shopping',
    description: 'Standard weekly grocery shopping list',
    items: [
      { name: 'Milk', category: 'Dairy' },
      { name: 'Bread', category: 'Bakery' },
      { name: 'Eggs', category: 'Dairy' },
      { name: 'Vegetables', category: 'Produce' },
      { name: 'Fruits', category: 'Produce' },
      { name: 'Meat', category: 'Meat' },
      { name: 'Fish', category: 'Meat' },
      { name: 'Cheese', category: 'Dairy' },
      { name: 'Yogurt', category: 'Dairy' },
      { name: 'Pasta', category: 'Pantry' },
    ],
  },
  mealPrep: {
    name: 'Meal Prep',
    description: 'Meal prep for the week',
    items: [
      { name: 'Chicken Breast', category: 'Meat' },
      { name: 'Brown Rice', category: 'Pantry' },
      { name: 'Broccoli', category: 'Produce' },
      { name: 'Carrots', category: 'Produce' },
      { name: 'Bell Peppers', category: 'Produce' },
      { name: 'Onions', category: 'Produce' },
      { name: 'Sweet Potatoes', category: 'Produce' },
      { name: 'Olive Oil', category: 'Pantry' },
      { name: 'Salt & Pepper', category: 'Pantry' },
      { name: 'Garlic', category: 'Produce' },
    ],
  },
  bbq: {
    name: 'BBQ Party',
    description: 'Everything for a backyard barbecue',
    items: [
      { name: 'Beef Steaks', category: 'Meat' },
      { name: 'Chicken', category: 'Meat' },
      { name: 'Sausages', category: 'Meat' },
      { name: 'Hamburger Buns', category: 'Bakery' },
      { name: 'Hot Dog Buns', category: 'Bakery' },
      { name: 'Lettuce', category: 'Produce' },
      { name: 'Tomatoes', category: 'Produce' },
      { name: 'Onions', category: 'Produce' },
      { name: 'Beverages', category: 'Pantry' },
      { name: 'Condiments', category: 'Pantry' },
      { name: 'Ice Cream', category: 'Frozen' },
    ],
  },
  keto: {
    name: 'Keto Diet',
    description: 'Low-carb, high-fat keto essentials',
    items: [
      { name: 'Eggs', category: 'Dairy' },
      { name: 'Butter', category: 'Dairy' },
      { name: 'Cheese', category: 'Dairy' },
      { name: 'Cream', category: 'Dairy' },
      { name: 'Beef', category: 'Meat' },
      { name: 'Salmon', category: 'Meat' },
      { name: 'Avocado', category: 'Produce' },
      { name: 'Spinach', category: 'Produce' },
      { name: 'Broccoli', category: 'Produce' },
      { name: 'Almonds', category: 'Pantry' },
      { name: 'Olive Oil', category: 'Pantry' },
    ],
  },
  vegan: {
    name: 'Vegan Shopping',
    description: 'Plant-based essentials',
    items: [
      { name: 'Tofu', category: 'Pantry' },
      { name: 'Tempeh', category: 'Pantry' },
      { name: 'Chickpeas', category: 'Pantry' },
      { name: 'Lentils', category: 'Pantry' },
      { name: 'Nuts', category: 'Pantry' },
      { name: 'Seeds', category: 'Pantry' },
      { name: 'Vegetables', category: 'Produce' },
      { name: 'Fruits', category: 'Produce' },
      { name: 'Grains', category: 'Pantry' },
      { name: 'Plant-based Milk', category: 'Dairy' },
    ],
  },
  family: {
    name: 'Family Shopping',
    description: 'Staples for family meals',
    items: [
      { name: 'Milk', category: 'Dairy' },
      { name: 'Bread', category: 'Bakery' },
      { name: 'Cereal', category: 'Pantry' },
      { name: 'Peanut Butter', category: 'Pantry' },
      { name: 'Pasta', category: 'Pantry' },
      { name: 'Tomato Sauce', category: 'Pantry' },
      { name: 'Chicken', category: 'Meat' },
      { name: 'Ground Beef', category: 'Meat' },
      { name: 'Mixed Vegetables', category: 'Frozen' },
      { name: 'Snacks', category: 'Pantry' },
    ],
  },
} as const;

export type TemplateKey = keyof typeof LIST_TEMPLATES;

export function createListFromTemplate(templateKey: TemplateKey): ShoppingList {
  const template = LIST_TEMPLATES[templateKey];
  const items: GroceryItem[] = template.items.map(item => ({
    id: generateId(),
    name: item.name,
    category: (item.category as any) || categorizeItem(item.name),
    quantity: 1,
    unit: 'pcs',
    isCompleted: false,
    dateAdded: new Date(),
  }));

  return {
    id: generateId(),
    name: template.name,
    items,
    totalCost: 0,
    dateCreated: new Date(),
    dateModified: new Date(),
    isCompleted: false,
  };
}

export function getTemplateList(): Array<{ key: TemplateKey; name: string; description: string }> {
  return Object.entries(LIST_TEMPLATES).map(([key, template]) => ({
    key: key as TemplateKey,
    name: template.name,
    description: template.description,
  }));
}
