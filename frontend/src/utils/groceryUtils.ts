import { GroceryCategory, GroceryItem } from '../types';

// Common grocery items categorization
const CATEGORY_KEYWORDS: Record<GroceryCategory, string[]> = {
  [GroceryCategory.PRODUCE]: [
    'apple', 'banana', 'orange', 'lettuce', 'tomato', 'potato', 'onion', 'carrot',
    'broccoli', 'spinach', 'bell pepper', 'cucumber', 'avocado', 'lemon', 'lime',
    'strawberry', 'blueberry', 'grapes', 'mushroom', 'garlic', 'ginger', 'celery'
  ],
  [GroceryCategory.DAIRY]: [
    'milk', 'cheese', 'yogurt', 'butter', 'cream', 'sour cream', 'cottage cheese',
    'mozzarella', 'cheddar', 'parmesan', 'egg', 'eggs'
  ],
  [GroceryCategory.MEAT]: [
    'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'turkey',
    'bacon', 'ham', 'sausage', 'ground beef', 'steak'
  ],
  [GroceryCategory.PANTRY]: [
    'rice', 'pasta', 'bread', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'vinegar',
    'sauce', 'canned', 'beans', 'lentils', 'quinoa', 'oats', 'cereal', 'honey',
    'maple syrup', 'baking powder', 'vanilla', 'spices'
  ],
  [GroceryCategory.FROZEN]: [
    'frozen', 'ice cream', 'frozen vegetables', 'frozen fruit', 'frozen pizza',
    'frozen dinner', 'ice'
  ],
  [GroceryCategory.BAKERY]: [
    'bagel', 'croissant', 'muffin', 'cake', 'cookie', 'pie', 'donut', 'pastry'
  ],
  [GroceryCategory.BEVERAGES]: [
    'water', 'juice', 'soda', 'coffee', 'tea', 'beer', 'wine', 'energy drink',
    'sports drink', 'sparkling water'
  ],
  [GroceryCategory.SNACKS]: [
    'chips', 'crackers', 'nuts', 'popcorn', 'candy', 'chocolate', 'granola bar',
    'pretzels', 'trail mix'
  ],
  [GroceryCategory.HOUSEHOLD]: [
    'toilet paper', 'paper towels', 'detergent', 'soap', 'cleaning', 'trash bags',
    'aluminum foil', 'plastic wrap', 'dish soap'
  ],
  [GroceryCategory.PERSONAL_CARE]: [
    'shampoo', 'toothpaste', 'deodorant', 'lotion', 'toothbrush', 'razor', 'makeup'
  ],
  [GroceryCategory.OTHER]: []
};

export function categorizeItem(itemName: string): GroceryCategory {
  const lowerName = itemName.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category as GroceryCategory;
    }
  }
  
  return GroceryCategory.OTHER;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function groupItemsByCategory(items: GroceryItem[]): Record<GroceryCategory, GroceryItem[]> {
  const grouped = {} as Record<GroceryCategory, GroceryItem[]>;
  
  // Initialize all categories
  Object.values(GroceryCategory).forEach(category => {
    grouped[category] = [];
  });
  
  items.forEach(item => {
    grouped[item.category].push(item);
  });
  
  return grouped;
}

export function calculateTotalCost(items: GroceryItem[]): number {
  return items.reduce((total, item) => {
    return total + (item.price || 0) * item.quantity;
  }, 0);
}

export function getCompletionPercentage(items: GroceryItem[]): number {
  if (items.length === 0) return 0;
  const completedItems = items.filter(item => item.isCompleted).length;
  return Math.round((completedItems / items.length) * 100);
}

// Smart suggestions based on shopping history
export function generateSuggestions(history: GroceryItem[], currentItems: GroceryItem[]): GroceryItem[] {
  const currentItemNames = new Set(currentItems.map(item => item.name.toLowerCase()));
  
  // Get frequently bought items that aren't in current list
  const itemFrequency = new Map<string, { item: GroceryItem; count: number }>();
  
  history.forEach(item => {
    const key = item.name.toLowerCase();
    if (!currentItemNames.has(key)) {
      const existing = itemFrequency.get(key);
      if (existing) {
        existing.count++;
      } else {
        itemFrequency.set(key, { item, count: 1 });
      }
    }
  });
  
  // Sort by frequency and return top suggestions
  return Array.from(itemFrequency.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(({ item }) => ({
      ...item,
      id: generateId(),
      isCompleted: false,
      dateAdded: new Date()
    }));
}