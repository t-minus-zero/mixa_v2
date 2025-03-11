'use client'
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid'; 
import {htmlElementsSchema, htmlAttributesSchema} from './htmlElementsSchema'; 

const TreeContext = createContext();



export const TreeProvider = ({ children }) => {
  const [tree, setTree] = useState({
    id: "root", 
    tag: "div", 
    title: "root", 
    classes: [], // List of classes separated by spaces
    style: [{"className":"css string"}], // Object of css properties by class (option only populated in the root level)
    content: "", // Text content of object
    attributes: [{"attribute":"src", "value":"url"}],
    childrens: []
  });
  const [selection, setSelection] = useState(tree);
  const [selectionParent, setSelectionParent] = useState(tree);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [dropPosition, setDropPosition] = useState(null); // 'before', 'after', or 'inside'

  const htmlSchemas = {
    elements: htmlElementsSchema,
    attributes: htmlAttributesSchema
  }
  
  // Utility function to check if an element is a void element
  const isVoidElement = (tag) => {
    return htmlSchemas.elements[tag]?.elementTypes?.includes('void') || false;
  };

  const updateTree = (updateFn) => {
    setTree(prevTree => produce(prevTree, updateFn));
  };

  const addStyle = (id, classObj) => {
    tree.style.push(classObj);
    addClass(id, classObj.className);
  };

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

  const selectionHandler = (node) => {
    if (selection.id !== node.id) {
      const parent = findParent(tree, node.id);
      setSelectionParent(parent ? parent : tree);
      setSelection(node);
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

  const updateClassName = (id, className, index) => {
    updateNode(id, node => {
      node.classes[index] = className;
    });
  };

  const addClass = (id, className) => {
    updateNode(id, node => {
      node.classes.push(className);
    });
  };

  const updateContent = (id, content) => {
    updateNode(id, node => {
      node.content = content;
    });
  };

  const updateTag = (id, tag) => {
    updateNode(id, node => {
      // Check if the new tag is a void element and if the node has children
      if (isVoidElement(tag) && node.childrens.length > 0) {
        console.log(`Cannot update to ${tag} because it's a void element and the current element has children. Move the children outside first.`);
        return; // Exit without updating the tag
      }
      
      node.tag = tag;
    });
  };

  const updateTitle = (id, title) => {
    updateNode(id, node => {
      node.title = title;
    });
  };

  const removeClass = (id, className) => {
    updateNode(id, node => {
      if (node.classes) {
        node.classes = node.classes.filter(cls => cls !== className);
      }
    });
  };

  // (remember to refractor when we switch to IDs for classes instead of names)
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

  const moveElement = (sourceId, targetId, position) => {
    updateTree(draft => {
      // Find and remove the source element
      let sourceElement;
      const removeSource = (node) => {
        if (!node.childrens) return false;
        for (let i = 0; i <node.childrens.length; i++) {
          if (node.childrens[i].id === sourceId) {
            sourceElement = node.childrens[i];
            node.childrens.splice(i, 1);
            return true;
          }
          if (removeSource(node.childrens[i])) return true;
        }
        return false;
      };
      removeSource(draft);

      // Insert the element at the new position
      const insertElement = (node) => {
        if (node.id === targetId) {
          if (position === 'inside') {
            // Check if the target is a void element
            if (isVoidElement(node.tag)) {
              console.log(`Cannot place children inside ${node.tag} because it's a void element.`);
              // Find the parent of the target and place the element after the target instead
              const parent = findParent(draft, targetId);
              if (parent) {
                const targetIndex = parent.childrens.findIndex(child => child.id === targetId);
                parent.childrens.splice(targetIndex + 1, 0, sourceElement);
              } else {
                // If we can't find a parent, add it back to where it came from
                // This is a failsafe that shouldn't typically be needed
                const originalParent = findParent(draft, sourceId);
                if (originalParent) {
                  originalParent.childrens.push(sourceElement);
                }
              }
              return true;
            }
            
            // Not a void element, proceed normally
            node.childrens.push(sourceElement);
          } else {
            const parent = findParent(draft, targetId);
            if (parent) {
              const targetIndex = parent.childrens.findIndex(child => child.id === targetId);
              parent.childrens.splice(
                position === 'before' ? targetIndex : targetIndex + 1,
                0,
                sourceElement
              );
            }
          }
          return true;
        }
        return node.childrens?.some(insertElement) || false;
      };
      
      if (sourceElement) {
        insertElement(draft);
      }
    });
  };

  // Temporary function that adds an image element to the tree, used by the IconBrowser in the LeftFloater.
  const createImageElement = (parentId, imageUrl) => {
    updateTree(draft => {
      const findAndAddImage = (node) => {
        if (node.id === parentId) {
          // Check if the node is a void element before adding a child
          if (isVoidElement(node.tag)) {
            console.log(`Cannot add image to ${node.tag} because it's a void element.`);
            return false;
          }
          
          // Create a new image element with the specified source URL
          const newImageElement = {
            id: uuidv4().substring(0, 8),
            tag: "img",
            title: "Image", // More descriptive title
            classes: [],
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
      
      findAndAddImage(draft);
    });
    
    return true; // Return success indicator
  };

  const value = useMemo(() => ({
    tree,
    setTree,
    selection,
    selectionHandler,
    selectionParent,
    setSelection,
    addStyle,
    deleteElement, 
    createElement,
    createImageElement,
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
    dropPosition,
    setDropPosition,
    moveElement,
    htmlSchemas,
    isVoidElement
  }), [selection, tree, draggedItem, dropTarget, dropPosition, htmlSchemas]);

  return (
    <TreeContext.Provider value={value}>
      {children}
    </TreeContext.Provider>
  );
}

export const useTree = () => {
  const context = useContext(TreeContext);
  if (context === undefined) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
}
