'use client'
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';

// Import utility functions
import * as treeUtils from '../_utils/treeUtils';
import * as cssUtils from '../_utils/cssUtils';
import * as selectionUtils from '../_utils/selectionUtils';

// No type declaration needed here - we'll handle the any type in the code

// Import schemas from our new _schemas folder
import { htmlTagsSchema, htmlAttributesSchema } from '../_schemas/html';
import { cssSchema } from '../_schemas/css';
import { inputsSchema } from '../_schemas/inputs';

// Import type definitions and constants from utility files
import { TreeNode, initialTreeState } from '../_utils/treeUtils';
import { CssClass, CssTree, initialCssState } from '../_utils/cssUtils';
import { VisualizationCssProperties } from '../_utils/selectionUtils';

// Rename CssTree to match our existing naming convention
type CssTreeType = CssTree;

interface MixEditorContextType {
  // Tree state
  tree: TreeNode;
  setTree: React.Dispatch<React.SetStateAction<TreeNode>>;
  selection: TreeNode;
  setSelection: React.Dispatch<React.SetStateAction<TreeNode>>;
  selectionParent: TreeNode;
  setSelectionParent: React.Dispatch<React.SetStateAction<TreeNode>>;
  draggedItem: TreeNode | null;
  setDraggedItem: React.Dispatch<React.SetStateAction<TreeNode | null>>;
  dropTarget: TreeNode | null;
  setDropTarget: React.Dispatch<React.SetStateAction<TreeNode | null>>;
  dropPosition: string | null;
  setDropPosition: React.Dispatch<React.SetStateAction<string | null>>;
  
  // CSS state
  cssTree: CssTreeType;
  setCssTree: React.Dispatch<React.SetStateAction<CssTreeType>>;
  selectedClass: string;
  setSelectedClass: React.Dispatch<React.SetStateAction<string>>;
  selectedProperty: any | null;
  setSelectedProperty: React.Dispatch<React.SetStateAction<any | null>>;
  
  // Tree utility methods
  isVoidElement: (tag: string) => boolean;
  findParent: (targetId: string) => TreeNode | null;
  createElement: (id: string) => void;
  deleteElement: (id: string) => void;
  updateNode: (id: string, updateFn: (node: TreeNode) => void) => void;
  moveElement: (sourceId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
  createImageElement: (parentId: string, imageUrl: string) => void;
  updateTag: (id: string, tag: string) => void;
  updateTitle: (id: string, title: string) => void;
  updateContent: (id: string, content: string) => void;
  addClass: (id: string, className: string) => void;
  updateClassName: (id: string, className: string, index: number) => void;
  removeClass: (id: string, className: string) => void;
  renameClassesInTree: (oldClassName: string, newClassName: string) => void;
  selectionHandler: (node: TreeNode) => void;
  applyVisualizationStyle: (nodeId: string, styleName: 'highlight' | 'explode3d', shouldApply: boolean) => void;

  // CSS utility methods
  addCssClass: (className?: string) => void;
  removeCssClass: (className: string) => void;
  updateCssClass: (className: string, newClassName: string) => void;
  addCssProperty: (className: string, propertyType: string) => void;
  updateCssProperty: (className: string, propertyId: string, updates: any) => void;
  deleteCssProperty: (className: string, propertyId: string) => void;
  generateCssFromTree: () => Array<{ className: string, cssString: string }>;
  
  // Schemas
  htmlSchemas: {
    elements: typeof htmlTagsSchema;
    attributes: typeof htmlAttributesSchema;
  };
  cssSchemas: {
    inputTypes: typeof inputsSchema;
    properties: typeof cssSchema;
  };
}

const MixEditorContext = createContext<MixEditorContextType | undefined>(undefined);



interface MixEditorProviderProps {
  children: React.ReactNode;
}

export const MixEditorProvider = ({ children }: MixEditorProviderProps) => {
  // Tree state
  const [tree, setTree] = useState<TreeNode>(initialTreeState);
  const [selection, setSelection] = useState<TreeNode>(initialTreeState);
  const [selectionParent, setSelectionParent] = useState<TreeNode>(initialTreeState);
  const [draggedItem, setDraggedItem] = useState<TreeNode | null>(null);
  const [dropTarget, setDropTarget] = useState<TreeNode | null>(null);
  const [dropPosition, setDropPosition] = useState<string | null>(null);

  // CSS state
  const [cssTree, setCssTree] = useState<CssTreeType>(initialCssState);
  const [selectedClass, setSelectedClass] = useState<string>('default');
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);

