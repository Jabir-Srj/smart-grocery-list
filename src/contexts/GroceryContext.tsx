'use client';

import { createContext, useContext, useReducer, ReactNode, useCallback, useEffect, useState } from 'react';
import { ShoppingList, GroceryItem, GroceryCategory, ShoppingHistory } from '../types';
import { storageService } from '../services/storageService';
import { generateId, categorizeItem, calculateTotalCost } from '../utils/groceryUtils';
import { STORAGE_KEYS } from '../constants';

export type GroceryState = {
  shoppingList: ShoppingList | null;
  shoppingHistory: ShoppingHistory;
  loading: boolean;
};

export type GroceryAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LIST'; payload: ShoppingList }
  | { type: 'SET_HISTORY'; payload: ShoppingHistory }
  | { type: 'ADD_ITEM'; payload: GroceryItem }
  | { type: 'ADD_ITEMS'; payload: GroceryItem[] }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM'; payload: GroceryItem }
  | { type: 'TOGGLE_COMPLETION'; payload: string }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_BUDGET'; payload: number | undefined }
  | { type: 'REORDER_ITEMS'; payload: GroceryItem[] };

const initialState: GroceryState = {
  shoppingList: null,
  shoppingHistory: { purchases: [], frequentItems: [] },
  loading: true,
};

function groceryReducer(state: GroceryState, action: GroceryAction): GroceryState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_LIST':
      return { ...state, shoppingList: action.payload };

    case 'SET_HISTORY':
      return { ...state, shoppingHistory: action.payload };

    case 'ADD_ITEM': {
      if (!state.shoppingList) return state;
      const updatedItems = [...state.shoppingList.items, action.payload];
      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          items: updatedItems,
          totalCost: calculateTotalCost(updatedItems),
          dateModified: new Date(),
        },
      };
    }

    case 'REMOVE_ITEM': {
      if (!state.shoppingList) return state;
      const updatedItems = state.shoppingList.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          items: updatedItems,
          totalCost: calculateTotalCost(updatedItems),
          dateModified: new Date(),
        },
      };
    }

    case 'UPDATE_ITEM': {
      if (!state.shoppingList) return state;
      const updatedItems = state.shoppingList.items.map(item =>
        item.id === action.payload.id ? action.payload : item
      );
      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          items: updatedItems,
          totalCost: calculateTotalCost(updatedItems),
          dateModified: new Date(),
        },
      };
    }

    case 'TOGGLE_COMPLETION': {
      if (!state.shoppingList) return state;
      const updatedItems = state.shoppingList.items.map(item =>
        item.id === action.payload ? { ...item, isCompleted: !item.isCompleted } : item
      );
      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          items: updatedItems,
          totalCost: calculateTotalCost(updatedItems),
          dateModified: new Date(),
        },
      };
    }

    case 'CLEAR_COMPLETED': {
      if (!state.shoppingList) return state;
      const updatedItems = state.shoppingList.items.filter(item => !item.isCompleted);
      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          items: updatedItems,
          totalCost: calculateTotalCost(updatedItems),
          dateModified: new Date(),
        },
      };
    }

    case 'CLEAR_ALL': {
      if (!state.shoppingList) return state;
      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          items: [],
          totalCost: 0,
          isCompleted: false,
          dateModified: new Date(),
        },
      };
    }

    case 'SET_BUDGET': {
      if (!state.shoppingList) return state;
      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          budget: action.payload,
          dateModified: new Date(),
        },
      };
    }

    default:
      return state;
  }
}

type GroceryContextType = {
  state: GroceryState;
  dispatch: React.Dispatch<GroceryAction>;
  addItem: (name: string, quantity?: number, unit?: string, price?: number, category?: GroceryCategory) => void;
  addItems: (items: GroceryItem[]) => void;
  removeItem: (id: string) => void;
  updateItem: (item: GroceryItem) => void;
  toggleItemCompletion: (id: string) => void;
  clearCompletedItems: () => void;
  clearAllItems: () => void;
  setBudget: (budget: number | undefined) => void;
  reorderItems: (items: GroceryItem[]) => void;
};

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export function GroceryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(groceryReducer, initialState);

  // Initialize data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedList = storageService.getCurrentList();
        const history = storageService.getShoppingHistory();

        if (savedList) {
          dispatch({ type: 'SET_LIST', payload: savedList });
        } else {
          const newList: ShoppingList = {
            id: generateId(),
            name: 'My Grocery List',
            items: [],
            totalCost: 0,
            dateCreated: new Date(),
            dateModified: new Date(),
            isCompleted: false,
          };
          dispatch({ type: 'SET_LIST', payload: newList });
          storageService.saveCurrentList(newList);
        }

        dispatch({ type: 'SET_HISTORY', payload: history });
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, []);

  // Save list whenever it changes
  useEffect(() => {
    if (state.shoppingList && !state.loading) {
      storageService.saveCurrentList(state.shoppingList);
    }
  }, [state.shoppingList, state.loading]);

  const addItem = useCallback(
    (
      name: string,
      quantity: number = 1,
      unit: string = 'pcs',
      price?: number,
      category?: GroceryCategory
    ) => {
      const newItem: GroceryItem = {
        id: generateId(),
        name: name.trim(),
        category: category || categorizeItem(name),
        quantity,
        unit,
        price,
        isCompleted: false,
        dateAdded: new Date(),
      };
      dispatch({ type: 'ADD_ITEM', payload: newItem });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateItem = useCallback((item: GroceryItem) => {
    dispatch({ type: 'UPDATE_ITEM', payload: item });
  }, []);

  const toggleItemCompletion = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_COMPLETION', payload: id });
  }, []);

  const clearCompletedItems = useCallback(() => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  }, []);

  const clearAllItems = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const setBudget = useCallback((budget: number | undefined) => {
    dispatch({ type: 'SET_BUDGET', payload: budget });
  }, []);

  const addItems = useCallback((items: GroceryItem[]) => {
    dispatch({ type: 'ADD_ITEMS', payload: items });
  }, []);

  const reorderItems = useCallback((items: GroceryItem[]) => {
    dispatch({ type: 'REORDER_ITEMS', payload: items });
  }, []);

  return (
    <GroceryContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        addItems,
        removeItem,
        updateItem,
        toggleItemCompletion,
        clearCompletedItems,
        clearAllItems,
        setBudget,
        reorderItems,
      }}
    >
      {children}
    </GroceryContext.Provider>
  );
}

export function useGroceryContext() {
  const context = useContext(GroceryContext);
  if (!context) {
    throw new Error('useGroceryContext must be used within GroceryProvider');
  }
  return context;
}
