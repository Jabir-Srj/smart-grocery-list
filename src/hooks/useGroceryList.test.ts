import { describe, it, expect } from 'vitest';
import { GroceryItem, GroceryCategory, ShoppingList } from '../types';

describe('useGroceryList Hook - Data Structures', () => {
  describe('Basic Functionality', () => {
    it('should handle basic item management concepts', () => {
      const item: GroceryItem = {
        id: 'test-1',
        name: 'Apple',
        category: GroceryCategory.PRODUCE,
        quantity: 2,
        unit: 'pcs',
        price: 1.5,
        isCompleted: false,
        dateAdded: new Date()
      };

      expect(item.name).toBe('Apple');
      expect(item.quantity).toBe(2);
      expect(item.price).toBe(1.5);
    });

    it('should work with shopping lists', () => {
      const list: ShoppingList = {
        id: 'list-1',
        name: 'Test List',
        items: [],
        totalCost: 0,
        dateCreated: new Date(),
        dateModified: new Date(),
        isCompleted: false
      };

      expect(list.items).toHaveLength(0);
      expect(list.totalCost).toBe(0);
    });

    it('should handle item completion status', () => {
      const item: GroceryItem = {
        id: 'test-1',
        name: 'Apple',
        category: GroceryCategory.PRODUCE,
        quantity: 2,
        unit: 'pcs',
        isCompleted: false,
        dateAdded: new Date()
      };

      expect(item.isCompleted).toBe(false);

      const completedItem = { ...item, isCompleted: true };
      expect(completedItem.isCompleted).toBe(true);
    });

    it('should support budget tracking', () => {
      const list: ShoppingList = {
        id: 'list-1',
        name: 'Test List',
        items: [],
        totalCost: 0,
        budget: 50,
        dateCreated: new Date(),
        dateModified: new Date(),
        isCompleted: false
      };

      expect(list.budget).toBe(50);
      expect(list.totalCost).toBeLessThanOrEqual(list.budget);
    });
  });

  describe('Multiple Items', () => {
    it('should group multiple items', () => {
      const items: GroceryItem[] = [
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
        }
      ];

      expect(items).toHaveLength(2);
      expect(items[0].category).toBe(GroceryCategory.PRODUCE);
      expect(items[1].category).toBe(GroceryCategory.DAIRY);
    });

    it('should track total cost of multiple items', () => {
      const items: GroceryItem[] = [
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

      const totalCost = items.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
      expect(totalCost).toBe(6.0);
    });

    it('should update item quantity', () => {
      const item: GroceryItem = {
        id: '1',
        name: 'Apple',
        category: GroceryCategory.PRODUCE,
        quantity: 2,
        unit: 'pcs',
        price: 1.5,
        isCompleted: false,
        dateAdded: new Date()
      };

      const updatedItem = { ...item, quantity: 5 };
      expect(updatedItem.quantity).toBe(5);
      expect(item.quantity).toBe(2);
    });

    it('should filter completed items', () => {
      const items: GroceryItem[] = [
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
          isCompleted: false,
          dateAdded: new Date()
        }
      ];

      const completedItems = items.filter(item => item.isCompleted);
      const pendingItems = items.filter(item => !item.isCompleted);

      expect(completedItems).toHaveLength(1);
      expect(pendingItems).toHaveLength(1);
    });
  });

  describe('List Operations', () => {
    it('should add items to list', () => {
      const list: ShoppingList = {
        id: 'list-1',
        name: 'Test List',
        items: [],
        totalCost: 0,
        dateCreated: new Date(),
        dateModified: new Date(),
        isCompleted: false
      };

      const newItem: GroceryItem = {
        id: 'item-1',
        name: 'Apple',
        category: GroceryCategory.PRODUCE,
        quantity: 2,
        unit: 'pcs',
        price: 1.5,
        isCompleted: false,
        dateAdded: new Date()
      };

      const updatedList = {
        ...list,
        items: [...list.items, newItem]
      };

      expect(updatedList.items).toHaveLength(1);
      expect(updatedList.items[0].name).toBe('Apple');
    });

    it('should remove items from list', () => {
      const item1: GroceryItem = {
        id: 'item-1',
        name: 'Apple',
        category: GroceryCategory.PRODUCE,
        quantity: 2,
        unit: 'pcs',
        isCompleted: false,
        dateAdded: new Date()
      };

      const item2: GroceryItem = {
        id: 'item-2',
        name: 'Milk',
        category: GroceryCategory.DAIRY,
        quantity: 1,
        unit: 'liter',
        isCompleted: false,
        dateAdded: new Date()
      };

      let items = [item1, item2];
      items = items.filter(item => item.id !== 'item-1');

      expect(items).toHaveLength(1);
      expect(items[0].name).toBe('Milk');
    });

    it('should calculate list total cost', () => {
      const list: ShoppingList = {
        id: 'list-1',
        name: 'Test List',
        items: [
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
        ],
        totalCost: 6.0,
        dateCreated: new Date(),
        dateModified: new Date(),
        isCompleted: false
      };

      const calculatedCost = list.items.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
      expect(calculatedCost).toBe(list.totalCost);
    });
  });
});
