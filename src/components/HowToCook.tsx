import React from 'react';
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

export function HowToCook({ recipe, addedIngredients, onBackToList }: HowToCookProps) {
  return (
    <div className="how-to-cook">
      <header className="how-to-cook-header">
        <div className="header-content">
          <button onClick={onBackToList} className="back-button">
            <ArrowLeft size={20} />
            Back to Grocery List
          </button>
          <div className="header-title">
            <ChefHat size={24} />
            <h1>How to Cook</h1>
          </div>
        </div>
      </header>

      <main className="how-to-cook-main">
        <div className="container">
          <div className="recipe-header">
            {recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.name}
                className="recipe-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            
            <div className="recipe-info">
              <h2 className="recipe-title">{recipe.name}</h2>
              
              <div className="recipe-meta">
                {recipe.readyInMinutes && (
                  <span className="meta-item">
                    <Clock size={16} />
                    {recipe.readyInMinutes} minutes
                  </span>
                )}
                <span className="meta-item">
                  <Users size={16} />
                  {recipe.servings} servings
                </span>
              </div>
              
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

          <div className="recipe-content">
            <div className="ingredients-section">
              <h3 className="section-title">
                <List size={20} />
                Ingredients Added to Your List ({addedIngredients.length})
              </h3>
              <div className="ingredients-grid">
                {addedIngredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-card">
                    <div className="ingredient-name">{ingredient.name}</div>
                    <div className="ingredient-amount">
                      {ingredient.quantity} {ingredient.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {recipe.instructions && (
              <div className="instructions-section">
                <h3 className="section-title">
                  <ChefHat size={20} />
                  Cooking Instructions
                </h3>
                <div className="instructions-content">
                  {recipe.instructions.split('\n')
                    .filter(step => step.trim() !== '')
                    .map((step, index) => (
                      <div key={index} className="instruction-step">
                        <div className="step-number">{index + 1}</div>
                        <div className="step-text">{step.trim()}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="cooking-actions">
            <button onClick={onBackToList} className="btn-primary full-width">
              Return to Grocery List
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}