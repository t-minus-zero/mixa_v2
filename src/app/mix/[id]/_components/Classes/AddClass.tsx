'use client'
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useMixEditor } from '../../_contexts/MixEditorContext';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'lucide-react';
import { addClassToElement, addClass } from '../../_utils/treeUtils';

// Add Class Button Component
const AddClassButton = () => {
  const { updateTree, selection, updateCssTree } = useMixEditor();
  
  const handleAddClass = async () => {
    // Generate a new class ID
    const newClassId = uuidv4().substring(0, 6);
    
    // First update the CSS tree with the new class
    updateCssTree(cssTree => {
      addClass(cssTree, newClassId);
    });
    
    // If we have a selection, add the class to the selected element
    if (selection) {
      // Small timeout to ensure the CSS tree is updated first
      setTimeout(() => {
        updateTree(tree => {
          addClassToElement(tree, selection.id, newClassId);
        });
        
        console.log(`Added class with id "${newClassId}" to selected element`);
      }, 0);
    }
  };
  
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        handleAddClass();
      }}
      className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-blue-500 transition-colors"
    >
      <Plus size={16} strokeWidth={1.5} />
    </button>
  );
};

export default AddClassButton;