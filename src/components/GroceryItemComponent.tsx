import { useState, useCallback, memo } from 'react';
import { Check, Edit2, Trash2, Save, X } from 'lucide-react';
import { GroceryItem, GroceryCategory } from '../types';
import { formatCurrency } from '../utils/groceryUtils';
import './GroceryItemComponent.css';

interface GroceryItemProps {
  item: GroceryItem;
  onToggleCompletion: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<GroceryItem>) => void;
  onRemoveItem: (id: string) => void;
}

const UNITS = ['pcs', 'lbs', 'oz', 'kg', 'g', 'gallon', 'liter', 'dozen', 'package', 'bag'];

export const GroceryItemComponent = memo(function GroceryItemComponent({ 
  item, 
  onToggleCompletion, 
  onUpdateItem, 
  onRemoveItem 
}: GroceryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
    price: item.price?.toString() || '',
    category: item.category,
    notes: item.notes || ''
  });

  const handleSave = useCallback(() => {
    onUpdateItem(item.id, {
      name: editForm.name.trim(),
      quantity: editForm.quantity,
      unit: editForm.unit,
      price: editForm.price ? parseFloat(editForm.price) : undefined,
      category: editForm.category,
      notes: editForm.notes.trim() || undefined
    });
    setIsEditing(false);
  }, [item.id, editForm, onUpdateItem]);

  const handleCancel = useCallback(() => {
    setEditForm({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price?.toString() || '',
      category: item.category,
      notes: item.notes || ''
    });
    setIsEditing(false);
  }, [item]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  const handleToggle = useCallback(() => {
    onToggleCompletion(item.id);
  }, [item.id, onToggleCompletion]);

  const handleRemove = useCallback(() => {
    onRemoveItem(item.id);
  }, [item.id, onRemoveItem]);

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const totalPrice = item.price ? item.price * item.quantity : 0;

  if (isEditing) {
    return (
      <div 
        className="grocery-item editing"
        role="form"
        aria-label={`Edit ${item.name}`}
      >
        <div className="item-content">
          <div className="edit-form">
            <div className="edit-row">
              <label htmlFor={`name-${item.id}`} className="sr-only">Item name</label>
              <input
                id={`name-${item.id}`}
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                onKeyDown={handleKeyDown}
                className="edit-input name-input"
                placeholder="Item name"
                autoFocus
              />
            </div>
            
            <div className="edit-row">
              <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity</label>
              <input
                id={`quantity-${item.id}`}
                type="number"
                min="0.1"
                step="0.1"
                value={editForm.quantity}
                onChange={(e) => setEditForm(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 1 }))}
                onKeyDown={handleKeyDown}
                className="edit-input quantity-input"
                aria-label="Quantity"
              />
              <label htmlFor={`unit-${item.id}`} className="sr-only">Unit</label>
              <select
                id={`unit-${item.id}`}
                value={editForm.unit}
                onChange={(e) => setEditForm(prev => ({ ...prev, unit: e.target.value }))}
                className="edit-select"
                aria-label="Unit"
              >
                {UNITS.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              <label htmlFor={`price-${item.id}`} className="sr-only">Price</label>
              <input
                id={`price-${item.id}`}
                type="number"
                min="0"
                step="0.01"
                value={editForm.price}
                onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                onKeyDown={handleKeyDown}
                className="edit-input price-input"
                placeholder="Price"
                aria-label="Price in dollars"
              />
            </div>

            <div className="edit-row">
              <label htmlFor={`category-${item.id}`} className="sr-only">Category</label>
              <select
                id={`category-${item.id}`}
                value={editForm.category}
                onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value as GroceryCategory }))}
                className="edit-select category-select"
                aria-label="Category"
              >
                {Object.values(GroceryCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="edit-row">
              <label htmlFor={`notes-${item.id}`} className="sr-only">Notes</label>
              <input
                id={`notes-${item.id}`}
                type="text"
                value={editForm.notes}
                onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                onKeyDown={handleKeyDown}
                className="edit-input notes-input"
                placeholder="Notes (optional)"
                aria-label="Notes"
              />
            </div>
          </div>
          
          <div className="item-actions" role="group" aria-label="Edit actions">
            <button 
              onClick={handleSave} 
              className="action-button save"
              aria-label="Save changes"
              type="button"
            >
              <Save size={16} aria-hidden="true" />
            </button>
            <button 
              onClick={handleCancel} 
              className="action-button cancel"
              aria-label="Cancel editing"
              type="button"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`grocery-item ${item.isCompleted ? 'completed' : ''}`}
      role="listitem"
      aria-label={`${item.name}, ${item.quantity} ${item.unit}${item.isCompleted ? ', completed' : ''}`}
    >
      <div className="item-content">
        <button
          onClick={handleToggle}
          className={`completion-button ${item.isCompleted ? 'completed' : ''}`}
          aria-label={item.isCompleted ? `Mark ${item.name} as not completed` : `Mark ${item.name} as completed`}
          aria-pressed={item.isCompleted}
          type="button"
        >
          {item.isCompleted && <Check size={16} aria-hidden="true" />}
        </button>
        
        <div className="item-details">
          <div className="item-main">
            <span className="item-name">{item.name}</span>
            <span className="item-quantity" aria-label={`Quantity: ${item.quantity} ${item.unit}`}>
              {item.quantity} {item.unit}
            </span>
          </div>
          
          <div className="item-meta">
            <span className="item-category">{item.category}</span>
            {totalPrice > 0 && (
              <span className="item-price" aria-label={`Price: ${formatCurrency(totalPrice)}`}>
                {formatCurrency(totalPrice)}
              </span>
            )}
          </div>
          
          {item.notes && (
            <div className="item-notes" aria-label={`Notes: ${item.notes}`}>
              {item.notes}
            </div>
          )}
        </div>
        
        <div className="item-actions" role="group" aria-label="Item actions">
          <button
            onClick={handleStartEdit}
            className="action-button edit"
            title="Edit item"
            aria-label={`Edit ${item.name}`}
            type="button"
          >
            <Edit2 size={16} aria-hidden="true" />
          </button>
          <button
            onClick={handleRemove}
            className="action-button delete"
            title="Delete item"
            aria-label={`Delete ${item.name}`}
            type="button"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
});
