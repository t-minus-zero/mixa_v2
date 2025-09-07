"use client"

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import Portal from 'MixaDev/app/_components/portal/Portal';
import { Plus, Filter } from 'lucide-react';
import { useMixEditor } from '../_contexts/MixEditorContext';
import { pseudoClassesSchema } from '../_schemas/css/pseudoClasses';
import { screensSchema } from '../_schemas/css/screens';
import { addCategory } from '../_utils/treeUtils';
import { CssCategoryNode } from '../_types/types';
import { v4 as uuidv4 } from 'uuid';

// Define types for constraint schema
interface ConstraintSchema {
  label: string;
  type: string;
  description?: string;
  inputs?: any;
  [key: string]: any;
}

interface ConstraintSelectorProps {
  className: string;
  onAddConstraint?: (constraintType: string, constraintCategory: 'pseudo-class' | 'screen') => void;
}

export default function ConstraintSelector({ className, onAddConstraint }: ConstraintSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { rightFloaterRef, cssTree, updateCssTree } = useMixEditor();

  // Combine both schemas with category information
  const allConstraints = [
    ...Object.entries(pseudoClassesSchema).map(([key, schema]) => ({
      key,
      schema,
      category: 'pseudo-class' as const
    })),
    ...Object.entries(screensSchema).map(([key, schema]) => ({
      key,
      schema,
      category: 'screen' as const
    }))
  ];

  // Handle constraint selection
  const handleSelectConstraint = (constraintType: string, category: 'pseudo-class' | 'screen') => {
    // Call the callback to let CssClassElement handle the actual addition
    if (onAddConstraint) {
      onAddConstraint(constraintType, category);
    }
    
    setIsOpen(false);
    setFilterText('');
    setSelectedIndex(0);
  };

  // Filter constraints based on search text
  const filteredConstraints = allConstraints.filter(({ key, schema }) => {
    const searchText = filterText.toLowerCase();
    return (
      key.toLowerCase().includes(searchText) ||
      (schema.label && schema.label.toLowerCase().includes(searchText)) ||
      (schema.description && schema.description.toLowerCase().includes(searchText)) ||
      schema.type.toLowerCase().includes(searchText)
    );
  });

  // Reset selected index when filtered constraints change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredConstraints.length]);

  // Focus the input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Scroll to the selected item when it changes
  useEffect(() => {
    if (isOpen && listRef.current && filteredConstraints.length > 0) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        // Calculate if the element is out of view
        const containerRect = listRef.current.getBoundingClientRect();
        const elementRect = selectedElement.getBoundingClientRect();
        
        if (elementRect.bottom > containerRect.bottom) {
          // If below visible area, scroll down
          selectedElement.scrollIntoView({ block: 'end', behavior: 'smooth' });
        } else if (elementRect.top < containerRect.top) {
          // If above visible area, scroll up
          selectedElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      }
    }
  }, [selectedIndex, isOpen, filteredConstraints.length]);

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredConstraints.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredConstraints.length > 0 && selectedIndex >= 0 && selectedIndex < filteredConstraints.length) {
          const selectedConstraint = filteredConstraints[selectedIndex];
          if (selectedConstraint) {
            handleSelectConstraint(selectedConstraint.key, selectedConstraint.category);
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFilterText('');
        setSelectedIndex(0);
        break;
      default:
        break;
    }
  };

  // Get category badge color
  const getCategoryBadgeColor = (category: 'pseudo-class' | 'screen') => {
    switch (category) {
      case 'pseudo-class':
        return 'bg-blue-100 text-blue-700';
      case 'screen':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="">
      <button 
        ref={buttonRef}
        className="w-6 h-6 flex items-center justify-center hover:text-purple-500"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <Filter size={16} strokeWidth={1.5}/>
      </button>

      <Portal
        show={isOpen}
        onClickOutside={() => {
          setIsOpen(false);
          setFilterText('');
          setSelectedIndex(0);
        }}
        anchorEl={rightFloaterRef}
        placement="left"
        offset={5}
        autoAdjust={true}
        maxHeight={350}
        className="bg-zinc-50/75 backdrop-blur-md rounded-xl shadow-lg border border-zinc-200 w-64 overflow-hidden"
        zIndex={1000}
      >
        <div className="flex flex-col h-full">
          {/* Filter input */}
          <div className="sticky top-0 bg-transparent border-b border-zinc-200 z-10">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Filter constraints..."
                className="w-full text-xs p-2 rounded focus:outline-none bg-transparent"
              />
              {filterText && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  onClick={() => setFilterText('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Constraints list with custom scrollbar */}
          <div className="overflow-y-auto max-h-[280px] no-scrollbar custom-scrollbar">
            <div ref={listRef} className="">
              {filteredConstraints.length > 0 ? (
                filteredConstraints.map(({ key, schema, category }, index) => (
                  <div 
                    key={`${category}-${key}`}
                    className={`px-2 py-2 text-xs cursor-pointer ${
                      selectedIndex === index 
                        ? 'bg-zinc-200/50' 
                        : 'hover:bg-zinc-100'
                    }`}
                    onClick={() => handleSelectConstraint(key, category)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {schema.label || key}
                      </span>
                      <span className={`text-[10px] font-medium ${
                        category === 'pseudo-class' ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {category === 'pseudo-class' ? 'Pseudo' : 'Screen'}
                      </span>
                    </div>
                    {schema.description && (
                      <div className="text-[10px] text-zinc-500 leading-tight">
                        {schema.description}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-zinc-500 italic">
                  No matching constraints
                </div>
              )}
            </div>
          </div>
        </div>
      </Portal>
    </div>
  );
}
