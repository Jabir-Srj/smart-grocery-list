import React, { useState, useCallback, memo } from 'react';
import { Plus, ChefHat } from 'lucide-react';
import { GroceryCategory, Recipe } from '../types';
import { RecipeSearch } from './RecipeSearch';
import { RecipeModal } from './RecipeModal';
import { categorizeItem } from '../utils/groceryUtils';
import './AddItemForm.css';

interface AddItemFormProps {
  onAddItem: (name: string, quantity: number, unit: string, price?: number, category?: GroceryCategory) => void;
  onAddItems: (items: Array<{
    name: string;
    quantity: number;
    unit: string;
    price?: number;
    category?: GroceryCategory;
  }>) => void;
  onShowCookingInstructions: (recipe: Recipe, addedIngredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const UNITS = ['pcs', 'lbs', 'oz', 'kg', 'g', 'gallon', 'liter', 'dozen', 'package', 'bag'];

export const AddItemForm = memo(function AddItemForm({ 
  onAddItem, 
  onAddItems, 
  onShowCookingInstructions, 
  isExpanded, 
  onToggleExpanded 
}: AddItemFormProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<GroceryCategory | ''>('');
  const [activeTab, setActiveTab] = useState<'manual' | 'recipe'>('manual');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddItem(
        name.trim(),
        quantity,
        unit,
        price ? parseFloat(price) : undefined,
        category || undefined
      );
      setName('');
      setQuantity(1);
      setPrice('');
      setCategory('');
    }
  }, [name, quantity, unit, price, category, onAddItem]);

  const handleRecipeSelect = useCallback((recipeId: string) => {
    setSelectedRecipeId(recipeId);
  }, []);

  const handleAddIngredients = useCallback((ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    category?: GroceryCategory;
  }>) => {
    onAddItems(ingredients.map(ingredient => ({
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      price: undefined,
      category: ingredient.category || categorizeItem(ingredient.name)
    })));
  }, [onAddItems]);

  const handleCloseModal = useCallback(() => {
    setSelectedRecipeId(null);
  }, []);

  return (
    <div className="add-item-form" role="region" aria-labelledby="add-item-heading">
      <h2 id="add-item-heading" className="sr-only">Add Items to Your List</h2>
      
      <div className="form-tabs" role="tablist" aria-label="Add item methods">
        <button
          type="button"
          role="tab"
          id="manual-tab"
          aria-selected={activeTab === 'manual'}
          aria-controls="manual-panel"
          onClick={() => setActiveTab('manual')}
          className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
        >
          <Plus size={20} aria-hidden="true" />
          Add Items
        </button>
        <button
          type="button"
          role="tab"
          id="recipe-tab"
          aria-selected={activeTab === 'recipe'}
          aria-controls="recipe-panel"
          onClick={() => setActiveTab('recipe')}
          className={`tab-button ${activeTab === 'recipe' ? 'active' : ''}`}
        >
          <ChefHat size={20} aria-hidden="true" />
          From Recipe
        </button>
      </div>

      {activeTab === 'manual' && (
        <div 
          id="manual-panel"
          role="tabpanel"
          aria-labelledby="manual-tab"
        >
          <div className="quick-add">
            <form onSubmit={handleSubmit} className="quick-add-form">
              <label htmlFor="quick-add-input" className="sr-only">Item name</label>
              <input
                id="quick-add-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Add item..."
                className="quick-input"
                aria-describedby="quick-add-hint"
              />
              <span id="quick-add-hint" className="sr-only">
                Type an item name and press Enter or click the add button
              </span>
              <button 
                type="submit" 
                className="add-button" 
                disabled={!name.trim()}
                aria-label="Add item to list"
              >
                <Plus size={20} aria-hidden="true" />
              </button>
            </form>
            <button
              type="button"
              onClick={onToggleExpanded}
              className={`expand-button ${isExpanded ? 'expanded' : ''}`}
              aria-expanded={isExpanded}
              aria-controls="detailed-form"
            >
              {isExpanded ? 'Simple' : 'Detailed'}
            </button>
          </div>

          {isExpanded && (
            <div 
              id="detailed-form"
              className="detailed-form"
              role="group"
              aria-label="Detailed item options"
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity-input">Quantity</label>
                  <input
                    id="quantity-input"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="unit-select">Unit</label>
                  <select
                    id="unit-select"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="form-select"
                  >
                    {UNITS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price-input">Price ($)</label>
                  <input
                    id="price-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category-select">Category</label>
                  <select
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GroceryCategory)}
                    className="form-select"
                  >
                    <option value="">Auto-detect</option>
                    {Object.values(GroceryCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'recipe' && (
        <div
          id="recipe-panel"
          role="tabpanel"
          aria-labelledby="recipe-tab"
        >
          <RecipeSearch onRecipeSelect={handleRecipeSelect} />
        </div>
      )}

      {selectedRecipeId && (
        <RecipeModal
          recipeId={selectedRecipeId}
          onClose={handleCloseModal}
          onAddIngredients={handleAddIngredients}
          onShowCookingInstructions={onShowCookingInstructions}
        />
      )}
    </div>
  );
});
