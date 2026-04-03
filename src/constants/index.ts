export const STORAGE_KEYS = {
  CURRENT_LIST: 'smartGroceryList_currentList',
  SHOPPING_HISTORY: 'smartGroceryList_history',
  COOKING_DATA: 'smartGroceryList_cookingData',
  THEME: 'smartGroceryList_theme',
} as const;

export const RECIPE_API = {
  BASE_URL: 'https://api.edamam.com',
  TYPE_RECIPE: 'recipe',
  DIET_OPTIONS: ['balanced', 'high-protein', 'low-carb', 'low-fat'] as const,
} as const;

export const UI = {
  CATEGORIES: ['Produce', 'Dairy', 'Meat', 'Bakery', 'Pantry', 'Frozen', 'Other'] as const,
  UNITS: ['pcs', 'kg', 'g', 'l', 'ml', 'cup', 'tbsp', 'tsp'] as const,
  THEME_TRANSITION_DURATION: 300,
} as const;

export const VALIDATION = {
  MIN_ITEM_NAME_LENGTH: 1,
  MAX_ITEM_NAME_LENGTH: 100,
  MIN_QUANTITY: 0.1,
  MAX_QUANTITY: 999,
  MIN_PRICE: 0,
  MAX_PRICE: 99999,
} as const;

export const ERROR_MESSAGES = {
  INVALID_INPUT: 'Please enter a valid item name',
  INVALID_QUANTITY: 'Quantity must be greater than 0',
  INVALID_PRICE: 'Price must be a valid number',
  NETWORK_ERROR: 'Unable to connect. Check your internet.',
  RECIPE_NOT_FOUND: 'Recipe not found. Try different keywords.',
  BUDGET_EXCEEDED: 'Your total cost exceeds the set budget',
  STORAGE_ERROR: 'Failed to save data. Please try again.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
} as const;

export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('Network')) return ERROR_MESSAGES.NETWORK_ERROR;
    if (error.message.includes('not found')) return ERROR_MESSAGES.RECIPE_NOT_FOUND;
  }
  return ERROR_MESSAGES.UNKNOWN_ERROR;
}