  // Schemas
  const htmlSchemas = {
    elements: htmlTagsSchema,
    attributes: htmlAttributesSchema
  };

  const cssSchemas = {
    inputTypes: inputsSchema,
    properties: cssSchema
  };

  // Tree manipulation functions that use Immer to update state immutably
  const updateTree = (updateFn: (draft: TreeNode) => void) => {
    setTree(prevTree => produce(prevTree, updateFn));
  };

  const updateCssTree = (updateFn: (draft: CssTreeType) => void) => {
    setCssTree(prevTree => produce(prevTree, updateFn));
  };

  // Tree utility function wrappers
  const isVoidElement = (tag: string) => treeUtils.isVoidElement(tag, htmlSchemas);
  
  const findParent = (targetId: string) => treeUtils.findParent(tree, targetId);
  
  const createElement = (id: string) => {
    updateTree(draft => {
      const newTree = treeUtils.createElement(draft, id, htmlSchemas);
      Object.assign(draft, newTree);
    });
  };

  const deleteElement = (id: string) => {
    updateTree(draft => {
      const newTree = treeUtils.deleteElement(draft, id);
      Object.assign(draft, newTree);
    });
  };

  const updateNode = (id: string, updateFn: (node: TreeNode) => void) => {
    updateTree(draft => {
      const newTree = treeUtils.updateNode(draft, id, updateFn);
      Object.assign(draft, newTree);
    });
  };

  const moveElement = (sourceId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
    updateTree(draft => {
      const newTree = treeUtils.moveElement(draft, sourceId, targetId, position, htmlSchemas);
      Object.assign(draft, newTree);
    });
  };

  const createImageElement = (parentId: string, imageUrl: string) => {
    updateTree(draft => {
      const newTree = treeUtils.createImageElement(draft, parentId, imageUrl, htmlSchemas);
      Object.assign(draft, newTree);
    });
  };

  const updateTag = (id: string, tag: string) => {
    updateTree(draft => {
      const newTree = treeUtils.updateTag(draft, id, tag, htmlSchemas);
      Object.assign(draft, newTree);
    });
  };

  const updateTitle = (id: string, title: string) => {
    updateTree(draft => {
      const newTree = treeUtils.updateTitle(draft, id, title);
      Object.assign(draft, newTree);
    });
  };

  const updateContent = (id: string, content: string) => {
    updateTree(draft => {
      const newTree = treeUtils.updateContent(draft, id, content);
      Object.assign(draft, newTree);
    });
  };

  const addClass = (id: string, className: string) => {
    updateTree(draft => {
      const newTree = treeUtils.addClass(draft, id, className);
      Object.assign(draft, newTree);
    });
  };

  const updateClassName = (id: string, className: string, index: number) => {
    updateTree(draft => {
      const newTree = treeUtils.updateClassName(draft, id, className, index);
      Object.assign(draft, newTree);
    });
  };

  const removeClass = (id: string, className: string) => {
    updateTree(draft => {
      const newTree = treeUtils.removeClass(draft, id, className);
      Object.assign(draft, newTree);
    });
  };

  const renameClassesInTree = (oldClassName: string, newClassName: string) => {
    updateTree(draft => {
      const newTree = treeUtils.renameClassesInTree(draft, oldClassName, newClassName);
      Object.assign(draft, newTree);
    });
  };

