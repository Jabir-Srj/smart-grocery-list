import React, { memo, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../hooks/useFeatures';
import { GroceryItem } from '../types';
import './SearchBar.css';

interface SearchBarProps {
  items: GroceryItem[];
  onSearchResults: (results: GroceryItem[]) => void;
}

export const SearchBar = memo(function SearchBar({
  items,
  onSearchResults,
}: SearchBarProps) {
  const { query, results, handleSearch } = useSearch(
    items,
    ['name', 'category'],
    300
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearch(value);
    onSearchResults(value ? results : items);
  }, [handleSearch, results, items, onSearchResults]);

  const handleClear = useCallback(() => {
    handleSearch('');
    onSearchResults(items);
  }, [handleSearch, items, onSearchResults]);

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <Search size={20} className="search-icon" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search items by name or category..."
          className="search-input"
          aria-label="Search grocery items"
          title="Search by item name or category"
        />
        {query && (
          <button
            onClick={handleClear}
            className="search-clear"
            aria-label="Clear search"
            title="Clear search"
            type="button"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>
      {query && (
        <div className="search-results-info" role="status" aria-live="polite">
          Found {results.length} item{results.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
});
