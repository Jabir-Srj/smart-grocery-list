import { memo, useCallback } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { GroceryItem } from '../types';
import { formatCurrency } from '../utils/groceryUtils';
import './SmartSuggestions.css';

interface SmartSuggestionsProps {
  suggestions: GroceryItem[];
  onAddSuggestion: (suggestion: GroceryItem) => void;
}

export const SmartSuggestions = memo(function SmartSuggestions({ 
  suggestions, 
  onAddSuggestion 
}: SmartSuggestionsProps) {
  const handleAddSuggestion = useCallback((suggestion: GroceryItem) => {
    onAddSuggestion(suggestion);
  }, [onAddSuggestion]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, suggestion: GroceryItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAddSuggestion(suggestion);
    }
  }, [handleAddSuggestion]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <section 
      className="smart-suggestions"
      aria-labelledby="suggestions-heading"
      role="region"
    >
      <div className="suggestions-header">
        <Sparkles size={20} aria-hidden="true" />
        <h3 id="suggestions-heading">Smart Suggestions</h3>
        <span className="suggestions-count" aria-label={`${suggestions.length} suggestions available`}>
          {suggestions.length}
        </span>
      </div>
      
      <ul className="suggestions-list" role="list" aria-label="Suggested items based on your shopping history">
        {suggestions.map((suggestion) => (
          <li 
            key={suggestion.id} 
            className="suggestion-item"
            role="listitem"
          >
            <div className="suggestion-details">
              <div className="suggestion-name">{suggestion.name}</div>
              <div className="suggestion-meta">
                <span className="suggestion-category">{suggestion.category}</span>
                <span 
                  className="suggestion-quantity"
                  aria-label={`${suggestion.quantity} ${suggestion.unit}`}
                >
                  {suggestion.quantity} {suggestion.unit}
                </span>
                {suggestion.price && (
                  <span 
                    className="suggestion-price"
                    aria-label={`Price: ${formatCurrency(suggestion.price * suggestion.quantity)}`}
                  >
                    {formatCurrency(suggestion.price * suggestion.quantity)}
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={() => handleAddSuggestion(suggestion)}
              onKeyDown={(e) => handleKeyDown(e, suggestion)}
              className="add-suggestion-button"
              title={`Add ${suggestion.name} to list`}
              aria-label={`Add ${suggestion.name} to your grocery list`}
              type="button"
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
});
