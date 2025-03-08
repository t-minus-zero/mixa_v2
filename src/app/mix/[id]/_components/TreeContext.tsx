'use client'
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid'; 

const TreeContext = createContext();



export const TreeProvider = ({ children }) => {
  const [tree, setTree] = useState({
    id: "root", 
    tag: "div", 
    title: "root", 
    classes: [], // List of classes separated by spaces
    style: [{"className":"css string"}], // Object of css properties by class (option only populated in the root level)
    content: "", // Text content of object
    childrens: []
  });
  const [selection, setSelection] = useState(tree);
  const [selectionParent, setSelectionParent] = useState(tree);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [dropPosition, setDropPosition] = useState(null); // 'before', 'after', or 'inside'

  const updateTree = (updateFn) => {
    setTree(prevTree => produce(prevTree, updateFn));
  };

  const updateGlobalCss = (cssString) => {
    setCss(cssString);
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

  const updateCss = (id, css) => {
    updateNode(id, node => {
      node.css = css;
    });
  };

  const updateContent = (id, content) => {
    updateNode(id, node => {
      node.content = content;
    });
  };

  const updateTag = (id, tag) => {
    updateNode(id, node => {
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

  const value = useMemo(() => ({
    selection, 
    setSelection,
    addStyle,
    selectionHandler,
    selectionParent,
    tree, 
    setTree, 
    deleteElement, 
    createElement,
    updateClassName,
    addClass,
    removeClass,
    updateClassCss,
    updateCss,
    updateGlobalCss,
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
  }), [selection, tree, draggedItem, dropTarget, dropPosition]);

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
