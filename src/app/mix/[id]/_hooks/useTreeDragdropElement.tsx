'use client';

import { produce } from 'immer';

// Define types for the hook
type NodeType = {
  id: string;
  title?: string;
  tag?: string;
  content?: string;
  childrens?: NodeType[];
  [key: string]: any;
};

type TreeUpdateFunction = (tree: NodeType) => void;

type DropPosition = 'before' | 'after' | 'inside';

type DragdropElementHookProps = {
  tree: NodeType;
  updateTree: (fn: (draft: NodeType) => void) => void;
  isVoidElement: (tag: string) => boolean;
  findParent: (id: string) => NodeType | null;
};

/**
 * Custom hook for handling tree element drag and drop operations
 * Decoupled from TreeContext to isolate drag-specific logic
 */
export function useTreeDragdropElement({ tree, updateTree, isVoidElement, findParent }: DragdropElementHookProps) {
  // No local state - hook just provides tree operations

  // [DRAG AND DROP|HELPER] Finds and removes an element from the tree by ID
  // Returns the removed element or undefined if not found
  const findAndRemoveElement = (tree, id) => {
    let removedElement;
    
    const removeSource = (node) => {
      if (!node.childrens) return false;
      
      for (let i = 0; i < node.childrens.length; i++) {
        if (node.childrens[i].id === id) {
          removedElement = node.childrens[i];
          node.childrens.splice(i, 1);
          return true;
        }
        
        if (removeSource(node.childrens[i])) return true;
      }
      
      return false;
    };
    
    removeSource(tree);
    return removedElement;
  };
  
  // [DRAG AND DROP|HELPER] Handles inserting an element inside another element
  // Accounts for void elements and performs appropriate fallback actions
  const insertElementInside = (tree, targetId, element, sourceId) => {
    let success = false;
    
    const insert = (node) => {
      if (node.id === targetId) {
        // Check if target is a void element
        if (isVoidElement(node.tag)) {
          console.log(`Cannot place children inside ${node.tag} because it's a void element.`);
          // Find parent and place after target instead
          const parent = findParent(tree, targetId);
          if (parent) {
            const targetIndex = parent.childrens.findIndex(child => child.id === targetId);
            parent.childrens.splice(targetIndex + 1, 0, element);
            success = true;
          } else {
            // Failsafe: add back to original parent
            const originalParent = findParent(tree, sourceId);
            if (originalParent) {
              originalParent.childrens.push(element);
              success = true;
            }
          }
        } else {
          // Not a void element, proceed normally
          if (!node.childrens) node.childrens = [];
          node.childrens.push(element);
          success = true;
        }
        return true;
      }
      return node.childrens?.some(insert) || false;
    };
    
    insert(tree);
    return success;
  };
  
  // [DRAG AND DROP|HELPER] Handles inserting an element before or after another element
  const insertElementAdjacentTo = (tree, targetId, element, position) => {
    let success = false;
    
    const insert = (node) => {
      if (node.id === targetId) {
        const parent = findParent(tree, targetId);
        if (parent) {
          const targetIndex = parent.childrens.findIndex(child => child.id === targetId);
          const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
          parent.childrens.splice(insertIndex, 0, element);
          success = true;
        }
        return true;
      }
      return node.childrens?.some(insert) || false;
    };
    
    insert(tree);
    return success;
  };

  // [DRAG AND DROP|STATE:UPDATES] Moves an element to a new location in the tree
  // Main function that orchestrates the move operation using helper functions
  const moveElement = (sourceId: string, targetId: string, position: DropPosition): void => {
    updateTree(draft => {
      // Step 1: Find and remove the source element
      const sourceElement = findAndRemoveElement(draft, sourceId);
      
      if (!sourceElement) {
        console.error(`Source element with ID ${sourceId} not found`);
        return;
      }
      
      // Step 2: Insert the element at the target position
      if (position === 'inside') {
        insertElementInside(draft, targetId, sourceElement, sourceId);
      } else {
        insertElementAdjacentTo(draft, targetId, sourceElement, position);
      }
    });
  };

  // Utility function to calculate drop position
  // This will be used by the component
  const calculateDropPosition = (elementRef: HTMLElement, mouseY: number): DropPosition => {
    if (!elementRef) return 'inside';
    
    const rect = elementRef.getBoundingClientRect();
    const relativeY = mouseY - rect.top;
    
    // Define zones
    const topZone = rect.height * 0.25;
    const bottomZone = rect.height * 0.75;
    
    if (relativeY < topZone) {
      return 'before';
    } else if (relativeY > bottomZone) {
      return 'after';
    } else {
      return 'inside';
    }
  };

  return {
    // Core tree operations
    findAndRemoveElement,
    moveElement,
    
    // Utility functions
    calculateDropPosition
  };
}
