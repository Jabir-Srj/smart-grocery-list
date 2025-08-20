import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { GroceryCategory } from '../types';
import './AddItemForm.css';

interface AddItemFormProps {
  onAddItem: (name: string, quantity: number, unit: string, price?: number, category?: GroceryCategory) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const UNITS = ['pcs', 'lbs', 'oz', 'kg', 'g', 'gallon', 'liter', 'dozen', 'package', 'bag'];

export function AddItemForm({ onAddItem, isExpanded, onToggleExpanded }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<GroceryCategory | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddItem(
        name.trim(),
        quantity,
        unit,
        price ? parseFloat(price) : undefined,
        category || undefined
      );
      setName('');
      setQuantity(1);
      setPrice('');
      setCategory('');
    }
  };

  return (
    <div className="add-item-form">
      <div className="quick-add">
        <form onSubmit={handleSubmit} className="quick-add-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add item..."
            className="quick-input"
          />
          <button type="submit" className="add-button" disabled={!name.trim()}>
            <Plus size={20} />
          </button>
        </form>
        <button
          type="button"
          onClick={onToggleExpanded}
          className={`expand-button ${isExpanded ? 'expanded' : ''}`}
        >
          {isExpanded ? 'Simple' : 'Detailed'}
        </button>
      </div>

      {isExpanded && (
        <div className="detailed-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                min="0.1"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="unit">Unit</label>
              <select
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="form-select"
              >
                {UNITS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as GroceryCategory)}
                className="form-select"
              >
                <option value="">Auto-detect</option>
                {Object.values(GroceryCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}