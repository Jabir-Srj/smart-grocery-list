import { describe, it, expect } from 'vitest';
import { categorizeItem, formatCurrency, calculateTotalCost, getCompletionPercentage } from './groceryUtils';
import { GroceryCategory, GroceryItem } from '../types';

describe('groceryUtils', () => {
  describe('categorizeItem', () => {
    it('should categorize items correctly', () => {
      expect(categorizeItem('apple')).toBe(GroceryCategory.PRODUCE);
      expect(categorizeItem('milk')).toBe(GroceryCategory.DAIRY);
      expect(categorizeItem('chicken')).toBe(GroceryCategory.MEAT);
      expect(categorizeItem('bread')).toBe(GroceryCategory.PANTRY);
      expect(categorizeItem('unknown item')).toBe(GroceryCategory.OTHER);
    });

    it('should handle case insensitivity', () => {
      expect(categorizeItem('APPLE')).toBe(GroceryCategory.PRODUCE);
      expect(categorizeItem('MiLk')).toBe(GroceryCategory.DAIRY);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(10.99)).toBe('$10.99');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(100)).toBe('$100.00');
    });
  });

  describe('calculateTotalCost', () => {
    it('should calculate total cost correctly', () => {
      const items: GroceryItem[] = [
        {
          id: '1',
          name: 'Apple',
          category: GroceryCategory.PRODUCE,
          quantity: 2,
          unit: 'lbs',
          price: 3.99,
          isCompleted: false,
          dateAdded: new Date()
        },
        {
          id: '2',
          name: 'Milk',
          category: GroceryCategory.DAIRY,
          quantity: 1,
          unit: 'gallon',
          price: 4.50,
          isCompleted: false,
          dateAdded: new Date()
        }
      ];

      expect(calculateTotalCost(items)).toBe(12.48); // (2 * 3.99) + (1 * 4.50)
    });

    it('should handle items without prices', () => {
      const items: GroceryItem[] = [
        {
          id: '1',
          name: 'Apple',
          category: GroceryCategory.PRODUCE,
          quantity: 2,
          unit: 'lbs',
          isCompleted: false,
          dateAdded: new Date()
        }
      ];

      expect(calculateTotalCost(items)).toBe(0);
    });
  });

  describe('getCompletionPercentage', () => {
    it('should calculate completion percentage correctly', () => {
      const items: GroceryItem[] = [
        {
          id: '1',
          name: 'Apple',
          category: GroceryCategory.PRODUCE,
          quantity: 1,
          unit: 'pcs',
          isCompleted: true,
          dateAdded: new Date()
        },
        {
          id: '2',
          name: 'Milk',
          category: GroceryCategory.DAIRY,
          quantity: 1,
          unit: 'gallon',
          isCompleted: false,
          dateAdded: new Date()
        }
      ];

      expect(getCompletionPercentage(items)).toBe(50);
    });

    it('should return 0 for empty list', () => {
      expect(getCompletionPercentage([])).toBe(0);
    });

    it('should return 100 for all completed items', () => {
      const items: GroceryItem[] = [
        {
          id: '1',
          name: 'Apple',
          category: GroceryCategory.PRODUCE,
          quantity: 1,
          unit: 'pcs',
          isCompleted: true,
          dateAdded: new Date()
        }
      ];

      expect(getCompletionPercentage(items)).toBe(100);
    });
  });
});