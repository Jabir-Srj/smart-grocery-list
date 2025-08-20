import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { recipeService } from '../services/recipeService';

// Mock fetch globally
globalThis.fetch = vi.fn();
const mockedFetch = fetch as Mock;

describe('RecipeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchRecipes', () => {
    it('should return recipes when API call is successful', async () => {
      const mockResponse = {
        meals: [
          {
            idMeal: '1',
            strMeal: 'Chicken Curry',
            strMealThumb: 'https://example.com/image.jpg'
          }
        ]
      };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const results = await recipeService.searchRecipes('chicken');
      
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        id: '1',
        title: 'Chicken Curry',
        image: 'https://example.com/image.jpg',
        readyInMinutes: 30
      });
    });

    it('should return empty array when no recipes found', async () => {
      const mockResponse = { meals: null };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const results = await recipeService.searchRecipes('nonexistent');
      expect(results).toEqual([]);
    });

    it('should handle API errors gracefully and return fallback data', async () => {
      mockedFetch.mockRejectedValueOnce(new Error('Network error'));

      const results = await recipeService.searchRecipes('chicken');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('title');
      expect(results[0]).toHaveProperty('id');
      expect(results[0]).toHaveProperty('image');
      expect(results[0]).toHaveProperty('readyInMinutes');
    });
  });

  describe('getRecipeById', () => {
    it('should return formatted recipe when API call is successful', async () => {
      const mockResponse = {
        meals: [
          {
            idMeal: '1',
            strMeal: 'Chicken Curry',
            strMealThumb: 'https://example.com/image.jpg',
            strInstructions: 'Cook the chicken...',
            strIngredient1: 'Chicken',
            strIngredient2: 'Curry Powder',
            strIngredient3: '',
            strMeasure1: '1 lb',
            strMeasure2: '2 tbsp',
            strMeasure3: ''
          }
        ]
      };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const recipe = await recipeService.getRecipeById('1');
      
      expect(recipe).toEqual({
        id: '1',
        name: 'Chicken Curry',
        ingredients: [
          { name: 'Chicken', quantity: 1, unit: 'lbs' },
          { name: 'Curry Powder', quantity: 2, unit: 'tbsp' }
        ],
        servings: 4,
        image: 'https://example.com/image.jpg',
        instructions: 'Cook the chicken...',
        readyInMinutes: 30,
        sourceUrl: 'https://www.themealdb.com/meal/1'
      });
    });

    it('should return null when recipe not found', async () => {
      const mockResponse = { meals: null };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const recipe = await recipeService.getRecipeById('999');
      expect(recipe).toBeNull();
    });

    it('should handle API errors gracefully and return fallback for mock IDs', async () => {
      mockedFetch.mockRejectedValueOnce(new Error('Network error'));

      const recipe = await recipeService.getRecipeById('mock-1');
      expect(recipe).not.toBeNull();
      expect(recipe?.name).toBe('Spaghetti Carbonara');
    });
  });
});