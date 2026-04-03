import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { GroceryProvider, useGroceryContext } from '../contexts/GroceryContext';
import { GroceryCategory } from '../types';

describe('Integration Tests - GroceryContext', () => {
  describe('Basic Context Functionality', () => {
    it('should provide context without crashing', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GroceryProvider>{children}</GroceryProvider>
      );

      const { result } = renderHook(() => useGroceryContext(), { wrapper });
      expect(result.current).toBeDefined();
    });

    it('should have initial state', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GroceryProvider>{children}</GroceryProvider>
      );

      const { result } = renderHook(() => useGroceryContext(), { wrapper });
      expect(result.current.state).toBeDefined();
      expect(result.current.state.loading).toBe(false);
    });
  });

  describe('State Management', () => {
    it('should add items to context', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GroceryProvider>{children}</GroceryProvider>
      );

      const { result } = renderHook(() => useGroceryContext(), { wrapper });

      act(() => {
        result.current.addItem('TestApple', 2, 'pcs', 1.5);
      });

      expect(result.current.state.shoppingList?.items.length).toBeGreaterThan(0);
      expect(result.current.state.shoppingList?.items.some(i => i.name === 'TestApple')).toBe(true);
    });

    it('should update items in context', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GroceryProvider>{children}</GroceryProvider>
      );

      const { result } = renderHook(() => useGroceryContext(), { wrapper });

      act(() => {
        result.current.addItem('TestItem', 2);
      });

      const item = result.current.state.shoppingList?.items.find(i => i.name === 'TestItem');

      if (item) {
        act(() => {
          result.current.updateItem({ ...item, quantity: 5 });
        });

        const updated = result.current.state.shoppingList?.items.find(i => i.name === 'TestItem');
        expect(updated?.quantity).toBe(5);
      }
    });

    it('should toggle item completion', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GroceryProvider>{children}</GroceryProvider>
      );

      const { result } = renderHook(() => useGroceryContext(), { wrapper });

      act(() => {
        result.current.addItem('TestToggle');
      });

      const item = result.current.state.shoppingList?.items.find(i => i.name === 'TestToggle');

      if (item) {
        expect(item.isCompleted).toBe(false);

        act(() => {
          result.current.toggleItemCompletion(item.id);
        });

        const updated = result.current.state.shoppingList?.items.find(i => i.name === 'TestToggle');
        expect(updated?.isCompleted).toBe(true);
      }
    });

    it('should set budget', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GroceryProvider>{children}</GroceryProvider>
      );

      const { result } = renderHook(() => useGroceryContext(), { wrapper });

      act(() => {
        result.current.setBudget(50);
      });

      expect(result.current.state.shoppingList?.budget).toBe(50);
    });

    it('should auto-categorize items', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GroceryProvider>{children}</GroceryProvider>
      );

      const { result } = renderHook(() => useGroceryContext(), { wrapper });

      act(() => {
        result.current.addItem('Banana');
      });

      const banana = result.current.state.shoppingList?.items.find(i => i.name === 'Banana');
      expect(banana?.category).toBe(GroceryCategory.PRODUCE);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when using hook outside provider', () => {
      expect(() => {
        renderHook(() => useGroceryContext());
      }).toThrow('useGroceryContext must be used within GroceryProvider');
    });
  });

  describe('Context Dispatch', () => {
    it('should provide dispatch function', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GroceryProvider>{children}</GroceryProvider>
      );

      const { result } = renderHook(() => useGroceryContext(), { wrapper });
      expect(result.current.dispatch).toBeDefined();
      expect(typeof result.current.dispatch).toBe('function');
    });
  });

  describe('Budget Tracking', () => {
    it('should track cost against budget', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GroceryProvider>{children}</GroceryProvider>
      );

      const { result } = renderHook(() => useGroceryContext(), { wrapper });

      act(() => {
        result.current.setBudget(100);
        result.current.addItem('TestExpensive', 2, 'pcs', 10);
      });

      const totalCost = result.current.state.shoppingList?.totalCost || 0;
      const budget = result.current.state.shoppingList?.budget || 0;

      expect(totalCost).toBeLessThanOrEqual(budget);
    });
  });

  describe('Category Verification', () => {
    it('should verify categories are assigned', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GroceryProvider>{children}</GroceryProvider>
      );

      const { result } = renderHook(() => useGroceryContext(), { wrapper });

      act(() => {
        result.current.addItem('TestProduce');
      });

      const item = result.current.state.shoppingList?.items.find(i => i.name === 'TestProduce');
      expect(item?.category).toBeDefined();
    });
  });
});
