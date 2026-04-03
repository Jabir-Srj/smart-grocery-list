import React, { memo } from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import './UndoRedoButtons.css';

interface UndoRedoButtonsProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const UndoRedoButtons = memo(function UndoRedoButtons({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: UndoRedoButtonsProps) {
  return (
    <div className="undo-redo-buttons">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="undo-redo-btn undo-btn"
        title="Undo (Ctrl+Z)"
        aria-label="Undo last action"
        type="button"
      >
        <RotateCcw size={18} aria-hidden="true" />
        <span className="sr-only">Undo</span>
      </button>

      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="undo-redo-btn redo-btn"
        title="Redo (Ctrl+Y)"
        aria-label="Redo last undone action"
        type="button"
      >
        <RotateCw size={18} aria-hidden="true" />
        <span className="sr-only">Redo</span>
      </button>
    </div>
  );
});
