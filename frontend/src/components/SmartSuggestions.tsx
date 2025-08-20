import { Plus, Sparkles } from 'lucide-react';
import { GroceryItem } from '../types';
import { formatCurrency } from '../utils/groceryUtils';
import './SmartSuggestions.css';

interface SmartSuggestionsProps {
  suggestions: GroceryItem[];
  onAddSuggestion: (suggestion: GroceryItem) => void;
}

export function SmartSuggestions({ suggestions, onAddSuggestion }: SmartSuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="smart-suggestions">
      <div className="suggestions-header">
        <Sparkles size={20} />
        <h3>Smart Suggestions</h3>
        <span className="suggestions-count">{suggestions.length}</span>
      </div>
      
      <div className="suggestions-list">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="suggestion-item">
            <div className="suggestion-details">
              <div className="suggestion-name">{suggestion.name}</div>
              <div className="suggestion-meta">
                <span className="suggestion-category">{suggestion.category}</span>
                <span className="suggestion-quantity">
                  {suggestion.quantity} {suggestion.unit}
                </span>
                {suggestion.price && (
                  <span className="suggestion-price">
                    {formatCurrency(suggestion.price * suggestion.quantity)}
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={() => onAddSuggestion(suggestion)}
              className="add-suggestion-button"
              title="Add to list"
            >
              <Plus size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}