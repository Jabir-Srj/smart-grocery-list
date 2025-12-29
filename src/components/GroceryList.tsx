import { memo, useMemo } from 'react';
import { ShoppingBag, Trash2, CheckCircle } from 'lucide-react';
import { GroceryItem } from '../types';
import { GroceryItemComponent } from './GroceryItemComponent';
import { groupItemsByCategory, getCompletionPercentage, formatCurrency, calculateTotalCost } from '../utils/groceryUtils';
import './GroceryList.css';

interface GroceryListProps {
  items: GroceryItem[];
  onToggleCompletion: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<GroceryItem>) => void;
  onRemoveItem: (id: string) => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  budget?: number;
}

export const GroceryList = memo(function GroceryList({
  items,
  onToggleCompletion,
  onUpdateItem,
  onRemoveItem,
  onClearCompleted,
  onClearAll,
  budget
}: GroceryListProps) {
  // Memoize computed values
  const groupedItems = useMemo(() => groupItemsByCategory(items), [items]);
  const completionPercentage = useMemo(() => getCompletionPercentage(items), [items]);
  const totalCost = useMemo(() => calculateTotalCost(items), [items]);
  const completedItems = useMemo(() => items.filter(item => item.isCompleted), [items]);
  const isOverBudget = budget && totalCost > budget;

  if (items.length === 0) {
    return (
      <div className="empty-list" role="status" aria-label="Empty grocery list">
        <ShoppingBag size={48} aria-hidden="true" />
        <h3>Your grocery list is empty</h3>
        <p>Start adding items to create your smart grocery list!</p>
      </div>
    );
  }

  return (
    <section className="grocery-list" aria-labelledby="grocery-list-heading">
      <h2 id="grocery-list-heading" className="sr-only">Grocery List</h2>
      
      {/* Summary Header */}
      <div className="list-summary" role="region" aria-label="Shopping summary">
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-value" aria-label={`${items.length} items`}>
              {items.length}
            </span>
            <span className="stat-label">Items</span>
          </div>
          <div className="stat">
            <span className="stat-value" aria-label={`${completionPercentage}% complete`}>
              {completionPercentage}%
            </span>
            <span className="stat-label">Complete</span>
          </div>
          <div className="stat">
            <span 
              className={`stat-value ${isOverBudget ? 'over-budget' : ''}`}
              aria-label={`Total cost: ${formatCurrency(totalCost)}${isOverBudget ? ', over budget' : ''}`}
            >
              {formatCurrency(totalCost)}
            </span>
            <span className="stat-label">
              {budget ? `of ${formatCurrency(budget)}` : 'Total'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container" role="progressbar" aria-valuenow={completionPercentage} aria-valuemin={0} aria-valuemax={100} aria-label="Shopping progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="progress-text">
            {completedItems.length} of {items.length} completed
          </span>
        </div>

        {/* Action Buttons */}
        <div className="list-actions" role="group" aria-label="List actions">
          {completedItems.length > 0 && (
            <button 
              onClick={onClearCompleted} 
              className="action-btn clear-completed"
              aria-label={`Clear ${completedItems.length} completed items`}
              type="button"
            >
              <CheckCircle size={16} aria-hidden="true" />
              Clear Completed ({completedItems.length})
            </button>
          )}
          <button 
            onClick={onClearAll} 
            className="action-btn clear-all"
            aria-label="Clear all items from list"
            type="button"
          >
            <Trash2 size={16} aria-hidden="true" />
            Clear All
          </button>
        </div>
      </div>

      {/* Budget Warning */}
      {isOverBudget && (
        <div 
          className="budget-warning" 
          role="alert" 
          aria-live="polite"
        >
          <strong>Over Budget!</strong> You're {formatCurrency(totalCost - budget!)} over your budget of {formatCurrency(budget!)}.
        </div>
      )}

      {/* Categorized Items */}
      <div className="categorized-items">
        {Object.entries(groupedItems).map(([category, categoryItems]) => {
          if (categoryItems.length === 0) return null;
          
          const completedInCategory = categoryItems.filter(item => item.isCompleted).length;
          const categoryProgress = Math.round((completedInCategory / categoryItems.length) * 100);

          return (
            <section 
              key={category} 
              className="category-section"
              aria-labelledby={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
            >
              <div className="category-header">
                <h3 
                  className="category-title"
                  id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {category}
                </h3>
                <div className="category-meta">
                  <span className="category-count" aria-label={`${categoryItems.length} items in ${category}`}>
                    {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                  </span>
                  <span 
                    className="category-progress"
                    aria-label={`${categoryProgress}% of ${category} items completed`}
                  >
                    {categoryProgress}%
                  </span>
                </div>
              </div>
              
              <div className="category-items" role="list" aria-label={`${category} items`}>
                {categoryItems.map(item => (
                  <GroceryItemComponent
                    key={item.id}
                    item={item}
                    onToggleCompletion={onToggleCompletion}
                    onUpdateItem={onUpdateItem}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
});
