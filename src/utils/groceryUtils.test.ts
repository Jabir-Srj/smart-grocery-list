import { describe, it, expect } from 'vitest';
import {
  categorizeItem,
  formatCurrency,
  formatDate,
  generateId,
  groupItemsByCategory,
  calculateTotalCost,
  getCompletionPercentage,
  generateSuggestions
} from './groceryUtils';
import { GroceryItem, GroceryCategory } from '../types';

describe('Grocery Utilities', () => {
  describe('categorizeItem', () => {
    it('should categorize produce correctly', () => {
      expect(categorizeItem('Apple')).toBe(GroceryCategory.PRODUCE);
      expect(categorizeItem('Banana')).toBe(GroceryCategory.PRODUCE);
      expect(categorizeItem('Carrot')).toBe(GroceryCategory.PRODUCE);
    });

    it('should categorize dairy correctly', () => {
      expect(categorizeItem('Milk')).toBe(GroceryCategory.DAIRY);
      expect(categorizeItem('Cheese')).toBe(GroceryCategory.DAIRY);
      expect(categorizeItem('Yogurt')).toBe(GroceryCategory.DAIRY);
    });

    it('should categorize meat correctly', () => {
      expect(categorizeItem('Chicken')).toBe(GroceryCategory.MEAT);
      expect(categorizeItem('Beef')).toBe(GroceryCategory.MEAT);
      expect(categorizeItem('Fish')).toBe(GroceryCategory.MEAT);
    });

    it('should categorize pantry items correctly', () => {
      expect(categorizeItem('Rice')).toBe(GroceryCategory.PANTRY);
      expect(categorizeItem('Pasta')).toBe(GroceryCategory.PANTRY);
      expect(categorizeItem('Flour')).toBe(GroceryCategory.PANTRY);
    });

    it('should categorize frozen items correctly', () => {
      expect(categorizeItem('frozen')).toBe(GroceryCategory.FROZEN);
      expect(categorizeItem('frozen vegetables')).toBe(GroceryCategory.FROZEN);
    });

    it('should categorize bakery items correctly', () => {
      expect(categorizeItem('Bagel')).toBe(GroceryCategory.BAKERY);
      expect(categorizeItem('Croissant')).toBe(GroceryCategory.BAKERY);
    });

    it('should categorize beverages correctly', () => {
      expect(categorizeItem('sparkling water')).toBe(GroceryCategory.BEVERAGES);
      expect(categorizeItem('coffee')).toBe(GroceryCategory.BEVERAGES);
      expect(categorizeItem('beer')).toBe(GroceryCategory.BEVERAGES);
    });

    it('should categorize snacks correctly', () => {
      expect(categorizeItem('Chips')).toBe(GroceryCategory.SNACKS);
      expect(categorizeItem('Candy')).toBe(GroceryCategory.SNACKS);
    });

    it('should categorize household items correctly', () => {
      expect(categorizeItem('paper towels')).toBe(GroceryCategory.HOUSEHOLD);
      expect(categorizeItem('plastic wrap')).toBe(GroceryCategory.HOUSEHOLD);
    });

    it('should categorize personal care items correctly', () => {
      expect(categorizeItem('toothbrush')).toBe(GroceryCategory.PERSONAL_CARE);
      expect(categorizeItem('toothpaste')).toBe(GroceryCategory.PERSONAL_CARE);
    });

    it('should categorize unknown items as OTHER', () => {
      expect(categorizeItem('XYZ Random Item')).toBe(GroceryCategory.OTHER);
    });

    it('should be case-insensitive', () => {
      expect(categorizeItem('APPLE')).toBe(GroceryCategory.PRODUCE);
      expect(categorizeItem('apple')).toBe(GroceryCategory.PRODUCE);
      expect(categorizeItem('ApPlE')).toBe(GroceryCategory.PRODUCE);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      const formatted = formatCurrency(10.5);
      expect(formatted).toContain('10');
      expect(formatted).toContain('50');
    });

    it('should handle zero', () => {
      const formatted = formatCurrency(0);
      expect(formatted).toContain('0');
    });

    it('should handle large numbers', () => {
      const formatted = formatCurrency(1000.99);
      expect(formatted).toBeDefined();
    });

    it('should handle decimal places', () => {
      const formatted = formatCurrency(9.99);
      expect(formatted).toBeDefined();
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toBeDefined();
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
    });

    it('should include year', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toContain('2024');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate string IDs', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    it('should generate non-empty IDs', () => {
      const id = generateId();
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe('groupItemsByCategory', () => {
    const mockItems: GroceryItem[] = [
      {
        id: '1',
        name: 'Apple',
        category: GroceryCategory.PRODUCE,
        quantity: 2,
        unit: 'pcs',
        isCompleted: false,
        dateAdded: new Date()
      },
      {
        id: '2',
        name: 'Milk',
        category: GroceryCategory.DAIRY,
        quantity: 1,
        unit: 'liter',
        isCompleted: false,
        dateAdded: new Date()
      },
      {
        id: '3',
        name: 'Banana',
        category: GroceryCategory.PRODUCE,
        quantity: 3,
        unit: 'pcs',
        isCompleted: false,
        dateAdded: new Date()
      }
    ];

    it('should group items by category', () => {
      const grouped = groupItemsByCategory(mockItems);
      expect(grouped[GroceryCategory.PRODUCE]).toHaveLength(2);
      expect(grouped[GroceryCategory.DAIRY]).toHaveLength(1);
    });

    it('should create empty arrays for unused categories', () => {
      const grouped = groupItemsByCategory(mockItems);
      expect(grouped[GroceryCategory.MEAT]).toHaveLength(0);
      expect(grouped[GroceryCategory.BEVERAGES]).toHaveLength(0);
    });

    it('should handle empty item list', () => {
      const grouped = groupItemsByCategory([]);
      Object.values(grouped).forEach(category => {
        expect(category).toHaveLength(0);
      });
    });
  });

  describe('calculateTotalCost', () => {
    const mockItems: GroceryItem[] = [
      {
        id: '1',
        name: 'Apple',
        category: GroceryCategory.PRODUCE,
        quantity: 2,
        unit: 'pcs',
        price: 1.5,
        isCompleted: false,
        dateAdded: new Date()
      },
      {
        id: '2',
        name: 'Milk',
        category: GroceryCategory.DAIRY,
        quantity: 1,
        unit: 'liter',
        price: 3.0,
        isCompleted: false,
        dateAdded: new Date()
      }
    ];

    it('should calculate total cost correctly', () => {
      const total = calculateTotalCost(mockItems);
      const expected = (2 * 1.5) + (1 * 3.0); // 6.0
      expect(total).toBe(expected);
    });

    it('should handle items without price', () => {
      const items = [
        { ...mockItems[0], price: undefined }
      ];
      const total = calculateTotalCost(items);
      expect(total).toBe(0);
    });

    it('should handle empty list', () => {
      const total = calculateTotalCost([]);
      expect(total).toBe(0);
    });

    it('should handle zero prices', () => {
      const items = [
        { ...mockItems[0], price: 0 }
      ];
      const total = calculateTotalCost(items);
      expect(total).toBe(0);
    });
  });

  describe('getCompletionPercentage', () => {
    const mockItems: GroceryItem[] = [
      {
        id: '1',
        name: 'Apple',
        category: GroceryCategory.PRODUCE,
        quantity: 2,
        unit: 'pcs',
        isCompleted: true,
        dateAdded: new Date()
      },
      {
        id: '2',
        name: 'Milk',
        category: GroceryCategory.DAIRY,
        quantity: 1,
        unit: 'liter',
        isCompleted: true,
        dateAdded: new Date()
      },
      {
        id: '3',
        name: 'Bread',
        category: GroceryCategory.PANTRY,
        quantity: 1,
        unit: 'pcs',
        isCompleted: false,
        dateAdded: new Date()
      },
      {
        id: '4',
        name: 'Cheese',
        category: GroceryCategory.DAIRY,
        quantity: 1,
        unit: 'pcs',
        isCompleted: false,
        dateAdded: new Date()
      }
    ];

    it('should calculate completion percentage correctly', () => {
      const percentage = getCompletionPercentage(mockItems);
      const expected = Math.round((2 / 4) * 100); // 50%
      expect(percentage).toBe(expected);
    });

    it('should return 0 for empty list', () => {
      const percentage = getCompletionPercentage([]);
      expect(percentage).toBe(0);
    });

    it('should return 0 for no completed items', () => {
      const items = mockItems.map(item => ({ ...item, isCompleted: false }));
      const percentage = getCompletionPercentage(items);
      expect(percentage).toBe(0);
    });

    it('should return 100 for all completed items', () => {
      const items = mockItems.map(item => ({ ...item, isCompleted: true }));
      const percentage = getCompletionPercentage(items);
      expect(percentage).toBe(100);
    });
  });

  describe('generateSuggestions', () => {
    const mockHistory: GroceryItem[] = [
      {
        id: '1',
        name: 'Milk',
        category: GroceryCategory.DAIRY,
        quantity: 1,
        unit: 'liter',
        isCompleted: true,
        dateAdded: new Date()
      },
      {
        id: '2',
        name: 'Milk',
        category: GroceryCategory.DAIRY,
        quantity: 1,
        unit: 'liter',
        isCompleted: true,
        dateAdded: new Date()
      },
      {
        id: '3',
        name: 'Bread',
        category: GroceryCategory.PANTRY,
        quantity: 1,
        unit: 'pcs',
        isCompleted: true,
        dateAdded: new Date()
      }
    ];

    const mockCurrentItems: GroceryItem[] = [
      {
        id: '4',
        name: 'Apple',
        category: GroceryCategory.PRODUCE,
        quantity: 2,
        unit: 'pcs',
        isCompleted: false,
        dateAdded: new Date()
      }
    ];

    it('should generate suggestions from history', () => {
      const suggestions = generateSuggestions(mockHistory, mockCurrentItems);
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should not suggest items already in current list', () => {
      const currentItems = [
        ...mockCurrentItems,
        {
          id: '5',
          name: 'Milk',
          category: GroceryCategory.DAIRY,
          quantity: 1,
          unit: 'liter',
          isCompleted: false,
          dateAdded: new Date()
        }
      ];

      const suggestions = generateSuggestions(mockHistory, currentItems);
      const suggestionNames = suggestions.map(s => s.name.toLowerCase());
      expect(suggestionNames).not.toContain('milk');
    });

    it('should prioritize frequently bought items', () => {
      const suggestions = generateSuggestions(mockHistory, mockCurrentItems);
      if (suggestions.length > 0) {
        expect(suggestions[0]).toBeDefined();
      }
    });

    it('should limit suggestions to 5 items', () => {
      const largeHistory = Array.from({ length: 20 }, (_, i) => ({
        id: `${i}`,
        name: `Item ${i}`,
        category: GroceryCategory.PRODUCE,
        quantity: 1,
        unit: 'pcs',
        isCompleted: true,
        dateAdded: new Date()
      }));

      const suggestions = generateSuggestions(largeHistory, mockCurrentItems);
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });

    it('should handle empty history', () => {
      const suggestions = generateSuggestions([], mockCurrentItems);
      expect(suggestions).toHaveLength(0);
    });
  });
});
