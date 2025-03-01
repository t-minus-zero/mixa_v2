"use client"

import { ChangeEvent, useState, useRef, useEffect, ReactNode } from 'react';
import SelectInput from './SelectInput';

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
  const [currentSelection, setCurrentSelection] = useState<string>("");
  const listRef = useRef<HTMLDivElement>(null);

  // Handle selection change
  const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentSelection(e.target.value);
  };

  // Add item to the list
  const handleAddItem = () => {
    if (!currentSelection || value.length >= max) return;
    
    const newList = [...value, currentSelection];
    onChange(newList);
    setCurrentSelection("");
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
    <div className="space-y-2" ref={listRef}>
      {/* List items */}
      {value.length > 0 && (
        <div className="space-y-1">
          {value.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center space-x-1 rounded border border-gray-200 p-1">
              {/* Item content - either custom rendered or default */}
              <div className="flex-grow">
                {renderItem ? renderItem(item, index) : <div className="text-xs">{item}</div>}
              </div>
              
              {/* Item controls */}
              <div className="flex items-center space-x-1">
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
      
      {/* Add new item controls */}
      {value.length < max && (
        <div className="flex items-center space-x-2">
          <div className="flex-grow">
            <SelectInput
              value={currentSelection}
              onChange={handleSelectionChange}
              options={options}
              placeholder={placeholder}
            />
          </div>
          
          <button
            type="button"
            className={`p-1 rounded ${!currentSelection ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={handleAddItem}
            disabled={!currentSelection}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      )}
      
      {/* Max items reached message */}
      {value.length >= max && (
        <div className="text-xs text-gray-400">
          Maximum of {max} items reached
        </div>
      )}
    </div>
  );
}
