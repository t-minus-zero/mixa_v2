'use client';

import { useEffect } from 'react';
import { useMixEditor } from '../_contexts/MixEditorContext';
import { deleteElement } from '../_utils/treeUtils';
import { useNotifications } from '../../../_contexts/NotificationsContext';

/**
 * Hook to handle keyboard shortcuts for the tree editor
 * Manages element deletion and other keyboard interactions
 */
const useMixEditorKeyHandler = () => {
  const { selection, selectionParent, setSelection } = useMixEditor();

  const { addNotification } = useNotifications();
  const { updateTree } = useMixEditor();

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
        updateTree(tree => {
              const result = deleteElement(tree, selection.id);
              
              // Show notification if there was an error
              if (!result.success && result.notification) {
                addNotification({
                  type: result.notification.type,
                  message: result.notification.message,
                  duration: 5000
                });
              }
            });
        
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
