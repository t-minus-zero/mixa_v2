// Import HTML schemas and notification types
import { htmlTagsSchema, htmlAttributesSchema } from '../_schemas/html';
import { cssSchema } from '../_schemas/css';
import { inputsSchema } from '../_schemas/inputs';
import { NotificationType } from '../../../_contexts/NotificationsContext';
import { TreeNode, DropPosition, CssTree, CssClass, CssValueNode, CssValue } from '../_types/types';
import { v4 as uuidv4 } from 'uuid';


// Result type for operations that might need to show notifications
export interface OperationResult {
  success: boolean;
  notification?: {
    type: NotificationType;
    message: string;
  };
}

// [ELEMENT OPERATIONS|STATE:UPDATES] Creates a new div element as a child of the specified node
export const createElement = (node: TreeNode, id: string) => {
      const findAndCreate = (node: TreeNode) => {
        if (node.id === id) {
          // Check if the node is a void element
          if (isVoidElement(node.tag)) {
            console.log(`Cannot add children to ${node.tag} because it's a void element.`);
            return false;
          }
          
          node.childrens.push({
            id: uuidv4().substring(0, 8),
            tag: "div",
            title: uuidv4().substring(0, 6),
            classes: [],
            style: [{"className":"css string"}],
            inlineStyle: {}, // Initialize inlineStyle
            content: "",
            childrens: []
          });
          return true;
        }
        return node.childrens.some(findAndCreate);
      };
      findAndCreate(node);
  };

// [TREE MANIPULATION|STATE:UPDATES] Updates a specific node in the tree by its ID
export const updateNode = (tree: TreeNode, id: string, updateFn: (node: TreeNode) => void) => {
  const findAndUpdate = (node: TreeNode) => {
    if (node.id === id) {
      updateFn(node);
      return true;
    }
    return node.childrens?.some(findAndUpdate) || false;
  };
  findAndUpdate(tree);
};

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

// [STYLE MANAGEMENT|STATE:UPDATES] Adds a class name to a node's classes array
export const addClassToElement = (tree: TreeNode, id: string, className: string) => {
  updateNode(tree, id, node => {
    node.classes.push(className);
  });
};

// [STYLE MANAGEMENT|STATE:UPDATES] Renames a class throughout the entire tree and its style definitions
export const renameClassesInTree = (tree: TreeNode, oldClassName: string, newClassName: string) => {
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
          const newStyleObj = {};
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
      
    updateClassNames(tree);

};

// [CONTENT MANAGEMENT|STATE:UPDATES] Updates the display title of a node
export const updateElementTitle = (tree: TreeNode, id: string, title: string) => {
  updateNode(tree, id, node => {
    node.title = title;
  });
};

// [STYLE MANAGEMENT|STATE:UPDATES] Removes a specific class name from a node
export const removeClassFromElement = (tree: TreeNode, id: string, className: string) => {
  updateNode(tree, id, node => {
    if (node.classes) {
      node.classes = node.classes.filter(cls => cls !== className);
    }
  });
};

// [CONTENT MANAGEMENT|STATE:UPDATES] Updates the text content of a node
export const updateElementContent = (tree: TreeNode, id: string, content: string) => {
  updateNode(tree, id, node => {
    node.content = content;
  });
};

