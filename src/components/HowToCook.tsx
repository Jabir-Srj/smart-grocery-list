import { memo } from 'react';
import { ArrowLeft, Clock, Users, List, ExternalLink, ChefHat } from 'lucide-react';
import { Recipe } from '../types';
import './HowToCook.css';

interface HowToCookProps {
  recipe: Recipe;
  addedIngredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  onBackToList: () => void;
}

export const HowToCook = memo(function HowToCook({ recipe, addedIngredients, onBackToList }: HowToCookProps) {
  return (
    <div className="how-to-cook">
      <header className="how-to-cook-header">
        <div className="header-content">
          <button 
            onClick={onBackToList} 
            className="back-button"
            aria-label="Go back to grocery list"
            type="button"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            Back to Grocery List
          </button>
          <div className="header-title">
            <ChefHat size={24} aria-hidden="true" />
            <h1>How to Cook</h1>
          </div>
        </div>
      </header>

      <main className="how-to-cook-main" id="main-content">
        <div className="container">
          <article className="recipe-header" aria-labelledby="recipe-title">
            {recipe.image && (
              <img
                src={recipe.image}
                alt=""
                className="recipe-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            
            <div className="recipe-info">
              <h2 className="recipe-title" id="recipe-title">{recipe.name}</h2>
              
              <div className="recipe-meta">
                {recipe.readyInMinutes && (
                  <span className="meta-item">
                    <Clock size={16} aria-hidden="true" />
                    <span aria-label={`Ready in ${recipe.readyInMinutes} minutes`}>
                      {recipe.readyInMinutes} minutes
                    </span>
                  </span>
                )}
                <span className="meta-item">
                  <Users size={16} aria-hidden="true" />
                  <span aria-label={`Serves ${recipe.servings}`}>
                    {recipe.servings} servings
                  </span>
                </span>
              </div>
              
              {recipe.sourceUrl && (
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  aria-label="View original recipe on external site"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  View Original Recipe
                </a>
              )}
            </div>
          </article>

          <div className="recipe-content">
            <section 
              className="ingredients-section" 
              aria-labelledby="ingredients-section-title"
            >
              <h3 className="section-title" id="ingredients-section-title">
                <List size={20} aria-hidden="true" />
                Ingredients Added to Your List ({addedIngredients.length})
              </h3>
              <div className="ingredients-grid" role="list" aria-label="Added ingredients">
                {addedIngredients.map((ingredient, index) => (
                  <div 
                    key={index} 
                    className="ingredient-card"
                    role="listitem"
                  >
                    <div className="ingredient-name">{ingredient.name}</div>
                    <div className="ingredient-amount" aria-label={`${ingredient.quantity} ${ingredient.unit}`}>
                      {ingredient.quantity} {ingredient.unit}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {recipe.instructions && (
              <section 
                className="instructions-section"
                aria-labelledby="instructions-section-title"
              >
                <h3 className="section-title" id="instructions-section-title">
                  <ChefHat size={20} aria-hidden="true" />
                  Cooking Instructions
                </h3>
                <ol className="instructions-content" aria-label="Step by step cooking instructions">
                  {recipe.instructions.split('\n')
                    .filter(step => step.trim() !== '')
                    .map((step, index) => (
                      <li key={index} className="instruction-step">
                        <span className="step-number" aria-hidden="true">{index + 1}</span>
                        <span className="step-text">{step.trim()}</span>
                      </li>
                    ))}
                </ol>
              </section>
            )}
          </div>

          <div className="cooking-actions">
            <button 
              onClick={onBackToList} 
              className="btn-primary full-width"
              type="button"
            >
              Return to Grocery List
            </button>
          </div>
        </div>
      </main>
    </div>
  );
});
