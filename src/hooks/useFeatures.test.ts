import { describe, it, expect } from 'vitest';
import { GroceryItem, GroceryCategory } from '../types';

describe('useFeatures Hook - Data Structures', () => {
  describe('useDragAndDrop Concepts', () => {
    it('should track dragging state', () => {
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
        }
      ];

      let isDragging = false;
      let draggedItem: GroceryItem | null = null;

      draggedItem = mockItems[0];
      isDragging = true;

      expect(isDragging).toBe(true);
      expect(draggedItem.id).toBe('1');
    });

    it('should reorder items', () => {
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
        },
        {
          id: '3',
          name: 'Bread',
          category: GroceryCategory.PANTRY,
          quantity: 1,
          unit: 'pcs',
          isCompleted: false,
          dateAdded: new Date()
        }
      ];

      const reordered = [items[2], items[0], items[1]];

      expect(reordered[0].id).toBe('3');
      expect(reordered[1].id).toBe('1');
      expect(reordered[2].id).toBe('2');
    });
  });

  describe('useHistory Concepts', () => {
    it('should track undo history', () => {
      const history: GroceryItem[][] = [];

      const state1: GroceryItem[] = [
        {
          id: '1',
          name: 'Apple',
          category: GroceryCategory.PRODUCE,
          quantity: 2,
          unit: 'pcs',
          isCompleted: false,
          dateAdded: new Date()
        }
      ];

      history.push(state1);
      expect(history).toHaveLength(1);

      const state2 = [...state1, {
        id: '2',
        name: 'Milk',
        category: GroceryCategory.DAIRY,
        quantity: 1,
        unit: 'liter',
        isCompleted: false,
        dateAdded: new Date()
      }];

      history.push(state2);
      expect(history).toHaveLength(2);
    });

    it('should support redo operations', () => {
      const history: GroceryItem[][] = [];
      let currentIndex = -1;

      const state1: GroceryItem[] = [];
      history.push(state1);
      currentIndex++;

      expect(currentIndex).toBe(0);
      expect(history[currentIndex]).toEqual(state1);
    });
  });

  describe('useSearch Concepts', () => {
    it('should search items by name', () => {
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
          name: 'Apricot',
          category: GroceryCategory.PRODUCE,
          quantity: 1,
          unit: 'pcs',
          isCompleted: false,
          dateAdded: new Date()
        },
        {
          id: '3',
          name: 'Milk',
          category: GroceryCategory.DAIRY,
          quantity: 1,
          unit: 'liter',
          isCompleted: false,
          dateAdded: new Date()
        }
      ];

      const searchResults = items.filter(item => 
        item.name.toLowerCase().includes('apr')
      );

      expect(searchResults.length).toBeGreaterThanOrEqual(1);
    });

    it('should search case-insensitively', () => {
      const items: GroceryItem[] = [
        {
          id: '1',
          name: 'Apple',
          category: GroceryCategory.PRODUCE,
          quantity: 2,
          unit: 'pcs',
          isCompleted: false,
          dateAdded: new Date()
        }
      ];

      const searchTerm = 'APPLE'.toLowerCase();
      const result = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
      );

      expect(result).toHaveLength(1);
    });

    it('should filter by category', () => {
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

      const dairyItems = items.filter(item => item.category === GroceryCategory.DAIRY);
      expect(dairyItems).toHaveLength(1);
      expect(dairyItems[0].name).toBe('Milk');
    });

    it('should filter by completion status', () => {
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

      const pendingItems = items.filter(item => !item.isCompleted);
      expect(pendingItems).toHaveLength(1);
      expect(pendingItems[0].name).toBe('Milk');
    });

    it('should combine multiple filters', () => {
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
          name: 'Apricot',
          category: GroceryCategory.PRODUCE,
          quantity: 1,
          unit: 'pcs',
          isCompleted: false,
          dateAdded: new Date()
        },
        {
          id: '3',
          name: 'Milk',
          category: GroceryCategory.DAIRY,
          quantity: 1,
          unit: 'liter',
          isCompleted: false,
          dateAdded: new Date()
        }
      ];

      const filtered = items.filter(item =>
        item.category === GroceryCategory.PRODUCE &&
        !item.isCompleted &&
        item.name.toLowerCase().includes('apr')
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Apricot');
    });
  });
});
