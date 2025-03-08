"use client"

import React, { useState, useRef } from 'react';
import Portal from 'MixaDev/app/_components/portal/Portal';
import { useCssTree } from './CssTreeContext';

interface PropertySelectorProps {
  className: string;
  onAddProperty?: (propertyType: string) => void;
}

export default function PropertySelector({ className, onAddProperty }: PropertySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { cssSchemas } = useCssTree();

  // Handle property selection
  const handleSelectProperty = (propertyType: string) => {
    if (onAddProperty) {
      onAddProperty(propertyType);
    }
    setIsOpen(false);
    setFilterText('');
  };

  // Focus the input when dropdown opens
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

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

  return (
    <div className="py-2 px-3 border-t border-zinc-200">
      <button
        ref={buttonRef}
        className="w-full py-1 px-2 flex items-center justify-center text-zinc-500 hover:text-green-500 hover:bg-zinc-100 rounded transition-colors"
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
        }}
        anchorEl={buttonRef}
        placement="bottom-start"
        offset={5}
        autoAdjust={true}
        maxHeight={300}
        className="bg-zinc-50 rounded-xl shadow-lg border border-zinc-200 w-56 overflow-hidden"
        zIndex={1000}
      >
        <div className="flex flex-col h-full">
          {/* Filter input */}
          <div className="sticky top-0 bg-white border-b border-zinc-200">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter properties..."
                className="w-full text-xs p-2 rounded focus:outline-none bg-zinc-50"
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
          
          {/* Properties list */}
          <div className="overflow-y-auto">
            <div className="">
              {filteredProperties.length > 0 ? (
                filteredProperties.map(([propertyType, propertySchema]) => (
                  <div 
                    key={propertyType}
                    className="px-3 py-2 text-sm hover:bg-zinc-100 cursor-pointer"
                    onClick={() => handleSelectProperty(propertyType)}
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
