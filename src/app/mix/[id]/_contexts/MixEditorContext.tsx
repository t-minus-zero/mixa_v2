'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { produce } from 'immer';
import { TreeNode } from '../_types/types';
import { useNotifications } from '../../../_contexts/NotificationsContext';
import { htmlTagsSchema, htmlAttributesSchema } from '../_schemas/html';
import {findParent} from '../_utils/treeUtils';

// Define the default tree node
const defaultTreeNode: TreeNode = {
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

// Define the context type
interface MixEditorContextType {
  tree: TreeNode;
  updateTree: (updateFn: (tree: TreeNode) => void) => void;
  selection: TreeNode;
  selectionParent: TreeNode;
  draggedItem: any;
  dropTarget: any;
  setSelection: (selection: TreeNode) => void;
  setSelectionParent: (parent: TreeNode) => void;
  setDraggedItem: (item: any) => void;
  setDropTarget: (target: any) => void;
  htmlSchemas: {
    elements: any;
    attributes: any;
  };
}

export const htmlSchemas = {
  elements: htmlTagsSchema,
  attributes: htmlAttributesSchema
}

// Create the context
const MixEditorContext = createContext<MixEditorContextType | null>(null);

// Create the provider component
export const MixEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addNotification } = useNotifications();
  const [tree, setTree] = useState<TreeNode>(defaultTreeNode);
  const [selection, setSelection] = useState<TreeNode>(defaultTreeNode);
  const [selectionParent, setSelectionParent] = useState<TreeNode>(defaultTreeNode);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [dropTarget, setDropTarget] = useState<any>(null);

  // Core function to update tree state using Immer
  const updateTree = (updateFn: (tree: TreeNode) => void) => {
    setTree(prevTree => produce(prevTree, updateFn));
  };
  
  useEffect(() => {
    if (selection.id !== tree.id) {
      const parent = findParent(tree, selection.id);
      setSelectionParent(parent ? parent : tree);
    } else {
      setSelectionParent(tree);
    }
    }, [selection, tree]);

  // Create the context value
  const contextValue: MixEditorContextType = {
    tree,
    updateTree,
    selection,
    selectionParent,
    draggedItem,
    dropTarget,
    setSelection,
    setSelectionParent,
    setDraggedItem,
    setDropTarget,
    htmlSchemas
  };

  return (
    <MixEditorContext.Provider value={contextValue}>
      {children}
    </MixEditorContext.Provider>
  );
};

// Create a hook to use the context
export const useMixEditor = () => {
  const context = useContext(MixEditorContext);
  if (!context) {
    throw new Error('useMixEditor must be used within a MixEditorProvider');
  }
  return context;
};
