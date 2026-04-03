import { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, BarChart3, History, ChefHat, Moon, Sun, Copy } from 'lucide-react';
import { AddItemForm } from './components/AddItemForm';
import { GroceryList } from './components/GroceryList';
import { SmartSuggestions } from './components/SmartSuggestions';
import { HowToCook } from './components/HowToCook';
import { TemplateSelector } from './components/TemplateSelector';
import { UndoRedoButtons } from './components/UndoRedoButtons';
import { GroceryProvider, useGroceryContext } from './contexts/GroceryContext';
import { useKeyboardShortcuts } from './services/api';
import { useHistory } from './hooks/useFeatures';
import { GroceryItem, Recipe } from './types';
import './App.css';

type Theme = 'light' | 'dark';

function AppContent() {
  const {
    state: { shoppingList, loading },
    addItem,
    addItems,
    removeItem,
    updateItem,
    toggleItemCompletion,
    clearCompletedItems,
    clearAllItems,
    setBudget,
    reorderItems,
  } = useGroceryContext();

  const [isAddFormExpanded, setIsAddFormExpanded] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [currentView, setCurrentView] = useState<'main' | 'cooking'>('main');
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('smartGroceryList_theme') as Theme | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [cookingData, setCookingData] = useState<{
    recipe: Recipe;
    addedIngredients: Array<{
      name: string;
      quantity: number;
      unit: string;
    }>;
  } | null>(null);

  // Template selector state
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // History for undo/redo
  const { current, push, undo, redo, canUndo, canRedo } = useHistory(
    shoppingList?.items || []
  );

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smartGroceryList_theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('smartGroceryList_theme');
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load cooking data from localStorage on mount
  useEffect(() => {
    const savedCookingData = localStorage.getItem('smartGroceryList_cookingData');
    if (savedCookingData) {
      try {
        const parsedData = JSON.parse(savedCookingData);
        setCookingData(parsedData);
      } catch (error) {
        console.error('Failed to parse saved cooking data:', error);
        localStorage.removeItem('smartGroceryList_cookingData');
      }
    }
  }, []);

  // Save cooking data to localStorage whenever it changes
  useEffect(() => {
    if (cookingData) {
      localStorage.setItem('smartGroceryList_cookingData', JSON.stringify(cookingData));
    } else {
      localStorage.removeItem('smartGroceryList_cookingData');
    }
  }, [cookingData]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const handleSetBudget = useCallback(() => {
    const budget = budgetInput ? parseFloat(budgetInput) : undefined;
    setBudget(budget);
    setShowBudgetModal(false);
    setBudgetInput('');
  }, [budgetInput, setBudget]);

  const handleShowCookingInstructions = useCallback((recipe: Recipe, addedIngredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>) => {
    setCookingData({ recipe, addedIngredients });
    setCurrentView('cooking');
  }, []);

  const handleBackToMain = useCallback(() => {
    setCurrentView('main');
  }, []);

  const handleViewCooking = useCallback(() => {
    if (cookingData) {
      setCurrentView('cooking');
    }
  }, [cookingData]);

  const handleBudgetModalOpen = useCallback(() => {
    setBudgetInput(shoppingList?.budget?.toString() || '');
    setShowBudgetModal(true);
  }, [shoppingList?.budget]);

  const handleBudgetModalClose = useCallback(() => {
    setShowBudgetModal(false);
  }, []);

  const handleRemoveBudget = useCallback(() => {
    setBudget(undefined);
    setShowBudgetModal(false);
  }, [setBudget]);

  const handleBudgetKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSetBudget();
    } else if (e.key === 'Escape') {
      handleBudgetModalClose();
    }
  }, [handleSetBudget, handleBudgetModalClose]);

  const handleLoadTemplate = useCallback((items: GroceryItem[]) => {
    addItems(items);
  }, [addItems]);

  const handleReorderItems = useCallback((reorderedItems: GroceryItem[]) => {
    if (reorderItems) {
      reorderItems(reorderedItems);
      push(reorderedItems);
    }
  }, [reorderItems, push]);

  const handleUndo = useCallback(() => {
    undo();
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
  }, [redo]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+n': () => setIsAddFormExpanded(true),
    'ctrl+k': () => handleBudgetModalOpen(),
    'ctrl+z': () => handleUndo(),
    'ctrl+y': () => handleRedo(),
    'ctrl+shift+t': () => setShowTemplateSelector(true),
    'escape': () => {
      setIsAddFormExpanded(false);
      setShowBudgetModal(false);
      setShowTemplateSelector(false);
    },
  });

  if (loading) {
    return (
      <div className="loading-screen" role="status" aria-label="Loading application">
        <div className="loading-content">
          <div className="loading-spinner">
            <ShoppingCart size={48} className="loading-icon" aria-hidden="true" />
          </div>
          <h2>Loading your smart grocery list...</h2>
          <div className="loading-dots" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  if (!shoppingList) {
    return (
      <div className="error-screen" role="alert">
        <h2>Something went wrong</h2>
        <p>Please refresh the page to try again.</p>
      </div>
    );
  }

  // Show cooking instructions view
  if (currentView === 'cooking' && cookingData) {
    return (
      <HowToCook
        recipe={cookingData.recipe}
        addedIngredients={cookingData.addedIngredients}
        onBackToList={handleBackToMain}
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <ShoppingCart size={32} aria-hidden="true" />
            <h1>Smart Grocery List</h1>
          </div>

          <div className="header-actions">
            {/* Undo/Redo Buttons */}
            <UndoRedoButtons
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
            />

            <button
              onClick={toggleTheme}
              className="header-button theme-toggle"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode (Ctrl+D)`}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
            </button>

            {cookingData && (
              <button
                onClick={handleViewCooking}
                className="header-button cooking-button"
                title="View Cooking Instructions"
                aria-label="View cooking instructions for saved recipe"
              >
                <ChefHat size={20} aria-hidden="true" />
              </button>
            )}

            <button
              onClick={() => setShowTemplateSelector(true)}
              className="header-button template-button"
              title="Load a Template (Ctrl+Shift+T)"
              aria-label="Load a pre-built template"
            >
              <Copy size={20} aria-hidden="true" />
            </button>

            <button
              onClick={handleBudgetModalOpen}
              className="header-button"
              title="Set Budget (Ctrl+K)"
              aria-label="Set shopping budget"
            >
              <BarChart3 size={20} aria-hidden="true" />
            </button>

            <div className="stats-badge" role="status" aria-label={`Shopping list with ${shoppingList.items.length} items`}>
              <History size={16} aria-hidden="true" />
              <span>{shoppingList.items.length} items</span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main" id="main-content">
        <div className="container">
          <AddItemForm
            onAddItem={addItem}
            onAddItems={addItems}
            onShowCookingInstructions={handleShowCookingInstructions}
            isExpanded={isAddFormExpanded}
            onToggleExpanded={() => setIsAddFormExpanded(!isAddFormExpanded)}
          />

          <GroceryList
            items={shoppingList.items}
            onToggleCompletion={toggleItemCompletion}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearCompleted={clearCompletedItems}
            onClearAll={clearAllItems}
            onReorderItems={handleReorderItems}
            budget={shoppingList.budget}
            shoppingList={shoppingList}
          />
        </div>
      </main>

      {/* Template Selector Modal */}
      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onLoadTemplate={handleLoadTemplate}
      />

      {/* Budget Modal */}
      {showBudgetModal && (
        <div
          className="modal-overlay"
          onClick={handleBudgetModalClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="budget-modal-title"
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="budget-modal-title">Set Shopping Budget</h3>
            <div className="modal-content">
              <input
                type="number"
                min="0"
                step="0.01"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                onKeyDown={handleBudgetKeyDown}
                placeholder="Enter budget amount"
                className="budget-input"
                autoFocus
                aria-label="Budget amount in dollars"
              />
              <div className="modal-actions">
                <button
                  onClick={handleBudgetModalClose}
                  className="btn-secondary"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetBudget}
                  className="btn-primary"
                  type="button"
                >
                  Set Budget
                </button>
                {shoppingList.budget && (
                  <button
                    onClick={handleRemoveBudget}
                    className="btn-danger"
                    type="button"
                  >
                    Remove Budget
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <div className="container">
          <p>Smart Grocery List — Built with React & TypeScript</p>
          <p>Auto-categorization • Shopping history • Budget management • Drag-and-drop • Templates • Export</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <GroceryProvider>
      <AppContent />
    </GroceryProvider>
  );
}

export default App;
