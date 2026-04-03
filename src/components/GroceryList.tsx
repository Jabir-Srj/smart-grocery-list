import { memo, useMemo, useState, useCallback } from 'react';
import { ShoppingBag, Trash2, CheckCircle } from 'lucide-react';
import { GroceryItem } from '../types';
import { GroceryItemComponent } from './GroceryItemComponent';
import { ExportButtons } from './ExportButtons';
import { SearchBar } from './SearchBar';
import { groupItemsByCategory, getCompletionPercentage, formatCurrency, calculateTotalCost } from '../utils/groceryUtils';
import { useDragAndDrop } from '../hooks/useFeatures';
import './GroceryList.css';

interface GroceryListProps {
  items: GroceryItem[];
  onToggleCompletion: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<GroceryItem>) => void;
  onRemoveItem: (id: string) => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  onReorderItems?: (items: GroceryItem[]) => void;
  budget?: number;
  shoppingList?: any;
}

export const GroceryList = memo(function GroceryList({
  items,
  onToggleCompletion,
  onUpdateItem,
  onRemoveItem,
  onClearCompleted,
  onClearAll,
  onReorderItems,
  budget,
  shoppingList
}: GroceryListProps) {
  // Memoize computed values
  const groupedItems = useMemo(() => groupItemsByCategory(items), [items]);
  const completionPercentage = useMemo(() => getCompletionPercentage(items), [items]);
  const totalCost = useMemo(() => calculateTotalCost(items), [items]);
  const completedItems = useMemo(() => items.filter(item => item.isCompleted), [items]);
  const isOverBudget = budget && totalCost > budget;

  // Search state
  const [searchResults, setSearchResults] = useState<GroceryItem[]>(items);

  // Drag and drop
  const { draggedId, handlers } = useDragAndDrop(items, (reordered) => {
    if (onReorderItems) onReorderItems(reordered);
  });

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = 'move';
    handlers.handleDragStart(id);
  }, [handlers]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    handlers.handleDragOver(e);
  }, [handlers]);

  const handleDrop = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    handlers.handleDrop(id);
  }, [handlers]);

  const handleDragEnd = useCallback(() => {
    handlers.handleDragEnd();
  }, [handlers]);

  // Determine which items to display (search results or all items)
  const displayedItems = searchResults;

  // Group displayed items by category
  const groupedDisplayedItems = useMemo(
    () => groupItemsByCategory(displayedItems),
    [displayedItems]
  );

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
        <div className="list-controls" role="group" aria-label="List controls">
          <div className="list-actions-left">
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

          {shoppingList && (
            <div className="list-actions-right">
              <ExportButtons shoppingList={shoppingList} />
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar items={items} onSearchResults={setSearchResults} />

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

      {/* No search results message */}
      {searchResults.length === 0 && items.length > 0 && (
        <div className="no-search-results" role="status" aria-live="polite">
          <p>No items match your search.</p>
        </div>
      )}

      {/* Categorized Items */}
      <div className="categorized-items">
        {Object.entries(groupedDisplayedItems).map(([category, categoryItems]) => {
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
                    isDragging={draggedId === item.id}
                    isDragOver={false}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
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
