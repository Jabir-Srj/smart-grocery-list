import React, { useState } from 'react';
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

export function AddItemForm({ onAddItem, onAddItems, onShowCookingInstructions, isExpanded, onToggleExpanded }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<GroceryCategory | ''>('');
  const [activeTab, setActiveTab] = useState<'manual' | 'recipe'>('manual');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
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
  };

  const handleRecipeSelect = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
  };

  const handleAddIngredients = (ingredients: Array<{
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
  };

  return (
    <div className="add-item-form">
      <div className="form-tabs">
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
        >
          <Plus size={20} />
          Add Items
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('recipe')}
          className={`tab-button ${activeTab === 'recipe' ? 'active' : ''}`}
        >
          <ChefHat size={20} />
          From Recipe
        </button>
      </div>

      {activeTab === 'manual' && (
        <>
          <div className="quick-add">
            <form onSubmit={handleSubmit} className="quick-add-form">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Add item..."
                className="quick-input"
              />
              <button type="submit" className="add-button" disabled={!name.trim()}>
                <Plus size={20} />
              </button>
            </form>
            <button
              type="button"
              onClick={onToggleExpanded}
              className={`expand-button ${isExpanded ? 'expanded' : ''}`}
            >
              {isExpanded ? 'Simple' : 'Detailed'}
            </button>
          </div>

          {isExpanded && (
            <div className="detailed-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="unit">Unit</label>
                  <select
                    id="unit"
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
                  <label htmlFor="price">Price ($)</label>
                  <input
                    id="price"
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
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
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
        </>
      )}

      {activeTab === 'recipe' && (
        <RecipeSearch onRecipeSelect={handleRecipeSelect} />
      )}

      {selectedRecipeId && (
        <RecipeModal
          recipeId={selectedRecipeId}
          onClose={() => setSelectedRecipeId(null)}
          onAddIngredients={handleAddIngredients}
          onShowCookingInstructions={onShowCookingInstructions}
        />
      )}
    </div>
  );
}