'use client';

import React, { createContext, useState, useContext, useEffect, useRef, RefObject } from 'react';
import { produce } from 'immer';
import { TreeNode } from '../_types/types';
import { CssTree, CssValueNode } from '../_types/css-types';
import { useNotifications } from '../../../_contexts/NotificationsContext';
import { htmlTagsSchema, htmlAttributesSchema } from '../_schemas/html';
import { cssSchema } from '../_schemas/css';
import { inputsSchema } from '../_schemas/inputs';
import {findParent, defaultCssTree} from '../_utils/treeUtils';

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

export const htmlSchemas = {
  elements: htmlTagsSchema,
  attributes: htmlAttributesSchema,
  properties: cssSchema,
  inputTypes: inputsSchema
}

// Define the context type
export interface MixEditorContextType {
  tree: TreeNode;
  updateTree: (newTree: TreeNode) => void;
  cssTree: CssTree;
  updateCssTree: (newTree: CssTree) => void;
  selection: TreeNode;
  selectionParent: TreeNode;
  draggedItem: any;
  dropTarget: any;
  setSelection: (node: TreeNode) => void;
  setSelectionParent: (node: TreeNode) => void;
  selectClass: (className: string) => void;
  selectedClass: string;
  selectedProperty: any;
  setSelectedProperty: (property: any) => void;
  setDraggedItem: (item: any) => void;
  setDropTarget: (target: any) => void;
  htmlSchemas: any;
  mixMetadata: { id: number; name: string };
  setMixMetadata: (metadata: { id: number; name: string }) => void;
  codePageOpen: boolean;
  setCodePageOpen: (open: boolean) => void;
  rightFloaterRef: RefObject<HTMLDivElement>;
}

// Create the context
const MixEditorContext = createContext<MixEditorContextType | null>(null);

// Create the provider component
export const MixEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addNotification } = useNotifications();

  const [mixMetadata, setMixMetadata] = useState({
    id: 0,
    name: '',
  });

  const [codePageOpen, setCodePageOpen] = useState(false);

  // Reference to the RightFloater component
  const rightFloaterRef = useRef<HTMLDivElement | null>(null);

  const [tree, setTree] = useState<TreeNode>(defaultTreeNode);
  const [cssTree, setCssTree] = useState(defaultCssTree);


  const [selection, setSelection] = useState<TreeNode>(defaultTreeNode);
  const [selectedClass, setSelectedClass] = useState('default');
  const [selectedProperty, setSelectedProperty] = useState<CssValueNode | null>(null);

  const [selectionParent, setSelectionParent] = useState<TreeNode>(defaultTreeNode);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [dropTarget, setDropTarget] = useState<any>(null);

  // Core function to update tree state using Immer
  const updateTree = (updateFn: (tree: TreeNode) => void) => {
    setTree(prevTree => produce(prevTree, updateFn));
    return true;
  };

  const updateCssTree = (updateFn: (cssTree: CssTree) => void) => {
    setCssTree(prevTree => produce(prevTree, updateFn));
    return true;
  };

  const selectClass = (className: string) => {
    setSelectedClass(className || '');
    setSelectedProperty(null); // Clear property selection when changing class
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
    cssTree,
    updateCssTree,
    selection,
    selectionParent,
    draggedItem,
    dropTarget,
    setSelection,
    setSelectionParent,
    selectClass,
    selectedClass,
    selectedProperty,
    setSelectedProperty,
    setDraggedItem,
    setDropTarget,
    htmlSchemas,
    mixMetadata,
    setMixMetadata,
    codePageOpen,
    setCodePageOpen,
    rightFloaterRef
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
