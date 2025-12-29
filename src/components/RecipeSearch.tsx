import React, { useState, useEffect, useCallback, memo } from 'react';
import { Search, Clock, ChefHat } from 'lucide-react';
import { RecipeSearchResult } from '../types';
import { recipeService } from '../services/recipeService';
import './RecipeSearch.css';

interface RecipeSearchProps {
  onRecipeSelect: (recipeId: string) => void;
}

export const RecipeSearch = memo(function RecipeSearch({ onRecipeSelect }: RecipeSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<RecipeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Load random recipes on component mount
  useEffect(() => {
    loadRandomRecipes();
  }, []);

  const loadRandomRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const randomRecipes = await recipeService.getRandomRecipes(6);
      setRecipes(randomRecipes);
    } catch (err) {
      console.error('Failed to load recipes:', err);
      setError('Failed to load recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const searchResults = await recipeService.searchRecipes(searchQuery.trim());
      setRecipes(searchResults);
      
      if (searchResults.length === 0) {
        setError('No recipes found. Try a different search term.');
      }
    } catch (err) {
      console.error('Failed to search recipes:', err);
      setError('Failed to search recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const resetToRandom = useCallback(async () => {
    setSearchQuery('');
    setHasSearched(false);
    setError(null);
    await loadRandomRecipes();
  }, [loadRandomRecipes]);

  const handleRecipeClick = useCallback((recipeId: string) => {
    onRecipeSelect(recipeId);
  }, [onRecipeSelect]);

  const handleRecipeKeyDown = useCallback((e: React.KeyboardEvent, recipeId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRecipeSelect(recipeId);
    }
  }, [onRecipeSelect]);

  return (
    <div className="recipe-search" role="region" aria-labelledby="recipe-search-heading">
      <div className="recipe-search-header">
        <h3 id="recipe-search-heading">
          <ChefHat size={24} aria-hidden="true" />
          Find Recipes
        </h3>
      </div>

      <form onSubmit={handleSearch} className="recipe-search-form" role="search">
        <label htmlFor="recipe-search-input" className="sr-only">Search for recipes</label>
        <input
          id="recipe-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for recipes..."
          className="recipe-search-input"
          aria-describedby="recipe-search-hint"
        />
        <span id="recipe-search-hint" className="sr-only">
          Enter a recipe name or ingredient and press search
        </span>
        <button 
          type="submit" 
          className="recipe-search-button"
          disabled={loading || !searchQuery.trim()}
          aria-label="Search recipes"
        >
          <Search size={20} aria-hidden="true" />
          Search
        </button>
      </form>

      {hasSearched && (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <button 
            onClick={resetToRandom}
            className="recipe-search-button"
            type="button"
            style={{ 
              background: 'var(--color-gray-600)',
              fontSize: 'var(--text-sm)',
              padding: 'var(--space-sm) var(--space-md)'
            }}
            aria-label="Show random recipes instead"
          >
            Show Random Recipes
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-state" role="status" aria-live="polite">
          <p>Loading recipes...</p>
        </div>
      )}

      {error && (
        <div className="error-state" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && recipes.length === 0 && hasSearched && (
        <div className="empty-state" role="status">
          <p>No recipes found. Try a different search term.</p>
        </div>
      )}

      {!loading && !error && recipes.length === 0 && !hasSearched && (
        <div className="loading-state" role="status">
          <p>Loading random recipes...</p>
        </div>
      )}

      {recipes.length > 0 && (
        <div 
          className="recipe-results" 
          role="list" 
          aria-label={hasSearched ? `Search results for ${searchQuery}` : 'Random recipe suggestions'}
        >
          {recipes.map((recipe) => (
            <article
              key={recipe.id}
              className="recipe-card"
              onClick={() => handleRecipeClick(recipe.id)}
              onKeyDown={(e) => handleRecipeKeyDown(e, recipe.id)}
              role="listitem"
              tabIndex={0}
              aria-label={`${recipe.title}, ready in ${recipe.readyInMinutes} minutes. Press Enter to view details.`}
            >
              <img
                src={recipe.image}
                alt=""
                className="recipe-card-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="recipe-card-content">
                <h4 className="recipe-card-title">{recipe.title}</h4>
                <div className="recipe-card-meta">
                  <span>
                    <Clock size={16} aria-hidden="true" />
                    {recipe.readyInMinutes} min
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
});
