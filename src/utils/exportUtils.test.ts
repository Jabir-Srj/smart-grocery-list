import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateShareLink,
  copyToClipboard
} from './exportUtils';
import { ShoppingList, GroceryCategory } from '../types';

describe('Export Utilities', () => {
  const mockList: ShoppingList = {
    id: 'list-1',
    name: 'Test Grocery List',
    items: [
      {
        id: 'item-1',
        name: 'Apple',
        category: GroceryCategory.PRODUCE,
        quantity: 2,
        unit: 'pcs',
        price: 1.5,
        isCompleted: false,
        dateAdded: new Date()
      },
      {
        id: 'item-2',
        name: 'Milk',
        category: GroceryCategory.DAIRY,
        quantity: 1,
        unit: 'liter',
        price: 3.0,
        isCompleted: true,
        dateAdded: new Date()
      }
    ],
    totalCost: 6.0,
    budget: 20,
    dateCreated: new Date(),
    dateModified: new Date(),
    isCompleted: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateShareLink', () => {
    it('should generate a valid share link', () => {
      const link = generateShareLink(mockList);
      expect(link).toContain('shared=');
      expect(link).toContain('http');
    });

    it('should encode list data in link', () => {
      const link = generateShareLink(mockList);
      const encoded = link.split('shared=')[1];
      const decoded = JSON.parse(atob(encoded));
      expect(decoded.id).toBe(mockList.id);
      expect(decoded.name).toBe(mockList.name);
    });

    it('should include all items in share link', () => {
      const link = generateShareLink(mockList);
      const encoded = link.split('shared=')[1];
      const decoded = JSON.parse(atob(encoded));
      expect(decoded.items).toHaveLength(mockList.items.length);
    });

    it('should preserve item details', () => {
      const link = generateShareLink(mockList);
      const encoded = link.split('shared=')[1];
      const decoded = JSON.parse(atob(encoded));
      expect(decoded.items[0].name).toBe('Apple');
      expect(decoded.items[0].quantity).toBe(2);
    });

    it('should preserve budget information', () => {
      const link = generateShareLink(mockList);
      const encoded = link.split('shared=')[1];
      const decoded = JSON.parse(atob(encoded));
      expect(decoded.budget).toBe(mockList.budget);
    });

    it('should handle lists without budget', () => {
      const listNoBudget = { ...mockList, budget: undefined };
      const link = generateShareLink(listNoBudget);
      const encoded = link.split('shared=')[1];
      const decoded = JSON.parse(atob(encoded));
      expect(decoded.budget).toBeUndefined();
    });
  });

  describe('copyToClipboard', () => {
    beforeEach(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn(() => Promise.resolve())
        }
      });
    });

    it('should copy text to clipboard successfully', async () => {
      const result = await copyToClipboard('test text');
      expect(result).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
    });

    it('should return false on clipboard error', async () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn(() => Promise.reject(new Error('Clipboard error')))
        }
      });

      const result = await copyToClipboard('test text');
      expect(result).toBe(false);
    });

    it('should handle empty string', async () => {
      const result = await copyToClipboard('');
      expect(result).toBe(true);
    });

    it('should handle long text', async () => {
      const longText = 'a'.repeat(10000);
      const result = await copyToClipboard(longText);
      expect(result).toBe(true);
    });

    it('should use clipboard API', async () => {
      const writeTextSpy = vi.fn(() => Promise.resolve());
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextSpy
        }
      });

      await copyToClipboard('test');
      expect(writeTextSpy).toHaveBeenCalled();
    });
  });

  describe('Data Format Verification', () => {
    it('should produce valid base64 encoding', () => {
      const link = generateShareLink(mockList);
      const encoded = link.split('shared=')[1];
      
      // Should be valid base64
      expect(() => atob(encoded)).not.toThrow();
    });

    it('should preserve all list properties', () => {
      const link = generateShareLink(mockList);
      const encoded = link.split('shared=')[1];
      const decoded = JSON.parse(atob(encoded));

      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('name');
      expect(decoded).toHaveProperty('items');
      expect(decoded).toHaveProperty('totalCost');
      expect(decoded).toHaveProperty('budget');
      expect(decoded).toHaveProperty('dateCreated');
      expect(decoded).toHaveProperty('dateModified');
      expect(decoded).toHaveProperty('isCompleted');
    });

    it('should preserve all item properties', () => {
      const link = generateShareLink(mockList);
      const encoded = link.split('shared=')[1];
      const decoded = JSON.parse(atob(encoded));

      const item = decoded.items[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('category');
      expect(item).toHaveProperty('quantity');
      expect(item).toHaveProperty('unit');
      expect(item).toHaveProperty('price');
      expect(item).toHaveProperty('isCompleted');
    });
  });
});
