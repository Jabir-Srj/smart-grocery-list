import { useState, useMemo, useCallback } from 'react';

// Drag and Drop Hook
export function useDragAndDrop<T extends { id: string }>(
  initialItems: T[],
  onReorder: (items: T[]) => void
) {
  const [items, setItems] = useState(initialItems);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const draggedIndex = items.findIndex(item => item.id === draggedId);
    const targetIndex = items.findIndex(item => item.id === targetId);

    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);

    setItems(newItems);
    onReorder(newItems);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  return {
    items,
    draggedId,
    handlers: {
      handleDragStart,
      handleDragOver,
      handleDrop,
      handleDragEnd,
    },
  };
}

// History/Undo-Redo Hook
export function useHistory<T>(initialState: T) {
  const [current, setCurrent] = useState<T>(initialState);
  const [history, setHistory] = useState<T[]>([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const push = useCallback((state: T) => {
    setCurrent(state);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), state]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setCurrent(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setCurrent(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  return {
    current,
    push,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
}

// Search Hook
export function useSearch<T>(
  items: T[],
  searchFields: (keyof T)[],
  debounceMs = 300
) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const results = useMemo(() => {
    if (!debouncedQuery) return items;

    const lower = debouncedQuery.toLowerCase();
    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return typeof value === 'string' && value.toLowerCase().includes(lower);
      })
    );
  }, [items, debouncedQuery, searchFields]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  return {
    query,
    results,
    handleSearch,
    hasResults: results.length > 0,
  };
}
