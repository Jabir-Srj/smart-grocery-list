import React, { useState, useEffect, useCallback, memo } from 'react';
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
  onShowCookingInstructions: (recipe: Recipe, addedIngredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>) => void;
}

export const RecipeModal = memo(function RecipeModal({ 
  recipeId, 
  onClose, 
  onAddIngredients, 
  onShowCookingInstructions 
}: RecipeModalProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(true);

  const loadRecipe = useCallback(async () => {
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
      console.error('Failed to load recipe:', err);
      setError('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    loadRecipe();
  }, [loadRecipe]);

  useEffect(() => {
    // Initially select all ingredients
    if (recipe?.ingredients) {
      setSelectedIngredients(new Set(recipe.ingredients.map((_, index) => index)));
    }
  }, [recipe]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleIngredientToggle = useCallback((index: number) => {
    setSelectedIngredients(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(index)) {
        newSelected.delete(index);
      } else {
        newSelected.add(index);
      }
      setSelectAll(newSelected.size === recipe?.ingredients.length);
      return newSelected;
    });
  }, [recipe?.ingredients.length]);

  const handleSelectAllToggle = useCallback(() => {
    if (selectAll && recipe?.ingredients) {
      setSelectedIngredients(new Set());
      setSelectAll(false);
    } else if (recipe?.ingredients) {
      setSelectedIngredients(new Set(recipe.ingredients.map((_, index) => index)));
      setSelectAll(true);
    }
  }, [selectAll, recipe?.ingredients]);

  const handleAddToList = useCallback(() => {
    if (!recipe) return;

    const ingredientsToAdd = Array.from(selectedIngredients)
      .map(index => recipe.ingredients[index])
      .filter(Boolean);

    onAddIngredients(ingredientsToAdd);
    
    // Show cooking instructions after adding ingredients
    onShowCookingInstructions(recipe, ingredientsToAdd);
    
    onClose();
  }, [recipe, selectedIngredients, onAddIngredients, onShowCookingInstructions, onClose]);

  if (loading) {
    return (
      <div 
        className="recipe-modal-overlay" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-loading"
      >
        <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <X size={24} aria-hidden="true" />
          </button>
          <div className="loading-recipe" id="recipe-modal-loading" role="status">
            <p>Loading recipe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div 
        className="recipe-modal-overlay" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-error"
      >
        <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <X size={24} aria-hidden="true" />
          </button>
          <div className="error-recipe" id="recipe-modal-error" role="alert">
            <p>{error || 'Recipe not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="recipe-modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-modal-title"
    >
      <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
        <button 
          className="close-button" 
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          <X size={24} aria-hidden="true" />
        </button>

        <div className="recipe-modal-header">
          {recipe.image && (
            <img
              src={recipe.image}
              alt=""
              className="recipe-modal-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          
          <div className="recipe-modal-info">
            <h2 className="recipe-modal-title" id="recipe-modal-title">{recipe.name}</h2>
            
            <div className="recipe-modal-meta">
              {recipe.readyInMinutes && (
                <span>
                  <Clock size={16} aria-hidden="true" />
                  <span aria-label={`Ready in ${recipe.readyInMinutes} minutes`}>
                    {recipe.readyInMinutes} minutes
                  </span>
                </span>
              )}
              <span>
                <Users size={16} aria-hidden="true" />
                <span aria-label={`Serves ${recipe.servings}`}>
                  {recipe.servings} servings
                </span>
              </span>
            </div>
            
            <div className="recipe-modal-actions">
              {recipe.sourceUrl && (
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  aria-label="View original recipe in new tab"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  View Original Recipe
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="recipe-modal-content">
          <div className="recipe-ingredients" role="region" aria-labelledby="ingredients-heading">
            <h4 id="ingredients-heading">
              <ShoppingCart size={20} aria-hidden="true" />
              Ingredients ({selectedIngredients.size} of {recipe.ingredients.length} selected)
            </h4>
            
            <label className="select-all-checkbox">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllToggle}
                className="ingredient-checkbox"
                aria-label="Select all ingredients"
              />
              <span>Select All</span>
            </label>

            <div className="ingredients-list" role="group" aria-label="Ingredients to add">
              {recipe.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`ingredient-item ${selectedIngredients.has(index) ? 'selected' : ''}`}
                  onClick={() => handleIngredientToggle(index)}
                  role="checkbox"
                  aria-checked={selectedIngredients.has(index)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleIngredientToggle(index);
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedIngredients.has(index)}
                    onChange={() => handleIngredientToggle(index)}
                    className="ingredient-checkbox"
                    aria-label={`${ingredient.name}, ${ingredient.quantity} ${ingredient.unit}`}
                    tabIndex={-1}
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
            <div className="recipe-instructions" role="region" aria-labelledby="instructions-heading">
              <h4 id="instructions-heading">
                <List size={20} aria-hidden="true" />
                Instructions
              </h4>
              <div className="instructions-text">{recipe.instructions}</div>
            </div>
          )}
        </div>

        <div className="recipe-modal-footer">
          <button 
            onClick={onClose} 
            className="btn-secondary"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToList}
            className="btn-primary"
            disabled={selectedIngredients.size === 0}
            type="button"
            aria-label={`Add ${selectedIngredients.size} ingredients to shopping list`}
          >
            <ShoppingCart size={16} aria-hidden="true" />
            Add {selectedIngredients.size} Ingredients to List
          </button>
        </div>
      </div>
    </div>
  );
});
