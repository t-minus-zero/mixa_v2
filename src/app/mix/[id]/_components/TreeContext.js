'use client'
import React, { createContext, useState, useContext, useMemo } from 'react';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid'; 

const TreeContext = createContext();

export const TreeProvider = ({ children }) => {
  const [tree, setTree] = useState({
    id: "root", 
    tag: "div", 
    title: "root", 
    classes: [" "],
    css: "", 
    content: "", 
    childrens: []
  });
  const [selection, setSelection] = useState(tree);
  const updateTree = (updateFn) => {
    setTree(prevTree => produce(prevTree, updateFn));
  };

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
            id: uuidv4(),
            tag: "div",
            title: "",
            classes: [" "],
            css: "",
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

  const value = useMemo(() => ({
    selection, 
    setSelection, 
    tree, 
    setTree, 
    deleteElement, 
    createElement,
    updateClassName,
    addClass,
    updateCss,
    updateContent,
    updateTag,
    updateTitle
  }), [selection, tree]);

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
