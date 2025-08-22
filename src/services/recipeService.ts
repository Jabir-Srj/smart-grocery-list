import { Recipe, RecipeSearchResult } from '../types';

// Using TheMealDB API - a free recipe database
const MEAL_DB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Fallback mock data for when API is unavailable
const MOCK_RECIPES: RecipeSearchResult[] = [
  {
    id: 'mock-1',
    title: 'Spaghetti Carbonara',
    image: 'https://via.placeholder.com/300x200/4CAF50/white?text=Spaghetti+Carbonara',
    readyInMinutes: 25
  },
  {
    id: 'mock-2',
    title: 'Chicken Stir Fry',
    image: 'https://via.placeholder.com/300x200/FF9800/white?text=Chicken+Stir+Fry',
    readyInMinutes: 20
  },
  {
    id: 'mock-3',
    title: 'Caesar Salad',
    image: 'https://via.placeholder.com/300x200/2196F3/white?text=Caesar+Salad',
    readyInMinutes: 15
  },
  {
    id: 'mock-4',
    title: 'Beef Tacos',
    image: 'https://via.placeholder.com/300x200/E91E63/white?text=Beef+Tacos',
    readyInMinutes: 30
  },
  {
    id: 'mock-5',
    title: 'Vegetable Soup',
    image: 'https://via.placeholder.com/300x200/8BC34A/white?text=Vegetable+Soup',
    readyInMinutes: 40
  },
  {
    id: 'mock-6',
    title: 'Grilled Salmon',
    image: 'https://via.placeholder.com/300x200/FF5722/white?text=Grilled+Salmon',
    readyInMinutes: 18
  }
];

