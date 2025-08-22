import React, { useState, useEffect } from 'react';
import { Search, Clock, ChefHat } from 'lucide-react';
import { RecipeSearchResult } from '../types';
import { recipeService } from '../services/recipeService';
import './RecipeSearch.css';

interface RecipeSearchProps {
  onRecipeSelect: (recipeId: string) => void;
}

export function RecipeSearch({ onRecipeSelect }: RecipeSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<RecipeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Load random recipes on component mount
  useEffect(() => {
    loadRandomRecipes();
  }, []);

  const loadRandomRecipes = async () => {
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
  };

  const handleSearch = async (e: React.FormEvent) => {
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
  };

  const resetToRandom = async () => {
    setSearchQuery('');
    setHasSearched(false);
    setError(null);
    await loadRandomRecipes();
  };

  return (
    <div className="recipe-search">
      <div className="recipe-search-header">
        <h3>
          <ChefHat size={24} />
          Find Recipes
        </h3>
      </div>

      <form onSubmit={handleSearch} className="recipe-search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for recipes..."
          className="recipe-search-input"
        />
        <button 
          type="submit" 
          className="recipe-search-button"
          disabled={loading || !searchQuery.trim()}
        >
          <Search size={20} />
          Search
        </button>
      </form>

      {hasSearched && (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <button 
            onClick={resetToRandom}
            className="recipe-search-button"
            style={{ 
              background: 'var(--color-gray-600)',
              fontSize: 'var(--text-sm)',
              padding: 'var(--space-sm) var(--space-md)'
            }}
          >
            Show Random Recipes
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <p>Loading recipes...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && recipes.length === 0 && hasSearched && (
        <div className="empty-state">
          <p>No recipes found. Try a different search term.</p>
        </div>
      )}

      {!loading && !error && recipes.length === 0 && !hasSearched && (
        <div className="loading-state">
          <p>Loading random recipes...</p>
        </div>
      )}

      {recipes.length > 0 && (
        <div className="recipe-results">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="recipe-card"
              onClick={() => onRecipeSelect(recipe.id)}
            >
              <img
                src={recipe.image}
                alt={recipe.title}
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
                    <Clock size={16} />
                    {recipe.readyInMinutes} min
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}