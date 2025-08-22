import { useState } from 'react';
import { ShoppingCart, BarChart3, History } from 'lucide-react';
import { AddItemForm } from './components/AddItemForm';
import { GroceryList } from './components/GroceryList';
import { SmartSuggestions } from './components/SmartSuggestions';
import { HowToCook } from './components/HowToCook';
import { useGroceryList } from './hooks/useGroceryList';
import { Recipe } from './types';
import './App.css';

function App() {
  const {
    shoppingList,
    shoppingHistory,
    loading,
    addItem,
    addItems,
    updateItem,
    removeItem,
    toggleItemCompletion,
    clearCompletedItems,
    clearAllItems,
    setBudget,
    getSuggestions,
    addSuggestion
  } = useGroceryList();

  const [isAddFormExpanded, setIsAddFormExpanded] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [currentView, setCurrentView] = useState<'main' | 'cooking'>('main');
  const [cookingData, setCookingData] = useState<{
    recipe: Recipe;
    addedIngredients: Array<{
      name: string;
      quantity: number;
      unit: string;
    }>;
  } | null>(null);

  const suggestions = getSuggestions();

  const handleSetBudget = () => {
    const budget = budgetInput ? parseFloat(budgetInput) : undefined;
    setBudget(budget);
    setShowBudgetModal(false);
    setBudgetInput('');
  };

  const handleShowCookingInstructions = (recipe: Recipe, addedIngredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>) => {
    setCookingData({ recipe, addedIngredients });
    setCurrentView('cooking');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setCookingData(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner">
            <ShoppingCart size={48} className="loading-icon" />
          </div>
          <h2>Loading your smart grocery list...</h2>
          <div className="loading-dots">
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
      <div className="error-screen">
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
            <ShoppingCart size={32} />
            <h1>Smart Grocery List</h1>
          </div>
          
          <div className="header-actions">
            <button
              onClick={() => {
                setBudgetInput(shoppingList.budget?.toString() || '');
                setShowBudgetModal(true);
              }}
              className="header-button"
              title="Set Budget"
            >
              <BarChart3 size={20} />
            </button>
            
            <div className="stats-badge">
              <History size={16} />
              <span>{shoppingHistory.purchases.length} purchases</span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <AddItemForm
            onAddItem={addItem}
            onAddItems={addItems}
            onShowCookingInstructions={handleShowCookingInstructions}
            isExpanded={isAddFormExpanded}
            onToggleExpanded={() => setIsAddFormExpanded(!isAddFormExpanded)}
          />

          {suggestions.length > 0 && (
            <SmartSuggestions
              suggestions={suggestions}
              onAddSuggestion={addSuggestion}
            />
          )}

          <GroceryList
            items={shoppingList.items}
            onToggleCompletion={toggleItemCompletion}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearCompleted={clearCompletedItems}
            onClearAll={clearAllItems}
            budget={shoppingList.budget}
          />
        </div>
      </main>

      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="modal-overlay" onClick={() => setShowBudgetModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Set Shopping Budget</h3>
            <div className="modal-content">
              <input
                type="number"
                min="0"
                step="0.01"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="Enter budget amount"
                className="budget-input"
                autoFocus
              />
              <div className="modal-actions">
                <button onClick={() => setShowBudgetModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSetBudget} className="btn-primary">
                  Set Budget
                </button>
                {shoppingList.budget && (
                  <button
                    onClick={() => {
                      setBudget(undefined);
                      setShowBudgetModal(false);
                    }}
                    className="btn-danger"
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
          <p>Smart Grocery List - Built with React & TypeScript</p>
          <p>Automatically categorizes items • Tracks shopping history • Budget management</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