  // Selection utility function wrappers
  const selectionHandler = (node: TreeNode) => {
    if (selection.id !== node.id) {
      const { updatedTree, selection: newSelection, selectionParent: newParent } = 
        selectionUtils.selectionHandler(tree, selection, node);
      
      setTree(updatedTree);
      setSelection(newSelection);
      setSelectionParent(newParent);
    } else {
      setSelectionParent(tree);
    }
  };

  const applyVisualizationStyle = (nodeId: string, styleName: 'highlight' | 'explode3d', shouldApply: boolean) => {
    updateTree(draft => {
      const newTree = selectionUtils.applyVisualizationStyle(draft, nodeId, styleName, shouldApply);
      Object.assign(draft, newTree);
    });
  };

  // CSS utility function wrappers
  const addCssClass = (className?: string) => {
    updateCssTree(draft => {
      const newCssTree = cssUtils.addClass(draft, className);
      Object.assign(draft, newCssTree);
    });
  };

  const removeCssClass = (className: string) => {
    updateCssTree(draft => {
      const newCssTree = cssUtils.removeClass(draft, className);
      Object.assign(draft, newCssTree);
    });
  };

  const updateCssClass = (className: string, newClassName: string) => {
    updateCssTree(draft => {
      const newCssTree = cssUtils.updateClass(draft, className, newClassName);
      Object.assign(draft, newCssTree);
    });
  };

  const addCssProperty = (className: string, propertyType: string) => {
    updateCssTree(draft => {
      const newCssTree = cssUtils.addProperty(draft, className, propertyType);
      Object.assign(draft, newCssTree);
    });
  };

  const updateCssProperty = (className: string, propertyId: string, updates: any) => {
    updateCssTree(draft => {
      const newCssTree = cssUtils.updateProperty(draft, className, propertyId, updates);
      Object.assign(draft, newCssTree);
    });
  };

  const deleteCssProperty = (className: string, propertyId: string) => {
    updateCssTree(draft => {
      const newCssTree = cssUtils.deleteProperty(draft, className, propertyId);
      Object.assign(draft, newCssTree);
    });
  };

  const generateCssFromTree = () => {
    return cssUtils.generateCssFromTree(cssTree, cssSchemas);
  };

  // Combine both contexts into one with all utility functions
  const value = useMemo(() => ({
    // Tree state
    tree,
    setTree,
    selection,
    setSelection,
    selectionParent,
    setSelectionParent,
    draggedItem,
    setDraggedItem,
    dropTarget,
    setDropTarget,
    dropPosition,
    setDropPosition,
    
    // CSS state
    cssTree,
    setCssTree,
    selectedClass,
    setSelectedClass,
    selectedProperty,
    setSelectedProperty,
    
    // Tree utility methods
    isVoidElement,
    findParent,
    createElement,
    deleteElement,
    updateNode,
    moveElement,
    createImageElement,
    updateTag,
    updateTitle,
    updateContent,
    addClass,
    updateClassName,
    removeClass,
    renameClassesInTree,
    selectionHandler,
    applyVisualizationStyle,

    // CSS utility methods
    addCssClass,
    removeCssClass,
    updateCssClass,
    addCssProperty,
    updateCssProperty,
    deleteCssProperty,
    generateCssFromTree,
    
    // Schemas
    htmlSchemas,
    cssSchemas
  }), [
    tree, selection, selectionParent, draggedItem, dropTarget, dropPosition,
    cssTree, selectedClass, selectedProperty,
    htmlSchemas, cssSchemas
  ]);

  return (
    <MixEditorContext.Provider value={value}>
      {children}
    </MixEditorContext.Provider>
  );
};

export const useMixEditor = () => {
  const context = useContext(MixEditorContext);
  if (context === undefined) {
    throw new Error('useMixEditor must be used within a MixEditorProvider');
  }
  return context;
};
