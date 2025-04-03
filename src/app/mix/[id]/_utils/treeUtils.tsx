// Import HTML schemas and notification types
import { htmlTagsSchema, htmlAttributesSchema } from '../_schemas/html';
import { NotificationType } from '../../../_contexts/NotificationsContext';
import { TreeNode, DropPosition } from '../_types/types';

// Result type for operations that might need to show notifications
export interface OperationResult {
  success: boolean;
  notification?: {
    type: NotificationType;
    message: string;
  };
}

// [HELPER] Checks if an element is a void element (cannot have children)
export const isVoidElement = (tag: string): boolean => {
  // Use the imported HTML schemas to determine if an element is void
  return htmlTagsSchema[tag]?.elementTypes?.includes('void') || false;
};

// [HELPER] Finds a node by its ID in the tree
export const findNodeById = (tree: TreeNode, id: string): TreeNode | null => {
  if (tree.id === id) return tree;
  
  if (!tree.childrens) return null;
  
  for (const child of tree.childrens) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  
  return null;
};

// [HELPER] Finds the parent node of a node with the given ID
export const findParent = (tree: TreeNode, id: string): TreeNode | null => {
  // If the tree is the target, it has no parent
  if (tree.id === id) return null;
  
  // Check if any direct children match the target ID
  if (tree.childrens && tree.childrens.some(child => child.id === id)) {
    return tree;
  }
  
  // Recursively check children
  if (tree.childrens) {
    for (const child of tree.childrens) {
      const parent = findParent(child, id);
      if (parent) return parent;
    }
  }
  
  return null;
};

// [DRAG AND DROP|HELPER] Finds and removes an element from the tree
export const findAndRemoveElement = (tree: TreeNode, id: string): TreeNode | null => {
  let removedElement: TreeNode | null = null;
  
  const removeSource = (node: TreeNode): boolean => {
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

// [DRAG AND DROP|HELPER] Inserts an element inside another element as a child
export const insertElementInside = (
  tree: TreeNode,
  targetId: string,
  element: TreeNode,
  sourceId: string
): OperationResult => {
  let result: OperationResult = { success: false };
  
  const insert = (node: TreeNode): boolean => {
    if (node.id === targetId) {
      // Don't allow inserting an element inside itself or its children
      if (findNodeById(element, targetId)) {
        result.notification = {
          type: 'error',
          message: "Cannot insert an element inside itself or its children"
        };
        return true;
      }
      
      // Handle void elements with fallback behavior
      if (isVoidElement(node.tag)) {
        // Find parent and place after target instead
        const parent = findParent(tree, targetId);
        if (parent) {
          const targetIndex = parent.childrens.findIndex(child => child.id === targetId);
          parent.childrens.splice(targetIndex + 1, 0, element);
          result.success = true;
          result.notification = {
            type: 'warning',
            message: `Cannot place inside <${node.tag}> (void element). Element placed after it instead.`
          };
        } else {
          // Failsafe: add back to original parent if we can find it
          const originalParent = findParent(tree, sourceId);
          if (originalParent) {
            originalParent.childrens.push(element);
            result.success = true;
            result.notification = {
              type: 'warning',
              message: `Cannot place inside <${node.tag}> (void element). Element returned to original location.`
            };
          }
        }
        
        return true;
      }
      
      // Normal case - not a void element
      if (!node.childrens) node.childrens = [];
      node.childrens.push(element);
      result.success = true;
      return true;
    }
    return node.childrens?.some(insert) || false;
  };
  
  insert(tree);
  return result;
};

// [DRAG AND DROP|HELPER] Inserts an element before or after another element
export const insertElementAdjacentTo = (
  tree: TreeNode,
  targetId: string,
  element: TreeNode,
  position: 'before' | 'after'
): boolean => {
  let success = false;
  
  const insert = (node: TreeNode): boolean => {
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

// [DRAG AND DROP|MAIN] Moves an element to a new location in the tree
export const moveElement = (
  tree: TreeNode,
  sourceId: string,
  targetId: string,
  position: DropPosition
): OperationResult => {
  // Step 1: Find and remove the source element
  const sourceElement = findAndRemoveElement(tree, sourceId);
  
  if (!sourceElement) {
    return {
      success: false,
      notification: {
        type: 'error',
        message: `Source element with ID ${sourceId} not found`
      }
    };
  }
  
  // Step 2: Insert the element at the target position
  let result: OperationResult;
  if (position === 'inside') {
    result = insertElementInside(tree, targetId, sourceElement, sourceId);
  } else {
    const success = insertElementAdjacentTo(tree, targetId, sourceElement, position);
    result = { success };
  }
  
  return result;
};

// [ELEMENT OPERATIONS] Deletes an element from the tree by its ID
export const deleteElement = (tree: TreeNode, id: string): OperationResult => {
  // Don't allow deleting the root element
  if (tree.id === id) {
    return {
      success: false,
      notification: {
        type: 'error',
        message: 'Cannot delete the root element'
      }
    };
  }
  
  // Find the parent of the element to delete
  const parent = findParent(tree, id);
  if (!parent) {
    return {
      success: false,
      notification: {
        type: 'error',
        message: `Element with ID ${id} not found`
      }
    };
  }
  
  // Find the index of the element in the parent's children
  const index = parent.childrens.findIndex(child => child.id === id);
  if (index === -1) {
    return {
      success: false,
      notification: {
        type: 'error',
        message: `Element with ID ${id} not found in parent's children`
      }
    };
  }
  
  // Remove the element
  parent.childrens.splice(index, 1);
  
  return {
    success: true
  };
};

