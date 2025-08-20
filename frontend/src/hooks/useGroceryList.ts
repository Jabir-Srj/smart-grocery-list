import { useState, useEffect, useCallback } from 'react';
import { ShoppingList, GroceryItem, GroceryCategory, ShoppingHistory } from '../types';
import { storageService } from '../services/storageService';
import { generateId, categorizeItem, calculateTotalCost, generateSuggestions } from '../utils/groceryUtils';

export function useGroceryList() {
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [shoppingHistory, setShoppingHistory] = useState<ShoppingHistory>({ purchases: [], frequentItems: [] });
  const [loading, setLoading] = useState(true);

  // Initialize or create new shopping list
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedList = storageService.getCurrentList();
        const history = storageService.getShoppingHistory();
        
        if (savedList) {
          setShoppingList(savedList);
        } else {
          // Create new list
          const newList: ShoppingList = {
            id: generateId(),
            name: 'My Grocery List',
            items: [],
            totalCost: 0,
            dateCreated: new Date(),
            dateModified: new Date(),
            isCompleted: false
          };
          setShoppingList(newList);
          storageService.saveCurrentList(newList);
        }
        
        setShoppingHistory(history);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save list whenever it changes
  useEffect(() => {
    if (shoppingList && !loading) {
      storageService.saveCurrentList(shoppingList);
    }
  }, [shoppingList, loading]);

  const addItem = useCallback((
    name: string,
    quantity: number = 1,
    unit: string = 'pcs',
    price?: number,
    category?: GroceryCategory
  ) => {
    if (!shoppingList) return;

    const newItem: GroceryItem = {
      id: generateId(),
      name: name.trim(),
      category: category || categorizeItem(name),
      quantity,
      unit,
      price,
      isCompleted: false,
      dateAdded: new Date()
    };

    const updatedList = {
      ...shoppingList,
      items: [...shoppingList.items, newItem],
      totalCost: calculateTotalCost([...shoppingList.items, newItem]),
      dateModified: new Date()
    };

    setShoppingList(updatedList);
  }, [shoppingList]);

  const updateItem = useCallback((itemId: string, updates: Partial<GroceryItem>) => {
    if (!shoppingList) return;

    const updatedItems = shoppingList.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    const updatedList = {
      ...shoppingList,
      items: updatedItems,
      totalCost: calculateTotalCost(updatedItems),
      dateModified: new Date()
    };

    setShoppingList(updatedList);
  }, [shoppingList]);

  const removeItem = useCallback((itemId: string) => {
    if (!shoppingList) return;

    const updatedItems = shoppingList.items.filter(item => item.id !== itemId);
    const updatedList = {
      ...shoppingList,
      items: updatedItems,
      totalCost: calculateTotalCost(updatedItems),
      dateModified: new Date()
    };

    setShoppingList(updatedList);
  }, [shoppingList]);

  const toggleItemCompletion = useCallback((itemId: string) => {
    if (!shoppingList) return;

    const updatedItems = shoppingList.items.map(item =>
      item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
    );

    const updatedList = {
      ...shoppingList,
      items: updatedItems,
      dateModified: new Date()
    };

    setShoppingList(updatedList);
  }, [shoppingList]);

  const clearCompletedItems = useCallback(() => {
    if (!shoppingList) return;

    const completedItems = shoppingList.items.filter(item => item.isCompleted);
    const remainingItems = shoppingList.items.filter(item => !item.isCompleted);

    // Add completed items to history
    if (completedItems.length > 0) {
      storageService.addToHistory(completedItems);
      setShoppingHistory(storageService.getShoppingHistory());
    }

    const updatedList = {
      ...shoppingList,
      items: remainingItems,
      totalCost: calculateTotalCost(remainingItems),
      dateModified: new Date()
    };

    setShoppingList(updatedList);
  }, [shoppingList]);

  const clearAllItems = useCallback(() => {
    if (!shoppingList) return;

    const updatedList = {
      ...shoppingList,
      items: [],
      totalCost: 0,
      dateModified: new Date()
    };

    setShoppingList(updatedList);
  }, [shoppingList]);

  const setBudget = useCallback((budget?: number) => {
    if (!shoppingList) return;

    const updatedList = {
      ...shoppingList,
      budget,
      dateModified: new Date()
    };

    setShoppingList(updatedList);
  }, [shoppingList]);

  const getSuggestions = useCallback(() => {
    if (!shoppingList) return [];
    
    const suggestions = generateSuggestions(shoppingHistory.purchases, shoppingList.items);
    return suggestions;
  }, [shoppingList, shoppingHistory]);

  const addSuggestion = useCallback((suggestion: GroceryItem) => {
    addItem(
      suggestion.name,
      suggestion.quantity,
      suggestion.unit,
      suggestion.price,
      suggestion.category
    );
  }, [addItem]);

  return {
    shoppingList,
    shoppingHistory,
    loading,
    addItem,
    updateItem,
    removeItem,
    toggleItemCompletion,
    clearCompletedItems,
    clearAllItems,
    setBudget,
    getSuggestions,
    addSuggestion
  };
}