// [ELEMENT OPERATIONS|STATE:UPDATES] Updates a node's HTML tag with void element validation
export const updateElementTag = (tree: TreeNode, id: string, tag: string) => {
  updateNode(tree, id, node => {
    // Check if the new tag is a void element and if the node has children
    if (isVoidElement(tag) && node.childrens.length > 0) {
      return
    } else {
      node.tag = tag;
    }
  });
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

// --- cssTree ---

export const defaultCssTree: CssTree =
  {
    classes: {
      "default": {
        name: "default",
        properties: [
          {
            id: uuidv4(),
            type: "display",
            value: 'grid'
          },
          {
            id: uuidv4(),
            type: "gridTemplateColumns",
            value: {
              id: uuidv4(),
              type: 'globalKeyword',
              value: 'initial',
            },
          },
          {
            id: uuidv4(),
            type: "gridTemplateRows",
            value: {
              id: uuidv4(),
              type: 'trackList',
              value: [
                {
                  id: uuidv4(),
                  type: 'trackKeyword',
                  value: 'auto'
                },
                {
                  id: uuidv4(),
                  type: 'fraction',
                  value: 1
                },
                {
                  id: uuidv4(),
                  type: 'dimension',
                  value: [
                    {
                      id: uuidv4(),
                      type: 'number',
                      value: 15
                    },
                    {
                      id: uuidv4(),
                      type: 'unit',
                      value: 'px'
                    }
                  ]
                }
              ]
            }
          },
          {
            id: uuidv4(),
            type: "gridGap",
            value: {
              id: uuidv4(),
              type: 'dimension',
              value: [
                {
                  id: uuidv4(),
                  type: 'number',
                  value: 15
                },
                {
                  id: uuidv4(),
                  type: 'unit',
                  value: 'px'
                }
              ]
            }
          }
        ]
      }
    }
  };

// CSS utility functions
export const generateStyleFromTree = (cssTree: CssTree) => {
  const result: { className: string; cssString: string }[] = [];
  
  // For each class in the tree, generate an object with classname and css string
  Object.keys(cssTree.classes).forEach(className => {
    const cssString = generateStyleFromClass(cssTree.classes[className], className);
    result.push({ className, cssString });
  });
  
  return result;
};

export const generateStyleFromClass = (classObj: CssClass, className: string) => {
  let cssString = `.${className} {`;
  
  // Process each property in the class
  classObj.properties.forEach(propObj => {
    // Get the property schema
    const propertySchema = cssSchema[propObj.type];
    
    if (propertySchema) {
      // Format the property value using formatProperty
      const formattedValue = formatStyleProperty(propObj.value, propObj.type);
      
      // Apply the property format from the schema
      const formattedProperty = propertySchema.format.replace('{value}', formattedValue);
      cssString += ` ${formattedProperty}`;
    }
  });
  
  cssString += ' }';
  return cssString;
};

export const formatStyleProperty = (value: CssValue, type: string) => {
    // If value is primitive (string, number), return it directly
    if (typeof value !== 'object') {
      return value;
    }
    
    // If value is an array, it should be processed in the context of its parent type
    if (Array.isArray(value)) {
      // Default separator is space if no type is provided
      const separator = '';
      return value.map(item => formatStyleProperty(item.value, item.type)).join(separator);
    }
    
    // If value is an object with type and value
    if (value.type && value.value !== undefined) {
      // Get the input type schema
      const inputTypeSchema = inputsSchema[value.type];             
      if (!inputTypeSchema) {
        return value.value; // Fallback if no schema found
      }
      
      let formattedValue;
      
      // Handle array values using the current type's separator
      if (Array.isArray(value.value)) {
        // Get separator from current schema, default to space
        const separator = inputTypeSchema.separator || '';
        formattedValue = value.value.map(item => 
          formatStyleProperty(item.value, item.type)
        ).join(separator);
      } else {
        formattedValue = formatStyleProperty(value.value, value.type);
      }
      
      // Apply the format from the input type schema
      return inputTypeSchema.format.replace('{value}', formattedValue);
    }
    
    // Fallback
    return String(value);
  };

export const processValue = (value: any) => {

  if (Array.isArray(value)) {
    return value.map(item => processValue(item));
  }

  if (isReference(value)) {
    const inputType = extractReferenceKey(value);
    const inputTypeSchema = inputsSchema[inputType];
    let newType = inputTypeSchema.inputType;
    if (['selection', 'list', 'composite', 'number'].includes(newType)) {
      newType = inputType;
    }
    const newValue = {
      id: uuidv4(),
      type: newType,
      value: processValue(inputTypeSchema.default),
    };
    return newValue;
  }

  // When we load a default we need to give it an id
  // First check if value is an object if it is we check if it has id
  if (typeof value === 'object' && value !== null && !('id' in value)) {
    const newValue = {
      id: uuidv4(),
      type: value.type,
      value: processValue(value.value),
    };
    return newValue;
  }

  return value;
}

// Helper functions for references
export const isReference = (value: string) => {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
};

export const extractReferenceKey = (value: string) => {
  if (!isReference(value)) return null;
  return value.substring(1, value.length - 1);
};

// [CSS CLASS OPERATIONS|NO STATE] Find a CSS class by ID
export const findClassById = (cssTree: CssTree, classId: string): CssClass | undefined => {
  // For object-based structure (current implementation)
  for (const key in cssTree.classes) {
    if (cssTree.classes[key].id === classId) {
      return cssTree.classes[key];
    }
  }
  
  return undefined;
  
  // For array-based structure (future implementation)
  // return cssTree.classes.find(cssClass => cssClass.id === classId);
};

// [CSS CLASS OPERATIONS|NO STATE] Find a CSS class by name
export const findClassByName = (cssTree: CssTree, className: string): CssClass | undefined => {
  // For object-based structure (current implementation)
  return cssTree.classes[className];
  
  // For array-based structure (future implementation)
  // return cssTree.classes.find(cssClass => cssClass.name === className);
};

// [CSS CLASS OPERATIONS|NO STATE] Get class ID by name
export const getClassIdByName = (cssTree: CssTree, className: string): string | undefined => {
  // For object-based structure (current implementation)
  return cssTree.classes[className]?.id;
  
  // For array-based structure (future implementation)
  // const cssClass = cssTree.classes.find(cssClass => cssClass.name === className);
  // return cssClass?.id;
};