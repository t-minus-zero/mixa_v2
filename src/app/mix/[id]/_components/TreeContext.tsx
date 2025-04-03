'use client'
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid'; 
import { htmlTagsSchema, htmlAttributesSchema } from '../_schemas/html';
import { useNotifications } from '../../../_contexts/NotificationsContext';
import { TreeNode } from '../_types/types';

// Define visualization CSS properties for element styling
type StyleName = 'highlight'; // Add more style names as needed

type StyleProperty = Record<string, string>;

type VisualizationStyles = {
  [key in StyleName]: StyleProperty[];
};

const VisualizationCssProperties: VisualizationStyles = {
  highlight: [
    { border: '1px dashed #666' }
  ]
  // Add other visualization styles as needed
};

const TreeContext = createContext();


export const TreeProvider = ({ children }) => {
  const { addNotification } = useNotifications();
  const [tree, setTree] = useState({
    id: "root", 
    tag: "div", 
    title: "root", 
    classes: [], // List of classes separated by spaces
    style: [], // Array of style properties (legacy, keeping for backward compatibility)
    inlineStyle: {}, // Flat object of inline CSS properties
    content: "", // Text content of object
    attributes: [{"attribute":"src", "value":"url"}],
    childrens: []
  });
  const [selection, setSelection] = useState(tree);
  const [selectionParent, setSelectionParent] = useState(tree);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const htmlSchemas = {
    elements: htmlTagsSchema,
    attributes: htmlAttributesSchema
  }
  
  // Utility function to check if an element is a void element
  // [UTILITY|STATE:NONE|USAGE:INTERNAL_USED] Checks if an HTML element is a void element (cannot have children)
  // Used internally by multiple functions and exported but not used by components
  const isVoidElement = (tag) => {
    return htmlSchemas.elements[tag]?.elementTypes?.includes('void') || false;
  };

  // [TREE MANIPULATION|STATE:UPDATES] Core function to update tree state using Immer
  const updateTree = (updateFn) => {
    setTree(prevTree => produce(prevTree, updateFn));
  };

  // [TREE MANIPULATION|STATE:UPDATES] Updates a specific node in the tree by its ID
  const updateNode = (id, updateFn) => {
    updateTree(draft => {
      const findAndUpdate = (node) => {
        if (node.id === id) {
          updateFn(node);
          return true;
        }
        return node.childrens.some(findAndUpdate);
      };
      findAndUpdate(draft);
    });
  };

  // [STYLE MANAGEMENT|STATE:UPDATES] Adds a style object to a node and adds its class name
  const addStyle = (id, classObj) => {
    updateNode(id, (node: any) => {
      node.style.push(classObj);
    });
    addClass(id, classObj.className);
  };

  // [TREE TRAVERSAL|STATE:NONE] Recursively finds the parent node of a target node
  const findParent = (node, targetId) => {
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

  // [STYLE MANAGEMENT|STATE:UPDATES|USAGE:EXPORTED_UNUSED] Updates CSS string for a class in the tree's style object
  // Exported as 'updateClass' in the context value but not used by components
  const updateClassCss = (className, cssString) => {
    updateTree(draft => {
      const styleEntry = draft.style.find(entry => entry[className] !== undefined);
      if (styleEntry) {
        styleEntry[className] = cssString;
      } else {
        draft.style.push({ [className]: cssString });
      }
    });
  };

  // [VISUALIZATION|STATE:UPDATES|USAGE:INTERNAL_ONLY] Applies or removes visual styling to nodes for UI feedback
  // Used internally by selectionHandler for highlighting selected nodes
  const applyVisualizationStyle = (nodeId: string, styleName: StyleName, shouldApply: boolean) => {
    if (!nodeId || nodeId === "root") return;
    
    updateNode(nodeId, node => {
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
    });
  };

  // [SELECTION MANAGEMENT|STATE:UPDATES|USAGE:EXPORTED_UNUSED] Handles node selection, highlighting, and parent tracking
  // Exported in context value but not used by components
  const selectionHandler = (node) => {
    if (selection.id !== node.id) {
      // Remove highlight styles from current selection
      applyVisualizationStyle(selection.id, 'highlight', false);
      
      // Get parent for new selection
      const parent = findParent(tree, node.id);
      
      // Update selection state
      setSelectionParent(parent ? parent : tree);
      setSelection(node);
      
      // Apply highlight styles to new selection
      applyVisualizationStyle(node.id, 'highlight', true);
    } else {
      setSelectionParent(tree);
    }
  };

  useEffect(() => {
    if (selection.id !== tree.id) {
      const parent = findParent(tree, selection.id);
      setSelectionParent(parent ? parent : tree);
    } else {
      setSelectionParent(tree);
    }
  }, [selection, tree]);

  // [ELEMENT OPERATIONS|STATE:UPDATES] Deletes an element from the tree by its ID
  // Used by the useMixEditorKeyHandler hook
  const deleteElement = (id) => {
    updateTree(draft => {
      const findAndDelete = (node) => {
        if (node.id === id) return true;
        node.childrens = node.childrens.filter(child => !findAndDelete(child));
        return false;
      };
      findAndDelete(draft);
    });
  };

  // NOTE: Keyboard event handling moved to useMixEditorKeyHandler hook

  // [ELEMENT OPERATIONS|STATE:UPDATES] Creates a new div element as a child of the specified node
  // Exported in context value but not used by components
  const createElement = (id) => {
    updateTree(draft => {
      const findAndCreate = (node) => {
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
      findAndCreate(draft);
    });
  };



  // [STYLE MANAGEMENT|STATE:UPDATES] Updates a class name at a specific index in a node's classes array
  const updateClassName = (id, className, index) => {
    updateNode(id, node => {
      node.classes[index] = className;
    });
  };

  // [STYLE MANAGEMENT|STATE:UPDATES] Adds a class name to a node's classes array
  const addClass = (id, className) => {
    updateNode(id, node => {
      node.classes.push(className);
    });
  };

  // [CONTENT MANAGEMENT|STATE:UPDATES] Updates the text content of a node
  const updateContent = (id, content) => {
    updateNode(id, node => {
      node.content = content;
    });
  };

  // [ELEMENT OPERATIONS|STATE:UPDATES] Updates a node's HTML tag with void element validation
  const updateTag = (id, tag) => {
    updateNode(id, node => {
      // Check if the new tag is a void element and if the node has children
      if (isVoidElement(tag) && node.childrens.length > 0) {
        addNotification({
          type: 'warning',
          message: `Cannot update to ${tag} because it's a void element and the current element has children. Move the children outside first.`,
          duration: 5000 // 5 seconds
        });
        return; // Exit without updating the tag
      }
      node.tag = tag;
    });
  };

  // [CONTENT MANAGEMENT|STATE:UPDATES] Updates the display title of a node
  const updateTitle = (id, title) => {
    updateNode(id, node => {
      node.title = title;
    });
  };

  // [STYLE MANAGEMENT|STATE:UPDATES] Removes a specific class name from a node
  const removeClass = (id, className) => {
    updateNode(id, node => {
      if (node.classes) {
        node.classes = node.classes.filter(cls => cls !== className);
      }
    });
  };

  // [STYLE MANAGEMENT|STATE:UPDATES] Renames a class throughout the entire tree and its style definitions
  const renameClassesInTree = (oldClassName, newClassName) => {
    updateTree(draft => {
      const updateClassNames = (node) => {
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
      
      updateClassNames(draft);
    });
  };


  const value = useMemo(() => ({
    tree,
    setTree,
    updateTree,
    selection,
    selectionHandler,
    selectionParent,
    setSelection,
    addStyle,
    deleteElement, 
    createElement,
    updateClassName,
    removeClass,
    renameClassesInTree,
    updateClass: updateClassCss,
    addClass,
    updateContent,
    updateTag,
    updateTitle,
    draggedItem,
    setDraggedItem,
    dropTarget,
    setDropTarget,
    htmlSchemas,
    isVoidElement
  }), [selection, tree, draggedItem, dropTarget, htmlSchemas]);

  return (
    <TreeContext.Provider value={value}>
      {children}
     </TreeContext.Provider>
  );
}

// [CONTEXT HOOK|STATE:NONE] Custom hook to access the tree context with error handling
export const useTree = () => {
  const context = useContext(TreeContext);
  if (context === undefined) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
}
