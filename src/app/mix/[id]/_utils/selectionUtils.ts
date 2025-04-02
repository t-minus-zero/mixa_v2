import { TreeNode } from './treeUtils';

// Visual effects for highlighting elements
export const VisualizationCssProperties = {
  highlight: [{"outline": "1px dashed rgba(10, 132, 255, 0.75)"}],
  explode3d: [{"box-shadow": "0 0 10px rgba(0, 0, 0, 0.5)"}],
};

/**
 * Find the parent node of a specified node in the tree
 */
export const findParent = (node: TreeNode, targetId: string): TreeNode | null => {
  if (!node.childrens) return null;
  
  for (let child of node.childrens) {
    if (child.id === targetId) {
      return node;
    }
    
    const found = findParent(child, targetId);
    if (found) return found;
  }
  
  return null;
};

/**
 * Apply visualization styles to a node (highlighting, etc.)
 */
export const applyVisualizationStyle = (
  tree: TreeNode, 
  nodeId: string, 
  styleName: keyof typeof VisualizationCssProperties, 
  shouldApply: boolean
): TreeNode => {
  if (!nodeId || nodeId === "root") return tree;
  
  // Create a deep copy to avoid mutating the original
  const newTree = JSON.parse(JSON.stringify(tree));
  
  const updateNodeStyle = (node: TreeNode): boolean => {
    if (node.id === nodeId) {
      // Initialize inlineStyle if it doesn't exist
      if (!node.inlineStyle) node.inlineStyle = {};
      
      if (shouldApply) {
        // Add the visualization properties to the flat inlineStyle object
        VisualizationCssProperties[styleName].forEach(styleProp => {
          const propName = Object.keys(styleProp)[0];
          const propValue = styleProp[propName];
          
          // Add to the flat inlineStyle object
          node.inlineStyle[propName] = propValue;
        });
      } else {
        // Remove the visualization properties from inlineStyle
        VisualizationCssProperties[styleName].forEach(styleProp => {
          const propName = Object.keys(styleProp)[0];
          
          // Remove property from inlineStyle
          delete node.inlineStyle[propName];
        });
      }
      
      return true;
    }
    
    return node.childrens?.some(updateNodeStyle) || false;
  };
  
  updateNodeStyle(newTree);
  
  return newTree;
};

/**
 * Handle selection of a node in the tree
 */
export const selectionHandler = (
  tree: TreeNode,
  currentSelection: TreeNode, 
  newSelection: TreeNode
): { 
  updatedTree: TreeNode; 
  selection: TreeNode; 
  selectionParent: TreeNode;
} => {
  let updatedTree = tree;
  let selectionParent = tree;
  
  if (currentSelection.id !== newSelection.id) {
    // Remove highlight styles from current selection
    updatedTree = applyVisualizationStyle(updatedTree, currentSelection.id, 'highlight', false);
    
    // Get parent for new selection
    const parent = findParent(updatedTree, newSelection.id);
    selectionParent = parent ? parent : updatedTree;
    
    // Apply highlight styles to new selection
    updatedTree = applyVisualizationStyle(updatedTree, newSelection.id, 'highlight', true);
  } else {
    selectionParent = tree;
  }
  
  return { 
    updatedTree, 
    selection: newSelection, 
    selectionParent 
  };
};
