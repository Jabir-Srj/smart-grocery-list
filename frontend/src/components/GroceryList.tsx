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

export function GroceryList({
  items,
  onToggleCompletion,
  onUpdateItem,
  onRemoveItem,
  onClearCompleted,
  onClearAll,
  budget
}: GroceryListProps) {
  if (items.length === 0) {
    return (
      <div className="empty-list">
        <ShoppingBag size={48} />
        <h3>Your grocery list is empty</h3>
        <p>Start adding items to create your smart grocery list!</p>
      </div>
    );
  }

  const groupedItems = groupItemsByCategory(items);
  const completionPercentage = getCompletionPercentage(items);
  const totalCost = calculateTotalCost(items);
  const completedItems = items.filter(item => item.isCompleted);

  const isOverBudget = budget && totalCost > budget;

  return (
    <div className="grocery-list">
      {/* Summary Header */}
      <div className="list-summary">
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-value">{items.length}</span>
            <span className="stat-label">Items</span>
          </div>
          <div className="stat">
            <span className="stat-value">{completionPercentage}%</span>
            <span className="stat-label">Complete</span>
          </div>
          <div className="stat">
            <span className={`stat-value ${isOverBudget ? 'over-budget' : ''}`}>
              {formatCurrency(totalCost)}
            </span>
            <span className="stat-label">
              {budget ? `of ${formatCurrency(budget)}` : 'Total'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
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
        <div className="list-actions">
          {completedItems.length > 0 && (
            <button onClick={onClearCompleted} className="action-btn clear-completed">
              <CheckCircle size={16} />
              Clear Completed ({completedItems.length})
            </button>
          )}
          <button onClick={onClearAll} className="action-btn clear-all">
            <Trash2 size={16} />
            Clear All
          </button>
        </div>
      </div>

      {/* Budget Warning */}
      {isOverBudget && (
        <div className="budget-warning">
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
            <div key={category} className="category-section">
              <div className="category-header">
                <h4 className="category-title">{category}</h4>
                <div className="category-meta">
                  <span className="category-count">
                    {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                  </span>
                  <span className="category-progress">{categoryProgress}%</span>
                </div>
              </div>
              
              <div className="category-items">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}