"use client"

import { useState, useRef, useEffect, ReactNode } from 'react';
import Portal from 'MixaDev/app/_components/portal/Portal';

interface ListInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  placeholder?: string;
  renderItem?: (value: string, index: number) => ReactNode;
  max?: number;
}

export default function ListInput({
  value = [],
  onChange,
  options,
  placeholder = "Add item...",
  renderItem,
  max = 10
}: ListInputProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    if (!dropdownOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        addButtonRef.current && 
        !addButtonRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      // Ensure we safely remove the event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Add item to the list
  const handleAddItem = (item: string) => {
    if (value.length >= max) return;
    
    const newList = [...value, item];
    onChange(newList);
    setDropdownOpen(false);
  };

  // Remove item from list
  const handleRemoveItem = (index: number) => {
    const newList = [...value];
    newList.splice(index, 1);
    onChange(newList);
  };

  // Move item up in the list
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...value];
    [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
    onChange(newList);
  };

  // Move item down in the list
  const handleMoveDown = (index: number) => {
    if (index === value.length - 1) return;
    const newList = [...value];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    onChange(newList);
  };

  return (
    <div className="w-full" ref={listRef}>
      {/* List items */}
      {value.length > 0 && (
        <div className="border border-zinc-200 rounded-md">
          {value.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center border-b border-gray-200 px-2 py-1">
              {/* Item content - either custom rendered or default */}
              <div className="flex-grow">
                {renderItem ? renderItem(item, index) : <div className="text-xs">{item}</div>}
              </div>
              
              {/* Item controls */}
              <div className="flex items-center space-x-1 border-l border-zinc-200">
                {/* Move up button */}
                <button
                  type="button"
                  className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </button>
                
                {/* Move down button */}
                <button
                  type="button"
                  className={`p-1 rounded ${index === value.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                  onClick={() => handleMoveDown(index)}
                  disabled={index === value.length - 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                
                {/* Remove button */}
                <button
                  type="button"
                  className="p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-red-500"
                  onClick={() => handleRemoveItem(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add new item button */}
      {value.length < max && (
        <div className="flex w-full">
          <button
            ref={addButtonRef}
            type="button"
            className="w-full flex items-center justify-center p-1 rounded text-gray-500 hover:bg-gray-100"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="text-xs mr-1">{placeholder}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      )}
      
      {/* Dropdown portal */}
      <Portal
        show={dropdownOpen}
        onClickOutside={() => setDropdownOpen(false)}
        anchorEl={addButtonRef}
        placement="bottom-start"
        offset={5}
        autoAdjust={true}
        maxHeight={250}
        className="bg-white rounded shadow-md border border-gray-200 min-w-[180px] overflow-y-auto"
        zIndex={1000}
      >
        {options.length > 0 ? (
          <div className="py-1">
            {options.map((option, index) => (
              <div
                key={index}
                className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => handleAddItem(option)}
              >
                {option}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-2 px-3 text-sm text-gray-500">No options available</div>
        )}
      </Portal>
      
      {/* Max items reached message */}
      {value.length >= max && (
        <div className="text-xs text-gray-400">
          Maximum of {max} items reached
        </div>
      )}
    </div>
  );
}
