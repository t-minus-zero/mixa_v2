"use client"

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import Portal from 'MixaDev/app/_components/portal/Portal';
import { useCssTree } from './CssTreeContext';

// Define types for CSS schema
interface CssPropertySchema {
  label: string;
  description?: string;
  inputs?: any;
  [key: string]: any;
}

interface CssSchemas {
  properties: Record<string, CssPropertySchema>;
  [key: string]: any;
}

interface PropertySelectorProps {
  className: string;
  onAddProperty?: (propertyType: string) => void;
}

export default function PropertySelector({ className, onAddProperty }: PropertySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { cssSchemas } = useCssTree() as { cssSchemas: CssSchemas };

  // Handle property selection
  const handleSelectProperty = (propertyType: string) => {
    if (onAddProperty) {
      onAddProperty(propertyType);
    }
    setIsOpen(false);
    setFilterText('');
    setSelectedIndex(0);
  };

  // Filter properties based on search text
  const filteredProperties = Object.entries(cssSchemas.properties).filter(
    ([propertyType, propertySchema]) => {
      const searchText = filterText.toLowerCase();
      return (
        propertyType.toLowerCase().includes(searchText) ||
        (propertySchema.label && propertySchema.label.toLowerCase().includes(searchText))
      );
    }
  );

  // Reset selected index when filtered properties change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredProperties.length]);

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
    if (isOpen && listRef.current && filteredProperties.length > 0) {
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
  }, [selectedIndex, isOpen, filteredProperties.length]);

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredProperties.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredProperties.length > 0 && selectedIndex >= 0 && selectedIndex < filteredProperties.length) {
          const selectedProperty = filteredProperties[selectedIndex];
          if (selectedProperty) {
            const [propertyType] = selectedProperty;
            handleSelectProperty(propertyType);
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

  return (
    <div className="py-2 px-3 border-t border-zinc-200">
      <button
        ref={buttonRef}
        className="w-full py-1 px-2 flex items-center justify-center text-zinc-500 hover:text-blue-500 hover:bg-zinc-100/50 rounded transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-xs">Add property</span>
      </button>

      <Portal
        show={isOpen}
        onClickOutside={() => {
          setIsOpen(false);
          setFilterText('');
          setSelectedIndex(0);
        }}
        anchorEl={buttonRef}
        placement="bottom-start"
        offset={5}
        autoAdjust={true}
        maxHeight={300}
        className="bg-zinc-50/75 backdrop-blur-md rounded-xl shadow-lg border border-zinc-200 w-56 overflow-hidden"
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
                placeholder="Filter properties..."
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
          
          {/* Properties list with custom scrollbar */}
          <div className="overflow-y-auto max-h-[250px] no-scrollbar custom-scrollbar">
            <div ref={listRef} className="">
              {filteredProperties.length > 0 ? (
                filteredProperties.map(([propertyType, propertySchema], index) => (
                  <div 
                    key={propertyType}
                    className={`px-2 py-2 text-xs cursor-pointer truncate ${
                      selectedIndex === index 
                        ? 'bg-zinc-200/50' 
                        : 'hover:bg-zinc-100'
                    }`}
                    onClick={() => handleSelectProperty(propertyType)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span className="text-xs font-medium">{propertySchema.label || propertyType}</span>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-zinc-500 italic">
                  No matching properties
                </div>
              )}
            </div>
          </div>
        </div>
      </Portal>
    </div>
  );
}
