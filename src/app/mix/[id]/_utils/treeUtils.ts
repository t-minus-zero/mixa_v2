import { v4 as uuidv4 } from 'uuid';

// Default initial tree state
export const initialTreeState = {
  id: "root", 
  tag: "div", 
  title: "root", 
  classes: [], 
  style: [], 
  inlineStyle: {}, 
  content: "", 
  attributes: [{"attribute":"src", "value":"url"}],
  childrens: []
};

// Export the TreeNode interface for use throughout the application
export interface TreeNode {
  id: string;
  tag: string;
  title: string;
  classes: string[];
  style: any[];
  inlineStyle: Record<string, any>;
  content: string;
  attributes: Array<{attribute: string; value: string}>;
  childrens: TreeNode[];
}

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
 * Check if a given tag is a void element based on the HTML schema
 */
export const isVoidElement = (tag: string, htmlSchemas: any): boolean => {
  return htmlSchemas.elements[tag]?.elementTypes?.includes('void') || false;
};

/**
 * Create a new element in the tree
 */
export const createElement = (tree: TreeNode, id: string, htmlSchemas: any): TreeNode => {
  const findAndCreate = (node: TreeNode): boolean => {
    if (node.id === id) {
      // Check if the node is a void element
      if (isVoidElement(node.tag, htmlSchemas)) {
        console.log(`Cannot add children to ${node.tag} because it's a void element.`);
        return false;
      }
      
      node.childrens.push({
        id: uuidv4().substring(0, 8),
        tag: "div",
        title: uuidv4().substring(0, 6),
        classes: [],
        style: [{"className":"css string"}],
        inlineStyle: {}, 
        content: "",
        attributes: [],
        childrens: []
      });
      
      return true;
    }
    
    return node.childrens.some(findAndCreate);
  };
  
  // Create a deep copy to avoid mutating the original
  const newTree = JSON.parse(JSON.stringify(tree));
  findAndCreate(newTree);
  
  return newTree;
};

/**
 * Update a node in the tree with a callback function
 */
export const updateNode = (tree: TreeNode, id: string, updateFn: (node: TreeNode) => void): TreeNode => {
  const findAndUpdate = (node: TreeNode): boolean => {
    if (node.id === id) {
      updateFn(node);
      return true;
    }
    
    return node.childrens.some(findAndUpdate);
  };
  
  // Create a deep copy to avoid mutating the original
  const newTree = JSON.parse(JSON.stringify(tree));
  findAndUpdate(newTree);
  
  return newTree;
};

/**
 * Delete a node from the tree
 */
export const deleteElement = (tree: TreeNode, id: string): TreeNode => {
  const findAndDelete = (node: TreeNode): boolean => {
    if (node.id === id) return true;
    
    node.childrens = node.childrens.filter(child => !findAndDelete(child));
    
    return false;
  };
  
  // Create a deep copy to avoid mutating the original
  const newTree = JSON.parse(JSON.stringify(tree));
  findAndDelete(newTree);
  
  return newTree;
};

/**
 * Move an element within the tree
 */
export const moveElement = (
  tree: TreeNode, 
  sourceId: string, 
  targetId: string, 
  position: 'before' | 'after' | 'inside',
  htmlSchemas: any
): TreeNode => {
  // Create a deep copy to avoid mutating the original
  const newTree = JSON.parse(JSON.stringify(tree));
  let sourceElement: TreeNode | undefined;
  
  // Find and remove the source element
  const removeSource = (node: TreeNode): boolean => {
    if (!node.childrens) return false;
    
    for (let i = 0; i < node.childrens.length; i++) {
      if (node.childrens[i].id === sourceId) {
        sourceElement = node.childrens[i];
        node.childrens.splice(i, 1);
        return true;
      }
      
      if (removeSource(node.childrens[i])) return true;
    }
    
    return false;
  };
  
  removeSource(newTree);
  
  // Insert the element at the new position
  const insertElement = (node: TreeNode): boolean => {
    if (node.id === targetId) {
      if (position === 'inside') {
        // Check if the target is a void element
        if (isVoidElement(node.tag, htmlSchemas)) {
          console.log(`Cannot place children inside ${node.tag} because it's a void element.`);
          
          // Find the parent of the target and place the element after the target instead
          const parent = findParent(newTree, targetId);
          if (parent) {
            const targetIndex = parent.childrens.findIndex(child => child.id === targetId);
            parent.childrens.splice(targetIndex + 1, 0, sourceElement!);
          } else {
            // If we can't find a parent, add it back to where it came from
            // This is a failsafe that shouldn't typically be needed
            const originalParent = findParent(newTree, sourceId);
            if (originalParent) {
              originalParent.childrens.push(sourceElement!);
            }
          }
          
          return true;
        }
        
        // Not a void element, proceed normally
        node.childrens.push(sourceElement!);
      } else {
        const parent = findParent(newTree, targetId);
        if (parent) {
          const targetIndex = parent.childrens.findIndex(child => child.id === targetId);
          parent.childrens.splice(
            position === 'before' ? targetIndex : targetIndex + 1,
            0,
            sourceElement!
          );
        }
      }
      
      return true;
    }
    
    return node.childrens?.some(insertElement) || false;
  };
  
  if (sourceElement) {
    insertElement(newTree);
  }
  
  return newTree;
};

