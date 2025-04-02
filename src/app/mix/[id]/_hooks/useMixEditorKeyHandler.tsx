'use client';

import { useEffect } from 'react';
import { useTree } from '../_components/TreeContext';

/**
 * Hook to handle keyboard shortcuts for the tree editor
 * Manages element deletion and other keyboard interactions
 */
const useMixEditorKeyHandler = () => {
  const {
    selection,
    selectionParent,
    setSelection,
    deleteElement
  } = useTree();

  // Handle keyboard shortcuts for the tree editor
  const handleKeyDown = (e: KeyboardEvent) => {
    // Skip if we're inside an input or textarea
    if (
      e.target instanceof HTMLElement &&
      (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')
    ) {
      return;
    }

    // Delete element with Backspace key
    if (e.key === 'Backspace' && selection && selection.id !== 'root') {
      e.preventDefault(); // Prevent browser navigation
      
      // Ask for confirmation before deleting
      if (confirm(`Are you sure you want to delete "${selection.title}" (${selection.tag}) and all its children?`)) {
        deleteElement(selection.id);
        
        // After deletion, select the parent
        if (selectionParent) {
          setSelection(selectionParent);
        }
      }
    }

    // Future keyboard shortcuts can be added here:
    // - Undo/Redo (Ctrl+Z, Ctrl+Y)
    // - Copy/Paste elements (Ctrl+C, Ctrl+V)
    // - Move elements up/down (Alt+Arrow keys)
    // - Toggle element properties panel (Tab)
  };

  // Set up keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selection, selectionParent]); // Re-attach when selection or parent changes
  
  // No need to return anything as this hook just sets up event listeners
};

export default useMixEditorKeyHandler;
