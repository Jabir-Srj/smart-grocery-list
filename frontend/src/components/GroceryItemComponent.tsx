import { useState } from 'react';
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

export function GroceryItemComponent({ 
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

  const handleSave = () => {
    onUpdateItem(item.id, {
      name: editForm.name.trim(),
      quantity: editForm.quantity,
      unit: editForm.unit,
      price: editForm.price ? parseFloat(editForm.price) : undefined,
      category: editForm.category,
      notes: editForm.notes.trim() || undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price?.toString() || '',
      category: item.category,
      notes: item.notes || ''
    });
    setIsEditing(false);
  };

  const totalPrice = item.price ? item.price * item.quantity : 0;

  if (isEditing) {
    return (
      <div className="grocery-item editing">
        <div className="item-content">
          <div className="edit-form">
            <div className="edit-row">
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="edit-input name-input"
                placeholder="Item name"
              />
            </div>
            
            <div className="edit-row">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={editForm.quantity}
                onChange={(e) => setEditForm(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 1 }))}
                className="edit-input quantity-input"
              />
              <select
                value={editForm.unit}
                onChange={(e) => setEditForm(prev => ({ ...prev, unit: e.target.value }))}
                className="edit-select"
              >
                {UNITS.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editForm.price}
                onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                className="edit-input price-input"
                placeholder="Price"
              />
            </div>

            <div className="edit-row">
              <select
                value={editForm.category}
                onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value as GroceryCategory }))}
                className="edit-select category-select"
              >
                {Object.values(GroceryCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="edit-row">
              <input
                type="text"
                value={editForm.notes}
                onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                className="edit-input notes-input"
                placeholder="Notes (optional)"
              />
            </div>
          </div>
          
          <div className="item-actions">
            <button onClick={handleSave} className="action-button save">
              <Save size={16} />
            </button>
            <button onClick={handleCancel} className="action-button cancel">
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`grocery-item ${item.isCompleted ? 'completed' : ''}`}>
      <div className="item-content">
        <button
          onClick={() => onToggleCompletion(item.id)}
          className={`completion-button ${item.isCompleted ? 'completed' : ''}`}
        >
          {item.isCompleted && <Check size={16} />}
        </button>
        
        <div className="item-details">
          <div className="item-main">
            <span className="item-name">{item.name}</span>
            <span className="item-quantity">
              {item.quantity} {item.unit}
            </span>
          </div>
          
          <div className="item-meta">
            <span className="item-category">{item.category}</span>
            {totalPrice > 0 && (
              <span className="item-price">{formatCurrency(totalPrice)}</span>
            )}
          </div>
          
          {item.notes && (
            <div className="item-notes">{item.notes}</div>
          )}
        </div>
        
        <div className="item-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="action-button edit"
            title="Edit item"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onRemoveItem(item.id)}
            className="action-button delete"
            title="Delete item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}