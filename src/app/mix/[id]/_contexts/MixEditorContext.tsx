'use client';

import React, { createContext, useState, useContext } from 'react';
import { produce } from 'immer';
import { TreeNode } from '../_types/types';
import { useNotifications } from '../../../_contexts/NotificationsContext';

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
}

// Create the context
const MixEditorContext = createContext<MixEditorContextType | null>(null);

// Create the provider component
export const MixEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addNotification } = useNotifications();
  const [tree, setTree] = useState<TreeNode>(defaultTreeNode);

  // Core function to update tree state using Immer
  const updateTree = (updateFn: (tree: TreeNode) => void) => {
    setTree(prevTree => produce(prevTree, updateFn));
  };

  // Create the context value
  const contextValue: MixEditorContextType = {
    tree,
    updateTree
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
