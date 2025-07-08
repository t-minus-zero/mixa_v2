"use client"

import { useState, useRef, useEffect, ReactNode } from 'react';
import Portal from 'MixaDev/app/_components/portal/Portal';
import { ChevronUp, ChevronDown, X, Plus } from 'lucide-react';

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
    <div className="w-full p-2" ref={listRef}>
      {/* List items */}
      {value.length > 0 && (
        <>
          {value.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center group">
              
              
              {/* Item controls */}
              <div className="w-full flex flex-row items-center justify-between relative gap-2">
                <div className="absolute left-0 flex flex-row opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-100 rounded-3xl z-20">
                  {/* Remove button */}
                  <button
                    type="button"
                    className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-red-500"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <X size={12} />
                  </button>
                  
                  {/* Stacked move up/down buttons */}
                  <div className="relative w-4 h-6 flex flex-col">
                    {/* Move up button - top half */}
                    <button
                      type="button"
                      className={`absolute top-0 w-full h-1/2 rounded flex items-center justify-center ${index === 0 ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:bg-gray-200'}`}
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                    >
                      <ChevronUp size={10} />
                    </button>
                    
                    {/* Move down button - bottom half */}
                    <button
                      type="button"
                      className={`absolute bottom-0 w-full h-1/2 rounded flex items-center justify-center ${index === value.length - 1 ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:bg-gray-200'}`}
                      onClick={() => handleMoveDown(index)}
                      disabled={index === value.length - 1}
                    >
                      <ChevronDown size={10} />
                    </button>
                  </div>
                  
                </div>
                <p className="text-xxs px-2 flex-grow text-gray-500 "> {index+1} </p>

                {/* Item content - either custom rendered or default */}
                <div className="">
                  {renderItem ? renderItem(item, index) : <div className="text-xs text-nowrap">{item}</div>}
                </div>

              </div>
            </div>
          ))}

          {/* Add new item button */}
          {value.length < max && (
            <div className="flex flex-row gap-1 items-center justify-center w-full text-gray-500 px-1">
              <button
                ref={addButtonRef}
                type="button"
                className="flex items-center justify-center p-1 rounded-3xl hover:text-gray-900  hover:bg-white/50"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Plus size={12} />
              </button>
            </div>
          )}

        </>
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

    </div>
  );
}