/**
 * Create a new image element in the tree
 */
export const createImageElement = (
  tree: TreeNode, 
  parentId: string, 
  imageUrl: string,
  htmlSchemas: any
): TreeNode => {
  const findAndAddImage = (node: TreeNode): boolean => {
    if (node.id === parentId) {
      // Check if the node is a void element before adding a child
      if (isVoidElement(node.tag, htmlSchemas)) {
        console.log(`Cannot add image to ${node.tag} because it's a void element.`);
        return false;
      }
      
      // Create a new image element with the specified source URL
      const newImageElement: TreeNode = {
        id: uuidv4().substring(0, 8),
        tag: "img",
        title: "Image", // More descriptive title
        classes: [],
        style: [{"className":"css string"}],
        inlineStyle: {}, // Initialize inlineStyle
        content: "",
        attributes: [
          { attribute: "src", value: imageUrl },
          { attribute: "alt", value: "Icon image" } // Add alt text for accessibility
        ],
        childrens: [] // Empty since img is a void element
      };
      
      node.childrens.push(newImageElement);
      return true;
    }
    
    return node.childrens?.some(findAndAddImage) || false;
  };
  
  // Create a deep copy to avoid mutating the original
  const newTree = JSON.parse(JSON.stringify(tree));
  findAndAddImage(newTree);
  
  return newTree;
};

/**
 * Update the tag of a node
 */
export const updateTag = (tree: TreeNode, id: string, tag: string, htmlSchemas: any): TreeNode => {
  return updateNode(tree, id, (node) => {
    // Check if the new tag is a void element and if the node has children
    if (isVoidElement(tag, htmlSchemas) && node.childrens.length > 0) {
      console.log(`Cannot update to ${tag} because it's a void element and the current element has children. Move the children outside first.`);
      return; // Exit without updating the tag
    }
    
    node.tag = tag;
  });
};

/**
 * Update the title of a node
 */
export const updateTitle = (tree: TreeNode, id: string, title: string): TreeNode => {
  return updateNode(tree, id, (node) => {
    node.title = title;
  });
};

/**
 * Update the content of a node
 */
export const updateContent = (tree: TreeNode, id: string, content: string): TreeNode => {
  return updateNode(tree, id, (node) => {
    node.content = content;
  });
};

/**
 * Add a class to a node
 */
export const addClass = (tree: TreeNode, id: string, className: string): TreeNode => {
  return updateNode(tree, id, (node) => {
    node.classes.push(className);
  });
};

/**
 * Update a class name in a node
 */
export const updateClassName = (tree: TreeNode, id: string, className: string, index: number): TreeNode => {
  return updateNode(tree, id, (node) => {
    node.classes[index] = className;
  });
};

/**
 * Remove a class from a node
 */
export const removeClass = (tree: TreeNode, id: string, className: string): TreeNode => {
  return updateNode(tree, id, (node) => {
    if (node.classes) {
      node.classes = node.classes.filter(cls => cls !== className);
    }
  });
};

/**
 * Rename classes across the entire tree
 */
export const renameClassesInTree = (tree: TreeNode, oldClassName: string, newClassName: string): TreeNode => {
  const updateClassNames = (node: TreeNode) => {
    if (node.classes && Array.isArray(node.classes)) {
      node.classes = node.classes.map(cls => 
        cls === oldClassName ? newClassName : cls
      );
    }
    
    // Also update style references if at root level
    if (node.id === "root" && node.style && Array.isArray(node.style)) {
      node.style = node.style.map(styleObj => {
        if (styleObj[oldClassName]) {
          const newStyleObj: any = {};
          newStyleObj[newClassName] = styleObj[oldClassName];
          return newStyleObj;
        }
        return styleObj;
      });
    }
    
    if (node.childrens && Array.isArray(node.childrens)) {
      node.childrens.forEach(updateClassNames);
    }
  };
  
  // Create a deep copy to avoid mutating the original
  const newTree = JSON.parse(JSON.stringify(tree));
  updateClassNames(newTree);
  
  return newTree;
};