const MOCK_RECIPE_DETAILS: Record<string, Recipe> = {
  'mock-1': {
    id: 'mock-1',
    name: 'Spaghetti Carbonara',
    ingredients: [
      { name: 'Spaghetti', quantity: 1, unit: 'lbs' },
      { name: 'Bacon', quantity: 6, unit: 'oz' },
      { name: 'Eggs', quantity: 3, unit: 'pcs' },
      { name: 'Parmesan Cheese', quantity: 1, unit: 'cup' },
      { name: 'Black Pepper', quantity: 1, unit: 'tsp' },
      { name: 'Salt', quantity: 1, unit: 'tsp' }
    ],
    servings: 4,
    image: 'https://via.placeholder.com/300x200/4CAF50/white?text=Spaghetti+Carbonara',
    instructions: '1. Cook spaghetti according to package directions.\n2. Cook bacon until crispy.\n3. Beat eggs with cheese and pepper.\n4. Combine hot pasta with bacon and egg mixture.\n5. Serve immediately.',
    readyInMinutes: 25,
    sourceUrl: 'https://example.com/carbonara'
  },
  'mock-2': {
    id: 'mock-2',
    name: 'Chicken Stir Fry',
    ingredients: [
      { name: 'Chicken Breast', quantity: 1, unit: 'lbs' },
      { name: 'Bell Peppers', quantity: 2, unit: 'pcs' },
      { name: 'Broccoli', quantity: 1, unit: 'cup' },
      { name: 'Soy Sauce', quantity: 3, unit: 'tbsp' },
      { name: 'Garlic', quantity: 3, unit: 'pcs' },
      { name: 'Ginger', quantity: 1, unit: 'tbsp' },
      { name: 'Vegetable Oil', quantity: 2, unit: 'tbsp' }
    ],
    servings: 4,
    image: 'https://via.placeholder.com/300x200/FF9800/white?text=Chicken+Stir+Fry',
    instructions: '1. Cut chicken into strips.\n2. Heat oil in wok or large pan.\n3. Cook chicken until done.\n4. Add vegetables and stir fry.\n5. Add sauce and cook until heated through.',
    readyInMinutes: 20,
    sourceUrl: 'https://example.com/stir-fry'
  },
  'mock-3': {
    id: 'mock-3',
    name: 'Caesar Salad',
    ingredients: [
      { name: 'Romaine Lettuce', quantity: 2, unit: 'pcs' },
      { name: 'Parmesan Cheese', quantity: 0.5, unit: 'cup' },
      { name: 'Croutons', quantity: 1, unit: 'cup' },
      { name: 'Caesar Dressing', quantity: 0.25, unit: 'cup' },
      { name: 'Anchovies', quantity: 4, unit: 'pcs' }
    ],
    servings: 4,
    image: 'https://via.placeholder.com/300x200/2196F3/white?text=Caesar+Salad',
    instructions: '1. Wash and chop romaine lettuce.\n2. Toss lettuce with dressing.\n3. Add parmesan cheese and croutons.\n4. Top with anchovies if desired.',
    readyInMinutes: 15,
    sourceUrl: 'https://example.com/caesar-salad'
  },
  'mock-4': {
    id: 'mock-4',
    name: 'Beef Tacos',
    ingredients: [
      { name: 'Ground Beef', quantity: 1, unit: 'lbs' },
      { name: 'Taco Shells', quantity: 8, unit: 'pcs' },
      { name: 'Lettuce', quantity: 1, unit: 'cup' },
      { name: 'Tomatoes', quantity: 2, unit: 'pcs' },
      { name: 'Cheddar Cheese', quantity: 1, unit: 'cup' },
      { name: 'Sour Cream', quantity: 0.5, unit: 'cup' },
      { name: 'Taco Seasoning', quantity: 1, unit: 'package' },
      { name: 'Onion', quantity: 1, unit: 'pcs' }
    ],
    servings: 4,
    image: 'https://via.placeholder.com/300x200/E91E63/white?text=Beef+Tacos',
    instructions: '1. Brown ground beef in a large skillet.\n2. Add diced onion and cook until tender.\n3. Add taco seasoning and water according to package directions.\n4. Simmer until thickened.\n5. Warm taco shells in oven.\n6. Fill shells with beef mixture.\n7. Top with lettuce, tomatoes, cheese, and sour cream.',
    readyInMinutes: 30,
    sourceUrl: 'https://example.com/beef-tacos'
  },
  'mock-5': {
    id: 'mock-5',
    name: 'Vegetable Soup',
    ingredients: [
      { name: 'Carrots', quantity: 3, unit: 'pcs' },
      { name: 'Celery', quantity: 3, unit: 'pcs' },
      { name: 'Onion', quantity: 1, unit: 'pcs' },
      { name: 'Potatoes', quantity: 2, unit: 'pcs' },
      { name: 'Green Beans', quantity: 1, unit: 'cup' },
      { name: 'Vegetable Broth', quantity: 6, unit: 'cup' },
      { name: 'Diced Tomatoes', quantity: 1, unit: 'can' },
      { name: 'Italian Seasoning', quantity: 1, unit: 'tsp' }
    ],
    servings: 6,
    image: 'https://via.placeholder.com/300x200/8BC34A/white?text=Vegetable+Soup',
    instructions: '1. Dice all vegetables.\n2. Heat oil in large pot.\n3. Sauté onion, carrots, and celery until tender.\n4. Add potatoes, green beans, broth, and tomatoes.\n5. Add seasoning and bring to boil.\n6. Reduce heat and simmer 20-25 minutes until vegetables are tender.\n7. Season with salt and pepper to taste.',
    readyInMinutes: 40,
    sourceUrl: 'https://example.com/vegetable-soup'
  },
  'mock-6': {
    id: 'mock-6',
    name: 'Grilled Salmon',
    ingredients: [
      { name: 'Salmon Fillets', quantity: 4, unit: 'pcs' },
      { name: 'Olive Oil', quantity: 2, unit: 'tbsp' },
      { name: 'Lemon', quantity: 1, unit: 'pcs' },
      { name: 'Garlic', quantity: 2, unit: 'pcs' },
      { name: 'Fresh Dill', quantity: 2, unit: 'tbsp' },
      { name: 'Salt', quantity: 1, unit: 'tsp' },
      { name: 'Black Pepper', quantity: 0.5, unit: 'tsp' }
    ],
    servings: 4,
    image: 'https://via.placeholder.com/300x200/FF5722/white?text=Grilled+Salmon',
    instructions: '1. Preheat grill to medium-high heat.\n2. Brush salmon with olive oil.\n3. Season with salt, pepper, and minced garlic.\n4. Grill 4-6 minutes per side until fish flakes easily.\n5. Squeeze fresh lemon juice over salmon.\n6. Garnish with fresh dill and serve immediately.',
    readyInMinutes: 18,
    sourceUrl: 'https://example.com/grilled-salmon'
  }
};

interface MealDBRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
}

interface MealDBSearchResponse {
  meals: MealDBRecipe[] | null;
}

