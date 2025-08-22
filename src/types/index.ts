export interface GroceryItem {
  id: string;
  name: string;
  category: GroceryCategory;
  quantity: number;
  unit: string;
  price?: number;
  isCompleted: boolean;
  dateAdded: Date;
  lastPurchased?: Date;
  notes?: string;
  nutritionalInfo?: NutritionalInfo;
}

export interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export enum GroceryCategory {
  PRODUCE = 'Produce',
  DAIRY = 'Dairy',
  MEAT = 'Meat & Seafood',
  PANTRY = 'Pantry',
  FROZEN = 'Frozen',
  BAKERY = 'Bakery',
  BEVERAGES = 'Beverages',
  SNACKS = 'Snacks',
  HOUSEHOLD = 'Household',
  PERSONAL_CARE = 'Personal Care',
  OTHER = 'Other'
}

export interface ShoppingList {
  id: string;
  name: string;
  items: GroceryItem[];
  budget?: number;
  totalCost: number;
  dateCreated: Date;
  dateModified: Date;
  isCompleted: boolean;
}

export interface ShoppingHistory {
  purchases: GroceryItem[];
  frequentItems: Array<{
    item: Omit<GroceryItem, 'id' | 'isCompleted' | 'dateAdded'>;
    frequency: number;
    lastPurchased: Date;
  }>;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  servings: number;
  image?: string;
  instructions?: string;
  readyInMinutes?: number;
  sourceUrl?: string;
}

export interface RecipeSearchResult {
  id: string;
  title: string;
  image: string;
  readyInMinutes: number;
}

export interface StoreLayout {
  categories: Array<{
    category: GroceryCategory;
    aisle: number;
    section: string;
  }>;
}