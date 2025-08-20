import React, { useState, useEffect } from 'react';
import { X, Clock, Users, ShoppingCart, List, ExternalLink } from 'lucide-react';
import { Recipe, GroceryCategory } from '../types';
import { recipeService } from '../services/recipeService';
import './RecipeModal.css';

interface RecipeModalProps {
  recipeId: string;
  onClose: () => void;
  onAddIngredients: (ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    category?: GroceryCategory;
  }>) => void;
}

export function RecipeModal({ recipeId, onClose, onAddIngredients }: RecipeModalProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(true);

  useEffect(() => {
    loadRecipe();
  }, [recipeId]);

  useEffect(() => {
    // Initially select all ingredients
    if (recipe?.ingredients) {
      setSelectedIngredients(new Set(recipe.ingredients.map((_, index) => index)));
    }
  }, [recipe]);

  const loadRecipe = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const recipeData = await recipeService.getRecipeById(recipeId);
      
      if (recipeData) {
        setRecipe(recipeData);
      } else {
        setError('Recipe not found');
      }
    } catch (err) {
      setError('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleIngredientToggle = (index: number) => {
    const newSelected = new Set(selectedIngredients);
    
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    
    setSelectedIngredients(newSelected);
    setSelectAll(newSelected.size === recipe?.ingredients.length);
  };

  const handleSelectAllToggle = () => {
    if (selectAll && recipe?.ingredients) {
      setSelectedIngredients(new Set());
      setSelectAll(false);
    } else if (recipe?.ingredients) {
      setSelectedIngredients(new Set(recipe.ingredients.map((_, index) => index)));
      setSelectAll(true);
    }
  };

  const handleAddToList = () => {
    if (!recipe) return;

    const ingredientsToAdd = Array.from(selectedIngredients)
      .map(index => recipe.ingredients[index])
      .filter(Boolean);

    onAddIngredients(ingredientsToAdd);
    onClose();
  };

  if (loading) {
    return (
      <div className="recipe-modal-overlay" onClick={onClose}>
        <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
          <div className="loading-recipe">
            <p>Loading recipe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="recipe-modal-overlay" onClick={onClose}>
        <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
          <div className="error-recipe">
            <p>{error || 'Recipe not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-modal-overlay" onClick={onClose}>
      <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="recipe-modal-header">
          {recipe.image && (
            <img
              src={recipe.image}
              alt={recipe.name}
              className="recipe-modal-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          
          <div className="recipe-modal-info">
            <h2 className="recipe-modal-title">{recipe.name}</h2>
            
            <div className="recipe-modal-meta">
              {recipe.readyInMinutes && (
                <span>
                  <Clock size={16} />
                  {recipe.readyInMinutes} minutes
                </span>
              )}
              <span>
                <Users size={16} />
                {recipe.servings} servings
              </span>
            </div>
            
            <div className="recipe-modal-actions">
              {recipe.sourceUrl && (
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <ExternalLink size={16} />
                  View Original Recipe
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="recipe-modal-content">
          <div className="recipe-ingredients">
            <h4>
              <ShoppingCart size={20} />
              Ingredients ({selectedIngredients.size} of {recipe.ingredients.length} selected)
            </h4>
            
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllToggle}
                  className="ingredient-checkbox"
                />
                <span style={{ fontWeight: 500 }}>Select All</span>
              </label>
            </div>

            <div className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`ingredient-item ${selectedIngredients.has(index) ? 'selected' : ''}`}
                  onClick={() => handleIngredientToggle(index)}
                >
                  <input
                    type="checkbox"
                    checked={selectedIngredients.has(index)}
                    onChange={() => handleIngredientToggle(index)}
                    className="ingredient-checkbox"
                  />
                  <div className="ingredient-details">
                    <div className="ingredient-name">{ingredient.name}</div>
                    <div className="ingredient-amount">
                      {ingredient.quantity} {ingredient.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {recipe.instructions && (
            <div className="recipe-instructions">
              <h4>
                <List size={20} />
                Instructions
              </h4>
              <div className="instructions-text">{recipe.instructions}</div>
            </div>
          )}
        </div>

        <div className="recipe-modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleAddToList}
            className="btn-primary"
            disabled={selectedIngredients.size === 0}
          >
            <ShoppingCart size={16} />
            Add {selectedIngredients.size} Ingredients to List
          </button>
        </div>
      </div>
    </div>
  );
}