class RecipeService {
  private parseIngredients(meal: MealDBRecipe): Array<{ name: string; quantity: number; unit: string }> {
    const ingredients = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}` as keyof MealDBRecipe] as string;
      const measure = meal[`strMeasure${i}` as keyof MealDBRecipe] as string;
      
      if (ingredient && ingredient.trim()) {
        const parsedMeasure = this.parseMeasurement(measure || '1');
        ingredients.push({
          name: ingredient.trim(),
          quantity: parsedMeasure.quantity,
          unit: parsedMeasure.unit
        });
      }
    }
    
    return ingredients;
  }

  private parseMeasurement(measure: string): { quantity: number; unit: string } {
    const trimmed = measure.trim();
    
    if (!trimmed || trimmed.toLowerCase() === 'to taste') {
      return { quantity: 1, unit: 'pcs' };
    }

    // Extract number from the beginning of the string
    const numberMatch = trimmed.match(/^(\d+(?:\.\d+)?|\d+\/\d+)/);
    let quantity = 1;
    
    if (numberMatch) {
      const numberStr = numberMatch[1];
      if (numberStr.includes('/')) {
        const [num, den] = numberStr.split('/').map(Number);
        quantity = num / den;
      } else {
        quantity = parseFloat(numberStr);
      }
    }

    // Extract unit
    let unit = trimmed.replace(/^(\d+(?:\.\d+)?|\d+\/\d+)\s*/, '').toLowerCase();
    
    // Normalize common units
    if (unit.includes('cup') || unit.includes('c ')) unit = 'cup';
    else if (unit.includes('tablespoon') || unit.includes('tbsp')) unit = 'tbsp';
    else if (unit.includes('teaspoon') || unit.includes('tsp')) unit = 'tsp';
    else if (unit.includes('pound') || unit.includes('lb')) unit = 'lbs';
    else if (unit.includes('ounce') || unit.includes('oz')) unit = 'oz';
    else if (unit.includes('gram') || unit.includes('g ')) unit = 'g';
    else if (unit.includes('kilogram') || unit.includes('kg')) unit = 'kg';
    else if (unit.includes('liter') || unit.includes('litre') || unit.includes('l ')) unit = 'liter';
    else if (unit.includes('milliliter') || unit.includes('ml')) unit = 'ml';
    else if (!unit || unit.trim() === '') unit = 'pcs';
    else unit = 'pcs'; // Default for unrecognized units
    
    return { quantity, unit };
  }

  async searchRecipes(query: string): Promise<RecipeSearchResult[]> {
    try {
      const response = await fetch(`${MEAL_DB_BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search recipes');
      }
      
      const data: MealDBSearchResponse = await response.json();
      
      if (!data.meals) {
        // If no results from API, search in mock data
        const filteredMockRecipes = MOCK_RECIPES.filter(recipe =>
          recipe.title.toLowerCase().includes(query.toLowerCase())
        );
        return filteredMockRecipes.slice(0, 12);
      }
      
      return data.meals.slice(0, 12).map(meal => ({
        id: meal.idMeal,
        title: meal.strMeal,
        image: meal.strMealThumb,
        readyInMinutes: 30 // TheMealDB doesn't provide cooking time, so we use a default
      }));
    } catch (error) {
      console.error('Error searching recipes:', error);
      // Fallback to mock data
      const filteredMockRecipes = MOCK_RECIPES.filter(recipe =>
        recipe.title.toLowerCase().includes(query.toLowerCase())
      );
      return filteredMockRecipes.slice(0, 12);
    }
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    try {
      // Check if it's a mock recipe first
      if (id.startsWith('mock-') && MOCK_RECIPE_DETAILS[id]) {
        return MOCK_RECIPE_DETAILS[id];
      }

      const response = await fetch(`${MEAL_DB_BASE_URL}/lookup.php?i=${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipe');
      }
      
      const data: MealDBSearchResponse = await response.json();
      
      if (!data.meals || data.meals.length === 0) {
        return null;
      }
      
      const meal = data.meals[0];
      const ingredients = this.parseIngredients(meal);
      
      return {
        id: meal.idMeal,
        name: meal.strMeal,
        ingredients,
        servings: 4, // Default servings as TheMealDB doesn't specify
        image: meal.strMealThumb,
        instructions: meal.strInstructions,
        readyInMinutes: 30,
        sourceUrl: `https://www.themealdb.com/meal/${meal.idMeal}`
      };
    } catch (error) {
      console.error('Error fetching recipe:', error);
      // Fallback to mock data if available
      if (id.startsWith('mock-') && MOCK_RECIPE_DETAILS[id]) {
        return MOCK_RECIPE_DETAILS[id];
      }
      return null;
    }
  }

  async getRandomRecipes(count: number = 6): Promise<RecipeSearchResult[]> {
    try {
      const recipes = [];
      
      // TheMealDB only allows fetching one random recipe at a time
      for (let i = 0; i < Math.min(count, 3); i++) { // Limit to 3 to avoid too many API calls
        const response = await fetch(`${MEAL_DB_BASE_URL}/random.php`);
        
        if (response.ok) {
          const data: MealDBSearchResponse = await response.json();
          
          if (data.meals && data.meals.length > 0) {
            const meal = data.meals[0];
            recipes.push({
              id: meal.idMeal,
              title: meal.strMeal,
              image: meal.strMealThumb,
              readyInMinutes: 30
            });
          }
        }
      }
      
      // Fill remaining slots with mock recipes
      const remainingCount = count - recipes.length;
      if (remainingCount > 0) {
        const shuffledMock = [...MOCK_RECIPES].sort(() => Math.random() - 0.5);
        recipes.push(...shuffledMock.slice(0, remainingCount));
      }
      
      return recipes;
    } catch (error) {
      console.error('Error fetching random recipes:', error);
      // Fallback to shuffled mock recipes
      const shuffledMock = [...MOCK_RECIPES].sort(() => Math.random() - 0.5);
      return shuffledMock.slice(0, count);
    }
  }
}

export const recipeService = new RecipeService();