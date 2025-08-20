import { ShoppingList, GroceryItem, ShoppingHistory } from '../types';

const STORAGE_KEYS = {
  CURRENT_LIST: 'smart-grocery-current-list',
  SHOPPING_HISTORY: 'smart-grocery-history',
  USER_PREFERENCES: 'smart-grocery-preferences'
};

export interface UserPreferences {
  defaultBudget?: number;
  preferredUnits: string[];
  favoriteStores: string[];
  dietaryRestrictions: string[];
}

class LocalStorageService {
  // Shopping List Management
  saveCurrentList(list: ShoppingList): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_LIST, JSON.stringify({
        ...list,
        dateCreated: list.dateCreated.toISOString(),
        dateModified: list.dateModified.toISOString(),
        items: list.items.map(item => ({
          ...item,
          dateAdded: item.dateAdded.toISOString(),
          lastPurchased: item.lastPurchased?.toISOString()
        }))
      }));
    } catch (error) {
      console.error('Failed to save current list:', error);
    }
  }

  getCurrentList(): ShoppingList | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_LIST);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        dateCreated: new Date(parsed.dateCreated),
        dateModified: new Date(parsed.dateModified),
        items: parsed.items.map((item: Partial<GroceryItem> & { dateAdded: string; lastPurchased?: string }) => ({
          ...item,
          dateAdded: new Date(item.dateAdded),
          lastPurchased: item.lastPurchased ? new Date(item.lastPurchased) : undefined
        } as GroceryItem))
      };
    } catch (error) {
      console.error('Failed to load current list:', error);
      return null;
    }
  }

  // Shopping History Management
  addToHistory(items: GroceryItem[]): void {
    try {
      const history = this.getShoppingHistory();
      const completedItems = items.filter(item => item.isCompleted);
      
      completedItems.forEach(item => {
        const historyItem = {
          ...item,
          lastPurchased: new Date(),
          dateAdded: new Date()
        };
        history.purchases.push(historyItem);
      });

      // Update frequent items
      this.updateFrequentItems(history, completedItems);
      
      // Keep only last 1000 purchases to prevent storage overflow
      if (history.purchases.length > 1000) {
        history.purchases = history.purchases.slice(-1000);
      }

      this.saveShoppingHistory(history);
    } catch (error) {
      console.error('Failed to add to history:', error);
    }
  }

  private updateFrequentItems(history: ShoppingHistory, newItems: GroceryItem[]): void {
    newItems.forEach(item => {
      const existingIndex = history.frequentItems.findIndex(
        freq => freq.item.name.toLowerCase() === item.name.toLowerCase()
      );

      if (existingIndex >= 0) {
        history.frequentItems[existingIndex].frequency++;
        history.frequentItems[existingIndex].lastPurchased = new Date();
      } else {
        history.frequentItems.push({
          item: {
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
            notes: item.notes,
            nutritionalInfo: item.nutritionalInfo
          },
          frequency: 1,
          lastPurchased: new Date()
        });
      }
    });

    // Sort by frequency and keep top 50
    history.frequentItems.sort((a, b) => b.frequency - a.frequency);
    history.frequentItems = history.frequentItems.slice(0, 50);
  }

  getShoppingHistory(): ShoppingHistory {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOPPING_HISTORY);
      if (!data) {
        return { purchases: [], frequentItems: [] };
      }
      
      const parsed = JSON.parse(data);
      return {
        purchases: parsed.purchases.map((item: Partial<GroceryItem> & { dateAdded: string; lastPurchased?: string }) => ({
          ...item,
          dateAdded: new Date(item.dateAdded),
          lastPurchased: item.lastPurchased ? new Date(item.lastPurchased) : undefined
        } as GroceryItem)),
        frequentItems: parsed.frequentItems.map((freq: { item: Omit<GroceryItem, 'id' | 'isCompleted' | 'dateAdded'>; frequency: number; lastPurchased: string }) => ({
          ...freq,
          lastPurchased: new Date(freq.lastPurchased)
        }))
      };
    } catch (error) {
      console.error('Failed to load shopping history:', error);
      return { purchases: [], frequentItems: [] };
    }
  }

  private saveShoppingHistory(history: ShoppingHistory): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOPPING_HISTORY, JSON.stringify({
        purchases: history.purchases.map(item => ({
          ...item,
          dateAdded: item.dateAdded.toISOString(),
          lastPurchased: item.lastPurchased?.toISOString()
        })),
        frequentItems: history.frequentItems.map(freq => ({
          ...freq,
          lastPurchased: freq.lastPurchased.toISOString()
        }))
      }));
    } catch (error) {
      console.error('Failed to save shopping history:', error);
    }
  }

  // User Preferences
  saveUserPreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  getUserPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (!data) {
        return {
          preferredUnits: ['pcs', 'lbs', 'oz', 'gallon', 'dozen'],
          favoriteStores: [],
          dietaryRestrictions: []
        };
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load user preferences:', error);
      return {
        preferredUnits: ['pcs', 'lbs', 'oz', 'gallon', 'dozen'],
        favoriteStores: [],
        dietaryRestrictions: []
      };
    }
  }

  // Clear all data
  clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }
}

export const storageService = new LocalStorageService();